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
    public class PolicyServiceTests
    {
        private readonly Mock<IPolicyRepository> _mockPolicyRepo;
        private readonly Mock<IVehicleRepository> _mockVehicleRepo;
        private readonly Mock<IPolicyPlanRepository> _mockPlanRepo;
        private readonly Mock<IUserRepository> _mockUserRepo;
        private readonly Mock<IPaymentRepository> _mockPaymentRepo;
        private readonly Mock<IPremiumCalculationService> _mockPremiumService;
        private readonly PolicyService _service;

        public PolicyServiceTests()
        {
            _mockPolicyRepo = new Mock<IPolicyRepository>();
            _mockVehicleRepo = new Mock<IVehicleRepository>();
            _mockPlanRepo = new Mock<IPolicyPlanRepository>();
            _mockUserRepo = new Mock<IUserRepository>();
            _mockPaymentRepo = new Mock<IPaymentRepository>();
            _mockPremiumService = new Mock<IPremiumCalculationService>();
            
            _service = new PolicyService(
                _mockPolicyRepo.Object, 
                _mockVehicleRepo.Object, 
                _mockPlanRepo.Object, 
                _mockUserRepo.Object, 
                _mockPaymentRepo.Object,
                _mockPremiumService.Object);
        }

        [Fact]
        public async Task GetMyPolicies_ShouldReturnCustomerPolicies()
        {
            // Arrange
            var policies = new List<Policy>
            {
                new Policy 
                { 
                    PolicyId = 1, 
                    Status = "Active",
                    Vehicle = new Vehicle { Make = "Toyota", RegistrationNumber = "V1" },
                    Plan = new PolicyPlan { PlanName = "Gold" }
                }
            };
            _mockPolicyRepo.Setup(repo => repo.GetByCustomerIdAsync(1)).ReturnsAsync(policies);
            _mockPaymentRepo.Setup(repo => repo.GetByPolicyIdAsync(1)).ReturnsAsync((Payment)null); // Simulating no payment 

            // Act
            var result = await _service.GetMyPolicies(1);

            // Assert
            Assert.NotNull(result);
            Assert.Single(result);
            Assert.Equal(1, result.First().PolicyId);
            Assert.Equal("Gold", result.First().PlanName);
        }

        [Fact]
        public async Task CreatePolicy_WithInvalidPlan_ShouldThrowException()
        {
            // Arrange
            var request = new CreatePolicyRequestDto { VehicleId = 1, PlanId = 99 };
            var vehicle = new Vehicle { VehicleId = 1, CurrentMarketValue = 10000 };

            _mockVehicleRepo.Setup(repo => repo.GetByIdAsync(1)).ReturnsAsync(vehicle);
            _mockPlanRepo.Setup(repo => repo.GetByIdAsync(99)).ReturnsAsync((PolicyPlan)null);

            // Act & Assert
            var ex = await Assert.ThrowsAsync<Exception>(() => _service.CreatePolicy(1, request));
            Assert.Equal("Plan not found", ex.Message);
        }
    }
}
