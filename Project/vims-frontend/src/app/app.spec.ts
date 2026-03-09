import { TestBed } from '@angular/core/testing';
import { App } from './app';
import { ThemeService } from './core/services/theme.service';
import { signal } from '@angular/core';
import { provideRouter } from '@angular/router';

describe('App', () => {
  let themeServiceSpy: jasmine.SpyObj<ThemeService>;

  beforeEach(async () => {
    themeServiceSpy = jasmine.createSpyObj('ThemeService', ['toggleTheme']);
    (themeServiceSpy as any).theme = signal('light');

    await TestBed.configureTestingModule({
      imports: [App],
      providers: [
        provideRouter([]),
        { provide: ThemeService, useValue: themeServiceSpy }
      ]
    }).compileComponents();
  });

  it('should create the app', () => {
    const fixture = TestBed.createComponent(App);
    const app = fixture.componentInstance;
    expect(app).toBeTruthy();
  });
});
