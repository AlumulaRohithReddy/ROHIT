import { ComponentFixture, TestBed } from '@angular/core/testing';
import { AdminSettingsComponent } from './settings';
import { AdminService } from '../../../../../app/core/services/admin-service';
import { NotificationService } from '../../../../../app/core/services/notification-service';
import { of, throwError } from 'rxjs';
import { FormsModule } from '@angular/forms';

describe('AdminSettingsComponent', () => {
    let component: AdminSettingsComponent;
    let fixture: ComponentFixture<AdminSettingsComponent>;
    let adminServiceSpy: jasmine.SpyObj<AdminService>;
    let notificationServiceSpy: jasmine.SpyObj<NotificationService>;

    const mockSettings = [
        { SettingKey: 'App.Name', SettingValue: 'VIMS', Description: 'App Name', Group: 'General' }
    ];

    beforeEach(async () => {
        adminServiceSpy = jasmine.createSpyObj('AdminService', ['getSettings', 'updateSettings']);
        notificationServiceSpy = jasmine.createSpyObj('NotificationService', ['showSuccess', 'showError']);

        adminServiceSpy.getSettings.and.returnValue(of(mockSettings));

        await TestBed.configureTestingModule({
            imports: [AdminSettingsComponent, FormsModule],
            providers: [
                { provide: AdminService, useValue: adminServiceSpy },
                { provide: NotificationService, useValue: notificationServiceSpy }
            ]
        }).compileComponents();

        fixture = TestBed.createComponent(AdminSettingsComponent);
        component = fixture.componentInstance;
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });

    it('should load settings on init', () => {
        fixture.detectChanges(); // ngOnInit
        expect(adminServiceSpy.getSettings).toHaveBeenCalled();
        expect(component.settings).toEqual(mockSettings);
    });

    it('should save settings successfully', () => {
        adminServiceSpy.updateSettings.and.returnValue(of({}));
        component.settings = mockSettings;

        component.saveSettings();

        expect(adminServiceSpy.updateSettings).toHaveBeenCalledWith(mockSettings);
        expect(notificationServiceSpy.showSuccess).toHaveBeenCalledWith('Settings updated successfully!');
    });

    it('should handle error when saving settings', () => {
        adminServiceSpy.updateSettings.and.returnValue(throwError(() => new Error('Error')));

        component.saveSettings();

        expect(component.loading).toBeFalse();
    });
});
