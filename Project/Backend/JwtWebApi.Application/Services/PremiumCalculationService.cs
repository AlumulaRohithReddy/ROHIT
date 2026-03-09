using JwtWebApi.Application.Interfaces;
using JwtWebApi.Domain.Entities;
using System;
using System.Collections.Generic;
using System.Threading.Tasks;

namespace JwtWebApi.Application.Services
{
    public class PremiumCalculationService : IPremiumCalculationService
    {
        public Task<PremiumBreakdown> CalculatePremiumAsync(Vehicle vehicle, PolicyPlan plan)
        {
            var breakdown = new PremiumBreakdown();
            
            // Base Premium: 2% of IDV (simplification)
            decimal idv = vehicle.CurrentMarketValue * 0.8m;
            breakdown.BasePremium = idv * 0.02m;
            breakdown.FactorsApplied.Add("Base Premium (2% of IDV)");

            // Risk Adjustment based on VehicleRiskScore
            decimal riskFactor = 1.0m + (vehicle.VehicleRiskScore * 0.05m); // 5% increase per risk point
            breakdown.RiskAdjustment = breakdown.BasePremium * (riskFactor - 1.0m);
            breakdown.FactorsApplied.Add($"Vehicle Risk Adjustment ({vehicle.VehicleRiskScore} rating)");

            // Age Adjustment
            int vehicleAge = DateTime.UtcNow.Year - vehicle.Year;
            if (vehicleAge > 10)
            {
                breakdown.AgeAdjustment = breakdown.BasePremium * 0.2m; // 20% surcharge for old vehicles
                breakdown.FactorsApplied.Add("Old Vehicle Surcharge (>10 years)");
            }
            else if (vehicleAge < 2)
            {
                breakdown.AgeAdjustment = -(breakdown.BasePremium * 0.1m); // 10% discount for new vehicles
                breakdown.FactorsApplied.Add("New Vehicle Discount (<2 years)");
            }

            
            if (vehicle.VehicleRiskScore < 7)
            {
                breakdown.NoClaimBonusDiscount = breakdown.BasePremium * 0.1m;
                breakdown.FactorsApplied.Add("No Claim Bonus (Standard)");
            }

            breakdown.TotalPremium = breakdown.BasePremium + breakdown.RiskAdjustment + breakdown.AgeAdjustment - breakdown.NoClaimBonusDiscount;
            
            // Ensure minimum premium
            if (breakdown.TotalPremium < 500) breakdown.TotalPremium = 500;

            return Task.FromResult(breakdown);
        }
    }
}
