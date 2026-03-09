using Microsoft.AspNetCore.Mvc;
using Moq;
using System.Collections.Generic;
using System.Security.Claims;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Http;
using Xunit;
using JwtWebApi.Application.DTOs.Vehicle;
using JwtWebApi.Application.Interfaces;
using JwtWebApi.Controllers;
using JwtWebApi.Domain.Entities;

namespace JwtWebApi.Api.Tests.Controllers
{
    public class VehicleControllerTests
    {
        private readonly Mock<IVehicleService> _mockService;
        private readonly VehicleController _controller;

        public VehicleControllerTests()
        {
            _mockService = new Mock<IVehicleService>();
            
            _controller = new VehicleController(_mockService.Object);
            
            // Mock HttpContext to simulate logged-in user
            var user = new ClaimsPrincipal(new ClaimsIdentity(new System.Security.Claims.Claim[]
            {
                new System.Security.Claims.Claim(ClaimTypes.NameIdentifier, "1")
            }, "mock"));

            _controller.ControllerContext = new ControllerContext
            {
                HttpContext = new DefaultHttpContext { User = user }
            };
        }

        [Fact]
        public async Task Get_ShouldReturnOkWithVehicles()
        {
            // Arrange
            var vehicles = new List<Vehicle> { new Vehicle { VehicleId = 1, Make = "Honda" } };
            _mockService.Setup(s => s.GetVehicles(1)).ReturnsAsync(vehicles);

            // Act
            var result = await _controller.Get();

            // Assert
            var okResult = Assert.IsType<OkObjectResult>(result);
            Assert.NotNull(okResult.Value);
        }

        [Fact]
        public async Task Add_ShouldReturnOkWithVehicleId()
        {
            // Arrange
            var dto = new CreateVehicleDto { Make = "Honda", Year = 2020 };
            _mockService.Setup(s => s.AddVehicle(dto, 1)).ReturnsAsync(99);

            // Act
            var result = await _controller.Add(dto);

            // Assert
            var okResult = Assert.IsType<OkObjectResult>(result);
            Assert.NotNull(okResult.Value);
        }
    }
}
