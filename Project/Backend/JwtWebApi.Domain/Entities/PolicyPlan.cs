using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace JwtWebApi.Domain.Entities
{
    public class PolicyPlan
    {
        public int PlanId { get; set; }
        public string PlanName { get; set; }
        public string Description { get; set; } = string.Empty;
        public string PolicyType { get; set; }

        public decimal BasePremium { get; set; }
        public decimal MaxCoverageAmount { get; set; }

        public int PolicyDurationMonths { get; set; }

        public ICollection<Policy> Policies { get; set; }
    }

}
