using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using JwtWebApi.Application.Interfaces;
using JwtWebApi.Infrastructure.Data;
using Microsoft.EntityFrameworkCore;
using JwtWebApi.Domain.Entities;
using JwtWebApi.Application.Exceptions;
namespace JwtWebApi.Infrastructure.Repositories
{
    

    public class ClaimRepository : IClaimRepository
    {
        private readonly AppDbContext _context;

        public ClaimRepository(AppDbContext context)
        {
            _context = context;
        }

        public async Task AddAsync(Claim claim)
        {
            await _context.Claims.AddAsync(claim);
        }

        public async Task<List<Claim>> GetAllAsync()
        {
            return await _context.Claims
                .Include(c => c.Customer)
                .Include(c => c.Policy)
                .ThenInclude(p => p.Vehicle)
                .Include(c => c.Policy)
                .ThenInclude(p => p.Plan)
                .ToListAsync();
        }

        public async Task<Claim?> GetByIdAsync(int id)
        {
            return await _context.Claims
                .Include(c => c.Customer)
                .Include(c => c.Policy)
                .ThenInclude(p => p.Vehicle)
                .Include(c => c.Policy)
                .ThenInclude(p => p.Plan)
                .FirstOrDefaultAsync(c => c.ClaimId == id);
        }

        public async Task<List<Claim>> GetByCustomerIdAsync(int customerId)
        {
            return await _context.Claims
                .Include(c => c.Customer)
                .Include(c => c.Policy)
                    .ThenInclude(p => p.Vehicle)
                .Include(c => c.Policy)
                    .ThenInclude(p => p.Plan)
                .Where(c => c.CustomerId == customerId)
                .ToListAsync();
        }

        public async Task<List<Claim>> GetByOfficerIdAsync(int officerId)
        {
            return await _context.Claims
                .Include(c => c.Customer)
                .Include(c => c.Policy)
                    .ThenInclude(p => p.Vehicle)
                .Include(c => c.Policy)
                    .ThenInclude(p => p.Plan)
                .Include(c => c.ClaimDocuments)
                .Where(c => c.ClaimsOfficerId == officerId)
                .ToListAsync();
        }

        public async Task SaveChangesAsync()
        {
            await _context.SaveChangesAsync();
        }
    }
}
