import { ChangeDetectorRef, Component } from '@angular/core';
import { CommonModule } from '@angular/common';

import { AdminService, User, Claim, PolicyPlan, AdminDashboardStats } from '../../../../../app/core/services/admin-service';
import { forkJoin } from 'rxjs';
import { Chart, registerables } from 'chart.js';
Chart.register(...registerables);
import { ViewChild, ElementRef, AfterViewInit } from '@angular/core';

@Component({
    selector: 'app-admin-overview',
    standalone: true,
    imports: [CommonModule],
    templateUrl: './overview.html'
})
export class AdminOverviewComponent implements AfterViewInit {
    stats: any[] = [];
    recentUsers: User[] = [];
    dashboardStats?: AdminDashboardStats;
    revenueChart: any;

    @ViewChild('revenueChart') chartCanvas!: ElementRef;

    constructor(private adminService: AdminService, private changeDetectorRef: ChangeDetectorRef) { }

    ngOnInit() {
        this.loadDashboardData();
    }

    ngAfterViewInit() {
        if (this.dashboardStats) {
            this.createChart();
        }
    }

    loadDashboardData() {
        forkJoin({
            users: this.adminService.getUsers(),
            dashboardStats: this.adminService.getDashboardStats()
        }).subscribe({
            next: ({ users, dashboardStats }) => {
                this.recentUsers = users.filter(v => v.Role != 'Admin').slice(0, 4);

                this.stats = [
                    { label: 'Total Users', value: dashboardStats.TotalUsers.toString(), trend: '+5%', icon: 'group', color: 'orange' },
                    { label: 'Active Policies', value: dashboardStats.TotalActivePolicies.toString(), trend: '+2%', icon: 'description', color: 'orange' },
                    { label: 'Pending Claims', value: dashboardStats.TotalPendingClaims.toString(), trend: '-10%', icon: 'security', color: 'orange' },
                    { label: 'Total Revenue', value: `₹${(dashboardStats.TotalRevenue / 1000).toFixed(1)}k`, trend: '+12%', icon: 'insights', color: 'orange' }
                ];

                this.dashboardStats = dashboardStats;
                setTimeout(() => this.createChart(), 0);
                this.changeDetectorRef.detectChanges();
            },
            error: (err) => {
                console.error('Error loading admin dashboard data:', err);
            }
        });
    }

    createChart() {
        if (!this.chartCanvas || !this.dashboardStats) return;

        const ctx = this.chartCanvas.nativeElement.getContext('2d');
        if (this.revenueChart) {
            this.revenueChart.destroy();
        }

        this.revenueChart = new Chart(ctx, {
            type: 'line',
            data: {
                labels: this.dashboardStats.MonthlyRevenue.map(m => m.Month),
                datasets: [{
                    label: 'Revenue (INR)',
                    data: this.dashboardStats.MonthlyRevenue.map(m => m.Amount),
                    borderColor: '#f39c12',
                    backgroundColor: 'rgba(243, 156, 18, 0.1)',
                    fill: true,
                    tension: 0.4,
                    pointRadius: 4,
                    pointBackgroundColor: '#f39c12'
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                plugins: {
                    legend: { display: false }
                },
                scales: {
                    y: {
                        beginAtZero: true,
                        grid: { display: true, color: 'rgba(0,0,0,0.05)' }
                    },
                    x: {
                        grid: { display: false }
                    }
                }
            }
        });
    }
}
