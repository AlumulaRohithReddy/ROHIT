using System.ComponentModel.DataAnnotations;

namespace JwtWebApi.Application.DTOs
{
    public class CreatePolicyPlanRequestDto
    {
        [Required(ErrorMessage = "Plan Name is required")]
        [StringLength(100, ErrorMessage = "Plan Name cannot exceed 100 characters")]
        public required string PlanName { get; set; }

        [StringLength(500, ErrorMessage = "Description cannot exceed 500 characters")]
        public string? Description { get; set; }

        [Required(ErrorMessage = "Policy Type is required")]
        public required string PolicyType { get; set; }

        [Required(ErrorMessage = "Base Premium is required")]
        [Range(0.01, 100, ErrorMessage = "Base Premium must be a percentage between 0.01 and 100")]
        public decimal BasePremium { get; set; }   // percentage

        [Range(0, 100000000, ErrorMessage = "Max Coverage Amount must be a positive number")]
        public decimal? MaxCoverageAmount { get; set; }

        [Required(ErrorMessage = "Policy Duration is required")]
        [Range(1, 120, ErrorMessage = "Duration must be between 1 and 120 months")]
        public int PolicyDurationMonths { get; set; }
    }
}
