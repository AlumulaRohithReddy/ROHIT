import { ComponentFixture, TestBed } from '@angular/core/testing';
import { CustomerOverviewComponent } from './overview';
import { CustomerService } from '../../../../../app/core/services/customer-service';
import { of } from 'rxjs';

describe('CustomerOverviewComponent', () => {
    let component: CustomerOverviewComponent;
    let fixture: ComponentFixture<CustomerOverviewComponent>;
    let customerServiceSpy: jasmine.SpyObj<CustomerService>;

    beforeEach(async () => {
        customerServiceSpy = jasmine.createSpyObj('CustomerService', ['getVehicles', 'getPolicies', 'getClaims', 'getPayments']);

        customerServiceSpy.getVehicles.and.returnValue(of([]));
        customerServiceSpy.getPolicies.and.returnValue(of([]));
        customerServiceSpy.getClaims.and.returnValue(of([]));
        customerServiceSpy.getPayments.and.returnValue(of([]));

        await TestBed.configureTestingModule({
            imports: [CustomerOverviewComponent],
            providers: [
                { provide: CustomerService, useValue: customerServiceSpy }
            ]
        }).compileComponents();

        fixture = TestBed.createComponent(CustomerOverviewComponent);
        component = fixture.componentInstance;
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });

    it('should load dashboard data on init', () => {
        fixture.detectChanges();
        expect(customerServiceSpy.getVehicles).toHaveBeenCalled();
        expect(customerServiceSpy.getPolicies).toHaveBeenCalled();
        expect(customerServiceSpy.getClaims).toHaveBeenCalled();
        expect(customerServiceSpy.getPayments).toHaveBeenCalled();
        expect(component.stats.length).toBe(4);
    });
});
