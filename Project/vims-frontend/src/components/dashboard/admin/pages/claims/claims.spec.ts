import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ClaimsAssignmentComponent } from './claims';
import { AdminService } from '../../../../../app/core/services/admin-service';
import { NotificationService } from '../../../../../app/core/services/notification-service';
import { of } from 'rxjs';
import { FormsModule } from '@angular/forms';

describe('ClaimsAssignmentComponent', () => {
    let component: ClaimsAssignmentComponent;
    let fixture: ComponentFixture<ClaimsAssignmentComponent>;
    let adminServiceSpy: jasmine.SpyObj<AdminService>;
    let notificationServiceSpy: jasmine.SpyObj<NotificationService>;

    const mockClaims = [
        { ClaimId: 1, ClaimNumber: 'CLM001', Status: 'Submitted', ClaimedAmount: 1000, CustomerName: 'John Doe' },
        { ClaimId: 2, ClaimNumber: 'CLM002', Status: 'Approved', ClaimedAmount: 2000, CustomerName: 'Jane Doe' }
    ];

    const mockUsers = [
        { UserId: 3, FullName: 'Officer 1', Email: 'o1@test.com', Role: 'Officer' }
    ];

    beforeEach(async () => {
        adminServiceSpy = jasmine.createSpyObj('AdminService', ['getAllClaims', 'getUsers', 'assignClaim']);
        notificationServiceSpy = jasmine.createSpyObj('NotificationService', ['showSuccess']);

        adminServiceSpy.getAllClaims.and.returnValue(of(mockClaims));
        adminServiceSpy.getUsers.and.returnValue(of(mockUsers));

        await TestBed.configureTestingModule({
            imports: [ClaimsAssignmentComponent, FormsModule],
            providers: [
                { provide: AdminService, useValue: adminServiceSpy },
                { provide: NotificationService, useValue: notificationServiceSpy }
            ]
        }).compileComponents();

        fixture = TestBed.createComponent(ClaimsAssignmentComponent);
        component = fixture.componentInstance;
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });

    it('should load claims and officers on init', () => {
        fixture.detectChanges();
        expect(adminServiceSpy.getAllClaims).toHaveBeenCalled();
        expect(adminServiceSpy.getUsers).toHaveBeenCalled();
        expect(component.allClaims.length).toBe(2);
        expect(component.claimsOfficers.length).toBe(1);
    });

    it('should filter claims by search term', () => {
        fixture.detectChanges();
        component.searchTerm = 'John';
        component.applyFilters();
        expect(component.filteredClaims.length).toBe(1);
        expect(component.filteredClaims[0].CustomerName).toBe('John Doe');
    });

    it('should assign an officer to a claim', () => {
        adminServiceSpy.assignClaim.and.returnValue(of({}));
        fixture.detectChanges();

        component.onAssignOfficer(1, { target: { value: '3' } });

        expect(adminServiceSpy.assignClaim).toHaveBeenCalledWith(1, 3);
        expect(notificationServiceSpy.showSuccess).toHaveBeenCalledWith('Officer assigned successfully');
    });
});
