using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace JwtWebApi.Application.DTOs
{
    public class PolicyResponse
    {
        public int PolicyId { get; set; }
        public string PolicyNumber { get; set; }

        public decimal PremiumAmount { get; set; }
        public decimal IDV { get; set; }

        public string Status { get; set; }

        public DateTime StartDate { get; set; }
        public DateTime EndDate { get; set; }

        // Vehicle Info
        public string VehicleNumber { get; set; }
        public string VehicleModel { get; set; }

        // Plan Info
        public string PlanName { get; set; }
        public decimal MaxCoverageAmount { get; set; }

        public string CustomerName { get; set; } = string.Empty;

        public int? PaymentId { get; set; }
        public int VehicleRiskScore { get; set; }
    }
}
