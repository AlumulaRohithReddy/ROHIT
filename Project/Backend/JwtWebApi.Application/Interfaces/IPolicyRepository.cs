using JwtWebApi.Domain.Entities;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace JwtWebApi.Application.Interfaces
{
    public interface IPolicyRepository
    {
        Task AddAsync(Policy policy);
        Task<List<Policy>> GetByCustomerIdAsync(int customerId);
        Task<List<Policy>> GetByAgentIdAsync(int agentId);
        Task<Policy?> GetByIdAsync(int id);
        Task<List<Policy>> GetByVehicleIdAsync(int vehicleId);
        void Update(Policy policy);
        Task SaveChangesAsync();
    }
}
