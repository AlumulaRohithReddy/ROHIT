using JwtWebApi.Application.DTOs;
using JwtWebApi.Domain.Entities;
namespace JwtWebApi.Application.Interfaces
{
    public interface IAuthService
    {
        Task<AuthResultDto?> RegisterAsync(RegisterDto dto);
        Task<AuthResultDto?> LoginAsync(LoginDto dto);
        Task<bool> UserExistsAsync(string username);
        Task<string?> GetSecurityQuestionAsync(string email);
        Task<bool> ResetPasswordAsync(ResetPasswordDto dto);
        Task<bool> ForceResetPasswordAsync(int userId, string newPassword);
        Task<User?> GetUserByIdAsync(int id);
        Task<IEnumerable<User>> GetAllUsersAsync();
    }
}
