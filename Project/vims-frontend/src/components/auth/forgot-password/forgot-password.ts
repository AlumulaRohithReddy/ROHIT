import { Component, ChangeDetectorRef, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { AuthService } from '../../../app/core/services/auth';
import { timeout, finalize } from 'rxjs/operators';
import { NotificationService } from '../../../app/core/services/notification-service';

@Component({
  selector: 'app-forgot-password',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule],
  templateUrl: './forgot-password.html'
})
export class ForgotPasswordComponent {
  step = 1;
  email = '';
  securityQuestion = '';
  securityAnswer = '';
  newPassword = '';
  confirmPassword = '';
  isLoading = false;
  errorMessage = '';
  private notificationService = inject(NotificationService);

  constructor(private authService: AuthService, private router: Router, private cdr: ChangeDetectorRef) { }

  onGetQuestion() {
    if (!this.email) return;
    this.isLoading = true;
    this.errorMessage = '';

    this.authService.forgotPassword(this.email).pipe(
      timeout(10000),
      finalize(() => this.isLoading = false)
    ).subscribe({
      next: (res) => {
        this.securityQuestion = res.Data;
        console.log('Received security question:', this.securityQuestion);
        this.step = 2;
        this.notificationService.showInfo('Email verified. Please answer your security question.');
        this.cdr.detectChanges();
      },
      error: (err) => {
        if (err.name === 'TimeoutError') {
          this.errorMessage = 'Request timed out. Please check if the server is running.';
        } else {
          this.errorMessage = err.error?.Message || 'User not found or security question not set.';
        }
        this.notificationService.showError(this.errorMessage);
        this.cdr.detectChanges();
      }
    });
  }

  onResetPassword() {
    if (this.newPassword !== this.confirmPassword) {
      this.errorMessage = 'Passwords do not match.';
      this.notificationService.showError(this.errorMessage);
      return;
    }

    this.isLoading = true;
    this.errorMessage = '';

    const data = {
      Email: this.email,
      SecurityAnswer: this.securityAnswer,
      NewPassword: this.newPassword
    };

    this.authService.resetPassword(data).pipe(
      timeout(10000),
      finalize(() => this.isLoading = false)
    ).subscribe({
      next: () => {
        this.notificationService.showSuccess('Password reset successfully! Redirecting to login.');
        this.router.navigate(['/login']);
      },
      error: (err) => {
        if (err.name === 'TimeoutError') {
          this.errorMessage = 'Request timed out. Please check if the server is running.';
        } else {
          this.errorMessage = err.error?.Message || 'Invalid answer or reset failed.';
        }
        this.notificationService.showError(this.errorMessage);
        this.cdr.detectChanges();
      }
    });
  }
}
