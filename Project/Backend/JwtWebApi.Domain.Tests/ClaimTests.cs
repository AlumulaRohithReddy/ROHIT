using System;
using System.Linq;
using JwtWebApi.Domain.Entities;

using Xunit;

namespace JwtWebApi.Domain.Tests
{
    public class ClaimTests
    {
        [Fact]
        public void Default_Claim_ShouldHave_Submitted_Status()
        {
            // Arrange & Act
            var claim = new Claim();

            // Assert
            Assert.Equal(JwtWebApi.Domain.Enums.ClaimStatus.Submitted.ToString(), claim.Status);
        }

        [Fact]
        public void Default_Claim_ShouldHave_Generated_ClaimNumber()
        {
            // Arrange & Act
            var claim = new Claim();

            // Assert
            Assert.NotNull(claim.ClaimNumber);
            Assert.False(string.IsNullOrWhiteSpace(claim.ClaimNumber));
        }

        [Fact]
        public void Default_Claim_ShouldHave_CreatedAt_ApproximatelyNow()
        {
            // Arrange & Act
            var claim = new Claim();
            var difference = DateTime.UtcNow - claim.CreatedAt;

            // Assert
            Assert.True(difference.TotalSeconds < 5, "CreatedAt should be initialized to current UTC time.");
        }

        [Fact]
        public void Default_Claim_ShouldInitialize_ClaimDocuments_Collection()
        {
            // Arrange & Act
            var claim = new Claim();

            // Assert
            Assert.NotNull(claim.ClaimDocuments);
            Assert.Empty(claim.ClaimDocuments);
        }
    }
}
