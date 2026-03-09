import { Component, OnInit, ChangeDetectorRef, inject } from '@angular/core';
import { CommonModule, DecimalPipe } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { AgentService, Policy } from '../../../../../app/core/services/agent-service';
import { NotificationService } from '../../../../../app/core/services/notification-service';

@Component({
  selector: 'app-agent-policies',
  standalone: true,
  imports: [CommonModule, DecimalPipe, FormsModule],
  template: `
    <div class="space-y-6 animate-in fade-in duration-500">
      <div class="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div class="space-y-0.5">
          <h2 class="text-2xl font-bold text-slate-800 dark:text-white tracking-tight">Policy Management</h2>
          <p class="text-sm text-slate-500 dark:text-slate-400 font-medium">Review and manage assigned customer policies.</p>
        </div>
        <div class="flex items-center space-x-3">
          <div class="relative group">
            <span class="material-icons absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 text-base">search</span>
            <input type="text" [(ngModel)]="searchTerm" placeholder="Search number or customer..." 
              class="w-64 pl-10 pr-3 py-2 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-md text-sm outline-none focus:border-orange-300 transition-colors">
          </div>
          <div class="relative group">
            <select [(ngModel)]="statusFilter" 
              class="px-3 py-2 pr-10 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-md text-sm font-bold outline-none cursor-pointer focus:border-orange-300 transition-colors appearance-none">
              <option value="All">All Statuses</option>
              <option value="PendingApproval">Pending Approval</option>
              <option value="Approved">Approved</option>
              <option value="Rejected">Rejected</option>
            </select>
            <span class="material-icons absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-400 text-base pointer-events-none group-focus-within:text-orange-400">expand_more</span>
          </div>
        </div>
      </div>

      <div class="bg-white dark:bg-slate-800 rounded-md border border-slate-100 dark:border-slate-700 overflow-hidden shadow-sm animate-in fade-in duration-700">
        <div class="overflow-x-auto">
          <table class="w-full text-left">
            <thead>
              <tr class="bg-slate-50/50 dark:bg-slate-900/40 border-b border-slate-100 dark:border-slate-700">
                <th class="px-6 py-4 text-xs font-bold text-slate-400 uppercase tracking-wider">Policy Name</th>
                <th class="px-6 py-4 text-xs font-bold text-slate-400 uppercase tracking-wider">Customer</th>
                <th class="px-6 py-4 text-xs font-bold text-slate-400 uppercase tracking-wider">Plan & Vehicle</th>
                <th class="px-6 py-4 text-xs font-bold text-slate-400 uppercase tracking-wider">Premium</th>
                <th class="px-6 py-4 text-xs font-bold text-slate-400 uppercase tracking-wider text-center">Status</th>
                <th class="px-6 py-4 text-xs font-bold text-slate-400 uppercase tracking-wider text-right">Actions</th>
              </tr>
            </thead>
            <tbody class="divide-y divide-slate-50 dark:divide-slate-700/50">
              <tr *ngFor="let p of filteredPolicies" class="hover:bg-orange-50/20 dark:hover:bg-slate-900/50 transition-colors group">
                <td class="px-6 py-3.5 font-bold text-slate-700 dark:text-slate-200 text-sm tracking-tight group-hover:text-orange-500 transition-colors">{{p.PolicyNumber}}</td>
                <td class="px-6 py-3.5">
                  <div class="font-semibold text-slate-700 dark:text-slate-200 text-sm italic">{{p.CustomerName}}</div>
                </td>
                <td class="px-6 py-3.5">
                  <div class="flex flex-col">
                    <span class="text-sm font-bold text-slate-800 dark:text-slate-200 transition-colors">{{p.PlanName}}</span>
                    <span class="text-[10px] text-slate-400 font-bold uppercase tracking-wider mt-0.5">{{p.VehicleModel}} • {{p.VehicleNumber}}</span>
                  </div>
                </td>
                <td class="px-6 py-3.5 font-bold text-slate-900 dark:text-slate-100 text-sm tracking-tight">
                  <span class="font-medium mr-1 opacity-50">₹</span>{{p.PremiumAmount | number}}
                </td>
                <td class="px-6 py-3.5 text-center">
                  <span [class]="'px-2.5 py-1 rounded text-[10px] font-bold uppercase tracking-wide inline-flex items-center gap-1.5 border ' + 
                    (p.Status === 'Approved' ? 'bg-green-50 dark:bg-green-900/20 text-green-600 border-green-100 dark:border-green-900/30' : 
                     p.Status === 'PendingApproval' ? 'bg-orange-50 dark:bg-orange-900/20 text-orange-600 border-orange-100 dark:border-orange-900/30' : 
                     'bg-red-50 dark:bg-red-900/20 text-red-600 border-red-100 dark:border-red-900/30')">
                    <span [class]="'w-1.5 h-1.5 rounded-full ' + (p.Status === 'Approved' ? 'bg-green-500' : p.Status === 'PendingApproval' ? 'bg-orange-500' : 'bg-red-500')"></span>
                    {{p.Status}}
                  </span>
                </td>
                <td class="px-6 py-3.5 text-right">
                  <div *ngIf="p.Status === 'PendingApproval'" class="flex justify-end space-x-2">
                    <button (click)="approvePolicy(p.PolicyId)" 
                      class="bg-[#f3af3d] hover:bg-[#e67e22] text-white px-3 py-1.5 rounded-md text-[11px] font-bold uppercase tracking-wide shadow-sm active:scale-95 transition-all outline-none">
                      Approve
                    </button>
                    <button (click)="rejectPolicy(p.PolicyId)" 
                      class="bg-rose-50 dark:bg-rose-900/20 text-rose-600 px-3 py-1.5 rounded-md text-[11px] font-bold uppercase tracking-wide hover:bg-rose-100 transition-all active:scale-95 outline-none">
                      Reject
                    </button>
                  </div>
                  <div *ngIf="p.Status !== 'PendingApproval'" class="text-[10px] text-slate-300 dark:text-slate-600 font-bold uppercase italic tracking-widest">
                    Archived
                  </div>
                </td>
              </tr>
              <tr *ngIf="filteredPolicies.length === 0">
                <td colspan="6" class="px-6 py-12 text-center text-slate-400 text-sm font-bold italic">No records found matching your query.</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>
  `
})
export class AgentPoliciesComponent implements OnInit {
  policies: Policy[] = [];
  searchTerm = '';
  statusFilter = 'All';
  private notificationService = inject(NotificationService);

  constructor(
    private agentService: AgentService,
    private cdr: ChangeDetectorRef
  ) { }

  ngOnInit() {
    this.loadData();
  }

  loadData() {
    this.agentService.getAssignedPolicies().subscribe({
      next: (data) => {
        this.policies = data;
        this.cdr.detectChanges();
      },
      error: (err) => {
        // Handled by global interceptor
      }
    });
  }

  get filteredPolicies() {
    return this.policies.filter(p => {
      const matchesSearch = p.PolicyNumber.toLowerCase().includes(this.searchTerm.toLowerCase()) ||
        p.CustomerName.toLowerCase().includes(this.searchTerm.toLowerCase());
      const matchesStatus = this.statusFilter === 'All' || p.Status === this.statusFilter;
      return matchesSearch && matchesStatus;
    });
  }

  approvePolicy(id: number) {
    const policy = this.policies.find(p => p.PolicyId === id);
    const newPremium = prompt('Enter premium amount to approve (leave as is to keep current):', policy?.PremiumAmount?.toString());

    if (newPremium !== null) {
      const premiumValue = parseFloat(newPremium);
      if (isNaN(premiumValue)) {
        this.notificationService.showError('Invalid premium amount');
        return;
      }

      this.agentService.approvePolicy(id, premiumValue).subscribe({
        next: () => {
          this.notificationService.showSuccess('Policy approved!');
          this.loadData();
        },
        error: (err) => {
          // Handled by global interceptor
        }
      });
    }
  }

  rejectPolicy(id: number) {
    if (confirm('Are you sure you want to reject this policy?')) {
      this.agentService.rejectPolicy(id).subscribe({
        next: () => {
          this.notificationService.showSuccess('Policy rejected!');
          this.loadData();
        },
        error: (err) => {
          // Handled by global interceptor
        }
      });
    }
  }
}
