import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Router } from '@angular/router';
import { AuthService } from '../../../app/core/services/auth';
import { ThemeService } from '../../../app/core/services/theme.service';

@Component({
  selector: 'app-officer-dashboard',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './officer.html',
  styleUrls: ['./officer.css']
})
export class OfficerDashboardComponent {
  isSidebarOpen = true;

  constructor(
    private auth: AuthService,
    private router: Router,
    public themeService: ThemeService
  ) { }

  toggleSidebar() {
    this.isSidebarOpen = !this.isSidebarOpen;
  }

  logout() {
    this.auth.logout();
    this.router.navigate(['/login']);
  }

  navItems = [
    { label: 'Overview', icon: 'grid_view', route: '/officer/overview' },
    { label: 'Assigned Claims', icon: 'security', route: '/officer/claims' },
  ];
}
