using JwtWebApi.Application.Interfaces;
using JwtWebApi.Domain.Entities;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using JwtWebApi.Infrastructure.Data;
using Microsoft.EntityFrameworkCore;
namespace JwtWebApi.Infrastructure.Repositories
{
    public class PolicyPlanRepository : IPolicyPlanRepository
    {
        private readonly AppDbContext _context;

        public PolicyPlanRepository(AppDbContext context)
        {
            _context = context;
        }

        public async Task<IEnumerable<PolicyPlan>> GetAllAsync()
        {
            return await _context.PolicyPlans.ToListAsync();
        }

        public async Task<PolicyPlan?> GetByIdAsync(int id)
        {
            return await _context.PolicyPlans.FindAsync(id);
        }

        public async Task AddAsync(PolicyPlan plan)
        {
            _context.PolicyPlans.Add(plan);
            await _context.SaveChangesAsync();
        }

        public async Task UpdateAsync(PolicyPlan plan)
        {
            _context.PolicyPlans.Update(plan);
            await _context.SaveChangesAsync();
        }

        public async Task DeleteAsync(PolicyPlan plan)
        {
            _context.PolicyPlans.Remove(plan);
            await _context.SaveChangesAsync();
        }
    }
}
