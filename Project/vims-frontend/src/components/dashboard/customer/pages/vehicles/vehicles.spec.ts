import { ComponentFixture, TestBed } from '@angular/core/testing';
import { VehicleManagementComponent } from './vehicles';
import { CustomerService } from '../../../../../app/core/services/customer-service';
import { NotificationService } from '../../../../../app/core/services/notification-service';
import { of } from 'rxjs';
import { FormsModule } from '@angular/forms';

describe('VehicleManagementComponent', () => {
    let component: VehicleManagementComponent;
    let fixture: ComponentFixture<VehicleManagementComponent>;
    let customerServiceSpy: jasmine.SpyObj<CustomerService>;
    let notificationServiceSpy: jasmine.SpyObj<NotificationService>;

    beforeEach(async () => {
        customerServiceSpy = jasmine.createSpyObj('CustomerService', ['getVehicles', 'addVehicle', 'deleteVehicle']);
        notificationServiceSpy = jasmine.createSpyObj('NotificationService', ['showSuccess']);

        customerServiceSpy.getVehicles.and.returnValue(of([]));

        await TestBed.configureTestingModule({
            imports: [VehicleManagementComponent, FormsModule],
            providers: [
                { provide: CustomerService, useValue: customerServiceSpy },
                { provide: NotificationService, useValue: notificationServiceSpy }
            ]
        }).compileComponents();

        fixture = TestBed.createComponent(VehicleManagementComponent);
        component = fixture.componentInstance;
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });

    it('should load vehicles on init', () => {
        fixture.detectChanges();
        expect(customerServiceSpy.getVehicles).toHaveBeenCalled();
    });

    it('should add vehicle successfully', () => {
        customerServiceSpy.addVehicle.and.returnValue(of({}));
        fixture.detectChanges();

        component.newVehicle = { RegistrationNumber: 'XYZ123', Make: 'Tesla', Model: '3', Year: 2024, FuelType: 'PETROL', VehicleType: 'CAR', CurrentMarketValue: 1000000 };
        component.onSubmitVehicle();

        expect(customerServiceSpy.addVehicle).toHaveBeenCalled();
        expect(notificationServiceSpy.showSuccess).toHaveBeenCalledWith('Vehicle added successfully!');
    });

    it('should delete vehicle after confirmation', () => {
        spyOn(window, 'confirm').and.returnValue(true);
        customerServiceSpy.deleteVehicle.and.returnValue(of({}));
        fixture.detectChanges();

        component.onDelete(1);

        expect(customerServiceSpy.deleteVehicle).toHaveBeenCalledWith(1);
        expect(notificationServiceSpy.showSuccess).toHaveBeenCalledWith('Vehicle removed successfully!');
    });
});
