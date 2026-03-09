using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace JwtWebApi.Application.DTOs.Vehicle
{
    public class UpdateVehicleDto
    {
        public string Make { get; set; } = string.Empty;
        public string Model { get; set; } = string.Empty;
        public int Year { get; set; }
        public string FuelType { get; set; } = string.Empty;
        public string VehicleType { get; set; } = string.Empty;
        public decimal CurrentMarketValue { get; set; }
    }
}
