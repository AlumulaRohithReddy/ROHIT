// core/guards/role.guard.ts

import { inject } from '@angular/core';
import { Router } from '@angular/router';
import { CanActivateFn } from '@angular/router';
import { AuthService } from '../services/auth';

function dashboardFor(role: string | null): string {
  const map: Record<string, string> = {
    Admin: '/admin',
    Customer: '/customer',
    Agent: '/agent',
    ClaimsOfficer: '/officer',
    Officer: '/officer'
  };
  return map[role ?? ''] ?? '/';
}

export const roleGuard: CanActivateFn = (route) => {

  const authService = inject(AuthService);
  const router = inject(Router);

  const userRole = authService.getRole();
  const expectedRoles = route.data['role'];
  const isLoggedIn = authService.isLoggedIn();

  if (!isLoggedIn) {
    // Not authenticated at all — go to login
    router.navigate(['/login']);
    return false;
  }

  if (!expectedRoles.includes(userRole)) {
    // Logged in but wrong role — show 403 error page with safe returnUrl
    router.navigate(['/error'], {
      queryParams: {
        code: 403,
        message: `Your account role (${userRole}) does not have permission to access this section.`,
        returnUrl: dashboardFor(userRole)
      }
    });
    return false;
  }

  return true;
};
