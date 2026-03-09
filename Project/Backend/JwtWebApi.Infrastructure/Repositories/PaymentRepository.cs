using JwtWebApi.Application.Interfaces;
using JwtWebApi.Domain.Entities;
using JwtWebApi.Infrastructure.Data;
using Microsoft.EntityFrameworkCore;

namespace JwtWebApi.Infrastructure.Repositories
{
    public class PaymentRepository : IPaymentRepository
    {
        private readonly AppDbContext _context;

        public PaymentRepository(AppDbContext context)
        {
            _context = context;
        }

        public async Task AddAsync(Payment payment)
        {
            await _context.Payments.AddAsync(payment);
        }

        public async Task<Payment?> GetByIdAsync(int id)
        {
            return await _context.Payments
        .Include(p => p.Policy)
            .ThenInclude(pol => pol.Vehicle)
        .Include(p => p.Policy)
            .ThenInclude(pol => pol.Plan)
        .FirstOrDefaultAsync(p => p.PaymentId == id);
        }

        public async Task<List<Payment>> GetByUserIdAsync(int userId)
        {
            return await _context.Payments
                .Include(p => p.Policy)
                .Where(p => p.Policy.CustomerId == userId)
                .ToListAsync();
        }

        public async Task<Payment?> GetByPolicyIdAsync(int policyId)
        {
            return await _context.Payments
                .FirstOrDefaultAsync(p => p.PolicyId == policyId && p.Status == "Success");
        }

        public async Task SaveChangesAsync()
        {
            await _context.SaveChangesAsync();
        }
    }
}