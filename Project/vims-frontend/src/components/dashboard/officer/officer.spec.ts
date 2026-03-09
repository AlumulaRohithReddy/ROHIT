import { ComponentFixture, TestBed } from '@angular/core/testing';
import { OfficerDashboardComponent } from './officer';
import { AuthService } from '../../../app/core/services/auth';
import { ThemeService } from '../../../app/core/services/theme.service';
import { of } from 'rxjs';
import { provideRouter } from '@angular/router';
import { signal } from '@angular/core';

describe('OfficerDashboardComponent', () => {
  let component: OfficerDashboardComponent;
  let fixture: ComponentFixture<OfficerDashboardComponent>;
  let authServiceSpy: jasmine.SpyObj<AuthService>;
  let themeServiceSpy: jasmine.SpyObj<ThemeService>;

  beforeEach(async () => {
    authServiceSpy = jasmine.createSpyObj('AuthService', ['logout']);
    themeServiceSpy = jasmine.createSpyObj('ThemeService', ['toggleTheme']);
    (themeServiceSpy as any).theme = signal('light');

    await TestBed.configureTestingModule({
      imports: [OfficerDashboardComponent],
      providers: [
        provideRouter([]),
        { provide: AuthService, useValue: authServiceSpy },
        { provide: ThemeService, useValue: themeServiceSpy }
      ]
    })
      .compileComponents();

    fixture = TestBed.createComponent(OfficerDashboardComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
