import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CustomerService, Payment } from '../../../../../app/core/services/customer-service';

@Component({
    selector: 'app-payment-history',
    standalone: true,
    imports: [CommonModule],
    templateUrl: './payments.html'
})
export class PaymentHistoryComponent implements OnInit {
    payments: Payment[] = [];

    constructor(private customerService: CustomerService, private changeDetectorRef: ChangeDetectorRef) { }

    ngOnInit() {
        this.customerService.getPayments().subscribe(p => this.payments = p);
        this.changeDetectorRef.detectChanges();
    }
}
