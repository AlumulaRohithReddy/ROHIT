using Microsoft.AspNetCore.Mvc;
using Moq;
using System.Collections.Generic;
using System.Threading.Tasks;
using Xunit;
using JwtWebApi.Application.DTOs;
using JwtWebApi.Application.Interfaces;
using JwtWebApi.Api.Controllers;
using JwtWebApi.Domain.Entities;
using Microsoft.EntityFrameworkCore;

namespace JwtWebApi.Api.Tests.Controllers
{
    public class SettingsControllerTests
    {
        private readonly Mock<IAppDbContext> _mockDb;
        private readonly SettingsController _controller;

        public SettingsControllerTests()
        {
            _mockDb = new Mock<IAppDbContext>();
            _controller = new SettingsController(_mockDb.Object);
        }

        // Simulating the controller bindings
        [Fact]
        public void Controller_ShouldHaveAuthorizeAttribute()
        {
            // Arrange
            var type = typeof(SettingsController);
            var attributes = type.GetCustomAttributes(typeof(Microsoft.AspNetCore.Authorization.AuthorizeAttribute), true);

            // Assert
            Assert.True(attributes.Length > 0);
        }
    }
}
