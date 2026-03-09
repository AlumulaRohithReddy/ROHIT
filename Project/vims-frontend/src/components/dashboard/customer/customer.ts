import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Router, NavigationEnd } from '@angular/router';
import { AuthService } from '../../../app/core/services/auth';
import { ThemeService } from '../../../app/core/services/theme.service';
import { filter } from 'rxjs/operators';

@Component({
  selector: 'app-customer-dashboard',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './customer.html',
  styleUrls: ['./customer.css']
})
export class CustomerDashboardComponent {
  isSidebarOpen = true;
  currentTitle = 'Overview';
  userName = 'Customer';

  navItems = [
    { label: 'Overview', icon: 'grid_view', route: '/customer/overview' },
    { label: 'Vehicles', icon: 'directions_car', route: '/customer/vehicles' },
    { label: 'Policies', icon: 'description', route: '/customer/policies' },
    { label: 'Claims', icon: 'security', route: '/customer/claims' },
    { label: 'Payments', icon: 'payments', route: '/customer/payments' },
  ];

  constructor(
    private auth: AuthService,
    private router: Router,
    public themeService: ThemeService
  ) {
    // Fetch real profile data instead of using local storage
    this.auth.getProfile().subscribe({
      next: (user) => {
        this.userName = user.FullName || 'Customer';
      },
      error: () => {
        this.userName = 'Customer';
      }
    });

    // Update title based on active route
    this.router.events.pipe(
      filter(event => event instanceof NavigationEnd)
    ).subscribe(() => {
      this.updateTitle();
    });
    this.updateTitle();
  }

  updateTitle() {
    const activeItem = this.navItems.find(item => this.router.url === item.route);
    this.currentTitle = activeItem ? activeItem.label : 'Dashboard';
  }

  toggleSidebar() {
    this.isSidebarOpen = !this.isSidebarOpen;
  }

  logout() {
    this.auth.logout();
    this.router.navigate(['/login']);
  }
}
