using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace JwtWebApi.Application.DTOs
{
    public class CreatePolicyRequestDto
    {
        public int VehicleId { get; set; }
        public int PlanId { get; set; }
    }
}
