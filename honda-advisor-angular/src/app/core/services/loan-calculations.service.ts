import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

import { ApiResponse } from '../models/api-response.model';
import {
  LoanCalculationPayload,
  LoanCalculationResult
} from '../models/loan-calculation.model';
import { ApiService } from './api.service';

@Injectable({
  providedIn: 'root'
})
export class LoanCalculationsService {
  constructor(private apiService: ApiService) {}

  calculateLoan(
    payload: LoanCalculationPayload
  ): Observable<ApiResponse<LoanCalculationResult>> {
    return this.apiService.post<LoanCalculationResult>(
      '/loan-calculations/calculate',
      payload
    );
  }

  saveLoanCalculation(
    payload: LoanCalculationPayload
  ): Observable<ApiResponse<LoanCalculationResult>> {
    return this.apiService.post<LoanCalculationResult>(
      '/loan-calculations',
      payload
    );
  }

  getLoanCalculations(): Observable<ApiResponse<LoanCalculationResult[]>> {
    return this.apiService.get<LoanCalculationResult[]>('/loan-calculations');
  }

  getMyLoanCalculations(): Observable<ApiResponse<LoanCalculationResult[]>> {
    return this.apiService.get<LoanCalculationResult[]>('/loan-calculations/my');
  }
}
