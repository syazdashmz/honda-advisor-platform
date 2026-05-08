import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

import { ApiResponse } from '../models/api-response.model';
import { HomeContent } from '../models/site-content.model';
import { ApiService } from './api.service';

@Injectable({
  providedIn: 'root'
})
export class SiteContentService {
  constructor(private apiService: ApiService) {}

  getPublicHomeContent(): Observable<ApiResponse<HomeContent>> {
    return this.apiService.get<HomeContent>('/site/home');
  }

  getAdminHomeContent(): Observable<ApiResponse<HomeContent>> {
    return this.apiService.get<HomeContent>('/admin/site/home');
  }

  updateHomeContent(payload: HomeContent): Observable<ApiResponse<HomeContent>> {
    return this.apiService.put<HomeContent>('/admin/site/home', payload);
  }
}