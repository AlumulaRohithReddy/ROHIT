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
    public class PolicyPlanRepositoryTests
    {
        private AppDbContext GetInMemoryDbContext()
        {
            var options = new DbContextOptionsBuilder<AppDbContext>()
                .UseInMemoryDatabase(databaseName: Guid.NewGuid().ToString())
                .Options;
            
            return new AppDbContext(options);
        }

        [Fact]
        public async Task GetAllAsync_ShouldReturnAllPlans()
        {
            // Arrange
            using var context = GetInMemoryDbContext();
            context.PolicyPlans.AddRange(
                new PolicyPlan { PlanName = "Silver", BasePremium = 100, PolicyType = "Car", Policies = new List<Policy>() },
                new PolicyPlan { PlanName = "Gold", BasePremium = 200, PolicyType = "Car", Policies = new List<Policy>() }
            );
            await context.SaveChangesAsync();
            
            var repository = new PolicyPlanRepository(context);

            // Act
            var result = await repository.GetAllAsync();

            // Assert
            Assert.NotNull(result);
            Assert.Equal(2, result.Count());
        }

        [Fact]
        public async Task AddAsync_ShouldPersistPlan()
        {
            // Arrange
            using var context = GetInMemoryDbContext();
            var repository = new PolicyPlanRepository(context);
            var plan = new PolicyPlan { PlanName = "Platinum", BasePremium = 300, PolicyType = "Car", Policies = new List<Policy>() };

            // Act
            await repository.AddAsync(plan);

            // Assert
            var saved = await context.PolicyPlans.FirstOrDefaultAsync(p => p.PlanName == "Platinum");
            Assert.NotNull(saved);
            Assert.Equal(300, saved.BasePremium);
        }
    }
}
