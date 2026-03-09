using System.Collections.Generic;
using System.Threading.Tasks;
using JwtWebApi.Application.DTOs;
using JwtWebApi.Domain.Entities;

namespace JwtWebApi.Application.Interfaces
{
    public interface IPolicyPlanService
    {
        Task<IEnumerable<PolicyPlan>> GetAllPlans();
        Task<PolicyPlan?> GetPlan(int id);
        Task<PolicyPlan> CreatePlan(CreatePolicyPlanRequestDto request);
        Task UpdatePlan(int id, CreatePolicyPlanRequestDto request);
        Task DeletePlan(int id);
    }
}
