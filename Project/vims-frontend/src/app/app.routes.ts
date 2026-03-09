import { Routes } from '@angular/router';
import { LoginComponent } from '../components/auth/login/login';
import { RegisterComponent } from '../components/auth/register/register';
import { ForgotPasswordComponent } from '../components/auth/forgot-password/forgot-password';
import { HomeComponent } from '../components/pages/home/home';
// import { ForgotPasswordComponent } from '../components/auth/forgot-password/forgot-password';
import { authGuard } from './core/guards/auth-guard';
import { roleGuard } from './core/guards/role-guard';
import { AdminDashboardComponent } from '../components/dashboard/admin/admin';
import { AdminOverviewComponent } from '../components/dashboard/admin/pages/overview/overview';
import { UserManagementComponent } from '../components/dashboard/admin/pages/users/users';
import { PolicyPlansComponent } from '../components/dashboard/admin/pages/plans/plans';
import { ClaimsAssignmentComponent } from '../components/dashboard/admin/pages/claims/claims';
import { Homepage } from '../components/pages/home/homepage/homepage';
import { AdminSettingsComponent } from '../components/dashboard/admin/pages/settings/settings';
import { AdminAnalyticsComponent } from '../components/dashboard/admin/pages/analytics/analytics';

import { CustomerDashboardComponent } from '../components/dashboard/customer/customer';
import { CustomerOverviewComponent } from '../components/dashboard/customer/pages/overview/overview';
import { VehicleManagementComponent } from '../components/dashboard/customer/pages/vehicles/vehicles';
import { PolicyManagementComponent } from '../components/dashboard/customer/pages/policies/policies';
import { ClaimTrackingComponent } from '../components/dashboard/customer/pages/claims/claims';
import { PaymentHistoryComponent } from '../components/dashboard/customer/pages/payments/payments';
import { BuyPolicyComponent } from '../components/dashboard/customer/pages/policies/buy-policy/buy-policy';

import { AgentDashboardComponent } from '../components/dashboard/agent/agent';
import { AgentOverviewComponent } from '../components/dashboard/agent/pages/overview/overview';
import { AgentPoliciesComponent } from '../components/dashboard/agent/pages/policies/policies';
import { AgentCustomersComponent } from '../components/dashboard/agent/pages/customers/customers';
import { OfficerDashboardComponent } from '../components/dashboard/officer/officer';
import { OfficerOverviewComponent } from '../components/dashboard/officer/pages/overview/overview';
import { OfficerClaimsComponent } from '../components/dashboard/officer/pages/claims/claims';
import { ErrorPageComponent } from '../components/pages/error/error-page';

export const routes: Routes = [
  { path: '', component: Homepage },
  { path: 'login', component: LoginComponent },
  { path: 'register', component: RegisterComponent },
  { path: 'forgot-password', component: ForgotPasswordComponent },
  {
    path: 'admin',
    component: AdminDashboardComponent,
    canActivate: [authGuard, roleGuard],
    data: { role: 'Admin' },
    children: [
      { path: '', redirectTo: 'overview', pathMatch: 'full' },
      { path: 'overview', component: AdminOverviewComponent },
      { path: 'users', component: UserManagementComponent },
      { path: 'plans', component: PolicyPlansComponent },
      { path: 'claims', component: ClaimsAssignmentComponent },
      { path: 'analytics', component: AdminAnalyticsComponent },
      { path: 'settings', component: AdminSettingsComponent }
    ]
  },
  //   { path: 'forgot-password', component: ForgotPasswordComponent },

  {
    path: 'customer',
    component: CustomerDashboardComponent,
    canActivate: [roleGuard],
    data: { role: 'Customer' },
    children: [
      { path: '', redirectTo: 'overview', pathMatch: 'full' },
      { path: 'overview', component: CustomerOverviewComponent },
      { path: 'vehicles', component: VehicleManagementComponent },
      { path: 'policies', component: PolicyManagementComponent },
      { path: 'policies/buy', component: BuyPolicyComponent },
      { path: 'claims', component: ClaimTrackingComponent },
      { path: 'payments', component: PaymentHistoryComponent }
    ]
  },
  {
    path: 'agent',
    component: AgentDashboardComponent,
    canActivate: [roleGuard],
    data: { role: 'Agent' },
    children: [
      { path: '', redirectTo: 'overview', pathMatch: 'full' },
      { path: 'overview', component: AgentOverviewComponent },
      { path: 'policies', component: AgentPoliciesComponent },
      { path: 'customers', component: AgentCustomersComponent }
    ]
  },
  {
    path: 'officer',
    component: OfficerDashboardComponent,
    canActivate: [roleGuard],
    data: { role: 'ClaimsOfficer' },
    children: [
      { path: '', redirectTo: 'overview', pathMatch: 'full' },
      { path: 'overview', component: OfficerOverviewComponent },
      { path: 'claims', component: OfficerClaimsComponent }
    ]
  },
  { path: 'error', component: ErrorPageComponent },
  { path: '**', redirectTo: '/error?code=404&message=The+page+you+were+looking+for+does+not+exist.' }
];
