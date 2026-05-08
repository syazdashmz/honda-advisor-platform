import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

import { ApiResponse } from '../models/api-response.model';
import { CarDetail, CarModel } from '../models/car.model';
import { ApiService } from './api.service';

@Injectable({
  providedIn: 'root'
})
export class CarsService {
  constructor(private apiService: ApiService) {}

  getCars(): Observable<ApiResponse<CarModel[]>> {
    return this.apiService.get<CarModel[]>('/cars');
  }

  getCarBySlug(slug: string): Observable<ApiResponse<CarDetail>> {
    return this.apiService.get<CarDetail>(`/cars/${slug}`);
  }
}