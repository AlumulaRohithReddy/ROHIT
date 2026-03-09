using JwtWebApi.Domain.Entities;

namespace JwtWebApi.Application.Interfaces
{
    public interface IAppDbContext
    {
        Microsoft.EntityFrameworkCore.DbSet<Vehicle> Vehicles{ get; }
        Microsoft.EntityFrameworkCore.DbSet<User> Users { get; }
        Microsoft.EntityFrameworkCore.DbSet<Policy> Policies { get; }
        Microsoft.EntityFrameworkCore.DbSet<Claim> Claims { get; }
        Microsoft.EntityFrameworkCore.DbSet<Payment> Payments { get; }
        Microsoft.EntityFrameworkCore.DbSet<SystemSetting> SystemSettings { get; }
        Microsoft.EntityFrameworkCore.DbSet<PolicyPlan> PolicyPlans { get; }
        Task<int> SaveChangesAsync(CancellationToken cancellationToken = default);
    }
}
