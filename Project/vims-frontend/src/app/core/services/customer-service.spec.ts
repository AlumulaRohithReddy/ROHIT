import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { CustomerService, Vehicle, Policy, Claim, Payment } from './customer-service';

describe('CustomerService', () => {
    let service: CustomerService;
    let httpMock: HttpTestingController;

    beforeEach(() => {
        TestBed.configureTestingModule({
            imports: [HttpClientTestingModule],
            providers: [CustomerService]
        });
        service = TestBed.inject(CustomerService);
        httpMock = TestBed.inject(HttpTestingController);
    });

    afterEach(() => {
        httpMock.verify();
    });

    it('should be created', () => {
        expect(service).toBeTruthy();
    });

    it('should get vehicles', () => {
        const mockVehicles: Vehicle[] = [
            { VehicleId: 1, Make: 'Tesla', Model: 'Model 3', Year: 2022, RegistrationNumber: 'TSL001', FuelType: 'Electric', VehicleType: 'Sedan', CurrentMarketValue: 40000 }
        ];

        service.getVehicles().subscribe(vehicles => {
            expect(vehicles.length).toBe(1);
            expect(vehicles).toEqual(mockVehicles);
        });

        const req = httpMock.expectOne('https://localhost:7066/api/Vehicle');
        expect(req.request.method).toBe('GET');
        req.flush({ Success: true, Message: 'Success', Data: mockVehicles });
    });

    it('should submit a claim', () => {
        const claimData = { policyId: 1, description: 'Accident' };
        const mockResponse = { Success: true, Message: 'Claim submitted', Data: { ClaimId: 10 } as any };

        service.submitClaim(claimData).subscribe(response => {
            expect(response.Success).toBeTrue();
            expect(response.Data.ClaimId).toBe(10);
        });

        const req = httpMock.expectOne('https://localhost:7066/api/Claim');
        expect(req.request.method).toBe('POST');
        expect(req.request.body).toEqual(claimData);
        req.flush(mockResponse);
    });

    it('should make a payment', () => {
        service.makePayment(1, 'Card').subscribe(response => {
            expect(response).toBeTruthy();
        });

        const req = httpMock.expectOne('https://localhost:7066/api/Payment');
        expect(req.request.method).toBe('POST');
        expect(req.request.body).toEqual({ policyId: 1, paymentMethod: 'Card' });
        req.flush({ Success: true, Message: 'Payment successful' });
    });
});
