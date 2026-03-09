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
    public class PolicyRepository : IPolicyRepository
    {
        private readonly AppDbContext _context;

        public PolicyRepository(AppDbContext context)
        {
            _context = context;
        }

        public async Task AddAsync(Policy policy)
        {
            _context.Policies.Add(policy);
            await _context.SaveChangesAsync();
        }

        public async Task<List<Policy>> GetByCustomerIdAsync(int customerId)
        {
            return await _context.Policies
                .Include(p => p.Vehicle)
                .Include(p => p.Plan)
                .Include(p => p.Customer)
                .Where(p => p.CustomerId == customerId)
                .ToListAsync();
        }

        public async Task<List<Policy>> GetByAgentIdAsync(int agentId)
        {
            return await _context.Policies
                .Include(p => p.Vehicle)
                .Include(p => p.Plan)
                .Include(p => p.Customer)
                .Where(p => p.AgentId == agentId)
                .ToListAsync();
        }
        
        public async Task<Policy?> GetByIdAsync(int id)
        {
            return await _context.Policies
                .Include(p => p.Vehicle)
                .Include(p => p.Plan)
                .FirstOrDefaultAsync(p => p.PolicyId == id);
        }

        public async Task<List<Policy>> GetByVehicleIdAsync(int vehicleId)
        {
            return await _context.Policies
                .Where(p => p.VehicleId == vehicleId)
                .ToListAsync();
        }

        public void Update(Policy policy)
        {
            _context.Policies.Update(policy);
        }

        public async Task SaveChangesAsync()
        {
            await _context.SaveChangesAsync();
        }
    }
}
