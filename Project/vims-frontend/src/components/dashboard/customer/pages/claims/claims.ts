import { Component, OnInit, ChangeDetectorRef, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { CustomerService, Claim, Policy } from '../../../../../app/core/services/customer-service';
import { NotificationService } from '../../../../../app/core/services/notification-service';

@Component({
    selector: 'app-claim-tracking',
    standalone: true,
    imports: [CommonModule, FormsModule],
    templateUrl: './claims.html'
})
export class ClaimTrackingComponent implements OnInit {
    claims: Claim[] = [];
    policies: Policy[] = [];
    showForm = false;
    newClaim = {
        PolicyId: 0,
        IncidentDate: '',
        IncidentLocation: '',
        Description: '',
        ClaimedAmount: 0
    };
    selectedFiles: File[] = [];
    private notificationService = inject(NotificationService);

    constructor(private customerService: CustomerService, private cdr: ChangeDetectorRef) { }

    ngOnInit() {
        this.loadClaims();
        this.loadPolicies();
    }

    loadClaims() {
        this.customerService.getClaims().subscribe(c => {
            this.claims = c;
            this.cdr.detectChanges();
        });
    }

    loadPolicies() {
        this.customerService.getPolicies().subscribe(p => {
            this.policies = p.filter(x => x.Status === 'Active' || x.Status === 'Approved');
            this.cdr.detectChanges();
        });
    }

    onNewClaim() {
        this.showForm = true;
    }

    onCancel() {
        this.showForm = false;
        this.resetForm();
    }

    onFileSelected(event: any) {
        const files = event.target.files;
        if (files) {
            for (let i = 0; i < files.length; i++) {
                this.selectedFiles.push(files[i]);
            }
        }
    }

    removeFile(index: number) {
        this.selectedFiles.splice(index, 1);
    }

    private resetForm() {
        this.newClaim = {
            PolicyId: 0,
            IncidentDate: '',
            IncidentLocation: '',
            Description: '',
            ClaimedAmount: 0
        };
        this.selectedFiles = [];
    }

    onSubmitClaim() {
        if (!this.newClaim.PolicyId || !this.newClaim.IncidentDate || !this.newClaim.ClaimedAmount) {
            this.notificationService.showError('Please fill in all required fields.');
            return;
        }

        const incidentDate = new Date(this.newClaim.IncidentDate);
        incidentDate.setHours(0, 0, 0, 0);
        const today = new Date();
        today.setHours(0, 0, 0, 0);

        if (incidentDate > today) {
            this.notificationService.showError('Incident date cannot be in the future.');
            return;
        }

        this.customerService.submitClaim(this.newClaim).subscribe({
            next: (res) => {
                const claimId = res.Data.ClaimId;

                if (this.selectedFiles.length > 0) {
                    this.uploadDocuments(claimId);
                } else {
                    this.notificationService.showSuccess('Claim submitted successfully!');
                    this.finalizeSubmission();
                }
            },
            error: (err) => {
                // Handled by global error interceptor
            }
        });
    }

    private uploadDocuments(claimId: number) {
        let uploadCount = 0;
        let hasError = false;
        this.selectedFiles.forEach(file => {
            this.customerService.uploadClaimDocument(claimId, file).subscribe({
                next: () => {
                    uploadCount++;
                    if (uploadCount === this.selectedFiles.length) {
                        if (hasError) {
                            this.notificationService.showInfo('Claim submitted, but some documents failed to upload.');
                        } else {
                            this.notificationService.showSuccess('Claim and all documents submitted successfully!');
                        }
                        this.finalizeSubmission();
                    }
                },
                error: (err) => {
                    hasError = true;
                    uploadCount++;
                    if (uploadCount === this.selectedFiles.length) {
                        this.notificationService.showInfo('Claim submitted, but some documents failed to upload.');
                        this.finalizeSubmission();
                    }
                }
            });
        });
    }

    private finalizeSubmission() {
        this.showForm = false;
        this.resetForm();
        this.loadClaims();
    }
}
