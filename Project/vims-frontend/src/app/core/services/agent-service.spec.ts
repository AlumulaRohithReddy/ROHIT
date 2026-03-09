import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { AgentService, Policy } from './agent-service';

describe('AgentService', () => {
    let service: AgentService;
    let httpMock: HttpTestingController;

    beforeEach(() => {
        TestBed.configureTestingModule({
            imports: [HttpClientTestingModule],
            providers: [AgentService]
        });
        service = TestBed.inject(AgentService);
        httpMock = TestBed.inject(HttpTestingController);
    });

    afterEach(() => {
        httpMock.verify();
    });

    it('should be created', () => {
        expect(service).toBeTruthy();
    });

    it('should get assigned policies', () => {
        const mockPolicies: Policy[] = [
            { PolicyId: 1, PolicyNumber: 'POL001', PlanName: 'Basic', CustomerName: 'John Doe', VehicleNumber: 'XYZ123', VehicleModel: 'Model X', PremiumAmount: 500, IDV: 10000, Status: 'Pending', StartDate: '2023-01-01', EndDate: '2024-01-01' }
        ];

        service.getAssignedPolicies().subscribe(policies => {
            expect(policies.length).toBe(1);
            expect(policies).toEqual(mockPolicies);
        });

        const req = httpMock.expectOne('https://localhost:7066/api/Policy/assigned');
        expect(req.request.method).toBe('GET');
        expect(req.request.headers.has('Authorization')).toBeTrue();
        req.flush({ Success: true, Message: 'Success', Data: mockPolicies });
    });

    it('should approve a policy', () => {
        service.approvePolicy(1, 450).subscribe(response => {
            expect(response).toBeTruthy();
        });

        const req = httpMock.expectOne('https://localhost:7066/api/Policy/1/approve');
        expect(req.request.method).toBe('PUT');
        expect(req.request.body).toEqual({ updatedPremium: 450 });
        req.flush({ Success: true, Message: 'Approved' });
    });
});
