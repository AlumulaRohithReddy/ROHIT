using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace JwtWebApi.Domain.Entities
{
    using System.Text.Json.Serialization;

    public class Vehicle
    {
        public int VehicleId { get; set; }
        public int CustomerId { get; set; }
        public int? UserId { get; set; }

        public string RegistrationNumber { get; set; } = string.Empty;
        public string Make { get; set; } = string.Empty;
        public string Model { get; set; } = string.Empty;
        public int Year { get; set; }
        public string FuelType { get; set; } = string.Empty;
        public string VehicleType { get; set; } = string.Empty;

        public decimal CurrentMarketValue { get; set; }
        public int VehicleRiskScore { get; set; }

       
        [JsonIgnore]
        public ICollection<Policy> Policies { get; set; }
    }
}
