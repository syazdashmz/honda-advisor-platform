import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

import { ApiResponse } from '../models/api-response.model';
import {
  AdminCarDetail,
  AdminCarModel
} from '../models/admin-car.model';
import { CarModel, CarVariant } from '../models/car.model';
import { ApiService } from './api.service';

@Injectable({
  providedIn: 'root'
})
export class AdminCarsService {
  constructor(private apiService: ApiService) {}

  getAdminCars(): Observable<ApiResponse<AdminCarModel[]>> {
    return this.apiService.get<AdminCarModel[]>('/admin/cars');
  }

  getAdminCarById(id: number): Observable<ApiResponse<AdminCarDetail>> {
    return this.apiService.get<AdminCarDetail>(`/admin/cars/${id}`);
  }

  updateCarModel(
    id: number,
    payload: Partial<CarModel>
  ): Observable<ApiResponse<CarModel>> {
    return this.apiService.put<CarModel>(`/admin/cars/${id}`, payload);
  }

  updateCarVariant(
    carId: number,
    variantId: number,
    payload: Partial<CarVariant>
  ): Observable<ApiResponse<CarVariant>> {
    return this.apiService.put<CarVariant>(
      `/admin/cars/${carId}/variants/${variantId}`,
      payload
    );
  }
}