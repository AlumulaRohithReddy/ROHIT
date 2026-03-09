import { HttpInterceptorFn, HttpErrorResponse } from '@angular/common/http';
import { catchError, throwError } from 'rxjs';
import { inject } from '@angular/core';
import { Router } from '@angular/router';
import { NotificationService } from '../services/notification-service';

// Errors that should redirect to a full error page
const REDIRECT_CODES = new Set([403, 404, 500, 503]);

export const errorInterceptor: HttpInterceptorFn = (req, next) => {
    const notificationService = inject(NotificationService);
    const router = inject(Router);

    return next(req).pipe(
        catchError((error: HttpErrorResponse) => {
            let errorMessage = 'An unexpected error occurred';

            if (error.error instanceof ErrorEvent) {
                errorMessage = error.error.message;
            } else {
                if (error.status === 401) {
                    errorMessage = 'Session expired or unauthorized access. Please login again.';
                } else if (error.error && error.error.Message) {
                    errorMessage = error.error.Message;
                } else if (error.error && error.error.message) {
                    errorMessage = error.error.message;
                } else if (error.error && error.error.errors) {
                    const firstKey = Object.keys(error.error.errors)[0];
                    errorMessage = error.error.errors[firstKey][0];
                } else if (typeof error.error === 'string') {
                    errorMessage = error.error;
                } else {
                    errorMessage = `Error Code: ${error.status} - ${error.statusText || 'Unknown Error'}`;
                }
            }

            // Special handling for Blob errors (like invoice download)
            if (error.error instanceof Blob) {
                // Leave specialized blob error handling to components
            } else if (REDIRECT_CODES.has(error.status)) {
                // Redirect to error page for serious errors
                router.navigate(['/error'], {
                    queryParams: {
                        code: error.status,
                        message: errorMessage
                    }
                });
            } else {
                // Show toast for validation/auth errors
                notificationService.showError(errorMessage);
            }

            return throwError(() => error);
        })
    );
};
