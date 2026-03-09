import { TestBed } from '@angular/core/testing';
import { ThemeService } from './theme.service';

describe('ThemeService', () => {
    let service: ThemeService;

    beforeEach(() => {
        (window as any).isTestEnvironment = false;
        localStorage.clear();
        TestBed.configureTestingModule({
            providers: [ThemeService]
        });
        service = TestBed.inject(ThemeService);
    });

    afterEach(() => {
        (window as any).isTestEnvironment = true;
    });

    it('should be created', () => {
        expect(service).toBeTruthy();
    });

    it('should initial theme from localStorage', () => {
        localStorage.setItem('vims-theme', 'dark');
        // Need to recreate service to read from localStorage
        const newService = TestBed.runInInjectionContext(() => new ThemeService());
        expect(newService.theme()).toBe('dark');
    });

    it('should toggle theme', () => {
        const initialTheme = service.theme();
        service.toggleTheme();
        const newTheme = service.theme();
        expect(newTheme).not.toBe(initialTheme);

        service.toggleTheme();
        expect(service.theme()).toBe(initialTheme);
    });

    it('should update localStorage when theme changes', (done) => {
        service.theme.set('dark');
        // effect runs asynchronously
        setTimeout(() => {
            expect(localStorage.getItem('vims-theme')).toBe('dark');
            done();
        }, 100);
    });
});
