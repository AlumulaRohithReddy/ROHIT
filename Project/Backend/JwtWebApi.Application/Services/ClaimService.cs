using JwtWebApi.Application.DTOs;
using JwtWebApi.Application.Exceptions;
using JwtWebApi.Application.Interfaces;
using JwtWebApi.Domain.Entities;
using JwtWebApi.Domain.Enums;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace JwtWebApi.Application.Services
{
    public class ClaimService
    {
        private readonly IClaimRepository _claimRepo;
        private readonly IPolicyRepository _policyRepo;
        private readonly IFraudDetectionService _fraudService;

        public ClaimService(IClaimRepository claimRepo, IPolicyRepository policyRepo, IFraudDetectionService fraudService)
        {
            _claimRepo = claimRepo;
            _policyRepo = policyRepo;
            _fraudService = fraudService;
        }

        //  SUBMIT CLAIM
        public async Task<ClaimResponse> SubmitClaim(int userId, CreateClaimRequestDto request)
        {
            var policy = await _policyRepo.GetByIdAsync(request.PolicyId);

            if (policy == null)
                throw new NotFoundException("Policy not found");

            if (policy.CustomerId != userId)
                throw new UnauthorizedException("You do not own this policy");

            if (policy.Status != "Active" && policy.Status != "Approved")
                throw new BadRequestException("Policy is not active");

            if (request.ClaimedAmount > policy.IDV)
                throw new BadRequestException("Claimed amount exceeds IDV");

            if (request.IncidentDate.Date > DateTime.UtcNow.Date)
                throw new BadRequestException("Incident date cannot be in the future");

            var claim = new Claim
            {
                PolicyId = request.PolicyId,
                Policy = policy, // Ensure policy is available for fraud detection
                ClaimNumber = $"CLM-{DateTime.UtcNow:yyyyMMddHHmmss}",
                CustomerId = userId,
                IncidentDate = request.IncidentDate,
                IncidentLocation = request.IncidentLocation,
                Description = request.Description,
                ClaimedAmount = request.ClaimedAmount,
                Status = JwtWebApi.Domain.Entities.ClaimStatus.Submitted
            };

            // Calculate Fraud Score
            var (fraudScore, fraudLevel) = await _fraudService.DetectFraudAsync(claim);
            claim.FraudScore = fraudScore;
            claim.FraudRiskLevel = fraudLevel;

         

            await _claimRepo.AddAsync(claim);
            await _claimRepo.SaveChangesAsync();

            // Reload to include navigation properties for mapping
            var newClaim = await _claimRepo.GetByIdAsync(claim.ClaimId);
            return MapToDto(newClaim);
        }

        //  ASSIGN OFFICER (ADMIN ONLY)
        public async Task AssignOfficer(int claimId, int officerId)
        {
            var claim = await _claimRepo.GetByIdAsync(claimId);

            if (claim == null)
                throw new NotFoundException("Claim not found");

            // Allow assignment if status is Submitted or UnderReview
            if (claim.Status != JwtWebApi.Domain.Entities.ClaimStatus.Submitted && 
                claim.Status != JwtWebApi.Domain.Entities.ClaimStatus.UnderReview)
                throw new BadRequestException("Claim cannot be assigned in its current status");

            if (officerId == 0)
            {
                // UNASSIGN
                claim.ClaimsOfficerId = null;
                claim.Status = JwtWebApi.Domain.Entities.ClaimStatus.Submitted;
            }
            else
            {
                // ASSIGN
                claim.ClaimsOfficerId = officerId;
                claim.Status = JwtWebApi.Domain.Entities.ClaimStatus.UnderReview;
            }

            await _claimRepo.SaveChangesAsync();
        }

        //  REVIEW CLAIM (OFFICER ONLY)
        public async Task ReviewClaim(int claimId, int officerId, ReviewClaimRequest request)
        {
            var claim = await _claimRepo.GetByIdAsync(claimId);

            if (claim == null)
                throw new NotFoundException("Claim not found");

            if (claim.ClaimsOfficerId != officerId)
                throw new UnauthorizedException("You are not assigned to this claim");

            if (claim.Status != JwtWebApi.Domain.Entities.ClaimStatus.UnderReview)
                throw new BadRequestException("Claim is not under review");

            if (request.IsApproved)
            {
                claim.Status = JwtWebApi.Domain.Entities.ClaimStatus.Approved;
                claim.ApprovedAmount = request.ApprovedAmount;
            }
            else
            {
                claim.Status = JwtWebApi.Domain.Entities.ClaimStatus.Rejected;
            }

            await _claimRepo.SaveChangesAsync();
        }

        //  GET MY CLAIMS
        public async Task<List<ClaimResponse>> GetMyClaims(int userId)
        {
            var claims = await _claimRepo.GetByCustomerIdAsync(userId);
            return claims.Select(MapToDto).ToList();
        }

        //  GET CLAIM BY ID
        public async Task<ClaimResponse> GetClaim(int id, int userId, string role)
        {
            var claim = await _claimRepo.GetByIdAsync(id);

            if (claim == null)
                throw new NotFoundException("Claim not found");

            // Security check
            if (role == "Customer" && claim.CustomerId != userId)
                throw new UnauthorizedException("Access denied");

            return MapToDto(claim);
        }

        //  GET ALL CLAIMS (ADMIN ONLY)
        public async Task<List<ClaimResponse>> GetAllClaims()
        {
            var claims = await _claimRepo.GetAllAsync();
            return claims.Select(MapToDto).ToList();
        }

        //  GET OFFICER CLAIMS (OFFICER ONLY)
        public async Task<List<ClaimResponse>> GetOfficerClaims(int officerId)
        {
            var claims = await _claimRepo.GetByOfficerIdAsync(officerId);
            return claims.Select(MapToDto).ToList();
        }

        private ClaimResponse MapToDto(Claim c)
        {
            return new ClaimResponse
            {
                ClaimId = c.ClaimId,
                PolicyId = c.PolicyId,
                ClaimNumber = c.ClaimNumber,
                Status = c.Status.ToString(),
                ClaimedAmount = c.ClaimedAmount,
                claimsofficerId = c.ClaimsOfficerId ?? 0,
                ApprovedAmount = c.ApprovedAmount,
                VehicleNumber = c.Policy?.Vehicle?.RegistrationNumber ?? "N/A",
                PlanName = c.Policy?.Plan?.PlanName ?? "N/A",
                CustomerName = c.Customer?.FullName ?? "Unknown",
                Description = c.Description,
                DocumentCount = c.ClaimDocuments?.Count ?? 0,
                FraudScore = c.FraudScore,
                FraudRiskLevel = c.FraudRiskLevel
            };
        }
    }
}