import { ComponentFixture, TestBed } from '@angular/core/testing';
import { AgentOverviewComponent } from './overview';
import { AgentService } from '../../../../../app/core/services/agent-service';
import { of } from 'rxjs';

describe('AgentOverviewComponent', () => {
    let component: AgentOverviewComponent;
    let fixture: ComponentFixture<AgentOverviewComponent>;
    let agentServiceSpy: jasmine.SpyObj<AgentService>;

    const mockPolicies = [
        { PolicyId: 1, Status: 'PendingApproval' } as any,
        { PolicyId: 2, Status: 'Approved' } as any
    ];

    beforeEach(async () => {
        agentServiceSpy = jasmine.createSpyObj('AgentService', ['getAssignedPolicies', 'approvePolicy', 'rejectPolicy']);
        agentServiceSpy.getAssignedPolicies.and.returnValue(of(mockPolicies));

        await TestBed.configureTestingModule({
            imports: [AgentOverviewComponent],
            providers: [
                { provide: AgentService, useValue: agentServiceSpy }
            ]
        }).compileComponents();

        fixture = TestBed.createComponent(AgentOverviewComponent);
        component = fixture.componentInstance;
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });

    it('should load data and update stats on init', () => {
        fixture.detectChanges();
        expect(agentServiceSpy.getAssignedPolicies).toHaveBeenCalled();
        expect(component.policies.length).toBe(2);
        expect(component.stats.find(s => s.label === 'Pending Approval').value).toBe('1');
    });

    it('should approve policy after confirmation', () => {
        spyOn(window, 'confirm').and.returnValue(true);
        spyOn(window, 'alert');
        agentServiceSpy.approvePolicy.and.returnValue(of({}));

        component.approvePolicy(1);

        expect(agentServiceSpy.approvePolicy).toHaveBeenCalledWith(1);
        expect(window.alert).toHaveBeenCalledWith('Policy approved!');
    });
});
