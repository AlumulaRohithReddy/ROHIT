import { ComponentFixture, TestBed } from '@angular/core/testing';
import { AgentCustomersComponent } from './customers';
import { AgentService } from '../../../../../app/core/services/agent-service';
import { NotificationService } from '../../../../../app/core/services/notification-service';
import { of } from 'rxjs';
import { FormsModule } from '@angular/forms';

describe('AgentCustomersComponent', () => {
    let component: AgentCustomersComponent;
    let fixture: ComponentFixture<AgentCustomersComponent>;
    let agentServiceSpy: jasmine.SpyObj<AgentService>;

    const mockPolicies = [
        { CustomerName: 'John Doe', PremiumAmount: 1000, IDV: 10000, Status: 'Approved' } as any,
        { CustomerName: 'John Doe', PremiumAmount: 500, IDV: 5000, Status: 'Pending' } as any,
        { CustomerName: 'Jane Smith', PremiumAmount: 2000, IDV: 20000, Status: 'Approved' } as any
    ];

    beforeEach(async () => {
        agentServiceSpy = jasmine.createSpyObj('AgentService', ['getAssignedPolicies']);
        agentServiceSpy.getAssignedPolicies.and.returnValue(of(mockPolicies));

        await TestBed.configureTestingModule({
            imports: [AgentCustomersComponent, FormsModule],
            providers: [
                { provide: AgentService, useValue: agentServiceSpy },
                { provide: NotificationService, useValue: {} }
            ]
        }).compileComponents();

        fixture = TestBed.createComponent(AgentCustomersComponent);
        component = fixture.componentInstance;
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });

    it('should load policies and process customers on init', () => {
        fixture.detectChanges();
        expect(agentServiceSpy.getAssignedPolicies).toHaveBeenCalled();
        expect(component.customers.length).toBe(2); // John Doe and Jane Smith

        const john = component.customers.find(c => c.Name === 'John Doe');
        expect(john?.PolicyCount).toBe(2);
        expect(john?.ActivePolicies).toBe(1);
        expect(john?.TotalPremium).toBe(1500);
    });

    it('should filter customers by search term', () => {
        fixture.detectChanges();
        component.searchTerm = 'Jane';
        expect(component.filteredCustomers.length).toBe(1);
        expect(component.filteredCustomers[0].Name).toBe('Jane Smith');
    });
});
