namespace JwtWebApi.Application.DTOs
{
    public class EmployeeCreateDto
    {
        public string Name { get; set; } = string.Empty;
        public string? Position { get; set; }
        public decimal Salary { get; set; }
    }

    public class EmployeeUpdateDto
    {
        public string Name { get; set; } = string.Empty;
        public string? Position { get; set; }
        public decimal Salary { get; set; }
    }
}
