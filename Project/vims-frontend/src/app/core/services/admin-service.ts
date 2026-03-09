import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, map } from 'rxjs';

export interface ApiResponse<T> {
    Success: boolean;
    Message: string;
    Data: T;
}

export interface PolicyPlan {
    PlanId?: number;
    PlanName: string;
    Description?: string;
    PolicyType: string;
    BasePremium: number;
    MaxCoverageAmount?: number;
    PolicyDurationMonths: number;
}

export interface User {
    UserId: number;
    FullName: string;
    Email: string;
    Role: string;
}

export interface Claim {
    ClaimId: number;
    ClaimNumber: string;
    Status: string;
    ClaimedAmount: number;
    ApprovedAmount?: number;
    PlanName?: string;
    CustomerName?: string;
    PolicyId?: number;
    OfficerId?: number;
    claimsofficerId?: number;
    Description?: string;
    FraudScore?: number;
    FraudRiskLevel?: string;
}

export interface MonthlyRevenue {
    Month: string;
    Amount: number;
}

export interface StatusDistribution {
    Status: string;
    Count: number;
}

export interface AdminDashboardStats {
    TotalUsers: number;
    TotalActivePolicies: number;
    TotalPendingClaims: number;
    TotalRevenue: number;
    MonthlyRevenue: MonthlyRevenue[];
    PolicyStatusDistribution: StatusDistribution[];
    ClaimStatusDistribution: StatusDistribution[];
}

export interface SystemSetting {
    SettingKey: string;
    SettingValue: string;
    Description: string;
    Group: string;
}

export interface PremiumCalculationResponse {
    BasePremium: number;
    VehicleRiskAdjustment: number;
    AgeAdjustment: number;
    ExperienceAdjustment: number;
    FinalPremium: number;
    AppliedRules: string[];
}

@Injectable({
    providedIn: 'root'
})
export class AdminService {
    private baseAuthUrl = 'https://localhost:7066/api/Auth';
    private basePlanUrl = 'https://localhost:7066/api/PolicyPlan';
    private baseClaimUrl = 'https://localhost:7066/api/Claim';
    private baseAdminUrl = 'https://localhost:7066/api/AdminDashboard';
    private baseSettingsUrl = 'https://localhost:7066/api/Settings';

    constructor(private http: HttpClient) { }

    // User Management
    registerUser(userData: any): Observable<any> {
        return this.http.post(`${this.baseAuthUrl}/register`, userData);
    }

    // Policy Plan Management
    getPolicyPlans(): Observable<PolicyPlan[]> {
        return this.http.get<ApiResponse<PolicyPlan[]>>(this.basePlanUrl)
            .pipe(map(res => res.Data));
    }

    createPolicyPlan(plan: PolicyPlan): Observable<any> {
        return this.http.post(this.basePlanUrl, plan);
    }

    updatePolicyPlan(id: number, plan: PolicyPlan): Observable<any> {
        return this.http.put(`${this.basePlanUrl}/${id}`, plan);
    }

    deletePolicyPlan(id: number): Observable<any> {
        return this.http.delete(`${this.basePlanUrl}/${id}`);
    }

    // Claims Management
    getAllClaims(): Observable<any[]> {
        return this.http.get<ApiResponse<Claim[]>>(this.baseClaimUrl)
            .pipe(map(res => res.Data));
    }

    assignClaim(claimId: number, officerId: number): Observable<any> {
        return this.http.put(`${this.baseClaimUrl}/${claimId}/assign/${officerId}`, {});
    }

    // Dashboard Stats
    getDashboardStats(): Observable<AdminDashboardStats> {
        return this.http.get<ApiResponse<AdminDashboardStats>>(`${this.baseAdminUrl}/stats`)
            .pipe(map(res => res.Data));
    }

    // Settings
    getSettings(): Observable<SystemSetting[]> {
        return this.http.get<SystemSetting[]>(this.baseSettingsUrl);
    }

    updateSettings(settings: SystemSetting[]): Observable<any> {
        return this.http.post(`${this.baseSettingsUrl}/bulk-update`, settings);
    }

    // User Management
    getUsers(): Observable<User[]> {
        return this.http.get<ApiResponse<User[]>>(`${this.baseAuthUrl}/users`)
            .pipe(map(res => res.Data));
    }

    adminResetPassword(userId: number, newPassword: string): Observable<any> {
        return this.http.post(`${this.baseAuthUrl}/admin-reset-password/${userId}`, { NewPassword: newPassword }, {
            headers: new HttpHeaders({ 'Content-Type': 'application/json' })
        });
    }
}
