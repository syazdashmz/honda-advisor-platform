import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

import { ApiResponse } from '../models/api-response.model';
import { AdminDashboardData } from '../models/admin-dashboard.model';
import { ApiService } from './api.service';

@Injectable({
  providedIn: 'root'
})
export class AdminDashboardService {
  constructor(private apiService: ApiService) {}

  getDashboard(): Observable<ApiResponse<AdminDashboardData>> {
    return this.apiService.get<AdminDashboardData>('/admin/dashboard');
  }
}