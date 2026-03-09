using System.ComponentModel.DataAnnotations;

namespace JwtWebApi.Application.DTOs.Vehicle
{
    public class CreateVehicleDto
    {
        [Required(ErrorMessage = "Registration number is required")]
        [RegularExpression(@"^[a-zA-Z]{2} \d{2} [a-zA-Z]{1,2} \d{4}$", ErrorMessage = "Registration number must follow the format XX 00 XX 0000")]
        public string RegistrationNumber { get; set; } = string.Empty;

        [Required(ErrorMessage = "Make is required")]
        public string Make { get; set; } = string.Empty;

        [Required(ErrorMessage = "Model is required")]
        public string Model { get; set; } = string.Empty;

        [Required(ErrorMessage = "Year is required")]
        [Range(1900, 2026, ErrorMessage = "Year must be between 1900 and 2026")]
        public int Year { get; set; }

        [Required(ErrorMessage = "Fuel type is required")]
        public string FuelType { get; set; } = string.Empty;

        [Required(ErrorMessage = "Vehicle type is required")]
        public string VehicleType { get; set; } = string.Empty;

        [Required(ErrorMessage = "Market value is required")]
        [Range(0, 100000000, ErrorMessage = "Market value must be a positive number")]
        public decimal CurrentMarketValue { get; set; }
    }
}
