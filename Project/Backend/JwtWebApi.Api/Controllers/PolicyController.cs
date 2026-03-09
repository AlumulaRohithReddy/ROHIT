using JwtWebApi.Application.DTOs;
using JwtWebApi.Application.Services;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using System.Security.Claims;
using JwtWebApi.Domain.Entities;
using JwtWebApi.Application.Common;
namespace JwtWebApi.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    [Authorize]
    public class PolicyController : ControllerBase
    {
        private readonly PolicyService _policyService;

        public PolicyController(PolicyService policyService)
        {
            _policyService = policyService;
        }

        private int GetUserId()
        {
            return int.Parse(User.FindFirst(ClaimTypes.NameIdentifier)?.Value);
        }

        [HttpPost]
        public async Task<IActionResult> CreatePolicy(CreatePolicyRequestDto request)
        {
            var userId = GetUserId();

            var policy = await _policyService.CreatePolicy(userId, request);

            return Ok(new ApiResponse<object> { Success = true, Message = "Policy created successfully" }); 
        }

        [HttpGet]
        public async Task<IActionResult> GetMyPolicies()
        {
            var userId = GetUserId();

            var policies = await _policyService.GetMyPolicies(userId);

            return Ok(new ApiResponse<List<PolicyResponse>> { Success = true, Data = policies });
        }

        [HttpGet("{id}")]
        public async Task<IActionResult> GetPolicy(int id)
        {
            var policy = await _policyService.GetPolicy(id);

            return Ok(new ApiResponse<PolicyResponse> { Success = true, Data = policy });
        }

        [Authorize(Roles = "Agent")]
        [HttpPut("{id}/approve")]
        public async Task<IActionResult> Approve(int id, [FromBody] ApprovePolicyRequest request)
        {
            await _policyService.ApprovePolicy(id, request.UpdatedPremium);
            return Ok(new ApiResponse<string> { Success = true, Message = "Policy approved successfully" });
        }

        [Authorize(Roles = "Agent")]
        [HttpPut("{id}/reject")]
        public async Task<IActionResult> Reject(int id)
        {
            await _policyService.RejectPolicy(id);
            return Ok(new ApiResponse<string> { Success = true, Message = "Policy rejected successfully" });
        }

        [Authorize(Roles = "Agent")]
        [HttpGet("assigned")]
        public async Task<IActionResult> GetAssignedPolicies()
        {
            var userId = GetUserId();
            var policies = await _policyService.GetAssignedPolicies(userId);
            return Ok(new ApiResponse<List<PolicyResponse>> { Success = true, Data = policies });
        }
    }
}
