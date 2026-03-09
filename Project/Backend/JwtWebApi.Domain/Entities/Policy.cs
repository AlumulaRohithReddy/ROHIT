using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using JwtWebApi.Domain.Enums;

namespace JwtWebApi.Domain.Entities
{
    public class Policy
    {
        public int PolicyId { get; set; }

        public string PolicyNumber { get; set; }

        public int CustomerId { get; set; }
        public int? AgentId { get; set; }

        public int VehicleId { get; set; }
        public int PlanId { get; set; }

        public decimal PremiumAmount { get; set; }

        public decimal IDV { get; set; }

        public string Status { get; set; } = "Active";

        public DateTime StartDate { get; set; }
        public DateTime EndDate { get; set; }

        public DateTime CreatedAt { get; set; } = DateTime.UtcNow;

        // Navigation
        public User Customer { get; set; }
        public User Agent { get; set; }
        public Vehicle Vehicle { get; set; }
        public PolicyPlan Plan { get; set; }
    }
}
