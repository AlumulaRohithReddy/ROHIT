using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace JwtWebApi.Application.DTOs
{
    public class ClaimResponse
    {
        public int ClaimId { get; set; }
        public int PolicyId { get; set; }
        public string ClaimNumber { get; set; } = string.Empty;
        public string Status { get; set; } = string.Empty;
        public int claimsofficerId { get; set; }
        public decimal ClaimedAmount { get; set; }
        public decimal? ApprovedAmount { get; set; }

        public string VehicleNumber { get; set; } = string.Empty;
        public string PlanName { get; set; } = string.Empty;
        public string CustomerName { get; set; } = string.Empty;
        public string Description { get; set; } = string.Empty;
        public int DocumentCount { get; set; }
        public int FraudScore { get; set; }
        public string FraudRiskLevel { get; set; } = string.Empty;
    }
}
