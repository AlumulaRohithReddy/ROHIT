using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace JwtWebApi.Domain.Entities
{
    public static class ClaimStatus
    {
        public const string Submitted = "Submitted";
        public const string UnderReview = "UnderReview";
        public const string Approved = "Approved";
        public const string Rejected = "Rejected";
        public const string Settled = "Settled";
    }
}
