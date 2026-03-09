import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { CommonModule, DecimalPipe } from '@angular/common';
import { AgentService, Policy } from '../../../../../app/core/services/agent-service';

@Component({
    selector: 'app-agent-overview',
    standalone: true,
    imports: [CommonModule, DecimalPipe],
    templateUrl: './overview.html'
})
export class AgentOverviewComponent implements OnInit {
    policies: Policy[] = [];
    stats: any[] = [];

    constructor(
        private agentService: AgentService,
        private cdr: ChangeDetectorRef
    ) { }

    ngOnInit() {
        this.loadData();
    }

    loadData() {
        this.agentService.getAssignedPolicies().subscribe({
            next: (data) => {
                this.policies = data;
                this.updateStats();
                this.cdr.detectChanges();
            },
            error: (err) => console.error('Error loading policies', err)
        });
    }

    updateStats() {
        const pending = this.policies.filter(p => p.Status === 'PendingApproval').length;
        const active = this.policies.filter(p => p.Status === 'Approved').length;

        this.stats = [
            { label: 'Assigned Policies', value: this.policies.length.toString(), icon: 'description', color: 'orange' },
            { label: 'Pending Approval', value: pending.toString(), icon: 'pending_actions', color: 'orange' },
            { label: 'Active Policies', value: active.toString(), icon: 'check_circle', color: 'orange' }
        ];
    }

    approvePolicy(id: number) {
        if (confirm('Are you sure you want to approve this policy?')) {
            this.agentService.approvePolicy(id).subscribe(() => {
                alert('Policy approved!');
                this.loadData();
            });
        }
    }

    rejectPolicy(id: number) {
        if (confirm('Are you sure you want to reject this policy?')) {
            this.agentService.rejectPolicy(id).subscribe(() => {
                alert('Policy rejected!');
                this.loadData();
            });
        }
    }
}
