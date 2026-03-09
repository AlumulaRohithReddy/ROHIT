using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using JwtWebApi.Domain.Entities;
namespace JwtWebApi.Application.Interfaces
{
    public interface IClaimRepository
    {
        Task AddAsync(Claim claim);
        Task<Claim?> GetByIdAsync(int id);
        Task<List<Claim>> GetAllAsync();
        Task<List<Claim>> GetByCustomerIdAsync(int customerId);
        Task<List<Claim>> GetByOfficerIdAsync(int officerId);
        Task SaveChangesAsync();
    }
}
