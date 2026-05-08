import { ChangeDetectorRef, Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatIconModule } from '@angular/material/icon';

import { InquiriesService } from '../../core/services/inquiries.service';
import {
  InquiryResult,
  InquiryStatus
} from '../../core/models/inquiry.model';

@Component({
  selector: 'app-admin-inquiries',
  imports: [
    CommonModule,
    MatIconModule
  ],
  templateUrl: './admin-inquiries.html',
  styleUrl: './admin-inquiries.scss'
})
export class AdminInquiries implements OnInit {
  private readonly inquiriesService = inject(InquiriesService);
  private readonly cdr = inject(ChangeDetectorRef);

  inquiries: InquiryResult[] = [];
  filteredInquiries: InquiryResult[] = [];

  selectedStatus = 'all';

  isLoading = true;
  updatingInquiryId: number | null = null;

  errorMessage = '';
  successMessage = '';

  statusFilters = [
    'all',
    'new',
    'contacted',
    'interested',
    'appointment_booked',
    'loan_processing',
    'won',
    'lost'
  ];

  ngOnInit(): void {
    this.loadInquiries();
  }

  loadInquiries(): void {
    this.isLoading = true;
    this.errorMessage = '';
    this.successMessage = '';

    this.inquiriesService.getInquiries().subscribe({
      next: (response) => {
        this.inquiries = response.data || [];
        this.applyFilter(this.selectedStatus);
        this.isLoading = false;
        this.cdr.detectChanges();
      },
      error: (error) => {
        console.error('Admin inquiries load error:', error);

        this.errorMessage =
          error?.error?.message || 'Unable to load inquiries.';

        this.isLoading = false;
        this.cdr.detectChanges();
      }
    });
  }

  applyFilter(status: string): void {
    this.selectedStatus = status;

    if (status === 'all') {
      this.filteredInquiries = this.inquiries;
      return;
    }

    this.filteredInquiries = this.inquiries.filter(
      (inquiry) => inquiry.status === status
    );
  }

  updateStatus(inquiry: InquiryResult, status: InquiryStatus): void {
    this.errorMessage = '';
    this.successMessage = '';
    this.updatingInquiryId = inquiry.id;

    this.inquiriesService.updateInquiryStatus(inquiry.id, status).subscribe({
      next: (response) => {
        this.successMessage = response.message;
        this.updatingInquiryId = null;
        this.loadInquiries();
        this.cdr.detectChanges();
      },
      error: (error) => {
        console.error('Inquiry status update error:', error);

        this.errorMessage =
          error?.error?.message || 'Unable to update inquiry status.';

        this.updatingInquiryId = null;
        this.cdr.detectChanges();
      }
    });
  }

  getStatusCount(status: string): number {
    if (status === 'all') {
      return this.inquiries.length;
    }

    return this.inquiries.filter((inquiry) => inquiry.status === status).length;
  }

  formatStatus(status: string): string {
    return status.replaceAll('_', ' ');
  }

  formatContactMethod(method: string): string {
    return method.replaceAll('_', ' ');
  }

  createWhatsAppLink(phoneNumber: string): string {
    const cleanedPhone = phoneNumber.replace(/\D/g, '');

    return `https://wa.me/${cleanedPhone}`;
  }

  createPhoneLink(phoneNumber: string): string {
    return `tel:${phoneNumber}`;
  }

  createEmailLink(email?: string | null): string {
    return email ? `mailto:${email}` : '#';
  }
}
