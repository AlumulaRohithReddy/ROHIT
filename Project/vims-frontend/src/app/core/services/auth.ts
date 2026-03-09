// core/services/auth.service.ts

import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { LoginRequest, RegisterRequest } from '../models/auth';
import { Router } from '@angular/router';
import { Observable, map } from 'rxjs';

export interface ApiResponse<T> {
  Success: boolean;
  Message: string;
  Data: T;
}

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  private baseUrl = 'https://localhost:7066/api/Auth';

  constructor(private http: HttpClient, private router: Router) { }

  login(data: LoginRequest): Observable<ApiResponse<any>> {
    return this.http.post<ApiResponse<any>>(`${this.baseUrl}/login`, data);
  }

  register(data: RegisterRequest): Observable<ApiResponse<any>> {
    return this.http.post<ApiResponse<any>>(`${this.baseUrl}/register`, data);
  }

  forgotPassword(email: string): Observable<ApiResponse<string>> {
    return this.http.post<ApiResponse<string>>(`${this.baseUrl}/forgot-password`, { email }, {
      headers: { 'Content-Type': 'application/json' }
    });
  }

  resetPassword(data: any): Observable<ApiResponse<any>> {
    return this.http.post<ApiResponse<any>>(`${this.baseUrl}/reset-password`, data);
  }

  saveAuth(token: string, role: string) {
    localStorage.setItem('token', token);
    localStorage.setItem('role', role);
  }

  logout() {
    localStorage.clear();
    this.router.navigate(['/login']);
  }

  getProfile(): Observable<any> {
    return this.http.get<ApiResponse<any>>(`${this.baseUrl}/profile`, {
      headers: { 'Authorization': `Bearer ${this.getToken()}` }
    }).pipe(map(res => res.Data));
  }

  getUser() {
    return {
      role: localStorage.getItem('role')
    };
  }

  getToken() {
    return localStorage.getItem('token');
  }

  getRole() {
    return localStorage.getItem('role');
  }

  isLoggedIn(): boolean {
    return !!this.getToken();
  }
}
