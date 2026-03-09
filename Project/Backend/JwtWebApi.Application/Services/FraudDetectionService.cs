using JwtWebApi.Application.Interfaces;
using JwtWebApi.Domain.Entities;
using System;
using System.Linq;
using System.Threading.Tasks;

namespace JwtWebApi.Application.Services
{
    public class FraudDetectionService : IFraudDetectionService
    {
        private readonly IClaimRepository _claimRepo;

        public FraudDetectionService(IClaimRepository claimRepo)
        {
            _claimRepo = claimRepo;
        }

        public async Task<(int Score, string Level)> DetectFraudAsync(Claim claim)
        {
            int score = 0;

            // 1. Claim within 7 days of policy purchase (+20)
            if (claim.Policy != null && (claim.IncidentDate - claim.Policy.StartDate).TotalDays <= 7)
            {
                score += 20;
            }

            // 2. More than 2 claims in last 6 months (+30)
            var lastSixMonthsClaims = await _claimRepo.GetByCustomerIdAsync(claim.CustomerId);
            int recentClaimsCount = lastSixMonthsClaims.Count(c => c.CreatedAt >= DateTime.UtcNow.AddMonths(-6));
            if (recentClaimsCount > 2)
            {
                score += 30;
            }

            // 3. Claim amount exceeds 50% of insured value (+25)
            if (claim.Policy != null && claim.ClaimedAmount > (claim.Policy.IDV * 0.5m))
            {
                score += 25;
            }

            // 4. Policy created/upgraded in last 30 days (+15)
            if (claim.Policy != null && (DateTime.UtcNow - claim.Policy.CreatedAt).TotalDays <= 30)
            {
                score += 15;
            }

            string level = score switch
            {
                >= 60 => "High",
                >= 30 => "Medium",
                _ => "Low"
            };

            return (score, level);
        }
    }
}
