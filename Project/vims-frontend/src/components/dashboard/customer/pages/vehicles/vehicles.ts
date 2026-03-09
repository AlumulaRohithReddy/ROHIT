import { Component, OnInit, ChangeDetectorRef, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { CustomerService, Vehicle } from '../../../../../app/core/services/customer-service';
import { NotificationService } from '../../../../../app/core/services/notification-service';

@Component({
    selector: 'app-vehicle-management',
    standalone: true,
    imports: [CommonModule, FormsModule],
    templateUrl: './vehicles.html'
})
export class VehicleManagementComponent implements OnInit {
    vehicles: Vehicle[] = [];
    newVehicle = { RegistrationNumber: '', Make: '', Model: '', Year: 2024, FuelType: 'PETROL', VehicleType: 'CAR', CurrentMarketValue: 0 };
    showForm = false;
    isLookupLoading = false;
    private notificationService = inject(NotificationService);

    private mockVehicles: Record<string, any> = {
        'TS09EX1234': { Make: 'Maruti Suzuki', Model: 'Swift', Year: 2022, FuelType: 'PETROL', VehicleType: 'CAR', CurrentMarketValue: 650000 },
        'KA01AB9999': { Make: 'Mahindra', Model: 'Scorpio-N', Year: 2023, FuelType: 'DIESEL', VehicleType: 'CAR', CurrentMarketValue: 1800000 },
        'DL34AF5678': { Make: 'Honda', Model: 'City', Year: 2021, FuelType: 'PETROL', VehicleType: 'CAR', CurrentMarketValue: 1200000 },
        'MH12RS4321': { Make: 'Royal Enfield', Model: 'Classic 350', Year: 2023, FuelType: 'PETROL', VehicleType: 'BIKE', CurrentMarketValue: 210000 },
        'TS07GY5255': { Make: 'Toyota', Model: 'Fortuner', Year: 2024, FuelType: 'DIESEL', VehicleType: 'CAR', CurrentMarketValue: 3500000 }
    };

    constructor(
        private customerService: CustomerService,
        private cdr: ChangeDetectorRef
    ) { }

    lookupVehicle() {
        const plate = this.newVehicle.RegistrationNumber.toUpperCase().replace(/[-\s]/g, '');
        if (plate.length < 6) return;

        this.isLookupLoading = true;
        this.cdr.detectChanges();

        // Simulate API delay
        setTimeout(() => {
            const result = this.mockVehicles[plate];
            if (result) {
                this.newVehicle = { ...this.newVehicle, ...result, RegistrationNumber: this.newVehicle.RegistrationNumber };
                this.notificationService.showSuccess('Vehicle details auto-filled!');
            } else {
                this.notificationService.showInfo('No matching records found. Please enter details manually.');
            }
            this.isLookupLoading = false;
            this.cdr.detectChanges();
        }, 1500);
    }

    ngOnInit() {
        this.loadVehicles();
    }

    loadVehicles() {
        this.customerService.getVehicles().subscribe(v => {
            this.vehicles = v;
            this.cdr.detectChanges();
        });
    }

    onAddVehicle() {
        this.showForm = true;
    }

    onRegNumberChange() {
        // Trim and normalize
        this.newVehicle.RegistrationNumber = this.newVehicle.RegistrationNumber.trim().toUpperCase();

        // Clear other fields
        this.newVehicle.Make = '';
        this.newVehicle.Model = '';
        this.newVehicle.Year = 2024;
        this.newVehicle.FuelType = 'PETROL';
        this.newVehicle.VehicleType = 'CAR';
        this.newVehicle.CurrentMarketValue = 0;

        // Auto-fetch if format is correct (XX 00 XX 0000)
        const regPattern = /^[A-Z]{2} \d{2} [A-Z]{1,2} \d{4}$/;
        if (regPattern.test(this.newVehicle.RegistrationNumber)) {
            this.lookupVehicle();
        }
    }

    onCancel() {
        this.showForm = false;
        this.resetForm();
    }

    private resetForm() {
        this.newVehicle = { RegistrationNumber: '', Make: '', Model: '', Year: 2024, FuelType: 'PETROL', VehicleType: 'CAR', CurrentMarketValue: 0 };
    }

    onSubmitVehicle() {
        this.customerService.addVehicle(this.newVehicle).subscribe({
            next: () => {
                this.notificationService.showSuccess('Vehicle added successfully!');
                this.loadVehicles();
                this.showForm = false;
                this.resetForm();
            },
            error: (err) => {
                // Handled by global error interceptor
            }
        });
    }

    onDelete(id: number) {
        if (confirm('Are you sure you want to remove this vehicle?')) {
            this.customerService.deleteVehicle(id).subscribe({
                next: () => {
                    this.notificationService.showSuccess('Vehicle removed successfully!');
                    this.loadVehicles();
                }
            });
        }
    }
}
