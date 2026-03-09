using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using JwtWebApi.Domain.Enums;

namespace JwtWebApi.Domain.Entities
{
    public class Claim
    {
        public int ClaimId { get; set; }
        public string ClaimNumber { get; set; } = Guid.NewGuid().ToString();

        public int PolicyId { get; set; }
        public int CustomerId { get; set; }
        public int? ClaimsOfficerId { get; set; }

        public string Status { get; set; } = ClaimStatus.Submitted;

        public DateTime IncidentDate { get; set; }
        public string IncidentLocation { get; set; } = string.Empty;
        public string Description { get; set; } = string.Empty;

        public decimal ClaimedAmount { get; set; }
        public decimal? ApprovedAmount { get; set; }

        public int FraudScore { get; set; }
        public string FraudRiskLevel { get; set; } = "Low";

        public DateTime CreatedAt { get; set; } = DateTime.UtcNow;

        public Policy Policy { get; set; } = null!;
        public User Customer { get; set; } = null!;
        public ICollection<ClaimDocument> ClaimDocuments { get; set; } = new List<ClaimDocument>();
    }
}
