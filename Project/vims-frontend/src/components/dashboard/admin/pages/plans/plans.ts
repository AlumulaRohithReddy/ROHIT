import { ChangeDetectorRef, Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { AdminService, PolicyPlan } from '../../../../../app/core/services/admin-service';
import { NotificationService } from '../../../../../app/core/services/notification-service';

@Component({
    selector: 'app-policy-plans',
    standalone: true,
    imports: [CommonModule, FormsModule],
    templateUrl: './plans.html'
})
export class PolicyPlansComponent implements OnInit {
    newPlan: PolicyPlan = { PlanName: '', Description: '', PolicyType: 'Vehicle', BasePremium: 1500, PolicyDurationMonths: 12, MaxCoverageAmount: 50000 };
    allPlans: PolicyPlan[] = [];
    filteredPlans: PolicyPlan[] = [];
    isEditing = false;
    showAddPlanModal = false;

    // Filters
    searchTerm: string = '';

    private notificationService = inject(NotificationService);

    constructor(private adminService: AdminService, private changeDetectorRef: ChangeDetectorRef) { }

    ngOnInit() {
        this.loadPlans();
    }

    loadPlans() {
        this.adminService.getPolicyPlans().subscribe(plans => {
            this.allPlans = plans;
            this.applyFilters();
            this.changeDetectorRef.detectChanges();
        });
    }

    applyFilters() {
        this.filteredPlans = this.allPlans.filter(plan => {
            return !this.searchTerm ||
                plan.PlanName.toLowerCase().includes(this.searchTerm.toLowerCase()) ||
                plan.PolicyType.toLowerCase().includes(this.searchTerm.toLowerCase());
        });
    }

    onAddPlan() {
        this.isEditing = false;
        this.newPlan = { PlanName: '', Description: '', PolicyType: 'Vehicle', BasePremium: 1500, PolicyDurationMonths: 12, MaxCoverageAmount: 50000 };
        this.showAddPlanModal = true;
    }

    onCreatePlan() {
        const obs = (this.isEditing && this.newPlan.PlanId)
            ? this.adminService.updatePolicyPlan(this.newPlan.PlanId, this.newPlan)
            : this.adminService.createPolicyPlan(this.newPlan);

        obs.subscribe({
            next: () => {
                this.notificationService.showSuccess(`Plan ${this.isEditing ? 'updated' : 'created'} successfully!`);
                this.loadPlans();
                this.showAddPlanModal = false;
                this.onCancelEdit();
            },
            error: (err) => {
                // Handled by global error interceptor
            }
        });
    }

    onEditPlan(plan: PolicyPlan) {
        this.isEditing = true;
        this.newPlan = { ...plan };
        this.showAddPlanModal = true;
    }

    onEdit(plan: PolicyPlan) {
        this.onEditPlan(plan);
    }

    onCancelEdit() {
        this.isEditing = false;
        this.showAddPlanModal = false;
        this.newPlan = { PlanName: '', Description: '', PolicyType: 'Vehicle', BasePremium: 1500, PolicyDurationMonths: 12, MaxCoverageAmount: 50000 };
    }

    onDeletePlan(PlanId: number | undefined) {
        if (PlanId && confirm('Are you sure you want to delete this plan?')) {
            this.adminService.deletePolicyPlan(PlanId).subscribe({
                next: () => {
                    this.notificationService.showSuccess('Plan deleted successfully');
                    this.loadPlans();
                },
                error: (err) => {
                    // Handled by global error interceptor
                }
            });
        }
    }
}
