// features/auth/login.component.ts

import { Component, inject } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { AuthService } from '../../../app/core/services/auth';
import { Router, RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { NotificationService } from '../../../app/core/services/notification-service';

@Component({
  standalone: true,
  selector: 'app-login',
  imports: [CommonModule, FormsModule, RouterModule],
  templateUrl: './login.html'
})
export class LoginComponent {

  email = '';
  password = '';
  showPassword = false;

  captcha = '';
  generatedCaptcha = '';
  private notificationService = inject(NotificationService);

  constructor(private auth: AuthService, private router: Router) {
    this.generateCaptcha();
  }
  generateCaptcha() {
    this.generatedCaptcha = Math.random().toString(36).substring(2, 7);
  }

  login() {

    if (this.captcha !== this.generatedCaptcha) {
      this.notificationService.showError('Invalid captcha');
      this.generateCaptcha();
      return;
    }

    this.auth.login({
      email: this.email,
      password: this.password
    }).subscribe({
      next: (res: any) => {

        this.auth.saveAuth(res.Data.Token, res.Data.Role);
        this.notificationService.showSuccess('Login successful');

        // Role-based redirect
        if (res.Data.Role === 'Admin') this.router.navigate(['/admin']);
        else if (res.Data.Role === 'Customer') this.router.navigate(['/customer']);
        else if (res.Data.Role === 'Agent') this.router.navigate(['/agent']);
        else if (res.Data.Role === 'ClaimsOfficer') this.router.navigate(['/officer']);
        else this.router.navigate(['/officer']);
      },
      error: () => {
        // Redundant alert removed, global interceptor shows backend error
      }
    });

  }
  redirecttoregister() {
    this.router.navigate(['/register']);
  }
}
