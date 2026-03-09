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
    public class PaymentRepositoryTests
    {
        private AppDbContext GetInMemoryDbContext()
        {
            var options = new DbContextOptionsBuilder<AppDbContext>()
                .UseInMemoryDatabase(databaseName: Guid.NewGuid().ToString())
                .Options;
            
            return new AppDbContext(options);
        }

        [Fact]
        public async Task GetByPolicyIdAsync_ShouldReturnSuccessPayment()
        {
            // Arrange
            using var context = GetInMemoryDbContext();
            
            // Payments require a Policy or at least a valid State
            context.Payments.AddRange(
                new Payment { PolicyId = 1, Status = "Failed", Amount = 100, TransactionId="T1", PaymentMethod="UPI" },
                new Payment { PolicyId = 1, Status = "Success", Amount = 100, TransactionId="T2", PaymentMethod="UPI" }, // Target
                new Payment { PolicyId = 2, Status = "Success", Amount = 200, TransactionId="T3", PaymentMethod="UPI" }
            );
            await context.SaveChangesAsync();
            
            var repository = new PaymentRepository(context);

            // Act
            var result = await repository.GetByPolicyIdAsync(1);

            // Assert
            Assert.NotNull(result);
            Assert.Equal("Success", result.Status);
            Assert.Equal(1, result.PolicyId);
        }
    }
}
