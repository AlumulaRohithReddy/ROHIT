import { Component, OnInit, ChangeDetectorRef, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { CustomerService, Policy } from '../../../../../app/core/services/customer-service';
import { NotificationService } from '../../../../../app/core/services/notification-service';

@Component({
    selector: 'app-policy-management',
    standalone: true,
    imports: [CommonModule],
    templateUrl: './policies.html'
})
export class PolicyManagementComponent implements OnInit {
    policies: Policy[] = [];
    private notificationService = inject(NotificationService);

    constructor(
        private customerService: CustomerService,
        private cdr: ChangeDetectorRef,
        public router: Router
    ) { }

    ngOnInit() {
        this.loadPolicies();
    }

    loadPolicies() {
        this.customerService.getPolicies().subscribe(p => {
            this.policies = p;
            this.cdr.detectChanges();
        });
    }

    onAddNew() {
        this.router.navigate(['/customer/policies/buy']);
    }

    onBuyPolicy(policyId: number) {
        if (confirm('Are you sure you want to buy this policy?')) {
            this.customerService.makePayment(policyId, 'UPI').subscribe({
                next: (res) => {
                    this.notificationService.showSuccess('Payment successful! Your policy is now active.');
                    this.loadPolicies();
                },
                error: (err) => {
                    // Handled by global error interceptor for non-blob
                }
            });
        }
    }

    onDownloadInvoice(paymentId: number) {
        this.customerService.downloadInvoice(paymentId).subscribe({
            next: (blob) => {
                const url = window.URL.createObjectURL(blob);
                const a = document.createElement('a');
                a.href = url;
                a.download = `Invoice_${paymentId}.pdf`;
                a.click();
                window.URL.revokeObjectURL(url);
                this.notificationService.showSuccess('Invoice downloaded successfully.');
            },
            error: async (err) => {
                if (err.error instanceof Blob) {
                    const reader = new FileReader();
                    reader.onload = () => {
                        try {
                            const json = JSON.parse(reader.result as string);
                            const msg = json.Message || json.message || 'Download failed';
                            this.notificationService.showError(msg);
                        } catch {
                            this.notificationService.showError('Download failed: ' + reader.result);
                        }
                    };
                    reader.readAsText(err.error);
                } else {
                    // Fallback for non-blob errors just in case
                    const msg = err.error?.Message || err.message || 'Download failed';
                    this.notificationService.showError(msg);
                }
            }
        });
    }
}
