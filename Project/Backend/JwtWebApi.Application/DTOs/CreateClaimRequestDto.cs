using System.ComponentModel.DataAnnotations;

namespace JwtWebApi.Application.DTOs
{
    public class CreateClaimRequestDto
    {
        [Required(ErrorMessage = "Policy ID is required")]
        [Range(1, int.MaxValue, ErrorMessage = "Invalid Policy ID")]
        public int PolicyId { get; set; }

        [Required(ErrorMessage = "Incident date is required")]
        public DateTime IncidentDate { get; set; }

        [Required(ErrorMessage = "Incident location is required")]
        public string IncidentLocation { get; set; } = string.Empty;

        [Required(ErrorMessage = "Description is required")]
        public string Description { get; set; } = string.Empty;

        [Required(ErrorMessage = "Claimed amount is required")]
        [Range(0.01, 100000000, ErrorMessage = "Claimed amount must be greater than 0")]
        public decimal ClaimedAmount { get; set; }
    }
}
