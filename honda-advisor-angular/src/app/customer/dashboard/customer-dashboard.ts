import { ChangeDetectorRef, Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';

import { AuthService } from '../../core/services/auth.service';
import { AppointmentsService } from '../../core/services/appointments.service';
import { LoanCalculationsService } from '../../core/services/loan-calculations.service';
import { InquiriesService } from '../../core/services/inquiries.service';
import { AppointmentResult } from '../../core/models/appointment.model';
import { LoanCalculationResult } from '../../core/models/loan-calculation.model';
import { InquiryResult } from '../../core/models/inquiry.model';

@Component({
  selector: 'app-customer-dashboard',
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatButtonModule,
    MatIconModule,
    MatFormFieldModule,
    MatInputModule,
    RouterLink
  ],
  templateUrl: './customer-dashboard.html',
  styleUrl: './customer-dashboard.scss'
})
export class CustomerDashboard implements OnInit {
  private readonly authService = inject(AuthService);
  private readonly appointmentsService = inject(AppointmentsService);
  private readonly loanCalculationsService = inject(LoanCalculationsService);
  private readonly inquiriesService = inject(InquiriesService);
  private readonly fb = inject(FormBuilder);
  private readonly cdr = inject(ChangeDetectorRef);

  user = this.authService.currentUser;

  appointments: AppointmentResult[] = [];
  loanCalculations: LoanCalculationResult[] = [];
  inquiries: InquiryResult[] = [];

  isLoadingAppointments = true;
  isLoadingLoanCalculations = true;
  isLoadingInquiries = true;

  appointmentErrorMessage = '';
  loanCalculationErrorMessage = '';
  inquiryErrorMessage = '';

  isEditingProfile = false;
  isSavingProfile = false;
  profileSaveSuccess = '';
  profileSaveError = '';

  profileForm = this.fb.group({
    full_name: ['', [Validators.required, Validators.minLength(2)]],
    phone_number: ['']
  });

  ngOnInit(): void {
    this.loadMyAppointments();
    this.loadMyLoanCalculations();
    this.loadMyInquiries();
  }

  loadMyAppointments(): void {
    this.isLoadingAppointments = true;
    this.appointmentErrorMessage = '';

    this.appointmentsService.getMyAppointments().subscribe({
      next: (response) => {
        this.appointments = response.data || [];
        this.isLoadingAppointments = false;
        this.cdr.detectChanges();
      },
      error: () => {
        this.appointmentErrorMessage =
          'Unable to load your appointment history. Please make sure you are logged in.';
        this.isLoadingAppointments = false;
        this.cdr.detectChanges();
      }
    });
  }

  loadMyLoanCalculations(): void {
    this.isLoadingLoanCalculations = true;
    this.loanCalculationErrorMessage = '';

    this.loanCalculationsService.getMyLoanCalculations().subscribe({
      next: (response) => {
        this.loanCalculations = response.data || [];
        this.isLoadingLoanCalculations = false;
        this.cdr.detectChanges();
      },
      error: () => {
        this.loanCalculationErrorMessage =
          'Unable to load your saved loan calculations. Please make sure you are logged in.';
        this.isLoadingLoanCalculations = false;
        this.cdr.detectChanges();
      }
    });
  }

  loadMyInquiries(): void {
    this.isLoadingInquiries = true;
    this.inquiryErrorMessage = '';

    this.inquiriesService.getMyInquiries().subscribe({
      next: (response) => {
        this.inquiries = response.data || [];
        this.isLoadingInquiries = false;
        this.cdr.detectChanges();
      },
      error: () => {
        this.inquiryErrorMessage = 'Unable to load your inquiry history.';
        this.isLoadingInquiries = false;
        this.cdr.detectChanges();
      }
    });
  }

  startEditingProfile(): void {
    const u = this.user();
    this.profileForm.patchValue({
      full_name: u?.full_name || '',
      phone_number: u?.phone_number || ''
    });
    this.profileSaveSuccess = '';
    this.profileSaveError = '';
    this.isEditingProfile = true;
  }

  cancelEditingProfile(): void {
    this.isEditingProfile = false;
    this.profileForm.reset();
    this.profileSaveSuccess = '';
    this.profileSaveError = '';
  }

  saveProfile(): void {
    if (this.profileForm.invalid || this.isSavingProfile) {
      return;
    }

    this.isSavingProfile = true;
    this.profileSaveSuccess = '';
    this.profileSaveError = '';

    const { full_name, phone_number } = this.profileForm.value;

    this.authService.updateProfile({
      full_name: full_name!,
      phone_number: phone_number || undefined
    }).subscribe({
      next: () => {
        this.profileSaveSuccess = 'Profile updated successfully.';
        this.isSavingProfile = false;
        this.isEditingProfile = false;
        this.cdr.detectChanges();
      },
      error: (err) => {
        this.profileSaveError = err?.error?.message || 'Failed to update profile. Please try again.';
        this.isSavingProfile = false;
        this.cdr.detectChanges();
      }
    });
  }

  getStatusLabel(status: string): string {
    return status.replaceAll('_', ' ');
  }

  getInquiryStatusClass(status: string): string {
    return status;
  }

  formatAppointmentType(type: string): string {
    return type.replaceAll('_', ' ');
  }

  formatTimeSlot(time: string): string {
    if (!time) return '-';
    const [hour, minute] = time.split(':');
    const numericHour = Number(hour);
    const suffix = numericHour >= 12 ? 'PM' : 'AM';
    const displayHour = numericHour > 12 ? numericHour - 12 : numericHour;
    return `${displayHour}:${minute} ${suffix}`;
  }

  formatDate(dateStr: string): string {
    if (!dateStr) return '-';
    // Parse only the date portion to avoid UTC-offset shift on MySQL DATE fields
    const [year, month, day] = dateStr.substring(0, 10).split('-').map(Number);
    const d = new Date(year, month - 1, day);
    return d.toLocaleDateString('en-MY', {
      weekday: 'short',
      day: 'numeric',
      month: 'short',
      year: 'numeric'
    });
  }

  formatCurrency(value?: number | null): string {
    return new Intl.NumberFormat('en-MY', {
      style: 'currency',
      currency: 'MYR',
      maximumFractionDigits: 0
    }).format(Number(value || 0));
  }
}
