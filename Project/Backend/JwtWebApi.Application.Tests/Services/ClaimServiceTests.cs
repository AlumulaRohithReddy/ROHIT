using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using JwtWebApi.Application.DTOs;
using JwtWebApi.Application.Exceptions;
using JwtWebApi.Application.Interfaces;
using JwtWebApi.Application.Services;
using JwtWebApi.Domain.Entities;
using Moq;
using Xunit;

namespace JwtWebApi.Application.Tests.Services
{
    public class ClaimServiceTests
    {
        private readonly Mock<IClaimRepository> _mockClaimRepo;
        private readonly Mock<IPolicyRepository> _mockPolicyRepo;
        private readonly Mock<IFraudDetectionService> _mockFraudService;
        private readonly ClaimService _service;

        public ClaimServiceTests()
        {
            _mockClaimRepo = new Mock<IClaimRepository>();
            _mockPolicyRepo = new Mock<IPolicyRepository>();
            _mockFraudService = new Mock<IFraudDetectionService>();
            _service = new ClaimService(_mockClaimRepo.Object, _mockPolicyRepo.Object, _mockFraudService.Object);
        }

        [Fact]
        public async Task SubmitClaim_WithInvalidPolicy_ShouldThrowNotFoundException()
        {
            // Arrange
            var request = new CreateClaimRequestDto { PolicyId = 99 };
            _mockPolicyRepo.Setup(repo => repo.GetByIdAsync(99)).ReturnsAsync((Policy)null);

            // Act & Assert
            await Assert.ThrowsAsync<NotFoundException>(() => _service.SubmitClaim(1, request));
        }

        [Fact]
        public async Task GetAllClaims_ShouldReturnMappedDtos()
        {
            // Arrange
            var claims = new List<Claim>
            {
                new Claim 
                { 
                    ClaimId = 1, 
                    Status = JwtWebApi.Domain.Enums.ClaimStatus.Submitted.ToString(), 
                    ClaimedAmount = 5000,
                    Policy = new Policy { Vehicle = new Vehicle { RegistrationNumber = "V1" } },
                    Customer = new User { FullName = "Bob" },
                    ClaimDocuments = new List<ClaimDocument>()
                }
            };
            _mockClaimRepo.Setup(repo => repo.GetAllAsync()).ReturnsAsync(claims);

            // Act
            var result = await _service.GetAllClaims();

            // Assert
            Assert.NotNull(result);
            Assert.Single(result);
            Assert.Equal(1, result.First().ClaimId);
            Assert.Equal(JwtWebApi.Domain.Enums.ClaimStatus.Submitted.ToString(), result.First().Status);
        }

        [Fact]
        public async Task AssignOfficer_WithValidData_ShouldUpdateClaim()
        {
            // Arrange
            var claim = new Claim { ClaimId = 1, ClaimsOfficerId = null };
            _mockClaimRepo.Setup(repo => repo.GetByIdAsync(1)).ReturnsAsync(claim);

            // Act
            await _service.AssignOfficer(1, 42);

            // Assert
            Assert.Equal(42, claim.ClaimsOfficerId);
            _mockClaimRepo.Verify(repo => repo.SaveChangesAsync(), Times.Once);
        }
    }
}
