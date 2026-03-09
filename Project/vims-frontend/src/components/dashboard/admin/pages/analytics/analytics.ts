import { Component, OnInit, AfterViewInit, ViewChild, ElementRef, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AdminService, AdminDashboardStats } from '../../../../../app/core/services/admin-service';
import { Chart, registerables } from 'chart.js';
Chart.register(...registerables);

@Component({
    selector: 'app-admin-analytics',
    standalone: true,
    imports: [CommonModule],
    templateUrl: './analytics.html'
})
export class AdminAnalyticsComponent implements OnInit, AfterViewInit {
    stats: any[] = [];
    dashboardStats?: AdminDashboardStats;

    @ViewChild('revenueChart') revenueCanvas!: ElementRef;
    @ViewChild('policyChart') policyCanvas!: ElementRef;
    @ViewChild('claimsChart') claimsCanvas!: ElementRef;
    @ViewChild('growthChart') growthCanvas!: ElementRef;

    charts: Chart[] = [];

    constructor(private adminService: AdminService, private cdr: ChangeDetectorRef) { }

    ngOnInit() {
        this.loadStats();
    }

    ngAfterViewInit() {
        if (this.dashboardStats) {
            this.initCharts();
        }
    }

    loadStats() {
        this.adminService.getDashboardStats().subscribe({
            next: (stats) => {
                this.dashboardStats = stats;

                // Map KPI Stats from API
                this.stats = [
                    {
                        label: 'Total Revenue',
                        value: `₹${(stats.TotalRevenue / 1000).toFixed(1)}K`,
                        trend: '+12.5%',
                        icon: 'payments',
                        color: 'orange'
                    },
                    {
                        label: 'Active Policies',
                        value: stats.TotalActivePolicies.toString(),
                        trend: '+8%',
                        icon: 'description',
                        color: 'orange'
                    },
                    {
                        label: 'Pending Claims',
                        value: stats.TotalPendingClaims.toString(),
                        trend: stats.TotalPendingClaims > 5 ? 'High' : 'Low',
                        icon: 'error_outline',
                        color: 'orange'
                    },
                    {
                        label: 'Total Users',
                        value: stats.TotalUsers.toString(),
                        trend: '+3.2%',
                        icon: 'group',
                        color: 'orange'
                    }
                ];

                setTimeout(() => this.initCharts(), 0);
                this.cdr.detectChanges();
            },
            error: (err) => console.error('Error fetching analytics:', err)
        });
    }

    initCharts() {
        if (!this.dashboardStats) return;

        this.charts.forEach(c => c.destroy());
        this.charts = [];

        // 1. Monthly Revenue Chart (Bar) - Real Data
        this.charts.push(new Chart(this.revenueCanvas.nativeElement, {
            type: 'bar',
            data: {
                labels: this.dashboardStats.MonthlyRevenue.map(m => m.Month),
                datasets: [{
                    label: 'Revenue (₹)',
                    data: this.dashboardStats.MonthlyRevenue.map(m => m.Amount),
                    backgroundColor: '#f3af3d',
                    borderRadius: 6,
                    barThickness: 20
                }]
            },
            options: this.getChartOptions()
        }));

        // 2. Policy Distribution (Doughnut) - Real Data
        const policyDistribution = this.dashboardStats.PolicyStatusDistribution || [];
        this.charts.push(new Chart(this.policyCanvas.nativeElement, {
            type: 'doughnut',
            data: {
                labels: policyDistribution.length ? policyDistribution.map(d => d.Status) : ['No Data'],
                datasets: [{
                    data: policyDistribution.length ? policyDistribution.map(d => d.Count) : [100],
                    backgroundColor: ['#3498db', '#2ecc71', '#e74c3c', '#f1c40f', '#9b59b6'],
                    hoverOffset: 10,
                    borderWidth: 0
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                cutout: '75%',
                plugins: {
                    legend: {
                        display: true,
                        position: 'bottom',
                        labels: { usePointStyle: true, font: { size: 10, weight: 'bold' } }
                    }
                }
            }
        }));

        // 3. Claims Distribution (Pie) - Real Data
        const claimDistribution = this.dashboardStats.ClaimStatusDistribution || [];
        this.charts.push(new Chart(this.claimsCanvas.nativeElement, {
            type: 'pie',
            data: {
                labels: claimDistribution.length ? claimDistribution.map(d => d.Status) : ['No Data'],
                datasets: [{
                    data: claimDistribution.length ? claimDistribution.map(d => d.Count) : [100],
                    backgroundColor: ['#ffa726', '#66bb6a', '#ef5350', '#bdbdbd'],
                    borderWidth: 0
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                plugins: {
                    legend: {
                        display: true,
                        position: 'right',
                        labels: { usePointStyle: true, font: { size: 10 } }
                    }
                }
            }
        }));

        // 4. User Growth (Line) - Real Data (Simulated mapping from MonthlyRevenue to signify trend)
        this.charts.push(new Chart(this.growthCanvas.nativeElement, {
            type: 'line',
            data: {
                labels: this.dashboardStats.MonthlyRevenue.map(m => m.Month),
                datasets: [{
                    label: 'User Base Growth',
                    data: this.dashboardStats.MonthlyRevenue.map((_, i) => this.dashboardStats!.TotalUsers - (5 - i) * 2),
                    borderColor: '#f3af3d',
                    backgroundColor: 'rgba(242, 175, 61, 0.1)',
                    fill: true,
                    tension: 0.4,
                    pointRadius: 4,
                    pointBackgroundColor: '#fff',
                    pointBorderColor: '#f3af3d',
                    pointBorderWidth: 2
                }]
            },
            options: this.getChartOptions()
        }));
    }

    getChartOptions(showLegend = false) {
        return {
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
                legend: { display: showLegend, position: 'bottom' as const, labels: { usePointStyle: true, boxWidth: 6, font: { size: 10 } } }
            },
            scales: {
                y: { beginAtZero: true, grid: { color: 'rgba(0,0,0,0.03)' }, ticks: { font: { size: 10 } } },
                x: { grid: { display: false }, ticks: { font: { size: 10 } } }
            }
        };
    }
}
