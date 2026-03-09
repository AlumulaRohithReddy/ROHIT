using JwtWebApi.Domain.Entities;
using System.Collections.Generic;
using System.Threading.Tasks;

namespace JwtWebApi.Application.Interfaces
{
    public interface IPremiumCalculationService
    {
        Task<PremiumBreakdown> CalculatePremiumAsync(Vehicle vehicle, PolicyPlan plan);
    }

    public class PremiumBreakdown
    {
        public decimal BasePremium { get; set; }
        public decimal RiskAdjustment { get; set; }
        public decimal AgeAdjustment { get; set; }
        public decimal NoClaimBonusDiscount { get; set; }
        public decimal TotalPremium { get; set; }
        public List<string> FactorsApplied { get; set; } = new List<string>();
    }
}
