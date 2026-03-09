using System.Linq;
using JwtWebApi.Domain.Entities;
using Xunit;

namespace JwtWebApi.Domain.Tests
{
    public class UserTests
    {
        [Fact]
        public void Default_User_ShouldHave_IsActive_True()
        {
            // Arrange & Act
            var user = new User();

            // Assert
            Assert.True(user.IsActive);
        }

        [Fact]
        public void Default_User_ShouldInitialize_Vehicles_Collection()
        {
            // Arrange & Act
            var user = new User();

            // Assert
            Assert.NotNull(user.Vehicles);
            Assert.Empty(user.Vehicles);
        }

        [Fact]
        public void Default_User_ShouldInitialize_Policies_Collection()
        {
            // Arrange & Act
            var user = new User();

            // Assert
            Assert.NotNull(user.Policies);
            Assert.Empty(user.Policies);
        }

        [Fact]
        public void Properties_Should_Update_Correctly()
        {
            // Arrange
            var user = new User();

            // Act
            user.FullName = "John Doe";
            user.Email = "john@example.com";
            user.Role = "Customer";

            // Assert
            Assert.Equal("John Doe", user.FullName);
            Assert.Equal("john@example.com", user.Email);
            Assert.Equal("Customer", user.Role);
        }
    }
}
