using Microsoft.AspNetCore.Mvc;
using Moq;
using System.Collections.Generic;
using System.Threading.Tasks;
using Xunit;
using JwtWebApi.Application.DTOs;
using JwtWebApi.Application.Interfaces;
using JwtWebApi.Controllers;
using JwtWebApi.Domain.Entities;

namespace JwtWebApi.Api.Tests.Controllers
{
    public class PolicyPlanControllerTests
    {
        private readonly Mock<IPolicyPlanService> _mockService;
        private readonly PolicyPlanController _controller;

        public PolicyPlanControllerTests()
        {
            _mockService = new Mock<IPolicyPlanService>();
            _controller = new PolicyPlanController(_mockService.Object);
        }

        [Fact]
        public async Task GetAll_ShouldReturnOkWithPlans()
        {
            // Arrange
            var plans = new List<PolicyPlan> { new PolicyPlan { PlanId = 1, PlanName = "Silver" } };
            _mockService.Setup(s => s.GetAllPlans()).ReturnsAsync(plans);

            // Act
            var result = await _controller.GetAll();

            // Assert
            var okResult = Assert.IsType<OkObjectResult>(result);
            Assert.NotNull(okResult.Value);
        }

        [Fact]
        public async Task GetById_WithValidId_ShouldReturnOk()
        {
            // Arrange
            var plan = new PolicyPlan { PlanId = 1, PlanName = "Silver" };
            _mockService.Setup(s => s.GetPlan(1)).ReturnsAsync(plan);

            // Act
            var result = await _controller.Get(1);

            // Assert
            var okResult = Assert.IsType<OkObjectResult>(result);
            Assert.NotNull(okResult.Value);
        }

        [Fact]
        public async Task GetById_WithInvalidId_ShouldReturnNotFound()
        {
            // Arrange
            _mockService.Setup(s => s.GetPlan(99)).ReturnsAsync((PolicyPlan)null);

            // Act
            var result = await _controller.Get(99);

            // Assert
            var notFoundResult = Assert.IsType<NotFoundObjectResult>(result);
            Assert.NotNull(notFoundResult.Value);
        }
    }
}
