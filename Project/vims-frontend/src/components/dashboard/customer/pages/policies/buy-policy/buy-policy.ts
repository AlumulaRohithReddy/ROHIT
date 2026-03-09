import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { CustomerService, PolicyPlan, Vehicle, PremiumBreakdown } from '../../../../../../app/core/services/customer-service';
import { PremiumVisualizerComponent } from './premium-visualizer';

@Component({
    selector: 'app-buy-policy',
    standalone: true,
    imports: [CommonModule, FormsModule, PremiumVisualizerComponent],
    templateUrl: './buy-policy.html'
})
export class BuyPolicyComponent implements OnInit {
    plans: PolicyPlan[] = [];
    vehicles: Vehicle[] = [];
    selectedPlan: PolicyPlan | null = null;
    selectedVehicleId: number | null = null;
    premiumBreakdown: PremiumBreakdown | null = null;
    isCalculating: boolean = false;
    step: number = 1;

    constructor(
        private customerService: CustomerService,
        private cdr: ChangeDetectorRef,
        public router: Router
    ) { }

    ngOnInit() {
        this.customerService.getPolicyPlans().subscribe(plans => {
            this.plans = plans;
            this.cdr.detectChanges();
        });
        this.customerService.getVehicles().subscribe(vehicles => {
            this.vehicles = vehicles;
            this.cdr.detectChanges();
        });
    }

    selectPlan(plan: PolicyPlan) {
        this.selectedPlan = plan;
        this.step = 2;
        this.selectedVehicleId = null;
        this.premiumBreakdown = null;
        this.cdr.detectChanges();
    }

    onVehicleSelect(vehicleId: number) {
        this.selectedVehicleId = vehicleId;
        this.fetchBreakdown();
    }

    fetchBreakdown() {
        if (!this.selectedPlan || !this.selectedVehicleId || !this.selectedPlan.PlanId) return;

        this.isCalculating = true;
        this.premiumBreakdown = null;
        this.cdr.detectChanges();

        this.customerService.calculatePremium(this.selectedVehicleId, this.selectedPlan.PlanId).subscribe({
            next: (data) => {
                this.premiumBreakdown = data;
                this.isCalculating = false;
                this.cdr.detectChanges();
            },
            error: () => {
                this.isCalculating = false;
                this.cdr.detectChanges();
            }
        });
    }

    onBuy() {
        if (!this.selectedPlan || !this.selectedVehicleId) return;

        const request = {
            PlanId: this.selectedPlan.PlanId,
            VehicleId: this.selectedVehicleId
        };

        this.customerService.buyPolicy(request).subscribe({
            next: () => {
                alert('Policy purchase request submitted! It is now pending approval from an agent.');
                this.router.navigate(['/customer/policies']);
            },
            error: (err) => alert('Error: ' + err.message)
        });
    }
}
