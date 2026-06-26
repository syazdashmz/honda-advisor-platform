import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

import { environment } from '../../../environments/environment';
import { ApiResponse } from '../models/api-response.model';

declare global {
  interface Window {
    __HONDA_ADVISOR_API_URL__?: string;
  }
}

@Injectable({
  providedIn: 'root'
})
export class ApiService {
  private readonly apiUrl = this.resolveApiUrl();

  constructor(private http: HttpClient) {}

  get<T>(path: string): Observable<ApiResponse<T>> {
    return this.http.get<ApiResponse<T>>(this.buildUrl(path));
  }

  post<T>(path: string, payload: unknown): Observable<ApiResponse<T>> {
    return this.http.post<ApiResponse<T>>(this.buildUrl(path), payload);
  }

  put<T>(path: string, payload: unknown): Observable<ApiResponse<T>> {
    return this.http.put<ApiResponse<T>>(this.buildUrl(path), payload);
  }

  patch<T>(path: string, payload: unknown): Observable<ApiResponse<T>> {
    return this.http.patch<ApiResponse<T>>(this.buildUrl(path), payload);
  }

  delete<T>(path: string): Observable<ApiResponse<T>> {
    return this.http.delete<ApiResponse<T>>(this.buildUrl(path));
  }

  private buildUrl(path: string): string {
    const normalizedPath = path.startsWith('/') ? path : `/${path}`;
    return `${this.apiUrl}${normalizedPath}`;
  }

  private resolveApiUrl(): string {
    const runtimeApiUrl =
      typeof window !== 'undefined'
        ? window.__HONDA_ADVISOR_API_URL__?.trim()
        : '';

    if (runtimeApiUrl) {
      return runtimeApiUrl.replace(/\/$/, '');
    }

    const configuredApiUrl = environment.apiUrl.trim();

    if (typeof window !== 'undefined') {
      const hostname = window.location.hostname;
      const isLocalhost = hostname === 'localhost' || hostname === '127.0.0.1';

      if (!isLocalhost && configuredApiUrl.includes('localhost')) {
        return '/api';
      }
    }

    return configuredApiUrl.replace(/\/$/, '');
  }
}
