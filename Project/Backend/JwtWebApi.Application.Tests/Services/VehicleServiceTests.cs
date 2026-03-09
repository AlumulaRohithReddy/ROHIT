using System;
using System.Collections.Generic;
using System.Threading.Tasks;
using JwtWebApi.Application.DTOs.Vehicle;
using JwtWebApi.Application.Exceptions;
using JwtWebApi.Application.Interfaces;
using JwtWebApi.Application.Services;
using JwtWebApi.Domain.Entities;
using Moq;
using Xunit;

namespace JwtWebApi.Application.Tests.Services
{
    public class VehicleServiceTests
    {
        private readonly Mock<IVehicleRepository> _mockRepo;
        private readonly Mock<IVehicleRiskService> _mockRiskRepo;
        private readonly Mock<IPolicyRepository> _mockPolicyRepo;
        private readonly VehicleService _service;

        public VehicleServiceTests()
        {
            _mockRepo = new Mock<IVehicleRepository>();
            _mockRiskRepo = new Mock<IVehicleRiskService>();
            _mockPolicyRepo = new Mock<IPolicyRepository>();
            _service = new VehicleService(_mockRepo.Object, _mockRiskRepo.Object, _mockPolicyRepo.Object);
        }

        [Fact]
        public async Task AddVehicle_WithValidData_ShouldReturnVehicleId()
        {
            // Arrange
            var request = new CreateVehicleDto
            {
                RegistrationNumber = "XYZ-123",
                Make = "Toyota",
                Model = "Camry",
                Year = 2020,
                FuelType = "Petrol",
                VehicleType = "Sedan",
                CurrentMarketValue = 15000
            };
            var userId = 1;

            _mockRepo.Setup(repo => repo.AddAsync(It.IsAny<Vehicle>())).Returns(Task.CompletedTask);
            _mockRepo.Setup(repo => repo.SaveChangesAsync()).Returns(Task.CompletedTask);

            // Act
            var result = await _service.AddVehicle(request, userId);

            // Assert
            _mockRepo.Verify(repo => repo.AddAsync(It.IsAny<Vehicle>()), Times.Once);
            _mockRepo.Verify(repo => repo.SaveChangesAsync(), Times.Once);
        }

        [Fact]
        public async Task AddVehicle_WithInvalidYear_ShouldThrowBadRequestException()
        {
            // Arrange
            var request = new CreateVehicleDto
            {
                RegistrationNumber = "XYZ-123",
                Year = 1800 // Invalid
            };
            var userId = 1;

            // Act & Assert
            await Assert.ThrowsAsync<BadRequestException>(() => _service.AddVehicle(request, userId));
        }

        [Fact]
        public async Task GetVehicleById_WithInvalidId_ShouldThrowNotFoundException()
        {
            // Arrange
            _mockRepo.Setup(repo => repo.GetByIdAsync(99)).ReturnsAsync((Vehicle)null);

            // Act & Assert
            await Assert.ThrowsAsync<NotFoundException>(() => _service.GetVehicleById(99));
        }
    }
}
