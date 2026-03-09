using System;
using System.Threading.Tasks;
using Microsoft.EntityFrameworkCore;
using Xunit;
using JwtWebApi.Domain.Entities;
using JwtWebApi.Infrastructure.Data;
using JwtWebApi.Infrastructure.Repositories;

namespace JwtWebApi.Infrastructure.Tests.Repositories
{
    public class UserRepositoryTests
    {
        private AppDbContext GetInMemoryDbContext()
        {
            var options = new DbContextOptionsBuilder<AppDbContext>()
                .UseInMemoryDatabase(databaseName: Guid.NewGuid().ToString())
                .Options;
            
            return new AppDbContext(options);
        }

        [Fact]
        public async Task AddAsync_ShouldAddUserToDatabase()
        {
            // Arrange
            using var context = GetInMemoryDbContext();
            var repository = new UserRepository(context);
            var user = new User { Email = "test@example.com", FullName = "Test User", Role = "Customer" };

            // Act
            await repository.AddAsync(user);

            // Assert
            var savedUser = await context.Users.FirstOrDefaultAsync(u => u.Email == "test@example.com");
            Assert.NotNull(savedUser);
            Assert.Equal("Test User", savedUser.FullName);
        }

        [Fact]
        public async Task GetByEmailAsync_ShouldReturnCorrectUser()
        {
            // Arrange
            using var context = GetInMemoryDbContext();
            context.Users.Add(new User { Email = "findme@example.com", FullName = "Found Me", Role = "Customer" });
            await context.SaveChangesAsync();
            
            var repository = new UserRepository(context);

            // Act
            var result = await repository.GetByEmailAsync("findme@example.com");

            // Assert
            Assert.NotNull(result);
            Assert.Equal("Found Me", result.FullName);
        }
    }
}
