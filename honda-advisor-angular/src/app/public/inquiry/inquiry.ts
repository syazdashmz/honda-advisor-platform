import { ChangeDetectorRef, Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import {
  FormBuilder,
  ReactiveFormsModule,
  Validators
} from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatButtonToggleModule } from '@angular/material/button-toggle';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';

import { CarsService } from '../../core/services/cars.service';
import { InquiriesService } from '../../core/services/inquiries.service';
import { CarModel } from '../../core/models/car.model';
import {
  InquiryPayload,
  InquiryResult
} from '../../core/models/inquiry.model';

@Component({
  selector: 'app-inquiry',
  imports: [
    CommonModule,
    ReactiveFormsModule,
    RouterLink,
    MatButtonModule,
    MatButtonToggleModule,
    MatCheckboxModule,
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule,
    MatSlideToggleModule
  ],
  templateUrl: './inquiry.html',
  styleUrl: './inquiry.scss'
})
export class Inquiry implements OnInit {
  private readonly formBuilder = inject(FormBuilder);
  private readonly carsService = inject(CarsService);
  private readonly inquiriesService = inject(InquiriesService);
  private readonly cdr = inject(ChangeDetectorRef);

  cars: CarModel[] = [];

  isLoadingCars = true;
  isSubmitting = false;

  carsErrorMessage = '';
  formErrorMessage = '';
  successMessage = '';

  submittedInquiry?: InquiryResult;

  budgetRanges = [
    'Below RM 90k',
    'RM 90k - RM 120k',
    'RM 120k - RM 150k',
    'RM 150k - RM 200k',
    'Above RM 200k',
    'Not sure yet'
  ];

  monthlyBudgetRanges = [
    'Below RM 900',
    'RM 900 - RM 1,200',
    'RM 1,200 - RM 1,600',
    'RM 1,600 - RM 2,000',
    'Above RM 2,000',
    'Need advisor recommendation'
  ];

  buyingTimelines = [
    'Immediately',
    'Within 1 month',
    'Within 3 months',
    'Within 6 months',
    'Just surveying'
  ];

  inquiryForm = this.formBuilder.group({
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

    budget_range: ['Not sure yet'],
    monthly_budget: ['Need advisor recommendation'],
    buying_timeline: ['Just surveying'],

    needs_loan: [true],
    has_trade_in: [false],

    preferred_contact_method: [
      'whatsapp' as 'whatsapp' | 'phone_call' | 'email',
      [
        Validators.required
      ]
    ],

    message: [''],

    privacy_consent: [
      false,
      [
        Validators.requiredTrue
      ]
    ]
  });

  ngOnInit(): void {
    this.loadCars();
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
          'Unable to load Honda model list. You can still submit inquiry without selecting a model.';
        this.isLoadingCars = false;

        this.cdr.detectChanges();
      }
    });
  }

  submitInquiry(): void {
    this.formErrorMessage = '';
    this.successMessage = '';
    this.submittedInquiry = undefined;

    if (this.inquiryForm.invalid) {
      this.inquiryForm.markAllAsTouched();
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

    this.inquiriesService.createInquiry(payload).subscribe({
      next: (response) => {
        this.submittedInquiry = response.data;
        this.successMessage =
          'Inquiry submitted successfully. The advisor can follow up based on your preferred contact method.';

        this.isSubmitting = false;

        this.inquiryForm.reset({
          car_model_id: null,
          full_name: '',
          phone_number: '',
          email: '',
          budget_range: 'Not sure yet',
          monthly_budget: 'Need advisor recommendation',
          buying_timeline: 'Just surveying',
          needs_loan: true,
          has_trade_in: false,
          preferred_contact_method: 'whatsapp',
          message: '',
          privacy_consent: false
        });

        this.cdr.detectChanges();
      },
      error: (error) => {
        console.error('Inquiry submission error:', error);

        this.formErrorMessage =
          error?.error?.message ||
          'Unable to submit inquiry. Please make sure backend API is running.';

        this.isSubmitting = false;
        this.cdr.detectChanges();
      }
    });
  }

  resetForm(): void {
    this.inquiryForm.reset({
      car_model_id: null,
      full_name: '',
      phone_number: '',
      email: '',
      budget_range: 'Not sure yet',
      monthly_budget: 'Need advisor recommendation',
      buying_timeline: 'Just surveying',
      needs_loan: true,
      has_trade_in: false,
      preferred_contact_method: 'whatsapp',
      message: '',
      privacy_consent: false
    });

    this.formErrorMessage = '';
    this.successMessage = '';
    this.submittedInquiry = undefined;
  }

  getSelectedCarName(): string {
    const selectedCarId = Number(this.inquiryForm.value.car_model_id || 0);
    const car = this.cars.find((item) => item.id === selectedCarId);

    return car?.name || 'No model selected yet';
  }

  private buildPayload(): InquiryPayload {
    return {
      car_model_id: this.inquiryForm.value.car_model_id || null,
      full_name: String(this.inquiryForm.value.full_name || '').trim(),
      phone_number: String(this.inquiryForm.value.phone_number || '').trim(),
      email: this.inquiryForm.value.email
        ? String(this.inquiryForm.value.email).trim()
        : null,
      budget_range: this.inquiryForm.value.budget_range || null,
      monthly_budget: this.inquiryForm.value.monthly_budget || null,
      buying_timeline: this.inquiryForm.value.buying_timeline || null,
      needs_loan: Boolean(this.inquiryForm.value.needs_loan),
      has_trade_in: Boolean(this.inquiryForm.value.has_trade_in),
      preferred_contact_method:
        this.inquiryForm.value.preferred_contact_method || 'whatsapp',
      message: this.inquiryForm.value.message
        ? String(this.inquiryForm.value.message).trim()
        : null,
      privacy_consent: Boolean(this.inquiryForm.value.privacy_consent),
      lead_source: 'website_inquiry_page'
    };
  }

  private validatePayload(payload: InquiryPayload): string {
    if (!payload.full_name || payload.full_name.length < 3) {
      return 'Full name must be at least 3 characters.';
    }

    if (!payload.phone_number || payload.phone_number.length < 9) {
      return 'Please enter a valid phone number.';
    }

    if (!payload.privacy_consent) {
      return 'Privacy consent is required before submitting inquiry.';
    }

    const allowedContactMethods = ['whatsapp', 'phone_call', 'email'];

    if (!allowedContactMethods.includes(payload.preferred_contact_method)) {
      return 'Please choose a valid contact method.';
    }

    return '';
  }
}
