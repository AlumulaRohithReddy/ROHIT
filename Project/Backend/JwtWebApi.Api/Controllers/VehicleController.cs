using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using System.Security.Claims;
using JwtWebApi.Application.Common;
using JwtWebApi.Application.DTOs.Vehicle;
using JwtWebApi.Application.Interfaces;
using JwtWebApi.Application.Services; 
using JwtWebApi.Domain.Entities;
namespace JwtWebApi.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    [Authorize]
    public class VehicleController : ControllerBase
    {
        private readonly IVehicleService _vehicleService;

        public VehicleController(IVehicleService vehicleService)
        {
            _vehicleService = vehicleService;
        }

        private int GetUserId()
        {
            return int.Parse(User.FindFirst(ClaimTypes.NameIdentifier)?.Value);
        }

        //  Add Vehicle
        [HttpPost]
        public async Task<IActionResult> Add([FromBody] CreateVehicleDto dto)
        {
            var userId = GetUserId();

            var id = await _vehicleService.AddVehicle(dto, userId);

            return Ok(new ApiResponse<int>
            {
                Success = true,
                Message = "Vehicle added successfully",
                Data = id
            });
        }

        //  Get All Vehicles
        [HttpGet]
        public async Task<IActionResult> Get()
        {
            var userId = GetUserId();

            var vehicles = await _vehicleService.GetVehicles(userId);

            return Ok(new ApiResponse<List<Vehicle>>
            {
                Success = true,
                Data = vehicles
            });
        }

        //  Get by Id
        [HttpGet("{id}")]
        public async Task<IActionResult> Get(int id)
        {
            var vehicle = await _vehicleService.GetVehicleById(id);

            return Ok(new ApiResponse<Vehicle>
            {
                Success = true,
                Data = vehicle
            });
        }

        //  Update
        [HttpPut("{id}")]
        public async Task<IActionResult> Update(int id, UpdateVehicleDto dto)
        {
            await _vehicleService.UpdateVehicle(id, dto);

            return Ok(new ApiResponse<string>
            {
                Success = true,
                Message = "Vehicle updated successfully"
            });
        }

        //  Delete
        [HttpDelete("{id}")]
        public async Task<IActionResult> Delete(int id)
        {
            await _vehicleService.DeleteVehicle(id);

            return Ok(new ApiResponse<string>
            {
                Success = true,
                Message = "Vehicle deleted successfully"
            });
        }
    }
}
