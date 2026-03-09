using System;
using System.Threading.Tasks;
using Microsoft.EntityFrameworkCore;
using Xunit;
using JwtWebApi.Domain.Entities;
using JwtWebApi.Infrastructure.Data;
using JwtWebApi.Infrastructure.Repositories;
using JwtWebApi.Application.Exceptions;
using System.Collections.Generic;

namespace JwtWebApi.Infrastructure.Tests.Repositories
{
    public class VehicleRepositoryTests
    {
        private AppDbContext GetInMemoryDbContext()
        {
            var options = new DbContextOptionsBuilder<AppDbContext>()
                .UseInMemoryDatabase(databaseName: Guid.NewGuid().ToString())
                .Options;
            
            return new AppDbContext(options);
        }

        [Fact]
        public async Task AddAsync_ShouldAddVehicle_WhenRegistrationIsUnique()
        {
            // Arrange
            using var context = GetInMemoryDbContext();
            var repository = new VehicleRepository(context);
            var vehicle = new Vehicle 
            { 
                RegistrationNumber = "UNIQUE-123", 
                Model = "Honda",
                FuelType = "Petrol",
                VehicleType = "Sedan",
                Policies = new List<Policy>()
            };

            // Act
            await repository.AddAsync(vehicle);
            await context.SaveChangesAsync();

            // Assert
            var savedVehicle = await context.Vehicles.FirstOrDefaultAsync(v => v.RegistrationNumber == "UNIQUE-123");
            Assert.NotNull(savedVehicle);
            Assert.Equal("Honda", savedVehicle.Model);
        }

        [Fact]
        public async Task AddAsync_ShouldThrowBadRequestException_WhenRegistrationExists()
        {
            // Arrange
            using var context = GetInMemoryDbContext();
            context.Vehicles.Add(new Vehicle 
            { 
                RegistrationNumber = "DUP-123", 
                Model = "Honda",
                FuelType = "Petrol",
                VehicleType = "Sedan",
                Policies = new List<Policy>()
            });
            await context.SaveChangesAsync();
            
            var repository = new VehicleRepository(context);
            var duplicateVehicle = new Vehicle 
            { 
                RegistrationNumber = "DUP-123", 
                Model = "Toyota",
                FuelType = "Petrol",
                VehicleType = "Sedan",
                Policies = new List<Policy>()
            };

            // Act & Assert
            var ex = await Assert.ThrowsAsync<BadRequestException>(() => repository.AddAsync(duplicateVehicle));
            Assert.Equal("A vehicle with this registration already exists in our system.", ex.Message);
        }

        [Fact]
        public async Task GetByCustomerIdAsync_ShouldReturnOnlyCustomersVehicles()
        {
            // Arrange
            using var context = GetInMemoryDbContext();
            context.Vehicles.AddRange(
                new Vehicle { RegistrationNumber = "V1", CustomerId = 1, FuelType="P", VehicleType="S", Policies = new List<Policy>() },
                new Vehicle { RegistrationNumber = "V2", CustomerId = 1, FuelType="P", VehicleType="S", Policies = new List<Policy>() },
                new Vehicle { RegistrationNumber = "V3", CustomerId = 2, FuelType="P", VehicleType="S", Policies = new List<Policy>() }
            );
            await context.SaveChangesAsync();
            
            var repository = new VehicleRepository(context);

            // Act
            var result = await repository.GetByCustomerIdAsync(1);

            // Assert
            Assert.NotNull(result);
            Assert.Equal(2, result.Count);
        }
    }
}
