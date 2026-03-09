using JwtWebApi.Domain.Entities;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace JwtWebApi.Application.Interfaces
{
    public interface IPolicyPlanRepository
    {
        Task<IEnumerable<PolicyPlan>> GetAllAsync();
        Task<PolicyPlan?> GetByIdAsync(int id);
        Task AddAsync(PolicyPlan plan);
        Task UpdateAsync(PolicyPlan plan);
        Task DeleteAsync(PolicyPlan plan);
    }
}
