import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ForgotPasswordComponent } from './forgot-password';
import { AuthService } from '../../../app/core/services/auth';
import { Router, RouterModule } from '@angular/router';
import { NotificationService } from '../../../app/core/services/notification-service';
import { of } from 'rxjs';
import { FormsModule } from '@angular/forms';
import { provideRouter } from '@angular/router';
import { ThemeService } from '../../../app/core/services/theme.service';
import { signal } from '@angular/core';

describe('ForgotPasswordComponent', () => {
  let component: ForgotPasswordComponent;
  let fixture: ComponentFixture<ForgotPasswordComponent>;
  let authServiceSpy: jasmine.SpyObj<AuthService>;
  let notificationServiceSpy: jasmine.SpyObj<NotificationService>;
  let routerSpy: jasmine.SpyObj<Router>;

  beforeEach(async () => {
    authServiceSpy = jasmine.createSpyObj('AuthService', ['forgotPassword', 'resetPassword']);
    notificationServiceSpy = jasmine.createSpyObj('NotificationService', ['showSuccess', 'showError', 'showInfo']);
    const themeServiceSpy = jasmine.createSpyObj('ThemeService', ['toggleTheme']);
    (themeServiceSpy as any).theme = signal('light');

    await TestBed.configureTestingModule({
      imports: [ForgotPasswordComponent, FormsModule],
      providers: [
        provideRouter([]),
        { provide: AuthService, useValue: authServiceSpy },
        { provide: NotificationService, useValue: notificationServiceSpy },
        { provide: ThemeService, useValue: themeServiceSpy }
      ]
    })
      .compileComponents();

    fixture = TestBed.createComponent(ForgotPasswordComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
