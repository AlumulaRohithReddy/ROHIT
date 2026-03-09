using System.ComponentModel.DataAnnotations;

namespace JwtWebApi.Domain.Entities
{
    public class Employee
    {
        public int Id { get; set; }

        [Required]
        public string Name { get; set; } = null!;
        public string? Position { get; set; }
        public decimal Salary { get; set; }
    }
}
