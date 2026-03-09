
export interface LoginRequest {
  email: string;
  password: string;
}

export interface RegisterRequest {
  fullName: string;
  email: string;
  password: string;
  role: 'Admin' | 'Customer' | 'Agent' | 'ClaimsOfficer';
  securityQuestion?: string;
  securityAnswer?: string;
}

export interface AuthResponse {
  token: string;
  role: string;
}
