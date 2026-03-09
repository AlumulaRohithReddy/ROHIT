using JwtWebApi.Domain.Entities;
namespace JwtWebApi.Application.Interfaces
{
    public interface IUserRepository
    {
        Task<User?> GetByEmailAsync(string email);
        Task<IEnumerable<User>> GetAllAsync();
        Task AddAsync(User user);

        Task SaveChangesAsync();
    }
}