import { ComponentFixture, TestBed, fakeAsync, tick } from '@angular/core/testing';
import { AdminOverviewComponent } from './overview';
import { AdminService } from '../../../../../app/core/services/admin-service';
import { of } from 'rxjs';
import { ChangeDetectorRef } from '@angular/core';

describe('AdminOverviewComponent', () => {
    let component: AdminOverviewComponent;
    let fixture: ComponentFixture<AdminOverviewComponent>;
    let adminServiceSpy: jasmine.SpyObj<AdminService>;

    const mockUsers = [
        { UserId: 1, FullName: 'User 1', Email: 'u1@test.com', Role: 'Manager' },
        { UserId: 2, FullName: 'User 2', Email: 'u2@test.com', Role: 'Customer' }
    ];

    const mockStats = {
        TotalUsers: 10,
        TotalActivePolicies: 5,
        TotalPendingClaims: 2,
        TotalRevenue: 100000,
        MonthlyRevenue: [
            { Month: 'Jan', Amount: 50000 },
            { Month: 'Feb', Amount: 50000 }
        ],
        PolicyStatusDistribution: [],
        ClaimStatusDistribution: []
    };

    beforeEach(async () => {
        adminServiceSpy = jasmine.createSpyObj('AdminService', ['getUsers', 'getDashboardStats']);
        adminServiceSpy.getUsers.and.returnValue(of(mockUsers));
        adminServiceSpy.getDashboardStats.and.returnValue(of(mockStats));

        await TestBed.configureTestingModule({
            imports: [AdminOverviewComponent],
            providers: [
                { provide: AdminService, useValue: adminServiceSpy },
                ChangeDetectorRef
            ]
        }).compileComponents();

        fixture = TestBed.createComponent(AdminOverviewComponent);
        component = fixture.componentInstance;
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });

    it('should load dashboard data on init', fakeAsync(() => {
        fixture.detectChanges(); // ngOnInit
        tick();

        expect(adminServiceSpy.getUsers).toHaveBeenCalled();
        expect(adminServiceSpy.getDashboardStats).toHaveBeenCalled();
        expect(component.recentUsers.length).toBe(2);
        expect(component.stats.length).toBe(4);
        expect(component.stats[0].value).toBe('10');
    }));

    it('should create chart after data load', fakeAsync(() => {
        fixture.detectChanges();
        tick();

        // The component uses setTimeout to create chart
        tick();

        expect(component.revenueChart).toBeDefined();
    }));
});
