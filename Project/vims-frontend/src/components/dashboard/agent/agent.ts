import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Router } from '@angular/router';
import { AuthService } from '../../../app/core/services/auth';
import { AgentService, Policy } from '../../../app/core/services/agent-service';
import { ThemeService } from '../../../app/core/services/theme.service';
import { ChangeDetectorRef } from '@angular/core';
import { CurrencyPipe } from '@angular/common';

@Component({
  selector: 'app-agent-dashboard',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './agent.html',
  styleUrls: ['./agent.css']
})
export class AgentDashboardComponent {
  isSidebarOpen = true;
  userName = 'Agent';
  navItems = [
    { label: 'Overview', icon: 'grid_view', route: '/agent/overview' },
    { label: 'Policies', icon: 'description', route: '/agent/policies' },
    { label: 'Customers', icon: 'group', route: '/agent/customers' },
  ];

  constructor(
    private auth: AuthService,
    private router: Router,
    public themeService: ThemeService
  ) {
    this.auth.getProfile().subscribe({
      next: (user) => {
        this.userName = user.FullName || 'Agent';
      },
      error: () => {
        this.userName = 'Agent';
      }
    });
  }

  toggleSidebar() {
    this.isSidebarOpen = !this.isSidebarOpen;
  }

  logout() {
    this.auth.logout();
    this.router.navigate(['/login']);
  }
}
