using System;
using System.Collections.Generic;

namespace JwtWebApi.Application.DTOs
{
    public class AdminDashboardStatsDto
    {
        public int TotalUsers { get; set; }
        public int TotalActivePolicies { get; set; }
        public int TotalPendingClaims { get; set; }
        public decimal TotalRevenue { get; set; }
        public List<MonthlyRevenueDto> MonthlyRevenue { get; set; } = new();
        public List<StatusDistributionDto> PolicyStatusDistribution { get; set; } = new();
        public List<StatusDistributionDto> ClaimStatusDistribution { get; set; } = new();
    }

    public class MonthlyRevenueDto
    {
        public string Month { get; set; } = string.Empty;
        public decimal Amount { get; set; }
    }

    public class StatusDistributionDto
    {
        public string Status { get; set; } = string.Empty;
        public int Count { get; set; }
    }
}
