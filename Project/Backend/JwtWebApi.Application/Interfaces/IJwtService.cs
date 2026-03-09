using JwtWebApi.Domain.Entities;

namespace JwtWebApi.Application.Interfaces
{
    public interface IJwtService
    {
        string GenerateToken(User user);
    }
}
