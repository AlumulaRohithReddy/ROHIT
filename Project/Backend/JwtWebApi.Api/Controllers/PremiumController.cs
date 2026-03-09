using JwtWebApi.Application.Common;
using JwtWebApi.Application.Interfaces;
using JwtWebApi.Domain.Entities;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using System.Threading.Tasks;

namespace JwtWebApi.Api.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    [Authorize]
    public class PremiumController : ControllerBase
    {
        private readonly IPremiumCalculationService _premiumService;
        private readonly IVehicleRepository _vehicleRepo;
        private readonly IPolicyPlanRepository _planRepo;

        public PremiumController(
            IPremiumCalculationService premiumService,
            IVehicleRepository vehicleRepo,
            IPolicyPlanRepository planRepo)
        {
            _premiumService = premiumService;
            _vehicleRepo = vehicleRepo;
            _planRepo = planRepo;
        }

        [HttpGet("calculate")]
        public async Task<IActionResult> CalculatePremium([FromQuery] int vehicleId, [FromQuery] int planId)
        {
            var vehicle = await _vehicleRepo.GetByIdAsync(vehicleId);
            if (vehicle == null) return NotFound("Vehicle not found");

            var plan = await _planRepo.GetByIdAsync(planId);
            if (plan == null) return NotFound("Plan not found");

            var breakdown = await _premiumService.CalculatePremiumAsync(vehicle, plan);
            
            // Dummy data for testing
            if (breakdown.TotalPremium == 0 || breakdown.BasePremium == 0)
            {
                breakdown.BasePremium = 5000;
                breakdown.TotalPremium = 5500;
                breakdown.FactorsApplied.Add("DEBUG: Dummy Base Premium");
            }
            
            return Ok(new ApiResponse<PremiumBreakdown>
            {
                Success = true,
                Data = breakdown
            });
        }
    }
}
