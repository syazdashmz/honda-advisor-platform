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
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';

import { AuthService } from '../../core/services/auth.service';
import { CarsService } from '../../core/services/cars.service';
import { LoanCalculationsService } from '../../core/services/loan-calculations.service';
import {
  CarDetail,
  CarModel,
  CarVariant
} from '../../core/models/car.model';
import {
  LoanCalculationPayload,
  LoanCalculationResult
} from '../../core/models/loan-calculation.model';

@Component({
  selector: 'app-loan-calculator',
  imports: [
    CommonModule,
    ReactiveFormsModule,
    RouterLink,
    MatButtonModule,
    MatButtonToggleModule,
    MatFormFieldModule,
    MatIconModule,
    MatInputModule,
    MatSelectModule
  ],
  templateUrl: './loan-calculator.html',
  styleUrl: './loan-calculator.scss'
})
export class LoanCalculator implements OnInit {
  private readonly formBuilder = inject(FormBuilder);
  private readonly authService = inject(AuthService);
  private readonly carsService = inject(CarsService);
  private readonly loanCalculationsService = inject(LoanCalculationsService);
  private readonly cdr = inject(ChangeDetectorRef);

  cars: CarModel[] = [];
  selectedCar?: CarDetail;
  variants: CarVariant[] = [];

  isLoadingCars = true;
  isLoadingVariants = false;
  isCalculating = false;
  isSaving = false;

  carsErrorMessage = '';
  formErrorMessage = '';
  successMessage = '';

  calculationResult?: LoanCalculationResult;

  loanForm = this.formBuilder.group({
    car_model_id: [null as number | null],
    car_variant_id: [null as number | null],

    car_price: [
      84900,
      [
        Validators.required,
        Validators.min(1)
      ]
    ],

    down_payment: [
      8490,
      [
        Validators.required,
        Validators.min(0)
      ]
    ],

    trade_in_value: [
      0,
      [
        Validators.required,
        Validators.min(0)
      ]
    ],

    interest_rate: [
      2.35,
      [
        Validators.required,
        Validators.min(0.01),
        Validators.max(20)
      ]
    ],

    loan_years: [
      9,
      [
        Validators.required,
        Validators.min(1),
        Validators.max(15)
      ]
    ]
  });

  loanYearOptions = [5, 7, 9];
  downPaymentQuickOptions = [10, 15, 20, 30];

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
          'Unable to load Honda model list. You can still enter car price manually.';
        this.isLoadingCars = false;

        this.cdr.detectChanges();
      }
    });
  }

  onCarModelChange(): void {
    const selectedCarId = Number(this.loanForm.value.car_model_id || 0);
    const car = this.cars.find((item) => item.id === selectedCarId);

    this.selectedCar = undefined;
    this.variants = [];
    this.calculationResult = undefined;
    this.successMessage = '';

    this.loanForm.patchValue({
      car_variant_id: null
    });

    if (!car) {
      return;
    }

    this.loanForm.patchValue({
      car_price: Number(car.estimated_price_from),
      down_payment: this.calculatePercentage(Number(car.estimated_price_from), 10)
    });

    this.loadCarVariants(car.slug);
  }

  loadCarVariants(slug: string): void {
    this.isLoadingVariants = true;

    this.carsService.getCarBySlug(slug).subscribe({
      next: (response) => {
        this.selectedCar = response.data;
        this.variants = response.data.variants || [];
        this.isLoadingVariants = false;
        this.cdr.detectChanges();
      },
      error: (error) => {
        console.error('Variants loading error:', error);

        this.variants = [];
        this.isLoadingVariants = false;
        this.cdr.detectChanges();
      }
    });
  }

  onVariantChange(): void {
    const selectedVariantId = Number(this.loanForm.value.car_variant_id || 0);
    const variant = this.variants.find((item) => item.id === selectedVariantId);

    this.calculationResult = undefined;
    this.successMessage = '';

    if (!variant) {
      return;
    }

    this.loanForm.patchValue({
      car_price: Number(variant.estimated_price),
      down_payment: this.calculatePercentage(Number(variant.estimated_price), 10)
    });
  }

  applyDownPaymentPercentage(percentage: number): void {
    const carPrice = Number(this.loanForm.value.car_price || 0);

    if (carPrice <= 0) {
      this.formErrorMessage = 'Please enter a valid car price first.';
      return;
    }

    this.loanForm.patchValue({
      down_payment: this.calculatePercentage(carPrice, percentage)
    });

    this.formErrorMessage = '';
    this.calculationResult = undefined;
  }

  calculateLoan(): void {
    this.formErrorMessage = '';
    this.successMessage = '';

    if (this.loanForm.invalid) {
      this.loanForm.markAllAsTouched();
      this.formErrorMessage = 'Please check all required fields before calculating.';
      return;
    }

    const payload = this.buildPayload();
    const validationError = this.validatePayload(payload);

    if (validationError) {
      this.formErrorMessage = validationError;
      return;
    }

    this.isCalculating = true;
    this.calculationResult = undefined;

    this.loanCalculationsService.calculateLoan(payload).subscribe({
      next: (response) => {
        this.calculationResult = response.data;
        this.isCalculating = false;
        this.cdr.detectChanges();
      },
      error: (error) => {
        console.error('Loan calculation error:', error);

        this.formErrorMessage =
          error?.error?.message ||
          'Unable to calculate loan estimate. Please make sure backend API is running.';

        this.isCalculating = false;
        this.cdr.detectChanges();
      }
    });
  }

  saveCalculation(): void {
    this.formErrorMessage = '';
    this.successMessage = '';

    if (!this.authService.isLoggedIn()) {
      this.formErrorMessage =
        'Please login or register before saving a loan calculation to your dashboard.';
      return;
    }

    if (this.loanForm.invalid) {
      this.loanForm.markAllAsTouched();
      this.formErrorMessage = 'Please complete the form before saving calculation.';
      return;
    }

    const payload = this.buildPayload();
    const validationError = this.validatePayload(payload);

    if (validationError) {
      this.formErrorMessage = validationError;
      return;
    }

    this.isSaving = true;

    this.loanCalculationsService.saveLoanCalculation(payload).subscribe({
      next: (response) => {
        this.calculationResult = response.data;
        this.successMessage = 'Loan calculation saved successfully.';
        this.isSaving = false;
        this.cdr.detectChanges();
      },
      error: (error) => {
        console.error('Save calculation error:', error);

        this.formErrorMessage =
          error?.error?.message ||
          'Unable to save calculation. Please check backend API connection.';

        this.isSaving = false;
        this.cdr.detectChanges();
      }
    });
  }

  resetCalculator(): void {
    this.loanForm.reset({
      car_model_id: null,
      car_variant_id: null,
      car_price: 84900,
      down_payment: 8490,
      trade_in_value: 0,
      interest_rate: 2.35,
      loan_years: 9
    });

    this.selectedCar = undefined;
    this.variants = [];
    this.calculationResult = undefined;
    this.formErrorMessage = '';
    this.successMessage = '';
  }

  getEstimatedLoanAmount(): number {
    const carPrice = Number(this.loanForm.value.car_price || 0);
    const downPayment = Number(this.loanForm.value.down_payment || 0);
    const tradeInValue = Number(this.loanForm.value.trade_in_value || 0);

    return Math.max(carPrice - downPayment - tradeInValue, 0);
  }

  getSelectedCarName(): string {
    const selectedCarId = Number(this.loanForm.value.car_model_id || 0);
    const car = this.cars.find((item) => item.id === selectedCarId);

    return car?.name || 'Manual estimate';
  }

  private buildPayload(): LoanCalculationPayload {
    return {
      car_model_id: this.loanForm.value.car_model_id || null,
      car_variant_id: this.loanForm.value.car_variant_id || null,
      car_price: Number(this.loanForm.value.car_price || 0),
      down_payment: Number(this.loanForm.value.down_payment || 0),
      trade_in_value: Number(this.loanForm.value.trade_in_value || 0),
      interest_rate: Number(this.loanForm.value.interest_rate || 0),
      loan_years: Number(this.loanForm.value.loan_years || 0)
    };
  }

  private validatePayload(payload: LoanCalculationPayload): string {
    if (payload.car_price <= 0) {
      return 'Car price must be greater than RM 0.';
    }

    if (payload.down_payment < 0) {
      return 'Down payment cannot be negative.';
    }

    if (payload.trade_in_value < 0) {
      return 'Trade-in value cannot be negative.';
    }

    if (payload.down_payment + payload.trade_in_value >= payload.car_price) {
      return 'Down payment and trade-in value cannot be equal to or higher than car price.';
    }

    if (payload.interest_rate <= 0 || payload.interest_rate > 20) {
      return 'Interest rate must be between 0.01% and 20%.';
    }

    if (payload.loan_years < 1 || payload.loan_years > 15) {
      return 'Loan period must be between 1 and 15 years.';
    }

    return '';
  }

  private calculatePercentage(amount: number, percentage: number): number {
    return Number(((amount * percentage) / 100).toFixed(2));
  }
}
