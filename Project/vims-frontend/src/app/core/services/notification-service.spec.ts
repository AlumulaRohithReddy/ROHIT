import { TestBed } from '@angular/core/testing';
import { MatSnackBar } from '@angular/material/snack-bar';
import { NotificationService } from './notification-service';

describe('NotificationService', () => {
    let service: NotificationService;
    let snackBarSpy: jasmine.SpyObj<MatSnackBar>;

    beforeEach(() => {
        snackBarSpy = jasmine.createSpyObj('MatSnackBar', ['open']);

        TestBed.configureTestingModule({
            providers: [
                NotificationService,
                { provide: MatSnackBar, useValue: snackBarSpy }
            ]
        });
        service = TestBed.inject(NotificationService);
    });

    it('should be created', () => {
        expect(service).toBeTruthy();
    });

    it('should show success message', () => {
        service.showSuccess('Test Success');
        expect(snackBarSpy.open).toHaveBeenCalledWith('Test Success', 'Close', jasmine.objectContaining({
            panelClass: ['success-snackbar']
        }));
    });

    it('should show error message', () => {
        service.showError('Test Error');
        expect(snackBarSpy.open).toHaveBeenCalledWith('Test Error', 'Close', jasmine.objectContaining({
            panelClass: ['error-snackbar']
        }));
    });

    it('should show info message', () => {
        service.showInfo('Test Info');
        expect(snackBarSpy.open).toHaveBeenCalledWith('Test Info', 'Close', jasmine.objectContaining({
            duration: 3000
        }));
    });
});
