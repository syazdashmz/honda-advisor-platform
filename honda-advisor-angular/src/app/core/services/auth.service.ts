import { Injectable, signal } from '@angular/core';
import { Observable, tap } from 'rxjs';

import { ApiResponse } from '../models/api-response.model';
import {
  AuthResponse,
  LoginPayload,
  RegisterPayload,
  User
} from '../models/user.model';
import { ApiService } from './api.service';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private readonly tokenKey = 'honda_advisor_token';
  private readonly userKey = 'honda_advisor_user';

  currentUser = signal<User | null>(this.getStoredUser());

  constructor(private apiService: ApiService) {}

  register(payload: RegisterPayload): Observable<ApiResponse<AuthResponse>> {
    return this.apiService
      .post<AuthResponse>('/auth/register', payload)
      .pipe(
        tap((response) => {
          if (response.success && response.data) {
            this.storeAuth(response.data);
          }
        })
      );
  }

  login(payload: LoginPayload): Observable<ApiResponse<AuthResponse>> {
    return this.apiService
      .post<AuthResponse>('/auth/login', payload)
      .pipe(
        tap((response) => {
          if (response.success && response.data) {
            this.storeAuth(response.data);
          }
        })
      );
  }

  logout(): void {
    localStorage.removeItem(this.tokenKey);
    localStorage.removeItem(this.userKey);
    this.currentUser.set(null);
  }

  getToken(): string | null {
    return localStorage.getItem(this.tokenKey);
  }

  isLoggedIn(): boolean {
    return !!this.getToken() && !!this.currentUser();
  }

  isAdmin(): boolean {
    const user = this.currentUser();
    return user?.role_name === 'admin' || user?.role_name === 'super_admin';
  }

  private storeAuth(authData: AuthResponse): void {
    localStorage.setItem(this.tokenKey, authData.token);
    localStorage.setItem(this.userKey, JSON.stringify(authData.user));
    this.currentUser.set(authData.user);
  }

  private getStoredUser(): User | null {
    const rawUser = localStorage.getItem(this.userKey);

    if (!rawUser) {
      return null;
    }

    try {
      return JSON.parse(rawUser) as User;
    } catch {
      localStorage.removeItem(this.userKey);
      return null;
    }
  }

  updateCurrentUser(user: User): void {
    localStorage.setItem(this.userKey, JSON.stringify(user));
    this.currentUser.set(user);
  }

  updateProfile(payload: { full_name: string; phone_number?: string }): Observable<ApiResponse<{ user: User }>> {
    return this.apiService
      .patch<{ user: User }>('/auth/profile', payload)
      .pipe(
        tap((response) => {
          if (response.success && response.data?.user) {
            this.updateCurrentUser(response.data.user);
          }
        })
      );
  }
}
