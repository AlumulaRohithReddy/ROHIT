using System;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.EntityFrameworkCore;
using Xunit;
using JwtWebApi.Domain.Entities;
using JwtWebApi.Infrastructure.Data;
using JwtWebApi.Infrastructure.Repositories;
using System.Collections.Generic;

namespace JwtWebApi.Infrastructure.Tests.Repositories
{
    public class PolicyRepositoryTests
    {
        private AppDbContext GetInMemoryDbContext()
        {
            var options = new DbContextOptionsBuilder<AppDbContext>()
                .UseInMemoryDatabase(databaseName: Guid.NewGuid().ToString())
                .Options;
            
            return new AppDbContext(options);
        }

        [Fact]
        public async Task GetByCustomerIdAsync_ShouldIncludeNavigationsAndFilter()
        {
            // Arrange
            using var context = GetInMemoryDbContext();
            
            var customer = new User { UserId = 111, FullName = "C", Email="c@v.com", Role="Customer", PasswordHash="P" };
            var vehicle = new Vehicle { VehicleId = 111, RegistrationNumber="V1", FuelType="P", VehicleType="S", Policies = new List<Policy>(), Model="M", Make="M" };
            var plan = new PolicyPlan { PlanId = 111, PlanName = "G", PolicyType="C", Policies = new List<Policy>() };
            
            context.Users.Add(customer);
            context.Vehicles.Add(vehicle);
            context.PolicyPlans.Add(plan);
            
            context.Policies.AddRange(
                new Policy { PolicyNumber="P1", CustomerId=111, VehicleId=111, PlanId=111, Status="Active" },
                new Policy { PolicyNumber="P2", CustomerId=222, Status="Pending", VehicleId=99, PlanId=99 } // Note: ID constraints might fail if not careful, but InMemory doesn't enforce FKs by default unless configured
            );
            await context.SaveChangesAsync();
            
            var repository = new PolicyRepository(context);

            // Act
            var result = await repository.GetByCustomerIdAsync(111);

            // Assert
            Assert.NotNull(result);
            Assert.Single(result);
            Assert.Equal("V1", result.First().Vehicle.RegistrationNumber);
        }
    }
}
