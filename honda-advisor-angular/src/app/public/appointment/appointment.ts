import { ChangeDetectorRef, Component, OnInit, computed, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import {
  FormBuilder,
  ReactiveFormsModule,
  Validators
} from '@angular/forms';

import { AuthService } from '../../core/services/auth.service';
import { CarsService } from '../../core/services/cars.service';
import { AppointmentsService } from '../../core/services/appointments.service';

import { CarModel } from '../../core/models/car.model';
import {
  AppointmentPayload,
  AppointmentResult,
  AppointmentType
} from '../../core/models/appointment.model';

@Component({
  selector: 'app-appointment',
  imports: [
    CommonModule,
    ReactiveFormsModule,
    RouterLink
  ],
  templateUrl: './appointment.html',
  styleUrl: './appointment.scss'
})
export class Appointment implements OnInit {
  private readonly formBuilder = inject(FormBuilder);
  private readonly authService = inject(AuthService);
  private readonly carsService = inject(CarsService);
  private readonly appointmentsService = inject(AppointmentsService);
  private readonly cdr = inject(ChangeDetectorRef);

  user = this.authService.currentUser;
  isLoggedIn = computed(() => this.authService.isLoggedIn());

  cars: CarModel[] = [];
  unavailableSlots: string[] = [];

  isLoadingCars = true;
  isLoadingAvailability = false;
  isSubmitting = false;

  carsErrorMessage = '';
  formErrorMessage = '';
  successMessage = '';

  submittedAppointment?: AppointmentResult;

  appointmentTypes: {
    value: AppointmentType;
    label: string;
    icon: string;
    description: string;
  }[] = [
    {
      value: 'showroom_visit',
      label: 'Showroom Visit',
      icon: '🏢',
      description: 'Visit the dealership showroom for model consultation.'
    },
    {
      value: 'test_drive',
      label: 'Test Drive',
      icon: '🚗',
      description: 'Request a test drive appointment for preferred Honda model.'
    },
    {
      value: 'loan_consultation',
      label: 'Loan Consultation',
      icon: '🧮',
      description: 'Discuss monthly estimate, documents, and loan direction.'
    },
    {
      value: 'trade_in_valuation',
      label: 'Trade-in Valuation',
      icon: '🔁',
      description: 'Discuss your current car and trade-in possibility.'
    },
    {
      value: 'model_comparison',
      label: 'Model Comparison',
      icon: '⚖️',
      description: 'Compare models or variants before deciding.'
    },
    {
      value: 'delivery_discussion',
      label: 'Delivery Discussion',
      icon: '🎁',
      description: 'Discuss delivery planning and next steps.'
    }
  ];

  timeSlots = [
    '09:00:00',
    '10:00:00',
    '11:00:00',
    '12:00:00',
    '14:00:00',
    '15:00:00',
    '16:00:00',
    '17:00:00'
  ];

  appointmentForm = this.formBuilder.group({
    car_model_id: [null as number | null],

    full_name: [
      '',
      [
        Validators.required,
        Validators.minLength(3)
      ]
    ],

    phone_number: [
      '',
      [
        Validators.required,
        Validators.minLength(9)
      ]
    ],

    email: [
      '',
      [
        Validators.email
      ]
    ],

    appointment_type: [
      'showroom_visit' as AppointmentType,
      [
        Validators.required
      ]
    ],

    preferred_date: [
      '',
      [
        Validators.required
      ]
    ],

    preferred_time: [
      '',
      [
        Validators.required
      ]
    ],

    message: [''],

    appointment_consent: [
      false,
      [
        Validators.requiredTrue
      ]
    ]
  });

  ngOnInit(): void {
    this.loadCars();
    this.prefillCustomerDetails();
  }

  loadCars(): void {
    this.isLoadingCars = true;
    this.carsErrorMessage = '';

    this.carsService.getCars().subscribe({
      next: (response) => {
        this.cars = response.data || [];
        this.isLoadingCars = false;
        this.cdr.detectChanges();
      },
      error: (error) => {
        console.error('Cars loading error:', error);

        this.carsErrorMessage =
          'Unable to load Honda model list. You can still request appointment without selecting a model.';
        this.isLoadingCars = false;

        this.cdr.detectChanges();
      }
    });
  }

  prefillCustomerDetails(): void {
    const currentUser = this.user();

    if (!currentUser) {
      return;
    }

    this.appointmentForm.patchValue({
      full_name: currentUser.full_name || '',
      phone_number: currentUser.phone_number || '',
      email: currentUser.email || ''
    });
  }

  onDateChange(): void {
    const selectedDate = this.appointmentForm.value.preferred_date || '';

    this.unavailableSlots = [];
    this.formErrorMessage = '';

    this.appointmentForm.patchValue({
      preferred_time: ''
    });

    if (!selectedDate) {
      return;
    }

    if (selectedDate < this.getMinDate()) {
      this.formErrorMessage = 'Preferred appointment date cannot be in the past.';
      return;
    }

    if (selectedDate > this.getMaxDate()) {
      this.formErrorMessage = 'Appointments can only be requested within 1 month from today.';
      return;
    }

    this.loadAvailability(selectedDate);
  }

  loadAvailability(date: string): void {
    this.isLoadingAvailability = true;

    this.appointmentsService.getAvailability(date).subscribe({
      next: (response) => {
        this.unavailableSlots = response.data.unavailable_slots || [];
        this.isLoadingAvailability = false;
        this.cdr.detectChanges();
      },
      error: (error) => {
        console.error('Availability loading error:', error);

        this.unavailableSlots = [];
        this.isLoadingAvailability = false;
        this.cdr.detectChanges();
      }
    });
  }

  isSlotUnavailable(slot: string): boolean {
    return this.unavailableSlots.includes(slot) || this.isPastTimeSlot(slot);
  }

  isPastTimeSlot(slot: string): boolean {
    const selectedDate = this.appointmentForm.value.preferred_date || '';

    if (!selectedDate || selectedDate !== this.getMinDate()) {
      return false;
    }

    return slot <= this.getCurrentTimeString();
  }

  submitAppointment(): void {
    this.formErrorMessage = '';
    this.successMessage = '';
    this.submittedAppointment = undefined;

    if (!this.isLoggedIn()) {
      this.formErrorMessage = 'Please login or register before requesting an appointment.';
      return;
    }

    if (this.appointmentForm.invalid) {
      this.appointmentForm.markAllAsTouched();
      this.formErrorMessage = 'Please complete all required fields before submitting.';
      return;
    }

    const payload = this.buildPayload();
    const validationError = this.validatePayload(payload);

    if (validationError) {
      this.formErrorMessage = validationError;
      return;
    }

    this.isSubmitting = true;

    this.appointmentsService.createAppointment(payload).subscribe({
      next: (response) => {
        this.submittedAppointment = response.data;
        this.successMessage =
          'Appointment request submitted successfully. The advisor will confirm your appointment slot.';

        this.isSubmitting = false;

        const currentUser = this.user();

        this.appointmentForm.reset({
          car_model_id: null,
          full_name: currentUser?.full_name || '',
          phone_number: currentUser?.phone_number || '',
          email: currentUser?.email || '',
          appointment_type: 'showroom_visit',
          preferred_date: '',
          preferred_time: '',
          message: '',
          appointment_consent: false
        });

        this.unavailableSlots = [];

        this.cdr.detectChanges();
      },
      error: (error) => {
        console.error('Appointment submission error:', error);

        this.formErrorMessage =
          error?.error?.message ||
          'Unable to submit appointment. Please make sure you are logged in and backend API is running.';

        this.isSubmitting = false;
        this.cdr.detectChanges();
      }
    });
  }

  resetForm(): void {
    const currentUser = this.user();

    this.appointmentForm.reset({
      car_model_id: null,
      full_name: currentUser?.full_name || '',
      phone_number: currentUser?.phone_number || '',
      email: currentUser?.email || '',
      appointment_type: 'showroom_visit',
      preferred_date: '',
      preferred_time: '',
      message: '',
      appointment_consent: false
    });

    this.unavailableSlots = [];
    this.formErrorMessage = '';
    this.successMessage = '';
    this.submittedAppointment = undefined;
  }

  getMinDate(): string {
    const today = new Date();
    return this.formatDateForInput(today);
  }

  getMaxDate(): string {
    const maxDate = new Date();
    maxDate.setMonth(maxDate.getMonth() + 1);
    return this.formatDateForInput(maxDate);
  }

  getCurrentTimeString(): string {
    const now = new Date();

    const hour = String(now.getHours()).padStart(2, '0');
    const minute = String(now.getMinutes()).padStart(2, '0');

    return `${hour}:${minute}:00`;
  }

  getSelectedCarName(): string {
    const selectedCarId = Number(this.appointmentForm.value.car_model_id || 0);
    const car = this.cars.find((item) => item.id === selectedCarId);

    return car?.name || 'Advisor recommendation';
  }

  getAppointmentTypeLabel(value?: AppointmentType | null): string {
    const type = this.appointmentTypes.find((item) => item.value === value);
    return type?.label || 'Appointment';
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

  private buildPayload(): AppointmentPayload {
    return {
      car_model_id: this.appointmentForm.value.car_model_id || null,
      full_name: String(this.appointmentForm.value.full_name || '').trim(),
      phone_number: String(this.appointmentForm.value.phone_number || '').trim(),
      email: this.appointmentForm.value.email
        ? String(this.appointmentForm.value.email).trim()
        : null,
      appointment_type:
        this.appointmentForm.value.appointment_type || 'showroom_visit',
      preferred_date: String(this.appointmentForm.value.preferred_date || ''),
      preferred_time: String(this.appointmentForm.value.preferred_time || ''),
      message: this.appointmentForm.value.message
        ? String(this.appointmentForm.value.message).trim()
        : null
    };
  }

  private validatePayload(payload: AppointmentPayload): string {
    if (!payload.full_name || payload.full_name.length < 3) {
      return 'Full name must be at least 3 characters.';
    }

    if (!payload.phone_number || payload.phone_number.length < 9) {
      return 'Please enter a valid phone number.';
    }

    if (!payload.appointment_type) {
      return 'Please select appointment type.';
    }

    if (!payload.preferred_date) {
      return 'Please select preferred appointment date.';
    }

    if (payload.preferred_date < this.getMinDate()) {
      return 'Preferred appointment date cannot be in the past.';
    }

    if (payload.preferred_date > this.getMaxDate()) {
      return 'Appointments can only be requested within 1 month from today.';
    }

    if (!payload.preferred_time) {
      return 'Please select preferred appointment time.';
    }

    if (this.isPastTimeSlot(payload.preferred_time)) {
      return 'This appointment time has already passed for today. Please choose another time.';
    }

    if (this.isSlotUnavailable(payload.preferred_time)) {
      return 'This appointment time is already confirmed. Please choose another time slot.';
    }

    if (!this.appointmentForm.value.appointment_consent) {
      return 'Appointment consent is required before submitting.';
    }

    return '';
  }

  private formatDateForInput(date: Date): string {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');

    return `${year}-${month}-${day}`;
  }
}
