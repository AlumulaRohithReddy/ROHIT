import { ComponentFixture, TestBed } from '@angular/core/testing';
import { UserManagementComponent } from './users';
import { AdminService } from '../../../../../app/core/services/admin-service';
import { NotificationService } from '../../../../../app/core/services/notification-service';
import { of } from 'rxjs';
import { FormsModule } from '@angular/forms';

describe('UserManagementComponent', () => {
    let component: UserManagementComponent;
    let fixture: ComponentFixture<UserManagementComponent>;
    let adminServiceSpy: jasmine.SpyObj<AdminService>;
    let notificationServiceSpy: jasmine.SpyObj<NotificationService>;

    const mockUsers = [
        { UserId: 1, FullName: 'Agent User', Email: 'agent@test.com', Role: 'InsuranceAgent' },
        { UserId: 2, FullName: 'Customer User', Email: 'customer@test.com', Role: 'Customer' }
    ];

    beforeEach(async () => {
        adminServiceSpy = jasmine.createSpyObj('AdminService', ['getUsers', 'registerUser', 'adminResetPassword']);
        notificationServiceSpy = jasmine.createSpyObj('NotificationService', ['showSuccess']);

        adminServiceSpy.getUsers.and.returnValue(of(mockUsers));

        await TestBed.configureTestingModule({
            imports: [UserManagementComponent, FormsModule],
            providers: [
                { provide: AdminService, useValue: adminServiceSpy },
                { provide: NotificationService, useValue: notificationServiceSpy }
            ]
        }).compileComponents();

        fixture = TestBed.createComponent(UserManagementComponent);
        component = fixture.componentInstance;
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });

    it('should load users on init', () => {
        fixture.detectChanges();
        expect(adminServiceSpy.getUsers).toHaveBeenCalled();
        // Admin role is filtered out in calculateStats
        expect(component.allUsers.length).toBe(2);
    });

    it('should create a user', () => {
        adminServiceSpy.registerUser.and.returnValue(of({}));
        fixture.detectChanges();

        component.newUser = { FullName: 'New User', Email: 'new@test.com', Password: 'password', Role: 'Customer' };
        component.onCreateUser();

        expect(adminServiceSpy.registerUser).toHaveBeenCalled();
        expect(notificationServiceSpy.showSuccess).toHaveBeenCalledWith('User created successfully!');
    });

    it('should reset password', () => {
        adminServiceSpy.adminResetPassword.and.returnValue(of({}));
        spyOn(window, 'confirm').and.returnValue(true);
        fixture.detectChanges();

        component.onResetPassword(1);

        expect(adminServiceSpy.adminResetPassword).toHaveBeenCalledWith(1, 'Shield@123');
        expect(notificationServiceSpy.showSuccess).toHaveBeenCalledWith('Password has been reset to "Shield@123"');
    });
});
