import { ComponentFixture, TestBed } from '@angular/core/testing';
import { PaymentHistoryComponent } from './payments';
import { CustomerService } from '../../../../../app/core/services/customer-service';
import { of } from 'rxjs';

describe('PaymentHistoryComponent', () => {
    let component: PaymentHistoryComponent;
    let fixture: ComponentFixture<PaymentHistoryComponent>;
    let customerServiceSpy: jasmine.SpyObj<CustomerService>;

    beforeEach(async () => {
        customerServiceSpy = jasmine.createSpyObj('CustomerService', ['getPayments']);
        customerServiceSpy.getPayments.and.returnValue(of([]));

        await TestBed.configureTestingModule({
            imports: [PaymentHistoryComponent],
            providers: [
                { provide: CustomerService, useValue: customerServiceSpy }
            ]
        }).compileComponents();

        fixture = TestBed.createComponent(PaymentHistoryComponent);
        component = fixture.componentInstance;
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });

    it('should load payments on init', () => {
        fixture.detectChanges();
        expect(customerServiceSpy.getPayments).toHaveBeenCalled();
    });
});
