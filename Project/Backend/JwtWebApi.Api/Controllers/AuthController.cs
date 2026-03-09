using JwtWebApi.Application.Common;
using JwtWebApi.Application.DTOs;
using JwtWebApi.Application.Interfaces;
using Microsoft.AspNetCore.Mvc;

namespace JwtWebApi.Api.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class AuthController : ControllerBase
    {
        private readonly IAuthService _authService;

        public AuthController(IAuthService authService)
        {
            _authService = authService;
        }

        [HttpPost("register")]
        public async Task<IActionResult> Register(RegisterDto dto)
        {
            var result = await _authService.RegisterAsync(dto);
            if (result == null)
                return BadRequest(new ApiResponse<object> { Success = false, Message = "Username already exists." });

            return Ok(new ApiResponse<object> { Success = true, Message = "User registered successfully", Data = result });
        }

        [HttpPost("login")]
        public async Task<IActionResult> Login(LoginDto dto)
        {
            var result = await _authService.LoginAsync(dto);
            if (result == null) return Unauthorized(new ApiResponse<object> { Success = false, Message = "Invalid credentials" });

            return Ok(new ApiResponse<object> { Success = true, Data = result });
        }

        public class ForgotPasswordDto
        {
            public string Email { get; set; } = string.Empty;
        }

        [HttpPost("forgot-password")]
        public async Task<IActionResult> ForgotPassword([FromBody] ForgotPasswordDto dto)
        {
            var question = await _authService.GetSecurityQuestionAsync(dto.Email);
            if (string.IsNullOrWhiteSpace(question))
                return NotFound(new ApiResponse<object> { Success = false, Message = "User not found or security question not set." });

            return Ok(new ApiResponse<string> { Success = true, Data = question });
        }

        [HttpPost("reset-password")]
        public async Task<IActionResult> ResetPassword(ResetPasswordDto dto)
        {
            var success = await _authService.ResetPasswordAsync(dto);
            if (!success)
                return BadRequest(new ApiResponse<object> { Success = false, Message = "Invalid security answer or user not found." });

            return Ok(new ApiResponse<object> { Success = true, Message = "Password reset successfully." });
        }

        public class AdminResetPasswordDto
        {
            public string NewPassword { get; set; } = string.Empty;
        }

        [HttpPost("admin-reset-password/{userId}")]
        [Microsoft.AspNetCore.Authorization.Authorize(Roles = "Admin")]
        public async Task<IActionResult> AdminResetPassword(int userId, [FromBody] AdminResetPasswordDto dto)
        {
            var user = await _authService.GetUserByIdAsync(userId);
            if (user == null) return NotFound(new ApiResponse<object> { Success = false, Message = "User not found" });

            // We need a method in AuthService or use _db directly if we had it here.
            // But let's add it to IAuthService for consistency.
            var result = await _authService.ForceResetPasswordAsync(userId, dto.NewPassword);
            if (!result) return BadRequest(new ApiResponse<object> { Success = false, Message = "Failed to reset password" });

            return Ok(new ApiResponse<object> { Success = true, Message = "Password reset successfully by Admin." });
        }

        [HttpGet("profile")]
        public async Task<IActionResult> GetProfile()
        {
            var userIdStr = User.FindFirst(System.Security.Claims.ClaimTypes.NameIdentifier)?.Value 
                         ?? User.FindFirst("sub")?.Value;
            if (string.IsNullOrEmpty(userIdStr)) return Unauthorized(new ApiResponse<object> { Success = false, Message = "Not logged in" });

            var userId = int.Parse(userIdStr);
            var user = await _authService.GetUserByIdAsync(userId);
            if (user == null) return NotFound(new ApiResponse<object> { Success = false, Message = "User not found" });

            return Ok(new ApiResponse<object> { Success = true, Data = user });
        }

        [HttpGet("users")]
        public async Task<IActionResult> GetAllUsers()
        {
            var users = await _authService.GetAllUsersAsync();
            return Ok(new ApiResponse<object> { Success = true, Data = users });
        }
    }
}

