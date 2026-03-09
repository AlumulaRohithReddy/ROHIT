import { ComponentFixture, TestBed } from '@angular/core/testing';
import { PolicyPlansComponent } from './plans';
import { AdminService } from '../../../../../app/core/services/admin-service';
import { NotificationService } from '../../../../../app/core/services/notification-service';
import { of } from 'rxjs';
import { FormsModule } from '@angular/forms';

describe('PolicyPlansComponent', () => {
    let component: PolicyPlansComponent;
    let fixture: ComponentFixture<PolicyPlansComponent>;
    let adminServiceSpy: jasmine.SpyObj<AdminService>;
    let notificationServiceSpy: jasmine.SpyObj<NotificationService>;

    const mockPlans = [
        { PlanId: 1, PlanName: 'Gold Plan', PolicyType: 'Vehicle', BasePremium: 2000, PolicyDurationMonths: 12 }
    ];

    beforeEach(async () => {
        adminServiceSpy = jasmine.createSpyObj('AdminService', ['getPolicyPlans', 'createPolicyPlan', 'updatePolicyPlan', 'deletePolicyPlan']);
        notificationServiceSpy = jasmine.createSpyObj('NotificationService', ['showSuccess']);

        adminServiceSpy.getPolicyPlans.and.returnValue(of(mockPlans));

        await TestBed.configureTestingModule({
            imports: [PolicyPlansComponent, FormsModule],
            providers: [
                { provide: AdminService, useValue: adminServiceSpy },
                { provide: NotificationService, useValue: notificationServiceSpy }
            ]
        }).compileComponents();

        fixture = TestBed.createComponent(PolicyPlansComponent);
        component = fixture.componentInstance;
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });

    it('should load plans on init', () => {
        fixture.detectChanges();
        expect(adminServiceSpy.getPolicyPlans).toHaveBeenCalled();
        expect(component.allPlans.length).toBe(1);
    });

    it('should create a new plan', () => {
        adminServiceSpy.createPolicyPlan.and.returnValue(of({}));
        fixture.detectChanges();

        component.newPlan = { PlanName: 'New Plan', PolicyType: 'Life', BasePremium: 1000, PolicyDurationMonths: 12 };
        component.onCreatePlan();

        expect(adminServiceSpy.createPolicyPlan).toHaveBeenCalled();
        expect(notificationServiceSpy.showSuccess).toHaveBeenCalledWith('Plan created successfully!');
    });

    it('should delete a plan', () => {
        adminServiceSpy.deletePolicyPlan.and.returnValue(of({}));
        spyOn(window, 'confirm').and.returnValue(true);
        fixture.detectChanges();

        component.onDeletePlan(1);

        expect(adminServiceSpy.deletePolicyPlan).toHaveBeenCalledWith(1);
        expect(notificationServiceSpy.showSuccess).toHaveBeenCalledWith('Plan deleted successfully');
    });
});
