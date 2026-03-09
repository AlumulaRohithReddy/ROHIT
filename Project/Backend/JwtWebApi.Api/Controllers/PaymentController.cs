using JwtWebApi.Application.DTOs;
using JwtWebApi.Application.Services;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using System.Security.Claims;
using JwtWebApi.Application.Common;
using JwtWebApi.Domain.Entities;
namespace JwtWebApi.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    [Authorize]
    public class PaymentController : ControllerBase
    {
        private readonly PaymentService _service;

        public PaymentController(PaymentService service)
        {
            _service = service;
        }

        private int GetUserId()
        {
            var claim = User.FindFirst(ClaimTypes.NameIdentifier)?.Value;

            if (claim == null)
                throw new Exception("User not found");

            return int.Parse(claim);
        }

        //  PAY
        [HttpPost]
        public async Task<IActionResult> Pay(CreatePaymentRequest request)
        {
            var userId = GetUserId();
            var result = await _service.MakePayment(userId, request);
            return Ok(new ApiResponse<object> { Success = true, Message = result });
        }

        //  MY PAYMENTS
        [HttpGet("my")]
        public async Task<IActionResult> GetMyPayments()
        {
            var userId = GetUserId();
            var result = await _service.GetMyPayments(userId);
            return Ok(new ApiResponse<List<PaymentResponse>> { Success = true, Data = result });
        }

        //  BY ID
        [HttpGet("{id}")]
        public async Task<IActionResult> GetPayment(int id)
        {
            var result = await _service.GetPayment(id);
            return Ok(new ApiResponse<PaymentResponse> { Success = true, Data = result });
        }
    }
}