import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CustomerService, Vehicle, Policy, Claim, Payment } from '../../../../../app/core/services/customer-service';
import { forkJoin } from 'rxjs';

@Component({
    selector: 'app-customer-overview',
    standalone: true,
    imports: [CommonModule],
    templateUrl: './overview.html'
})
export class CustomerOverviewComponent implements OnInit {
    stats: any[] = [];
    recentVehicles: Vehicle[] = [];
    recentClaims: Claim[] = [];
    recentPayments: Payment[] = [];

    constructor(
        private customerService: CustomerService,
        private cdr: ChangeDetectorRef
    ) { }

    ngOnInit() {
        this.loadDashboardData();
    }

    loadDashboardData() {
        forkJoin({
            vehicles: this.customerService.getVehicles(),
            policies: this.customerService.getPolicies(),
            claims: this.customerService.getClaims(),
            payments: this.customerService.getPayments()
        }).subscribe(({ vehicles, policies, claims, payments }) => {
            this.recentVehicles = vehicles.slice(0, 3);
            this.recentClaims = claims.slice(0, 3);
            this.recentPayments = payments.slice(0, 3);

            const totalPaid = payments
                .filter(p => p.Status === 'Success' || p.Status === 'Paid')
                .reduce((sum, p) => sum + p.Amount, 0);

            const activePoliciesCount = policies.filter(p => p.Status === 'Active' || p.Status === 'Approved').length;

            this.stats = [
                { label: 'My Vehicles', value: vehicles.length.toString(), icon: 'directions_car', color: 'orange' },
                { label: 'Active Policies', value: activePoliciesCount.toString(), icon: 'description', color: 'orange' },
                { label: 'Open Claims', value: claims.filter(c => c.Status !== 'Approved' && c.Status !== 'Rejected' && c.Status !== 'Paid').length.toString(), icon: 'security', color: 'orange' },
                { label: 'Total Paid', value: `₹${totalPaid.toLocaleString()}`, icon: 'payments', color: 'orange' }
            ];
            this.cdr.detectChanges();
        });
    }
}
