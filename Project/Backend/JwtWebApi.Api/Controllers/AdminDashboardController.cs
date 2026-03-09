using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using JwtWebApi.Application.Interfaces;
using JwtWebApi.Application.DTOs;
using System.Linq;
using System.Threading.Tasks;
using System.Globalization;

namespace JwtWebApi.Api.Controllers
{
    [Authorize(Roles = "Admin")]
    [Route("api/[controller]")]
    [ApiController]
    public class AdminDashboardController : ControllerBase
    {
        private readonly IAppDbContext _context;

        public AdminDashboardController(IAppDbContext context)
        {
            _context = context;
        }

        [HttpGet("stats")]
        public async Task<IActionResult> GetDashboardStats()
        {
            var totalUsers = await _context.Users.CountAsync(u => u.Role != "Admin");
            var totalActivePolicies = await _context.Policies.CountAsync(p => p.Status == "Active");
            var totalPendingClaims = await _context.Claims.CountAsync(c => c.Status == "Submitted");
            var totalRevenue = await _context.Payments.Where(p => p.Status == "Success").SumAsync(p => p.Amount);

            var monthlyRevenue = await _context.Payments
                .Where(p => p.Status == "Success")
                .GroupBy(p => new { p.PaymentDate.Year, p.PaymentDate.Month })
                .Select(g => new MonthlyRevenueDto
                {
                    Month = CultureInfo.CurrentCulture.DateTimeFormat.GetAbbreviatedMonthName(g.Key.Month) + " " + g.Key.Year,
                    Amount = g.Sum(p => p.Amount)
                })
                .ToListAsync();

            var policyStatus = await _context.Policies
                .GroupBy(p => p.Status)
                .Select(g => new StatusDistributionDto
                {
                    Status = g.Key,
                    Count = g.Count()
                })
                .ToListAsync();

            var claimStatus = await _context.Claims
                .GroupBy(c => c.Status)
                .Select(g => new StatusDistributionDto
                {
                    Status = g.Key,
                    Count = g.Count()
                })
                .ToListAsync();

            var stats = new AdminDashboardStatsDto
            {
                TotalUsers = totalUsers,
                TotalActivePolicies = totalActivePolicies,
                TotalPendingClaims = totalPendingClaims,
                TotalRevenue = totalRevenue,
                MonthlyRevenue = monthlyRevenue.OrderByDescending(r => r.Month).Take(6).Reverse().ToList(),
                PolicyStatusDistribution = policyStatus,
                ClaimStatusDistribution = claimStatus
            };

            return Ok(new { Success = true, Data = stats });
        }
    }
}
