using JwtWebApi.Application.DTOs;
using JwtWebApi.Domain.Entities;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using System.Security.Claims;
using JwtWebApi.Application.Common;
using JwtWebApi.Application.Services;
[ApiController]
[Route("api/[controller]")]
[Authorize]
public class ClaimController : ControllerBase
{
    private readonly ClaimService _service;

    public ClaimController(ClaimService service)
    {
        _service = service;
    }

    private int GetUserId()
    {
        return int.Parse(User.FindFirst(ClaimTypes.NameIdentifier)!.Value);
    }

    private string GetRole()
    {
        return User.FindFirst(ClaimTypes.Role)!.Value;
    }

    // CUSTOMER
    [Authorize(Roles = "Customer")]
    [HttpPost]
    public async Task<IActionResult> SubmitClaim(CreateClaimRequestDto request)
    {
        var result = await _service.SubmitClaim(GetUserId(), request);
        return Ok(new ApiResponse<JwtWebApi.Application.DTOs.ClaimResponse> { Success = true, Data = result, Message = "Claim submitted successfully" });
    }

    // ADMIN
    [Authorize(Roles = "Admin")]
    [HttpPut("{id}/assign/{officerId}")]
    public async Task<IActionResult> Assign(int id, int officerId)
    {
        await _service.AssignOfficer(id, officerId);
        return Ok(new ApiResponse<object> { Success = true, Message = "Officer assigned" });
    }

    // CLAIMS OFFICER
    [Authorize(Roles = "ClaimsOfficer")]
    [HttpPut("{id}/review")]
    public async Task<IActionResult> Review(int id, ReviewClaimRequest request)
    {
        await _service.ReviewClaim(id, GetUserId(), request);
        return Ok(new ApiResponse<object> { Success = true, Message = "Claim reviewed" });
    }

    [HttpGet("my")]
    public async Task<IActionResult> GetMyClaims()
    {
        var claims = await _service.GetMyClaims(GetUserId());
        return Ok(new ApiResponse<List<JwtWebApi.Application.DTOs.ClaimResponse>> { Success = true, Data = claims });
    }

    [Authorize(Roles = "ClaimsOfficer")]
    [HttpGet("officer")]
    public async Task<IActionResult> GetOfficerClaims()
    {
        var claims = await _service.GetOfficerClaims(GetUserId());
        return Ok(new ApiResponse<List<JwtWebApi.Application.DTOs.ClaimResponse>> { Success = true, Data = claims });
    }

    [HttpGet("{id}")]
    public async Task<IActionResult> GetClaim(int id)
    {
        var claim = await _service.GetClaim(id, GetUserId(), GetRole());
        return Ok(new ApiResponse<JwtWebApi.Application.DTOs.ClaimResponse> { Success = true, Data = claim });
    }

    [Authorize(Roles = "Admin")]
    [HttpGet]
    public async Task<IActionResult> GetAllClaims()
    {
        var claims = await _service.GetAllClaims();
        return Ok(new ApiResponse<List<JwtWebApi.Application.DTOs.ClaimResponse>> { Success = true, Data = claims });
    }
}