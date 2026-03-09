using JwtWebApi.Application.DTOs;
using JwtWebApi.Application.Services;
using JwtWebApi.Application.Interfaces;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using JwtWebApi.Application.Common;
using JwtWebApi.Domain.Entities;
using Microsoft.AspNetCore.Authorization;
namespace JwtWebApi.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    [Authorize]
    public class PolicyPlanController : ControllerBase
    {
        private readonly IPolicyPlanService _service;

        public PolicyPlanController(IPolicyPlanService service)
        {
            _service = service;
        }

        [HttpGet]
        public async Task<IActionResult> GetAll()
        {
            var plans = await _service.GetAllPlans();
            return Ok(new ApiResponse<List<PolicyPlan>> { Success = true, Data = (List<PolicyPlan>)plans });
        }

        [HttpGet("{id}")]
        public async Task<IActionResult> Get(int id)
        {
            var plan = await _service.GetPlan(id);
            if (plan == null) return NotFound(new ApiResponse<object> { Success = false, Message = "Plan not found" });
            return Ok(new ApiResponse<PolicyPlan> { Success = true, Data = plan });
        }

        [Authorize(Roles = "Admin")]
        [HttpPost]
        public async Task<IActionResult> Create(CreatePolicyPlanRequestDto request)
        {
            var planId = await _service.CreatePlan(request);
            return Ok(new ApiResponse<PolicyPlan> { Success = true, Message = "Plan created successfully", Data = planId });
        }

        [Authorize(Roles = "Admin")]
        [HttpPut("{id}")]
        public async Task<IActionResult> Update(int id, CreatePolicyPlanRequestDto request)
        {
            await _service.UpdatePlan(id, request);
            return Ok(new ApiResponse<string> { Success = true, Message = "Plan updated successfully" });
        }

        [Authorize(Roles = "Admin")]
        [HttpDelete("{id}")]
        public async Task<IActionResult> Delete(int id)
        {
            await _service.DeletePlan(id);
            return Ok(new ApiResponse<string> { Success = true, Message = "Plan deleted successfully" });
        }
    }
}
