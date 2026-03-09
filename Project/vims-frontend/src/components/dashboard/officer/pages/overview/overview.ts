import {ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { OfficerService, Claim } from '../../../../../app/core/services/officer-service';

@Component({
    selector: 'app-officer-overview',
    standalone: true,
    imports: [CommonModule],
    templateUrl: './overview.html'
})
export class OfficerOverviewComponent implements OnInit {
    stats = [
        { label: 'Assigned Claims', value: '0', icon: 'security', color: 'orange' },
        { label: 'Pending Review', value: '0', icon: 'description', color: 'orange' },
        { label: 'Approved', value: '0', icon: 'check_circle', color: 'orange' }
    ];

    recentClaims: Claim[] = [];

    constructor(private officerService: OfficerService, private changeDetectorRef: ChangeDetectorRef) { }

    ngOnInit() {
        this.loadDashboardData();
    }

    loadDashboardData() {
        this.officerService.getAssignedClaims().subscribe(claims => {
            this.recentClaims = claims.slice(0, 5);
            this.updateStats(claims);
            this.changeDetectorRef.detectChanges();
        });
    }

    updateStats(claims: Claim[]) {
        const assigned = claims.length;
        const pending = claims.filter(c => c.Status === 'UnderReview').length;
        const approved = claims.filter(c => c.Status === 'Approved').length;

        this.stats[0].value = assigned.toString();
        this.stats[1].value = pending.toString();
        this.stats[2].value = approved.toString();
    }
}
