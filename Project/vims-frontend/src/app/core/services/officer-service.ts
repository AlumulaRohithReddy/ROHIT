import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, map } from 'rxjs';

export interface ApiResponse<T> {
    Success: boolean;
    Message: string;
    Data: T;
}

export interface Claim {
    ClaimId: number;
    ClaimNumber: string;
    Status: string;
    ClaimedAmount: number;
    ApprovedAmount?: number;
    VehicleNumber: string;
    PlanName: string;
    CustomerName: string;
    DocumentCount: number;
    FraudScore: number;
    FraudRiskLevel: string;
    Description?: string;
}

@Injectable({
    providedIn: 'root'
})
export class OfficerService {
    private baseUrl = 'https://localhost:7066/api/Claim';
    private docUrl = 'https://localhost:7066/api/claim-documents';

    constructor(private http: HttpClient) { }

    getAssignedClaims(): Observable<Claim[]> {
        return this.http.get<ApiResponse<Claim[]>>(`${this.baseUrl}/officer`)
            .pipe(map(res => res.Data));
    }

    getClaimDocuments(claimId: number): Observable<string[]> {
        return this.http.get<ApiResponse<string[]>>(`${this.docUrl}/${claimId}`)
            .pipe(map(res => res.Data));
    }

    reviewClaim(claimId: number, review: { isApproved: boolean, approvedAmount?: number }): Observable<any> {
        return this.http.put(`${this.baseUrl}/${claimId}/review`, review);
    }
}
