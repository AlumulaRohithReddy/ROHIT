using JwtWebApi.Domain.Entities;

using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace JwtWebApi.Application.Interfaces
{
    public interface IPaymentRepository
    {
        Task AddAsync(Payment payment);

        Task<Payment?> GetByIdAsync(int id);

        Task<List<Payment>> GetByUserIdAsync(int userId);
        Task<Payment?> GetByPolicyIdAsync(int policyId);

        Task SaveChangesAsync();
    }
}