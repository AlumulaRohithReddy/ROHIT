using JwtWebApi.Domain.Entities;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace JwtWebApi.Application.Interfaces
{
    public interface IClaimDocumentRepository
    {
        Task AddAsync(ClaimDocument document);

        Task<ClaimDocument?> GetByIdAsync(int id);  

        Task<List<ClaimDocument>> GetByClaimIdAsync(int claimId);

        Task DeleteAsync(ClaimDocument document);

        Task SaveChangesAsync();
    }
}
