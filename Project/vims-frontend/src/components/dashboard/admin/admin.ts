import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Router, NavigationEnd } from '@angular/router';
import { AuthService } from '../../../app/core/services/auth';
import { ThemeService } from '../../../app/core/services/theme.service';
import { filter } from 'rxjs/operators';

@Component({
  selector: 'app-admin-dashboard',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './admin.html',
  styleUrls: ['./admin.css']
})
export class AdminDashboardComponent {
  isSidebarOpen = true;
  currentTitle = 'Overview';
  userName = 'Admin';

  navItems = [
    { label: 'Overview', icon: 'grid_view', route: '/admin/overview' },
    { label: 'User Management', icon: 'group', route: '/admin/users' },
    { label: 'Policy Plans', icon: 'description', route: '/admin/plans' },
    { label: 'Claims Assignment', icon: 'security', route: '/admin/claims' },
    { label: 'Analytics', icon: 'insights', route: '/admin/analytics' },
  ];

  constructor(
    private auth: AuthService,
    private router: Router,
    public themeService: ThemeService
  ) {
    this.auth.getProfile().subscribe({
      next: (user) => {
        this.userName = user.FullName || 'Admin';
      },
      error: () => {
        this.userName = 'Admin';
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
