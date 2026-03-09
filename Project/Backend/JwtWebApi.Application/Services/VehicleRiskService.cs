using JwtWebApi.Application.Interfaces;
using JwtWebApi.Domain.Entities;
using System;
using System.Linq;
using System.Threading.Tasks;

namespace JwtWebApi.Application.Services
{
    public class VehicleRiskService : IVehicleRiskService
    {
        private readonly IPolicyRepository _policyRepo;
        private readonly IClaimRepository _claimRepo;

        public VehicleRiskService(IPolicyRepository policyRepo, IClaimRepository claimRepo)
        {
            _policyRepo = policyRepo;
            _claimRepo = claimRepo;
        }

        public async Task<int> CalculateVehicleRiskScoreAsync(Vehicle vehicle)
        {
            int score = 1; // Base score

            // 1. Vehicle Age Factor
            int age = DateTime.UtcNow.Year - vehicle.Year;
            if (age > 15) score += 3;
            else if (age > 8) score += 2;
            else if (age > 3) score += 1;

            // 2. Vehicle Type Factor
            if (vehicle.VehicleType.Equals("Supercar", StringComparison.OrdinalIgnoreCase) || 
                vehicle.VehicleType.Equals("Luxury", StringComparison.OrdinalIgnoreCase))
            {
                score += 3;
            }
            else if (vehicle.VehicleType.Equals("SUV", StringComparison.OrdinalIgnoreCase))
            {
                score += 1;
            }

            // 3. Claim History Factor
            var claims = await _claimRepo.GetByCustomerIdAsync(vehicle.CustomerId);
            // In a real scenario, we'd filter by vehicle registration, but assuming customer-wide history for now
            if (claims.Any(c => c.Status == "Approved"))
            {
                score += 2;
                if (claims.Count(c => c.Status == "Approved") > 1) score += 2;
            }

            return Math.Min(score, 10); // Cap at 10
        }
    }
}
