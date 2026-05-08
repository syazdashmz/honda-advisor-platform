import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

import { ApiResponse } from '../models/api-response.model';
import {
  AppointmentAvailability,
  AppointmentPayload,
  AppointmentResult,
  AppointmentStatus
} from '../models/appointment.model';
import { ApiService } from './api.service';

@Injectable({
  providedIn: 'root'
})
export class AppointmentsService {
  constructor(private apiService: ApiService) {}

  createAppointment(
    payload: AppointmentPayload
  ): Observable<ApiResponse<AppointmentResult>> {
    return this.apiService.post<AppointmentResult>('/appointments', payload);
  }

  getAvailability(date: string): Observable<ApiResponse<AppointmentAvailability>> {
    return this.apiService.get<AppointmentAvailability>(
      `/appointments/availability?date=${date}`
    );
  }

  getMyAppointments(): Observable<ApiResponse<AppointmentResult[]>> {
    return this.apiService.get<AppointmentResult[]>('/appointments/my');
  }

  getAdminAppointments(): Observable<ApiResponse<AppointmentResult[]>> {
    return this.apiService.get<AppointmentResult[]>('/appointments');
  }

  updateAppointmentStatus(
    id: number,
    status: AppointmentStatus
  ): Observable<ApiResponse<AppointmentResult>> {
    return this.apiService.put<AppointmentResult>(`/appointments/${id}/status`, {
      status
    });
  }
}