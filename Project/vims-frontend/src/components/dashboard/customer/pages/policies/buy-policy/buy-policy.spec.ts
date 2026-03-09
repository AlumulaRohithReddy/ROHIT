import { ComponentFixture, TestBed, fakeAsync, tick } from '@angular/core/testing';
import { BuyPolicyComponent } from './buy-policy';
import { CustomerService } from '../../../../../../app/core/services/customer-service';
import { Router } from '@angular/router';
import { of } from 'rxjs';
import { FormsModule } from '@angular/forms';

describe('BuyPolicyComponent', () => {
    let component: BuyPolicyComponent;
    let fixture: ComponentFixture<BuyPolicyComponent>;
    let customerServiceSpy: jasmine.SpyObj<CustomerService>;
    let routerSpy: jasmine.SpyObj<Router>;

    const mockPlans = [{ PlanId: 1, PlanName: 'Gold' } as any];
    const mockVehicles = [{ VehicleId: 10, Model: 'Tesla' } as any];

    beforeEach(async () => {
        customerServiceSpy = jasmine.createSpyObj('CustomerService', ['getPolicyPlans', 'getVehicles', 'calculatePremium', 'buyPolicy']);
        routerSpy = jasmine.createSpyObj('Router', ['navigate']);

        customerServiceSpy.getPolicyPlans.and.returnValue(of(mockPlans));
        customerServiceSpy.getVehicles.and.returnValue(of(mockVehicles));

        await TestBed.configureTestingModule({
            imports: [BuyPolicyComponent, FormsModule],
            providers: [
                { provide: CustomerService, useValue: customerServiceSpy },
                { provide: Router, useValue: routerSpy }
            ]
        }).compileComponents();

        fixture = TestBed.createComponent(BuyPolicyComponent);
        component = fixture.componentInstance;
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });

    it('should load plans and vehicles on init', () => {
        fixture.detectChanges();
        expect(customerServiceSpy.getPolicyPlans).toHaveBeenCalled();
        expect(customerServiceSpy.getVehicles).toHaveBeenCalled();
        expect(component.plans.length).toBe(1);
    });

    it('should calculate premium when vehicle is selected', () => {
        component.selectedPlan = mockPlans[0];
        customerServiceSpy.calculatePremium.and.returnValue(of({ Total: 1000 }));
        fixture.detectChanges();

        component.onVehicleSelect(10);

        expect(customerServiceSpy.calculatePremium).toHaveBeenCalledWith(10, 1);
        expect(component.premiumBreakdown.Total).toBe(1000);
    });

    it('should navigate to policies after buying', () => {
        spyOn(window, 'alert');
        customerServiceSpy.buyPolicy.and.returnValue(of({}));
        component.selectedPlan = mockPlans[0];
        component.selectedVehicleId = 10;
        fixture.detectChanges();

        component.onBuy();

        expect(customerServiceSpy.buyPolicy).toHaveBeenCalled();
        expect(routerSpy.navigate).toHaveBeenCalledWith(['/customer/policies']);
    });
});
