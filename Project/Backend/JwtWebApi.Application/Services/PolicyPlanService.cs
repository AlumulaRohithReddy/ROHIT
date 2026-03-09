using JwtWebApi.Application.DTOs;
using JwtWebApi.Application.Interfaces;
using JwtWebApi.Domain.Entities;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace JwtWebApi.Application.Services
{
    public class PolicyPlanService : IPolicyPlanService
    {
        private readonly IPolicyPlanRepository _repository;

        public PolicyPlanService(IPolicyPlanRepository repository)
        {
            _repository = repository;
        }

        public async Task<IEnumerable<PolicyPlan>> GetAllPlans()
        {
            return await _repository.GetAllAsync();
        }

        public async Task<PolicyPlan?> GetPlan(int id)
        {
            return await _repository.GetByIdAsync(id);
        }

        public async Task<PolicyPlan> CreatePlan(CreatePolicyPlanRequestDto request)
        {
            var plan = new PolicyPlan
            {
                PlanName = request.PlanName,
                Description = request.Description ?? string.Empty,
                PolicyType = request.PolicyType,
                BasePremium = request.BasePremium,
                MaxCoverageAmount = (decimal)request.MaxCoverageAmount,
                PolicyDurationMonths = request.PolicyDurationMonths
            };

            await _repository.AddAsync(plan);

            return plan;
        }

        public async Task UpdatePlan(int id, CreatePolicyPlanRequestDto request)
        {
            var plan = await _repository.GetByIdAsync(id);

            if (plan == null)
                throw new Exception("Plan not found");

            plan.PlanName = request.PlanName;
            plan.Description = request.Description ?? string.Empty;
            plan.PolicyType = request.PolicyType;
            plan.BasePremium = request.BasePremium;
            plan.MaxCoverageAmount = (decimal)request.MaxCoverageAmount;
            plan.PolicyDurationMonths = request.PolicyDurationMonths;

            await _repository.UpdateAsync(plan);
        }

        public async Task DeletePlan(int id)
        {
            var plan = await _repository.GetByIdAsync(id);

            if (plan == null)
                throw new Exception("Plan not found");

            await _repository.DeleteAsync(plan);
        }
    }
}
