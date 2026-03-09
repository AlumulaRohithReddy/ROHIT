using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using JwtWebApi.Application.DTOs;
using JwtWebApi.Application.Interfaces;
using JwtWebApi.Application.Services;
using JwtWebApi.Domain.Entities;
using Moq;
using Xunit;

namespace JwtWebApi.Application.Tests.Services
{
    public class PolicyPlanServiceTests
    {
        private readonly Mock<IPolicyPlanRepository> _mockRepo;
        private readonly PolicyPlanService _service;

        public PolicyPlanServiceTests()
        {
            _mockRepo = new Mock<IPolicyPlanRepository>();
            _service = new PolicyPlanService(_mockRepo.Object);
        }

        [Fact]
        public async Task GetAllPlans_ShouldReturnAllPlans()
        {
            // Arrange
            var plans = new List<PolicyPlan>
            {
                new PolicyPlan { PlanId = 1, PlanName = "Plan A" },
                new PolicyPlan { PlanId = 2, PlanName = "Plan B" }
            };
            _mockRepo.Setup(repo => repo.GetAllAsync()).ReturnsAsync(plans);

            // Act
            var result = await _service.GetAllPlans();

            // Assert
            Assert.NotNull(result);
            Assert.Equal(2, result.Count());
            Assert.Equal("Plan A", result.First().PlanName);
        }

        [Fact]
        public async Task GetPlan_WithValidId_ShouldReturnPlan()
        {
            // Arrange
            var plan = new PolicyPlan { PlanId = 1, PlanName = "Plan A" };
            _mockRepo.Setup(repo => repo.GetByIdAsync(1)).ReturnsAsync(plan);

            // Act
            var result = await _service.GetPlan(1);

            // Assert
            Assert.NotNull(result);
            Assert.Equal(1, result.PlanId);
            Assert.Equal("Plan A", result.PlanName);
        }

        [Fact]
        public async Task CreatePlan_ShouldAddPlanAndReturnIt()
        {
            // Arrange
            var request = new CreatePolicyPlanRequestDto
            {
                PlanName = "New Plan",
                PolicyType = "Comprehensive",
                BasePremium = 500,
                MaxCoverageAmount = 10000,
                PolicyDurationMonths = 12
            };

            _mockRepo.Setup(repo => repo.AddAsync(It.IsAny<PolicyPlan>())).Returns(Task.CompletedTask);

            // Act
            var result = await _service.CreatePlan(request);

            // Assert
            Assert.NotNull(result);
            Assert.Equal("New Plan", result.PlanName);
            _mockRepo.Verify(repo => repo.AddAsync(It.IsAny<PolicyPlan>()), Times.Once);
        }
    }
}
