using JwtWebApi.Application.DTOs;
using JwtWebApi.Application.Interfaces;
using JwtWebApi.Domain.Entities;
using JwtWebApi.Domain.Enums;
using Microsoft.AspNetCore.Identity;
using Microsoft.EntityFrameworkCore;
using System.Data;
using System.Xml.Linq;

namespace JwtWebApi.Application.Services
{
    public class AuthService : IAuthService
    {
        private readonly IAppDbContext _db;
        private readonly IJwtService _jwt;
        private readonly PasswordHasher<User> _hasher;

        public AuthService(IAppDbContext db, IJwtService jwt)
        {
            _db = db;
            _jwt = jwt;
            _hasher = new PasswordHasher<User>();
        }

        public async Task<AuthResultDto?> RegisterAsync(RegisterDto dto)
        {
            if (await UserExistsAsync(dto.Email)) return null;

            var user = new User
            {
                Email = dto.Email,
                FullName = dto.FullName,
                Role = dto.Role,
                IsActive = true,
                SecurityQuestion = dto.SecurityQuestion
            };
            user.PasswordHash = _hasher.HashPassword(user, dto.Password);
            
            if (!string.IsNullOrEmpty(dto.SecurityAnswer))
            {
                user.SecurityAnswerHash = _hasher.HashPassword(user, dto.SecurityAnswer.ToLower().Trim());
            }

            _db.Users.Add(user);
            await _db.SaveChangesAsync();

            var token = _jwt.GenerateToken(user);
            return new AuthResultDto(token, user.Email, user.Role);
        }

        public async Task<string?> GetSecurityQuestionAsync(string email)
        {
            var user = await _db.Users.SingleOrDefaultAsync(u => u.Email == email);
            return user?.SecurityQuestion;
        }

        public async Task<bool> ResetPasswordAsync(ResetPasswordDto dto)
        {
            var user = await _db.Users.SingleOrDefaultAsync(u => u.Email == dto.Email);
            if (user == null || string.IsNullOrEmpty(user.SecurityAnswerHash)) return false;

            var result = _hasher.VerifyHashedPassword(user, user.SecurityAnswerHash, dto.SecurityAnswer.ToLower().Trim());
            if (result == PasswordVerificationResult.Failed) return false;

            user.PasswordHash = _hasher.HashPassword(user, dto.NewPassword);
            await _db.SaveChangesAsync();
            return true;
        }

        public async Task<AuthResultDto?> LoginAsync(LoginDto dto)
        {
            var user = await _db.Users.SingleOrDefaultAsync(u => u.Email == dto.Email);
            if (user == null) return null;

            var verificationResult = _hasher.VerifyHashedPassword(user, user.PasswordHash, dto.Password);
            if (verificationResult == PasswordVerificationResult.Failed) return null;

            var token = _jwt.GenerateToken(user);
            return new AuthResultDto(token, user.Email, user.Role);
        }

        public async Task<bool> UserExistsAsync(string email)
        {
            return await _db.Users.AnyAsync(u => u.Email == email);
        }

        

        public async Task<bool> ForceResetPasswordAsync(int userId, string newPassword)
        {
            var user = await _db.Users.SingleOrDefaultAsync(u => u.UserId == userId);
            if (user == null) return false;

            user.PasswordHash = _hasher.HashPassword(user, newPassword);
            await _db.SaveChangesAsync();
            return true;
        }

        public async Task<User?> GetUserByIdAsync(int id)
        {
            return await _db.Users.SingleOrDefaultAsync(u => u.UserId == id);
        }

        public async Task<IEnumerable<User>> GetAllUsersAsync()
        {
            return await _db.Users.ToListAsync();
        }
    }
}
