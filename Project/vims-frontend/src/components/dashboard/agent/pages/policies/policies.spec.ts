import { ComponentFixture, TestBed } from '@angular/core/testing';
import { AgentPoliciesComponent } from './policies';
import { AgentService } from '../../../../../app/core/services/agent-service';
import { NotificationService } from '../../../../../app/core/services/notification-service';
import { of } from 'rxjs';
import { FormsModule } from '@angular/forms';

describe('AgentPoliciesComponent', () => {
    let component: AgentPoliciesComponent;
    let fixture: ComponentFixture<AgentPoliciesComponent>;
    let agentServiceSpy: jasmine.SpyObj<AgentService>;
    let notificationServiceSpy: jasmine.SpyObj<NotificationService>;

    const mockPolicies = [
        { PolicyId: 1, PolicyNumber: 'POL001', CustomerName: 'John Doe', Status: 'PendingApproval', PremiumAmount: 1000 } as any
    ];

    beforeEach(async () => {
        agentServiceSpy = jasmine.createSpyObj('AgentService', ['getAssignedPolicies', 'approvePolicy', 'rejectPolicy']);
        notificationServiceSpy = jasmine.createSpyObj('NotificationService', ['showSuccess', 'showError']);

        agentServiceSpy.getAssignedPolicies.and.returnValue(of(mockPolicies));

        await TestBed.configureTestingModule({
            imports: [AgentPoliciesComponent, FormsModule],
            providers: [
                { provide: AgentService, useValue: agentServiceSpy },
                { provide: NotificationService, useValue: notificationServiceSpy }
            ]
        }).compileComponents();

        fixture = TestBed.createComponent(AgentPoliciesComponent);
        component = fixture.componentInstance;
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });

    it('should load data on init', () => {
        fixture.detectChanges();
        expect(agentServiceSpy.getAssignedPolicies).toHaveBeenCalled();
        expect(component.policies.length).toBe(1);
    });

    it('should approve policy with new premium', () => {
        spyOn(window, 'prompt').and.returnValue('1200');
        agentServiceSpy.approvePolicy.and.returnValue(of({}));
        fixture.detectChanges();

        component.approvePolicy(1);

        expect(agentServiceSpy.approvePolicy).toHaveBeenCalledWith(1, 1200);
        expect(notificationServiceSpy.showSuccess).toHaveBeenCalledWith('Policy approved!');
    });

    it('should filter policies by status', () => {
        fixture.detectChanges();
        component.statusFilter = 'Approved';
        expect(component.filteredPolicies.length).toBe(0);

        component.statusFilter = 'PendingApproval';
        expect(component.filteredPolicies.length).toBe(1);
    });
});
