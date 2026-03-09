import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ClaimTrackingComponent } from './claims';
import { CustomerService } from '../../../../../app/core/services/customer-service';
import { NotificationService } from '../../../../../app/core/services/notification-service';
import { of } from 'rxjs';
import { FormsModule } from '@angular/forms';

describe('ClaimTrackingComponent', () => {
    let component: ClaimTrackingComponent;
    let fixture: ComponentFixture<ClaimTrackingComponent>;
    let customerServiceSpy: jasmine.SpyObj<CustomerService>;
    let notificationServiceSpy: jasmine.SpyObj<NotificationService>;

    beforeEach(async () => {
        customerServiceSpy = jasmine.createSpyObj('CustomerService', ['getClaims', 'getPolicies', 'submitClaim', 'uploadClaimDocument']);
        notificationServiceSpy = jasmine.createSpyObj('NotificationService', ['showSuccess', 'showError', 'showInfo']);

        customerServiceSpy.getClaims.and.returnValue(of([]));
        customerServiceSpy.getPolicies.and.returnValue(of([]));

        await TestBed.configureTestingModule({
            imports: [ClaimTrackingComponent, FormsModule],
            providers: [
                { provide: CustomerService, useValue: customerServiceSpy },
                { provide: NotificationService, useValue: notificationServiceSpy }
            ]
        }).compileComponents();

        fixture = TestBed.createComponent(ClaimTrackingComponent);
        component = fixture.componentInstance;
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });

    it('should load claims and policies on init', () => {
        fixture.detectChanges();
        expect(customerServiceSpy.getClaims).toHaveBeenCalled();
        expect(customerServiceSpy.getPolicies).toHaveBeenCalled();
    });

    it('should submit claim without documents', () => {
        customerServiceSpy.submitClaim.and.returnValue(of({ Data: { ClaimId: 1 } } as any));
        fixture.detectChanges();

        component.newClaim = {
            PolicyId: 1,
            IncidentDate: '2023-01-01',
            IncidentLocation: 'Test',
            Description: 'Test',
            ClaimedAmount: 1000
        };
        component.selectedFiles = [];
        component.onSubmitClaim();

        expect(customerServiceSpy.submitClaim).toHaveBeenCalled();
        expect(notificationServiceSpy.showSuccess).toHaveBeenCalledWith('Claim submitted successfully!');
    });

    it('should submit claim with documents', () => {
        customerServiceSpy.submitClaim.and.returnValue(of({ Data: { ClaimId: 1 } } as any));
        customerServiceSpy.uploadClaimDocument.and.returnValue(of({}));
        fixture.detectChanges();

        component.newClaim = {
            PolicyId: 1,
            IncidentDate: '2023-01-01',
            IncidentLocation: 'Test',
            Description: 'Test',
            ClaimedAmount: 1000
        };
        const mockFile = new File([''], 'test.png', { type: 'image/png' });
        component.selectedFiles = [mockFile];
        component.onSubmitClaim();

        expect(customerServiceSpy.submitClaim).toHaveBeenCalled();
        expect(customerServiceSpy.uploadClaimDocument).toHaveBeenCalledWith(1, mockFile);
        expect(notificationServiceSpy.showSuccess).toHaveBeenCalledWith('Claim and all documents submitted successfully!');
    });
});
