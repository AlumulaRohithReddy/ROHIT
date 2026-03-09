import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { OfficerService, Claim } from './officer-service';

describe('OfficerService', () => {
    let service: OfficerService;
    let httpMock: HttpTestingController;

    beforeEach(() => {
        TestBed.configureTestingModule({
            imports: [HttpClientTestingModule],
            providers: [OfficerService]
        });
        service = TestBed.inject(OfficerService);
        httpMock = TestBed.inject(HttpTestingController);
    });

    afterEach(() => {
        httpMock.verify();
    });

    it('should be created', () => {
        expect(service).toBeTruthy();
    });

    it('should get assigned claims', () => {
        const mockClaims: Claim[] = [
            { ClaimId: 1, ClaimNumber: 'CLM001', Status: 'Assigned', ClaimedAmount: 1000, VehicleNumber: 'V123', PlanName: 'Gold', CustomerName: 'Jane Smith', DocumentCount: 2, FraudScore: 10, FraudRiskLevel: 'Low' }
        ];

        service.getAssignedClaims().subscribe(claims => {
            expect(claims.length).toBe(1);
            expect(claims).toEqual(mockClaims);
        });

        const req = httpMock.expectOne('https://localhost:7066/api/Claim/officer');
        expect(req.request.method).toBe('GET');
        req.flush({ Success: true, Message: 'Success', Data: mockClaims });
    });

    it('should review a claim', () => {
        const review = { isApproved: true, approvedAmount: 900 };

        service.reviewClaim(1, review).subscribe(response => {
            expect(response).toBeTruthy();
        });

        const req = httpMock.expectOne('https://localhost:7066/api/Claim/1/review');
        expect(req.request.method).toBe('PUT');
        expect(req.request.body).toEqual(review);
        req.flush({ Success: true, Message: 'Review submitted' });
    });
});
