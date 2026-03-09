import { TestBed } from '@angular/core/testing';
import { HttpInterceptorFn, HttpRequest, HttpHandlerFn, HttpErrorResponse } from '@angular/common/http';
import { errorInterceptor } from './error-interceptor';
import { NotificationService } from '../services/notification-service';
import { of, throwError } from 'rxjs';

describe('errorInterceptor', () => {
    let notificationServiceSpy: jasmine.SpyObj<NotificationService>;
    const interceptor: HttpInterceptorFn = (req, next) =>
        TestBed.runInInjectionContext(() => errorInterceptor(req, next));

    beforeEach(() => {
        notificationServiceSpy = jasmine.createSpyObj('NotificationService', ['showError']);

        TestBed.configureTestingModule({
            providers: [
                { provide: NotificationService, useValue: notificationServiceSpy }
            ]
        });
    });

    it('should be created', () => {
        expect(interceptor).toBeTruthy();
    });

    it('should handle 401 error and show specialized message', (done) => {
        const req = new HttpRequest('GET', '/test');
        const errorResponse = new HttpErrorResponse({
            status: 401,
            statusText: 'Unauthorized'
        });

        const next: HttpHandlerFn = () => throwError(() => errorResponse);

        interceptor(req, next).subscribe({
            error: (err) => {
                expect(notificationServiceSpy.showError).toHaveBeenCalledWith('Session expired or unauthorized access. Please login again.');
                expect(err).toBe(errorResponse);
                done();
            }
        });
    });

    it('should handle server-side error with message', (done) => {
        const req = new HttpRequest('GET', '/test');
        const errorResponse = new HttpErrorResponse({
            error: { Message: 'Custom Server Error' },
            status: 500
        });

        const next: HttpHandlerFn = () => throwError(() => errorResponse);

        interceptor(req, next).subscribe({
            error: (err) => {
                expect(notificationServiceSpy.showError).toHaveBeenCalledWith('Custom Server Error');
                done();
            }
        });
    });

    it('should handle string error response', (done) => {
        const req = new HttpRequest('GET', '/test');
        const errorResponse = new HttpErrorResponse({
            error: 'Plain string error',
            status: 400
        });

        const next: HttpHandlerFn = () => throwError(() => errorResponse);

        interceptor(req, next).subscribe({
            error: (err) => {
                expect(notificationServiceSpy.showError).toHaveBeenCalledWith('Plain string error');
                done();
            }
        });
    });

    it('should handle client-side error', (done) => {
        const req = new HttpRequest('GET', '/test');
        const errorEvent = new ErrorEvent('Client Error', { message: 'Client-side error occurred' });
        const errorResponse = new HttpErrorResponse({
            error: errorEvent,
            status: 0
        });

        const next: HttpHandlerFn = () => throwError(() => errorResponse);

        interceptor(req, next).subscribe({
            error: (err) => {
                expect(notificationServiceSpy.showError).toHaveBeenCalledWith('Client-side error occurred');
                done();
            }
        });
    });
});
