using System.ComponentModel.DataAnnotations;

namespace JwtWebApi.Application.DTOs
{
    public class RegisterDto
    {
        [Required(ErrorMessage = "Full Name is required")]
        [StringLength(100, ErrorMessage = "Full Name cannot exceed 100 characters")]
        public string FullName { get; set; } = string.Empty;

        [Required(ErrorMessage = "Email is required")]
        [EmailAddress(ErrorMessage = "Invalid email format")]
        public string Email { get; set; } = string.Empty;

        [Required(ErrorMessage = "Password is required")]
        public string Password { get; set; } = string.Empty;

        public string Role { get; set; } = "Customer";

        public string? SecurityQuestion { get; set; }

        public string? SecurityAnswer { get; set; }
    }
}
