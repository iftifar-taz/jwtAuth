import { Injectable } from '@angular/core';
import { environment } from '../../environments/environment.development';
import { map, Observable } from 'rxjs';
import { AuthResponse } from '../interfaces/auth-response';
import { LoginRequest } from '../interfaces/login-request';
import { HttpClient } from '@angular/common/http';
import { UserDetail } from '../interfaces/user-detail';
import { jwtDecode } from 'jwt-decode';
import { RegisterRequest } from '../interfaces/register-request';
import { ResetPasswordRequest } from '../interfaces/reset-password-request';
import { ChangePasswordRequest } from '../interfaces/change-password-request';
import { RefreshTokenRequest } from '../interfaces/refresh-token-request';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  apiUrl: string = environment.apiUrl;
  private userKey: string = 'user';

  constructor(private http: HttpClient) { }

  login(data: LoginRequest): Observable<AuthResponse> {
    return this.http.post<AuthResponse>(`${this.apiUrl}/accounts/login`, data).pipe(
      map((response: AuthResponse) => {
        if (response.isSuccess) {
          localStorage.setItem(this.userKey, JSON.stringify(response));
        }
        return response;
      })
    );
  }

  register(data: RegisterRequest): Observable<AuthResponse> {
    return this.http.post<AuthResponse>(`${this.apiUrl}/accounts/register`, data).pipe(
      map((response: AuthResponse) => {
        if (response.isSuccess) {
          localStorage.setItem(this.userKey, JSON.stringify(response));
        }
        return response;
      })
    );
  }

  getAll(): Observable<UserDetail[]> {
    return this.http.get<UserDetail[]>(`${this.apiUrl}/accounts`);
  }

  getDetail(): Observable<UserDetail> {
    return this.http.get<UserDetail>(`${this.apiUrl}/accounts/detail`);
  }

  forgetPassword(email: string): Observable<AuthResponse> {
    return this.http.post<AuthResponse>(`${this.apiUrl}/accounts/forget-password`, { email });
  }

  resetPassword(dto: ResetPasswordRequest): Observable<AuthResponse> {
    return this.http.post<AuthResponse>(`${this.apiUrl}/accounts/reset-password`, dto);
  }

  changePassword(dto: ChangePasswordRequest): Observable<AuthResponse> {
    return this.http.post<AuthResponse>(`${this.apiUrl}/accounts/change-password`, dto);
  }

  refreshToken(dto: RefreshTokenRequest): Observable<AuthResponse> {
    return this.http.post<AuthResponse>(`${this.apiUrl}/accounts/refresh-token`, dto);
  }

  getUserDetail(): UserDetail | null {
    const token = this.getToken();
    if (!token) {
      return null;
    }
    const decodedToken: any = jwtDecode(token);
    const userDetail = {
      id: decodedToken.nameid,
      fullName: decodedToken.name,
      email: decodedToken.email,
      roles: decodedToken.role || [],
    };

    return userDetail;
  }

  getRoles(): string[] | null {
    const token = this.getToken();
    if (!token) {
      return null;
    }
    const decodedToken: any = jwtDecode(token);
    return decodedToken.role || null;
  }

  isLoggedIn(): boolean {
    const token = this.getToken();
    if (!token) {
      return false;
    }
    return !this.isTokenExpired();
  }

  logout(): void {
    localStorage.removeItem(this.userKey);
  }

  getToken(): string | null {
    const user = localStorage.getItem(this.userKey);
    if (!user) {
      return null;
    }
    const userDetail: AuthResponse = JSON.parse(user);
    return userDetail.token;
  }

  getRefreshToken(): string | null {
    const user = localStorage.getItem(this.userKey);
    if (!user) {
      return null;
    }
    const userDetail: AuthResponse = JSON.parse(user);
    return userDetail.refreshToken;
  }

  private isTokenExpired(): boolean {
    const token = this.getToken();
    if (!token) {
      return true;
    }
    const decodedToken = jwtDecode(token);
    const isTokenExpired = Date.now() >= decodedToken['exp']! * 1000;
    // if (isTokenExpired) {
    //   this.logout();
    // }
    return isTokenExpired;
  }
}
