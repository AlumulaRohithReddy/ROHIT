import { ComponentFixture, TestBed } from '@angular/core/testing';
import { PolicyManagementComponent } from './policies';
import { CustomerService } from '../../../../../app/core/services/customer-service';
import { NotificationService } from '../../../../../app/core/services/notification-service';
import { Router } from '@angular/router';
import { of } from 'rxjs';

describe('PolicyManagementComponent', () => {
    let component: PolicyManagementComponent;
    let fixture: ComponentFixture<PolicyManagementComponent>;
    let customerServiceSpy: jasmine.SpyObj<CustomerService>;
    let notificationServiceSpy: jasmine.SpyObj<NotificationService>;
    let routerSpy: jasmine.SpyObj<Router>;

    beforeEach(async () => {
        customerServiceSpy = jasmine.createSpyObj('CustomerService', ['getPolicies', 'makePayment', 'downloadInvoice']);
        notificationServiceSpy = jasmine.createSpyObj('NotificationService', ['showSuccess', 'showError']);
        routerSpy = jasmine.createSpyObj('Router', ['navigate']);

        customerServiceSpy.getPolicies.and.returnValue(of([]));

        await TestBed.configureTestingModule({
            imports: [PolicyManagementComponent],
            providers: [
                { provide: CustomerService, useValue: customerServiceSpy },
                { provide: NotificationService, useValue: notificationServiceSpy },
                { provide: Router, useValue: routerSpy }
            ]
        }).compileComponents();

        fixture = TestBed.createComponent(PolicyManagementComponent);
        component = fixture.componentInstance;
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });

    it('should load policies on init', () => {
        fixture.detectChanges();
        expect(customerServiceSpy.getPolicies).toHaveBeenCalled();
    });

    it('should navigate to buy page', () => {
        component.onAddNew();
        expect(routerSpy.navigate).toHaveBeenCalledWith(['/customer/policies/buy']);
    });

    it('should handle payment', () => {
        spyOn(window, 'confirm').and.returnValue(true);
        customerServiceSpy.makePayment.and.returnValue(of({}));

        component.onBuyPolicy(1);

        expect(customerServiceSpy.makePayment).toHaveBeenCalledWith(1, 'UPI');
        expect(notificationServiceSpy.showSuccess).toHaveBeenCalled();
    });
});
