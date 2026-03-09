using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace JwtWebApi.Application.DTOs
{
    public class ReviewClaimRequest
    {
        public bool IsApproved { get; set; }
        public decimal ApprovedAmount { get; set; }
    }
}
