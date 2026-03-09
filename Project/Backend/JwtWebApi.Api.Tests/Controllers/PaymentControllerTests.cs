using Microsoft.AspNetCore.Mvc;
using Moq;
using System.Collections.Generic;
using System.Security.Claims;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Http;
using Xunit;
using JwtWebApi.Application.DTOs;
using JwtWebApi.Application.Services;
using JwtWebApi.Controllers;

namespace JwtWebApi.Api.Tests.Controllers
{
    public class PaymentControllerTests
    {
        // Note: PaymentController directly injects the concrete PaymentService, not an IPaymentService interface.
        // Similar to Vehicle and PolicyPlan, we would normally extract an IPaymentService.
        // For testing the controller's attribute routing, we validate its metadata setup.

        [Fact]
        public void Controller_ShouldHaveAuthorizeAttribute()
        {
            // Arrange
            var type = typeof(PaymentController);
            var attributes = type.GetCustomAttributes(typeof(Microsoft.AspNetCore.Authorization.AuthorizeAttribute), true);

            // Assert
            Assert.True(attributes.Length > 0);
        }
    }
}
