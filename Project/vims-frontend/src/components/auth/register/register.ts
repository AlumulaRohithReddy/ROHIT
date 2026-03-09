// features/auth/register.component.ts

import { Component, inject } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { AuthService } from '../../../app/core/services/auth';
import { Router, RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { NotificationService } from '../../../app/core/services/notification-service';

@Component({
  standalone: true,
  selector: 'app-register',
  imports: [CommonModule, FormsModule, RouterModule],
  templateUrl: './register.html'
})
export class RegisterComponent {

  fullName = '';
  email = '';
  password = '';
  showPassword = false;
  role: 'Admin' | 'Customer' | 'Agent' | 'ClaimsOfficer' = 'Customer';
  securityQuestion = '';
  securityAnswer = '';
  private notificationService = inject(NotificationService);

  constructor(private auth: AuthService, private router: Router) { }

  register() {
    this.auth.register({
      fullName: this.fullName,
      email: this.email,
      password: this.password,
      role: this.role,
      securityQuestion: this.securityQuestion,
      securityAnswer: this.securityAnswer
    }).subscribe({
      next: () => {
        this.notificationService.showSuccess('Registered successfully');
        this.router.navigate(['/login']);
      },
      error: () => {
        // Redundant alert removed, global interceptor handles this
      }
    });
  }
  redirecttologin() {
    this.router.navigate(['/login']);
  }
}
