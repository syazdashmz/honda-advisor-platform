import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

import { ApiResponse } from '../models/api-response.model';
import { User } from '../models/user.model';
import {
  AdminPasswordUpdatePayload,
  AdminProfileUpdatePayload,
  CreateAdminPayload
} from '../models/admin-account.model';
import { ApiService } from './api.service';

@Injectable({
  providedIn: 'root'
})
export class AdminAccountService {
  constructor(private apiService: ApiService) {}

  updateProfile(
    payload: AdminProfileUpdatePayload
  ): Observable<ApiResponse<{ user: User }>> {
    return this.apiService.put<{ user: User }>('/admin/account/profile', payload);
  }

  changePassword(
    payload: AdminPasswordUpdatePayload
  ): Observable<ApiResponse<{ updated: boolean }>> {
    return this.apiService.put<{ updated: boolean }>('/admin/account/password', payload);
  }

  createAdmin(
    payload: CreateAdminPayload
  ): Observable<ApiResponse<User>> {
    return this.apiService.post<User>('/admin/account/admins', payload);
  }
}