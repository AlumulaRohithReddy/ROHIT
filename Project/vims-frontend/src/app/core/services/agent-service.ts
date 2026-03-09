import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, map } from 'rxjs';

export interface ApiResponse<T> {
    Success: boolean;
    Message: string;
    Data: T;
}

export interface Policy {
    PolicyId: number;
    PolicyNumber: string;
    PlanName: string;
    CustomerName: string;
    VehicleNumber: string;
    VehicleModel: string;
    PremiumAmount: number;
    IDV: number;
    Status: string;
    StartDate: string;
    EndDate: string;
}

@Injectable({
    providedIn: 'root'
})
export class AgentService {
    private basePolicyUrl = 'https://localhost:7066/api/Policy';

    constructor(private http: HttpClient) { }


    getAssignedPolicies(): Observable<Policy[]> {
        return this.http.get<ApiResponse<Policy[]>>(`${this.basePolicyUrl}/assigned`)
            .pipe(map(res => res.Data));
    }

    approvePolicy(id: number, updatedPremium?: number): Observable<any> {
        return this.http.put(`${this.basePolicyUrl}/${id}/approve`, { updatedPremium });
    }

    rejectPolicy(id: number): Observable<any> {
        return this.http.put(`${this.basePolicyUrl}/${id}/reject`, {});
    }
}
