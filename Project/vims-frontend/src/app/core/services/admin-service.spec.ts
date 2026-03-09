import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { AdminService, PolicyPlan, Claim, User, AdminDashboardStats } from './admin-service';

describe('AdminService', () => {
    let service: AdminService;
    let httpMock: HttpTestingController;

    beforeEach(() => {
        TestBed.configureTestingModule({
            imports: [HttpClientTestingModule],
            providers: [AdminService]
        });
        service = TestBed.inject(AdminService);
        httpMock = TestBed.inject(HttpTestingController);
    });

    afterEach(() => {
        httpMock.verify();
    });

    it('should be created', () => {
        expect(service).toBeTruthy();
    });

    it('should get policy plans', () => {
        const mockPlans: PolicyPlan[] = [
            { PlanId: 1, PlanName: 'Test Plan', PolicyType: 'Life', BasePremium: 100, PolicyDurationMonths: 12 }
        ];

        service.getPolicyPlans().subscribe(plans => {
            expect(plans.length).toBe(1);
            expect(plans).toEqual(mockPlans);
        });

        const req = httpMock.expectOne('https://localhost:7066/api/PolicyPlan');
        expect(req.request.method).toBe('GET');
        req.flush({ Success: true, Message: 'Success', Data: mockPlans });
    });

    it('should create a policy plan', () => {
        const newPlan: PolicyPlan = { PlanName: 'New Plan', PolicyType: 'Health', BasePremium: 200, PolicyDurationMonths: 24 };

        service.createPolicyPlan(newPlan).subscribe(response => {
            expect(response).toBeTruthy();
        });

        const req = httpMock.expectOne('https://localhost:7066/api/PolicyPlan');
        expect(req.request.method).toBe('POST');
        expect(req.request.body).toEqual(newPlan);
        req.flush({ Success: true, Message: 'Created' });
    });

    it('should get all claims', () => {
        const mockClaims: Claim[] = [
            { ClaimId: 1, ClaimNumber: 'CLM001', Status: 'Pending', ClaimedAmount: 5000 }
        ];

        service.getAllClaims().subscribe(claims => {
            expect(claims.length).toBe(1);
            expect(claims).toEqual(mockClaims);
        });

        const req = httpMock.expectOne('https://localhost:7066/api/Claim');
        expect(req.request.method).toBe('GET');
        req.flush({ Success: true, Message: 'Success', Data: mockClaims });
    });

    it('should get dashboard stats', () => {
        const mockStats: AdminDashboardStats = {
            TotalUsers: 10,
            TotalActivePolicies: 5,
            TotalPendingClaims: 2,
            TotalRevenue: 10000,
            MonthlyRevenue: [],
            PolicyStatusDistribution: [],
            ClaimStatusDistribution: []
        };

        service.getDashboardStats().subscribe(stats => {
            expect(stats).toEqual(mockStats);
        });

        const req = httpMock.expectOne('https://localhost:7066/api/AdminDashboard/stats');
        expect(req.request.method).toBe('GET');
        req.flush({ Success: true, Message: 'Success', Data: mockStats });
    });
});
