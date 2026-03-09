import { ChangeDetectorRef, Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { AdminService, Claim, User as UserInterface } from '../../../../../app/core/services/admin-service';
import { NotificationService } from '../../../../../app/core/services/notification-service';

@Component({
    selector: 'app-claims-assignment',
    standalone: true,
    imports: [CommonModule, FormsModule],
    templateUrl: './claims.html'
})
export class ClaimsAssignmentComponent implements OnInit {
    allClaims: Claim[] = [];
    filteredClaims: Claim[] = [];
    claimsOfficers: UserInterface[] = [];
    selectedClaim: Claim | null = null;
    showClaimDetailsModal = false;
    // Stats
    stats = {
        pending: 0,
        review: 0,
        approved: 0,
        rejected: 0
    };

    // Filters
    searchTerm: string = '';
    selectedStatus: string = '';
    selectedOfficerId: string = '';

    get officers() { return this.claimsOfficers; }

    private notificationService = inject(NotificationService);

    constructor(private adminService: AdminService, private changeDetectorRef: ChangeDetectorRef) { }

    ngOnInit() {
        this.loadClaims();
        this.adminService.getUsers().subscribe(users => {
            this.claimsOfficers = users.filter(u => u.Role === 'ClaimsOfficer' || u.Role === 'Officer');
            this.changeDetectorRef.detectChanges();
        });
    }

    loadClaims() {
        this.adminService.getAllClaims().subscribe(claims => {
            this.allClaims = claims;
            console.log('Loaded claims:', claims);
            this.calculateStats();
            this.applyFilters();
            this.changeDetectorRef.detectChanges();
        });
    }

    calculateStats() {
        this.stats.pending = this.allClaims.filter(c => c.Status === 'Submitted' || c.Status === 'Pending').length;
        this.stats.review = this.allClaims.filter(c => c.Status === 'Under Review').length;
        this.stats.approved = this.allClaims.filter(c => c.Status === 'Approved').length;
        this.stats.rejected = this.allClaims.filter(c => c.Status === 'Rejected').length;
    }

    applyFilters() {
        this.filteredClaims = this.allClaims.filter(claim => {
            const matchesSearch = !this.searchTerm ||
                claim.ClaimNumber.toLowerCase().includes(this.searchTerm.toLowerCase()) ||
                (claim.CustomerName && claim.CustomerName.toLowerCase().includes(this.searchTerm.toLowerCase()));

            const matchesStatus = !this.selectedStatus || claim.Status === this.selectedStatus;

            return matchesSearch && matchesStatus;
        });
    }

    viewClaimDetails(claim: Claim) {
        this.selectedClaim = claim;
        console.log('Selected claim for details:', claim);
        this.selectedOfficerId = '';
        this.showClaimDetailsModal = true;
    }

    getOfficerName(id: number): string {
        if (!id) return 'Unassigned';
        const officer = this.claimsOfficers.find(o => o.UserId === id);
        return officer ? officer.FullName : `Officer (${id})`;
    }

    hasOfficer(claim: Claim): boolean {
        return !!(claim.claimsofficerId || claim.OfficerId);
    }

    getClaimOfficerId(claim: Claim): number {
        return claim.claimsofficerId || claim.OfficerId || 0;
    }

    assignOfficer(claim: Claim) {
        if (this.selectedOfficerId) {
            this.onAssignOfficer(claim.ClaimId, { target: { value: this.selectedOfficerId } });
        }
    }

    unassignOfficer(claim: Claim) {
        // Using 0 to unassign
        this.adminService.assignClaim(claim.ClaimId, 0).subscribe({
            next: () => {
                this.notificationService.showSuccess('Officer unassigned successfully');
                this.showClaimDetailsModal = false;
                this.loadClaims();
            }
        });
    }

    onAssignOfficer(claimId: number, event: any) {
        const officerId = event.target.value;
        if (officerId) {
            this.adminService.assignClaim(claimId, parseInt(officerId)).subscribe({
                next: () => {
                    this.notificationService.showSuccess('Officer assigned successfully');
                    this.showClaimDetailsModal = false;
                    this.loadClaims();
                },
                error: (err) => {
                    // Handled by global error interceptor
                }
            });
            this.changeDetectorRef.detectChanges();
        }
    }
}
