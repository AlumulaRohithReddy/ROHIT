import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, map } from 'rxjs';

export interface Vehicle {
    VehicleId: number;
    Make: string;
    Model: string;
    Year: number;
    RegistrationNumber: string;
    FuelType: string;
    VehicleType: string;
    CurrentMarketValue: number;
}

export interface ApiResponse<T> {
    Success: boolean;
    Message: string;
    Data: T;
}

export interface Policy {
    PolicyId: number;
    PolicyNumber: string;
    PlanName: string;
    PremiumAmount: number;
    IDV: number;
    Status: string;
    StartDate: string;
    EndDate: string;
    VehicleNumber: string;
    VehicleModel: string;
    PaymentId?: number;
    VehicleRiskScore?: number;
}

export interface Claim {
    ClaimId: number;
    ClaimNumber: string;
    Status: string;
    ClaimedAmount: number;
    ApprovedAmount?: number;
    VehicleNumber?: string;
    PlanName?: string;
    DateFiled?: string;
    FraudScore?: number;
    FraudRiskLevel?: string;
    Description?: string;
}

export interface Payment {
    PaymentId: number;
    Amount: number;
    Status: string;
    PaymentDate: string;
    TransactionId: string;
    Description?: string;
}

export interface PremiumBreakdown {
    BasePremium: number;
    RiskAdjustment: number;
    AgeAdjustment: number;
    NoClaimBonusDiscount: number;
    TotalPremium: number;
    FactorsApplied: string[];
}

export interface PolicyPlan {
    PlanId: number;
    PlanName: string;
    Description?: string;
    PolicyType: string;
    BasePremium: number;
    MaxCoverageAmount: number;
    PolicyDurationMonths: number;
}

@Injectable({
    providedIn: 'root'
})
export class CustomerService {
    private baseVehicleUrl = 'https://localhost:7066/api/Vehicle';
    private basePolicyUrl = 'https://localhost:7066/api/Policy';
    private baseClaimUrl = 'https://localhost:7066/api/Claim';
    private basePaymentUrl = 'https://localhost:7066/api/Payment';
    private basePlanUrl = 'https://localhost:7066/api/PolicyPlan';

    constructor(private http: HttpClient) { }


    // Vehicles
    getVehicles(): Observable<Vehicle[]> {
        return this.http.get<ApiResponse<Vehicle[]>>(this.baseVehicleUrl)
            .pipe(map(res => res.Data));
    }

    addVehicle(vehicle: any): Observable<any> {
        return this.http.post(this.baseVehicleUrl, vehicle);
    }

    deleteVehicle(id: number): Observable<any> {
        return this.http.delete(`${this.baseVehicleUrl}/${id}`);
    }

    // Policies
    getPolicies(): Observable<Policy[]> {
        return this.http.get<ApiResponse<Policy[]>>(this.basePolicyUrl)
            .pipe(map(res => res.Data));
    }

    buyPolicy(policyData: any): Observable<any> {
        return this.http.post(this.basePolicyUrl, policyData);
    }

    // Claims
    getClaims(): Observable<Claim[]> {
        return this.http.get<ApiResponse<Claim[]>>(`${this.baseClaimUrl}/my`)
            .pipe(map(res => res.Data));
    }

    submitClaim(claimData: any): Observable<ApiResponse<Claim>> {
        return this.http.post<ApiResponse<Claim>>(this.baseClaimUrl, claimData);
    }

    uploadClaimDocument(claimId: number, file: File): Observable<any> {
        const formData = new FormData();
        formData.append('file', file);

        // Note: Don't set Content-Type, browser will set it with boundary for FormData
        // Authorization is handled automatically by the authInterceptor
        return this.http.post(`https://localhost:7066/api/claim-documents/${claimId}`, formData);
    }

    // Payments
    getPayments(): Observable<Payment[]> {
        return this.http.get<ApiResponse<Payment[]>>(`${this.basePaymentUrl}/my`)
            .pipe(map(res => res.Data));
    }

    makePayment(policyId: number, paymentMethod: string): Observable<any> {
        return this.http.post(this.basePaymentUrl, { policyId, paymentMethod });
    }

    downloadInvoice(paymentId: number): Observable<Blob> {
        return this.http.get(`https://localhost:7066/api/Invoice/${paymentId}`, {
            responseType: 'blob'
        });
    }

    // Policy Plans
    getPolicyPlans(): Observable<PolicyPlan[]> {
        return this.http.get<ApiResponse<PolicyPlan[]>>(this.basePlanUrl)
            .pipe(map(res => res.Data));
    }

    calculatePremium(vehicleId: number, planId: number): Observable<any> {
        return this.http.get<any>(`https://localhost:7066/api/Premium/calculate?vehicleId=${vehicleId}&planId=${planId}`)
            .pipe(map(res => {
                // Handle both PascalCase and camelCase for standard system response
                const result = res.Data || res.data || res;
                return result;
            }));
    }
}
