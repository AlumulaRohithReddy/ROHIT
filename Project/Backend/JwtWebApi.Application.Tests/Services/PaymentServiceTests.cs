using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using JwtWebApi.Application.DTOs;
using JwtWebApi.Application.Interfaces;
using JwtWebApi.Application.Services;
using JwtWebApi.Domain.Entities;
using Moq;
using Xunit;

namespace JwtWebApi.Application.Tests.Services
{
    public class PaymentServiceTests
    {
        private readonly Mock<IPaymentRepository> _mockPaymentRepo;
        private readonly Mock<IPolicyRepository> _mockPolicyRepo;
        private readonly PaymentService _service;

        public PaymentServiceTests()
        {
            _mockPaymentRepo = new Mock<IPaymentRepository>();
            _mockPolicyRepo = new Mock<IPolicyRepository>();
            _service = new PaymentService(_mockPaymentRepo.Object, _mockPolicyRepo.Object);
        }

        [Fact]
        public async Task MakePayment_WithValidPolicy_ShouldReturnSuccessMessage()
        {
            // Arrange
            var request = new CreatePaymentRequest { PolicyId = 1, PaymentMethod = "Card" };
            var policy = new Policy { PolicyId = 1, CustomerId = 1, Status = "Pending", PremiumAmount = 1000 };
            
            _mockPolicyRepo.Setup(repo => repo.GetByIdAsync(1)).ReturnsAsync(policy);
            _mockPaymentRepo.Setup(repo => repo.AddAsync(It.IsAny<Payment>())).Returns(Task.CompletedTask);
            _mockPaymentRepo.Setup(repo => repo.SaveChangesAsync()).Returns(Task.CompletedTask);

            // Act
            var result = await _service.MakePayment(1, request);

            // Assert
            Assert.Equal("Payment successful. Policy activated.", result);
            Assert.Equal("Active", policy.Status); 
            _mockPaymentRepo.Verify(repo => repo.AddAsync(It.IsAny<Payment>()), Times.Once);
        }

        [Fact]
        public async Task MakePayment_WhenUnauthorized_ShouldThrowException()
        {
            // Arrange
            var request = new CreatePaymentRequest { PolicyId = 1, PaymentMethod = "Card" };
            var policy = new Policy { PolicyId = 1, CustomerId = 99 }; // Different customer
            
            _mockPolicyRepo.Setup(repo => repo.GetByIdAsync(1)).ReturnsAsync(policy);

            // Act & Assert
            var ex = await Assert.ThrowsAsync<Exception>(() => _service.MakePayment(1, request));
            Assert.Equal("Unauthorized access", ex.Message);
        }

        [Fact]
        public async Task GetMyPayments_ShouldReturnMappedPayments()
        {
            // Arrange
            var payments = new List<Payment>
            {
                new Payment { PaymentId = 1, PolicyId = 1, Amount = 500, Status = "Success" }
            };
            _mockPaymentRepo.Setup(repo => repo.GetByUserIdAsync(1)).ReturnsAsync(payments);

            // Act
            var result = await _service.GetMyPayments(1);

            // Assert
            Assert.NotNull(result);
            Assert.Single(result);
            Assert.Equal(500, result.First().Amount);
        }
    }
}
