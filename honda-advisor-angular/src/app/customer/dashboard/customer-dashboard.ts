import { ChangeDetectorRef, Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';

import { AuthService } from '../../core/services/auth.service';
import { AppointmentsService } from '../../core/services/appointments.service';
import { AppointmentResult } from '../../core/models/appointment.model';

@Component({
  selector: 'app-customer-dashboard',
  imports: [
    CommonModule
  ],
  templateUrl: './customer-dashboard.html',
  styleUrl: './customer-dashboard.scss'
})
export class CustomerDashboard implements OnInit {
  private readonly authService = inject(AuthService);
  private readonly appointmentsService = inject(AppointmentsService);
  private readonly cdr = inject(ChangeDetectorRef);

  user = this.authService.currentUser;

  appointments: AppointmentResult[] = [];

  isLoadingAppointments = true;
  appointmentErrorMessage = '';

  ngOnInit(): void {
    this.loadMyAppointments();
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
      error: (error) => {
        console.error('Customer appointments loading error:', error);

        this.appointmentErrorMessage =
          'Unable to load your appointment history. Please make sure you are logged in.';
        this.isLoadingAppointments = false;
        this.cdr.detectChanges();
      }
    });
  }

  getStatusLabel(status: string): string {
    return status.replace('_', ' ');
  }

  formatAppointmentType(type: string): string {
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
}