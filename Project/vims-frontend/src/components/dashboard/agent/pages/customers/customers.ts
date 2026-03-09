import { Component, OnInit, ChangeDetectorRef, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { AgentService, Policy } from '../../../../../app/core/services/agent-service';
import { NotificationService } from '../../../../../app/core/services/notification-service';

export interface CustomerSummary {
  Name: string;
  PolicyCount: number;
  ActivePolicies: number;
  TotalPremium: number;
  TotalIDV: number;
}

@Component({
  selector: 'app-agent-customers',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <div class="space-y-6 animate-in fade-in duration-500">
      <div class="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div class="space-y-0.5">
          <h2 class="text-2xl font-bold text-slate-800 dark:text-white tracking-tight">Customer Directory</h2>
          <p class="text-sm text-slate-500 dark:text-slate-400 font-medium">Browse and manage your customer portfolio.</p>
        </div>
        <div class="relative group">
          <span class="material-icons absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 text-base">search</span>
          <input type="text" [(ngModel)]="searchTerm" placeholder="Search customers..." 
            class="w-72 pl-10 pr-3 py-2 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-md text-sm outline-none focus:border-orange-300 transition-colors">
        </div>
      </div>

      <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        <div *ngFor="let c of filteredCustomers" class="bg-white dark:bg-slate-800 p-5 rounded-md border border-slate-100 dark:border-slate-700 hover:shadow-md transition-all duration-300 border-l-4 border-l-[#f3af3d] group">
          
          <div class="flex items-center space-x-4 mb-5">
            <div class="w-10 h-10 bg-orange-50 dark:bg-slate-900/50 text-[#f3af3d] rounded-lg flex items-center justify-center font-bold text-lg border border-orange-100 dark:border-slate-700 group-hover:bg-[#f3af3d] group-hover:text-white transition-all">
              {{c.Name.charAt(0)}}
            </div>
            <div>
              <h3 class="text-base font-bold text-slate-800 dark:text-white leading-tight group-hover:text-orange-500 transition-colors">{{c.Name}}</h3>
              <p class="text-[10px] text-slate-400 font-bold uppercase tracking-wide mt-0.5">Premium Client</p>
            </div>
          </div>
          
          <div class="grid grid-cols-2 gap-4 border-t border-slate-50 dark:border-slate-700/50 pt-4 mt-1 transition-colors">
            <div>
              <div class="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1">Policies</div>
              <div class="text-sm font-bold text-slate-700 dark:text-slate-200">{{c.PolicyCount}} <span class="text-[10px] font-bold text-green-500 ml-1">({{c.ActivePolicies}} Active)</span></div>
            </div>
            <div>
              <div class="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1">Asset Value</div>
              <div class="text-sm font-bold text-slate-700 dark:text-slate-200">₹{{c.TotalIDV | number}}</div>
            </div>
          </div>

          <div class="mt-4 pt-4 border-t border-slate-50 dark:border-slate-700/50">
             <div class="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1">Total Premium</div>
             <div class="text-xl font-bold text-orange-600 dark:text-orange-400 tracking-tight">₹{{c.TotalPremium | number}}</div>
          </div>
        </div>
      </div>

      <div *ngIf="filteredCustomers.length === 0" class="col-span-full py-24 text-center">
        <div class="w-16 h-16 bg-slate-50 dark:bg-slate-900/50 rounded-lg flex items-center justify-center mx-auto mb-4">
            <span class="material-icons text-4xl text-slate-200 dark:text-slate-700">person_off</span>
        </div>
        <p class="text-slate-400 font-bold text-sm italic">No records found matching your query.</p>
      </div>
    </div>
  `
})
export class AgentCustomersComponent implements OnInit {
  customers: CustomerSummary[] = [];
  searchTerm = '';
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
      next: (policies) => {
        this.processCustomers(policies);
        this.cdr.detectChanges();
      },
      error: (err) => {
        // Handled by global interceptor
      }
    });
  }

  processCustomers(policies: Policy[]) {
    const customerMap = new Map<string, CustomerSummary>();

    policies.forEach(p => {
      if (!customerMap.has(p.CustomerName)) {
        customerMap.set(p.CustomerName, {
          Name: p.CustomerName,
          PolicyCount: 0,
          ActivePolicies: 0,
          TotalPremium: 0,
          TotalIDV: 0
        });
      }

      const summary = customerMap.get(p.CustomerName)!;
      summary.PolicyCount++;
      summary.TotalPremium += p.PremiumAmount;
      summary.TotalIDV += p.IDV;
      if (p.Status === 'Approved') {
        summary.ActivePolicies++;
      }
    });

    this.customers = Array.from(customerMap.values());
  }

  get filteredCustomers() {
    return this.customers.filter(c =>
      c.Name.toLowerCase().includes(this.searchTerm.toLowerCase())
    );
  }
}
