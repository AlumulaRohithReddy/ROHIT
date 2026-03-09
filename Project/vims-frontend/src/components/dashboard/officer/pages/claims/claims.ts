import { ChangeDetectorRef, Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { OfficerService, Claim } from '../../../../../app/core/services/officer-service';
import { NotificationService } from '../../../../../app/core/services/notification-service';

@Component({
    selector: 'app-officer-claims',
    standalone: true,
    imports: [CommonModule, FormsModule],
    templateUrl: './claims.html'
})
export class OfficerClaimsComponent implements OnInit {
    allClaims: Claim[] = [];
    selectedClaim: Claim | null = null;
    documents: string[] = [];

    showReviewModal = false;
    reviewData = { isApproved: true, approvedAmount: 0 };

    showImagePreview = false;
    selectedImage = '';
    private notificationService = inject(NotificationService);

    constructor(private officerService: OfficerService, private changeDetectorRef: ChangeDetectorRef) { }

    isPdf(doc: string): boolean {
        return doc.toLowerCase().endsWith('.pdf');
    }

    isImage(doc: string): boolean {
        const ext = doc.toLowerCase();
        return ext.endsWith('.png') || ext.endsWith('.jpg') || ext.endsWith('.jpeg') || ext.endsWith('.webp');
    }

    openImagePreview(doc: string) {
        const url = 'https://localhost:7066/' + doc;
        if (this.isPdf(doc)) {
            window.open(url, '_blank');
        } else {
            this.selectedImage = url;
            this.showImagePreview = true;
        }
        this.changeDetectorRef.detectChanges();
    }

    closeImagePreview() {
        this.showImagePreview = false;
        this.selectedImage = '';
        this.changeDetectorRef.detectChanges();
    }

    ngOnInit() {
        this.loadClaims();
    }

    loadClaims() {
        this.officerService.getAssignedClaims().subscribe(claims => {
            this.allClaims = claims;
            this.changeDetectorRef.detectChanges();
        });
    }

    openReview(claim: Claim) {
        this.selectedClaim = claim;
        this.reviewData = { isApproved: true, approvedAmount: claim.ClaimedAmount };
        this.showReviewModal = true;
        this.documents = [];
        this.officerService.getClaimDocuments(claim.ClaimId).subscribe(docs => {
            this.documents = docs;
            this.changeDetectorRef.detectChanges();
        });
    }

    submitReview() {
        if (!this.selectedClaim) return;

        this.officerService.reviewClaim(this.selectedClaim.ClaimId, this.reviewData).subscribe({
            next: () => {
                this.notificationService.showSuccess('Claim reviewed successfully');
                this.showReviewModal = false;
                this.loadClaims();
            },
            error: (err) => {
                // Handled by global error interceptor
            }
        });
    }
}
