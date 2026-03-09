using JwtWebApi.Application.Interfaces;
using JwtWebApi.Domain.Entities;
using Microsoft.Extensions.Configuration;
using Microsoft.IdentityModel.Tokens;
using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using System.Text;

namespace JwtWebApi.Infrastructure.Authentication
{
    public class JwtService : IJwtService
    {
        private readonly IConfiguration _config;
        private readonly string _key;
        private readonly string _issuer;
        private readonly string _audience;
        private readonly int _expiresMinutes;

        public JwtService(IConfiguration config)
        {
            _config = config;
            _key = _config["Jwt:Key"]!;
            _issuer = _config["Jwt:Issuer"]!;
            _audience = _config["Jwt:Audience"]!;
            _expiresMinutes = int.Parse(_config["Jwt:ExpiresMinutes"] ?? "60");
        }

        public string GenerateToken(User user)
        {
            var claims = new List<System.Security.Claims.Claim>
            {
                new System.Security.Claims.Claim(System.Security.Claims.ClaimTypes.NameIdentifier, user.UserId.ToString()),
                new System.Security.Claims.Claim(System.Security.Claims.ClaimTypes.Email, user.Email),
                new System.Security.Claims.Claim(System.Security.Claims.ClaimTypes.Role, user.Role),
                new System.Security.Claims.Claim("sub", user.UserId.ToString()),
                new System.Security.Claims.Claim("role", user.Role),
                new System.Security.Claims.Claim("email", user.Email)
            };

            var securityKey = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(_key));
            var creds = new SigningCredentials(securityKey, SecurityAlgorithms.HmacSha256);

            var token = new JwtSecurityToken(
                issuer: _issuer,
                audience: _audience,
                claims: claims,
                expires: DateTime.UtcNow.AddMinutes(_expiresMinutes),
                signingCredentials: creds
            );

            return new JwtSecurityTokenHandler().WriteToken(token);
        }
    }
}
