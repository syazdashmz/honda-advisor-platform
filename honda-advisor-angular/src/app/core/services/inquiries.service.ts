import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

import { ApiResponse } from '../models/api-response.model';
import {
  InquiryPayload,
  InquiryResult,
  InquiryStatus
} from '../models/inquiry.model';
import { ApiService } from './api.service';

@Injectable({
  providedIn: 'root'
})
export class InquiriesService {
  constructor(private apiService: ApiService) {}

  createInquiry(payload: InquiryPayload): Observable<ApiResponse<InquiryResult>> {
    return this.apiService.post<InquiryResult>('/inquiries', payload);
  }

  getInquiries(): Observable<ApiResponse<InquiryResult[]>> {
    return this.apiService.get<InquiryResult[]>('/inquiries');
  }

  getInquiryById(id: number): Observable<ApiResponse<InquiryResult>> {
    return this.apiService.get<InquiryResult>(`/inquiries/${id}`);
  }

  updateInquiryStatus(
    id: number,
    status: InquiryStatus
  ): Observable<ApiResponse<InquiryResult>> {
    return this.apiService.put<InquiryResult>(`/inquiries/${id}/status`, {
      status
    });
  }
}