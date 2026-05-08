import { ChangeDetectorRef, Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';

import { AppointmentsService } from '../../core/services/appointments.service';
import {
  AppointmentResult,
  AppointmentStatus
} from '../../core/models/appointment.model';

@Component({
  selector: 'app-admin-appointments',
  imports: [
    CommonModule
  ],
  templateUrl: './admin-appointments.html',
  styleUrl: './admin-appointments.scss'
})
export class AdminAppointments implements OnInit {
  private readonly appointmentsService = inject(AppointmentsService);
  private readonly cdr = inject(ChangeDetectorRef);

  appointments: AppointmentResult[] = [];
  filteredAppointments: AppointmentResult[] = [];

  selectedStatus = 'all';

  isLoading = true;
  updatingAppointmentId: number | null = null;

  errorMessage = '';
  successMessage = '';

  statusFilters = [
    'all',
    'pending',
    'confirmed',
    'declined',
    'cancelled',
    'completed'
  ];

  ngOnInit(): void {
    this.loadAppointments();
  }

  loadAppointments(): void {
    this.isLoading = true;
    this.errorMessage = '';
    this.successMessage = '';

    this.appointmentsService.getAdminAppointments().subscribe({
      next: (response) => {
        this.appointments = response.data || [];
        this.applyFilter(this.selectedStatus);
        this.isLoading = false;
        this.cdr.detectChanges();
      },
      error: (error) => {
        console.error('Admin appointments load error:', error);

        this.errorMessage =
          error?.error?.message || 'Unable to load appointments.';

        this.isLoading = false;
        this.cdr.detectChanges();
      }
    });
  }

  applyFilter(status: string): void {
    this.selectedStatus = status;

    if (status === 'all') {
      this.filteredAppointments = this.appointments;
      return;
    }

    this.filteredAppointments = this.appointments.filter(
      (appointment) => appointment.status === status
    );
  }

  updateStatus(appointment: AppointmentResult, status: AppointmentStatus): void {
    this.errorMessage = '';
    this.successMessage = '';
    this.updatingAppointmentId = appointment.id;

    this.appointmentsService.updateAppointmentStatus(appointment.id, status).subscribe({
      next: (response) => {
        this.successMessage = response.message;
        this.updatingAppointmentId = null;
        this.loadAppointments();
        this.cdr.detectChanges();
      },
      error: (error) => {
        console.error('Appointment status update error:', error);

        this.errorMessage =
          error?.error?.message || 'Unable to update appointment status.';

        this.updatingAppointmentId = null;
        this.cdr.detectChanges();
      }
    });
  }

  formatStatus(status: string): string {
    return status.replaceAll('_', ' ');
  }

  formatType(type: string): string {
    return type.replaceAll('_', ' ');
  }

  formatTimeSlot(time: string): string {
    if (!time) {
      return '-';
    }

    const [hour, minute] = time.split(':');
    const numericHour = Number(hour);
    const suffix = numericHour >= 12 ? 'PM' : 'AM';
    const displayHour = numericHour > 12 ? numericHour - 12 : numericHour;

    return `${displayHour}:${minute} ${suffix}`;
  }

  getStatusCount(status: string): number {
    if (status === 'all') {
      return this.appointments.length;
    }

    return this.appointments.filter((appointment) => appointment.status === status).length;
  }
}