using System.Linq;
using JwtWebApi.Domain.Entities;
using Xunit;

namespace JwtWebApi.Domain.Tests
{
    public class PolicyPlanTests
    {
        [Fact]
        public void Should_Set_And_Get_Properties_Correctly()
        {
            // Arrange
            var plan = new PolicyPlan
            {
                PlanId = 1,
                PlanName = "Gold Plan",
                PolicyType = "Comprehensive",
                BasePremium = 1500.00m,
                MaxCoverageAmount = 50000.00m,
                PolicyDurationMonths = 12
            };

            // Act & Assert
            Assert.Equal(1, plan.PlanId);
            Assert.Equal("Gold Plan", plan.PlanName);
            Assert.Equal("Comprehensive", plan.PolicyType);
            Assert.Equal(1500.00m, plan.BasePremium);
            Assert.Equal(50000.00m, plan.MaxCoverageAmount);
            Assert.Equal(12, plan.PolicyDurationMonths);
        }
    }
}
