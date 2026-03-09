using JwtWebApi.Application.DTOs;
using JwtWebApi.Application.Interfaces;
using JwtWebApi.Domain.Entities;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
namespace JwtWebApi.Application.Services
{
    public class PolicyService
    {
        private readonly IPaymentRepository _paymentRepository;
        private readonly IPolicyRepository _policyRepository;
        private readonly IVehicleRepository _vehicleRepository;
        private readonly IPolicyPlanRepository _planRepository;
        private readonly IUserRepository _userRepository;
        private readonly IPremiumCalculationService _premiumService;

        public PolicyService(
            IPolicyRepository policyRepository,
            IVehicleRepository vehicleRepository,
            IPolicyPlanRepository planRepository,
            IUserRepository userRepository,
            IPaymentRepository paymentRepository,
            IPremiumCalculationService premiumService)
        {
            _policyRepository = policyRepository;
            _vehicleRepository = vehicleRepository;
            _planRepository = planRepository;
            _userRepository = userRepository;
            _paymentRepository = paymentRepository;
            _premiumService = premiumService;
        }

        public async Task<Policy> CreatePolicy(int userId, CreatePolicyRequestDto request)
        {
            var vehicle = await _vehicleRepository.GetByIdAsync(request.VehicleId);
            if (vehicle == null)
                throw new Exception("Vehicle not found");

            var plan = await _planRepository.GetByIdAsync(request.PlanId);
            if (plan == null)
                throw new Exception("Plan not found");


            var idv = vehicle.CurrentMarketValue * 0.8m; // depreciation

            // Dynamic Premium Calculation
            var premiumBreakdown = await _premiumService.CalculatePremiumAsync(vehicle, plan);

            // Randomly Assign Agent
            var allUsers = await _userRepository.GetAllAsync();
            var agents = allUsers.Where(u => u.Role == "Agent").ToList();
            int? assignedAgentId = null;
            if (agents.Any())
            {
                var random = new Random();
                assignedAgentId = agents[random.Next(agents.Count)].UserId;
            }

            var policy = new Policy
            {
                CustomerId = userId,
                VehicleId = request.VehicleId,
                PlanId = request.PlanId,
                AgentId = assignedAgentId,
                IDV = idv,
                PremiumAmount = premiumBreakdown.TotalPremium,
                PolicyNumber = "POL" + DateTime.UtcNow.Ticks,
                Status = "PendingApproval",
                StartDate = DateTime.UtcNow,
                EndDate = DateTime.UtcNow.AddMonths(plan.PolicyDurationMonths)
            };

            await _policyRepository.AddAsync(policy);
            await _policyRepository.SaveChangesAsync();

            return policy;
        }

        public async Task ApprovePolicy(int policyId, decimal? updatedPremium)
        {
            var policy = await _policyRepository.GetByIdAsync(policyId);
            if (policy == null) throw new Exception("Policy not found");

            if (updatedPremium.HasValue)
            {
                policy.PremiumAmount = updatedPremium.Value;
            }

            policy.Status = "Approved";
            _policyRepository.Update(policy);
            await _policyRepository.SaveChangesAsync();
        }

        public async Task RejectPolicy(int policyId)
        {
            var policy = await _policyRepository.GetByIdAsync(policyId);
            if (policy == null) throw new Exception("Policy not found");

            policy.Status = "Rejected";
            _policyRepository.Update(policy);
            await _policyRepository.SaveChangesAsync();
        }

        public async Task<List<PolicyResponse>> GetAssignedPolicies(int agentId)
        {
            var policies = await _policyRepository.GetByAgentIdAsync(agentId);
            return policies.Select(p=>MapToDto(p)).ToList();
        }

        public async Task<List<PolicyResponse>> GetMyPolicies(int customerId)
        {
            var policies = await _policyRepository.GetByCustomerIdAsync(customerId);
            var responses = new List<PolicyResponse>();

            foreach(var p in policies)
            {
                var payment = await _paymentRepository.GetByPolicyIdAsync(p.PolicyId);
                responses.Add(MapToDto(p, payment?.PaymentId));
            }

            return responses;
        }

        public async Task<PolicyResponse?> GetPolicy(int policyId)
        {
            var policy = await _policyRepository.GetByIdAsync(policyId);

            if (policy == null)
                return null;

            var payment = await _paymentRepository.GetByPolicyIdAsync(policyId);
            return MapToDto(policy, payment?.PaymentId);
        }

        //  Mapping method (clean)
        private PolicyResponse MapToDto(Policy p, int? paymentId = null)
        {
            return new PolicyResponse
            {
                PolicyId = p.PolicyId,
                PolicyNumber = p.PolicyNumber,
                PremiumAmount = p.PremiumAmount,
                IDV = p.IDV,
                Status = p.Status.ToString(),

                StartDate = p.StartDate,
                EndDate = p.EndDate,

                VehicleNumber = p.Vehicle.RegistrationNumber,
                VehicleModel = p.Vehicle.Model,

                PlanName = p.Plan.PlanName,
                MaxCoverageAmount = p.Plan.MaxCoverageAmount,
                CustomerName = p.Customer?.FullName ?? "N/A",
                PaymentId = paymentId,
                VehicleRiskScore = p.Vehicle?.VehicleRiskScore ?? 0
            };
        }
    }
}