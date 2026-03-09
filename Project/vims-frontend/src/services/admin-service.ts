// features/admin/services/admin.service.ts

import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

@Injectable({ providedIn: 'root' })
export class AdminService {

  private baseUrl = 'https://localhost:7066/api';

  constructor(private http: HttpClient) {}

  // 🔹 USERS
  createAgent(data: any) {
    return this.http.post(`${this.baseUrl}/Auth/register`, data);
  }
  createOfficer(data: any) {
    return this.http.post(`${this.baseUrl}/Auth/register`, data);
  }

  // 🔹 POLICY PLANS
  getPlans() {
    return this.http.get(`${this.baseUrl}/PolicyPlan`);
  }

  createPlan(data: any) {
    return this.http.post(`${this.baseUrl}/PolicyPlan`, data);
  }

  // 🔹 CLAIMS
  getAllClaims() {
    return this.http.get(`${this.baseUrl}/Claim`);
  }

  assignOfficer(claimId: number, officerId: number) {
    return this.http.put(`${this.baseUrl}/Claim/${claimId}/assign/${officerId}`, {});
  }

  // 🔹 PAYMENTS
  getPayments() {
    return this.http.get(`${this.baseUrl}/Payment`);
  }
  getAgents() {
  return this.http.get(`${this.baseUrl}/Admin/agents`);
}
getOfficers() {
  return this.http.get(`${this.baseUrl}/Admin/officers`);
}
}
