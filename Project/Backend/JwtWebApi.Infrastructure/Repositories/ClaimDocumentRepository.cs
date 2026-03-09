using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using JwtWebApi.Application.Interfaces;
using JwtWebApi.Domain.Entities;
using JwtWebApi.Infrastructure.Data;
using Microsoft.AspNetCore.Http.HttpResults;
using Microsoft.EntityFrameworkCore;

namespace JwtWebApi.Infrastructure.Repositories
{
    public class ClaimDocumentRepository : IClaimDocumentRepository
    {
        private readonly AppDbContext _context;

        public ClaimDocumentRepository(AppDbContext context)
        {
            _context = context;
        }

        public async Task AddAsync(ClaimDocument document)
        {
            await _context.ClaimDocuments.AddAsync(document);
            await SaveChangesAsync();
        }

        public async Task<ClaimDocument?> GetByIdAsync(int id)
        {
            return await _context.ClaimDocuments
                .FirstOrDefaultAsync(d => d.DocumentId == id);
        }

        public async Task<List<ClaimDocument>> GetByClaimIdAsync(int claimId)
        {
            return await _context.ClaimDocuments
                .Where(d => d.ClaimId == claimId)
                .ToListAsync();
        }

        public async Task DeleteAsync(ClaimDocument document)
        {
            _context.ClaimDocuments.Remove(document);
            await SaveChangesAsync();
        }

        public async Task SaveChangesAsync()
        {
            await _context.SaveChangesAsync();
        }
    }
}