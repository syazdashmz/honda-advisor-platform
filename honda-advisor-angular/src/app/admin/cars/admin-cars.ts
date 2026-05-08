import { ChangeDetectorRef, Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import {
  FormBuilder,
  ReactiveFormsModule,
  Validators
} from '@angular/forms';

import { AdminCarsService } from '../../core/services/admin-cars.service';
import {
  AdminCarDetail,
  AdminCarModel
} from '../../core/models/admin-car.model';
import {
  CarModel,
  CarVariant
} from '../../core/models/car.model';

@Component({
  selector: 'app-admin-cars',
  imports: [
    CommonModule,
    ReactiveFormsModule
  ],
  templateUrl: './admin-cars.html',
  styleUrl: './admin-cars.scss'
})
export class AdminCars implements OnInit {
  private readonly formBuilder = inject(FormBuilder);
  private readonly adminCarsService = inject(AdminCarsService);
  private readonly cdr = inject(ChangeDetectorRef);

  cars: AdminCarModel[] = [];
  selectedCar?: AdminCarDetail;
  selectedVariant?: CarVariant;

  isLoadingCars = true;
  isLoadingDetail = false;
  isSavingCar = false;
  isSavingVariant = false;

  errorMessage = '';
  successMessage = '';

  carForm = this.formBuilder.nonNullable.group({
    name: ['', [Validators.required]],
    slug: ['', [Validators.required]],
    category: ['sedan', [Validators.required]],
    fuel_type: ['petrol', [Validators.required]],
    estimated_price_from: [0, [Validators.required, Validators.min(1)]],
    short_description: [''],
    best_for: [''],
    hero_image_url: [''],
    brochure_url: [''],
    is_featured: [false],
    is_active: [true],
    data_mode: ['mock'],
    is_mock_data: [true],
    data_status: ['Updated by admin']
  });

  variantForm = this.formBuilder.nonNullable.group({
    variant_name: ['', [Validators.required]],
    estimated_price: [0, [Validators.required, Validators.min(1)]],
    engine: [''],
    transmission: [''],
    fuel_type: ['petrol'],
    key_highlights: [''],
    recommended_for: [''],
    sort_order: [0],
    is_active: [true],
    data_mode: ['mock'],
    is_mock_data: [true],
    data_status: ['Updated by admin']
  });

  ngOnInit(): void {
    this.loadCars();
  }

  loadCars(): void {
    this.isLoadingCars = true;
    this.errorMessage = '';

    this.adminCarsService.getAdminCars().subscribe({
      next: (response) => {
        this.cars = response.data || [];
        this.isLoadingCars = false;
        this.cdr.detectChanges();
      },
      error: (error) => {
        console.error('Admin cars load error:', error);

        this.errorMessage =
          error?.error?.message || 'Unable to load admin car list. Please make sure backend API is running and admin token is valid.';

        this.isLoadingCars = false;
        this.cdr.detectChanges();
      }
    });
  }

  selectCar(carId: number): void {
    this.isLoadingDetail = true;
    this.errorMessage = '';
    this.successMessage = '';
    this.selectedVariant = undefined;

    this.adminCarsService.getAdminCarById(carId).subscribe({
      next: (response) => {
        this.selectedCar = response.data;

        this.carForm.patchValue({
          name: this.selectedCar.name || '',
          slug: this.selectedCar.slug || '',
          category: this.selectedCar.category || 'sedan',
          fuel_type: this.selectedCar.fuel_type || 'petrol',
          estimated_price_from: Number(this.selectedCar.estimated_price_from || 0),
          short_description: this.selectedCar.short_description || '',
          best_for: this.selectedCar.best_for || '',
          hero_image_url: this.selectedCar.hero_image_url || '',
          brochure_url: this.selectedCar.brochure_url || '',
          is_featured: Boolean(this.selectedCar.is_featured),
          is_active: Boolean(this.selectedCar.is_active),
          data_mode: this.selectedCar.data_mode || 'mock',
          is_mock_data: Boolean(this.selectedCar.is_mock_data),
          data_status: this.selectedCar.data_status || 'Updated by admin'
        });

        this.isLoadingDetail = false;
        this.cdr.detectChanges();
      },
      error: (error) => {
        console.error('Admin car detail error:', error);

        this.errorMessage =
          error?.error?.message || 'Unable to load selected car details.';

        this.isLoadingDetail = false;
        this.cdr.detectChanges();
      }
    });
  }

  saveCarModel(): void {
    if (!this.selectedCar) {
      this.errorMessage = 'Please select a car first.';
      return;
    }

    if (this.carForm.invalid) {
      this.carForm.markAllAsTouched();
      this.errorMessage = 'Please complete required car model fields.';
      return;
    }

    this.isSavingCar = true;
    this.errorMessage = '';
    this.successMessage = '';

    const payload = this.buildCarModelPayload();

    this.adminCarsService
      .updateCarModel(this.selectedCar.id, payload)
      .subscribe({
        next: () => {
          const selectedCarId = this.selectedCar?.id;

          this.successMessage =
            'Car model updated successfully. Public pages and loan calculator will now use this latest data.';

          this.isSavingCar = false;
          this.loadCars();

          if (selectedCarId) {
            this.selectCar(selectedCarId);
          }

          this.cdr.detectChanges();
        },
        error: (error) => {
          console.error('Save car error:', error);

          this.errorMessage =
            error?.error?.message || 'Unable to update car model.';

          this.isSavingCar = false;
          this.cdr.detectChanges();
        }
      });
  }

  selectVariant(variant: CarVariant): void {
    this.selectedVariant = variant;
    this.successMessage = '';
    this.errorMessage = '';

    this.variantForm.patchValue({
      variant_name: variant.variant_name || '',
      estimated_price: Number(variant.estimated_price || 0),
      engine: variant.engine || '',
      transmission: variant.transmission || '',
      fuel_type: variant.fuel_type || 'petrol',
      key_highlights: variant.key_highlights || '',
      recommended_for: variant.recommended_for || '',
      sort_order: Number(variant.sort_order || 0),
      is_active: Boolean(variant.is_active),
      data_mode: variant.data_mode || 'mock',
      is_mock_data: Boolean(variant.is_mock_data),
      data_status: variant.data_status || 'Updated by admin'
    });
  }

  saveVariant(): void {
    if (!this.selectedCar || !this.selectedVariant) {
      this.errorMessage = 'Please select a car variant first.';
      return;
    }

    if (this.variantForm.invalid) {
      this.variantForm.markAllAsTouched();
      this.errorMessage = 'Please complete required variant fields.';
      return;
    }

    this.isSavingVariant = true;
    this.errorMessage = '';
    this.successMessage = '';

    const payload = this.buildVariantPayload();

    this.adminCarsService
      .updateCarVariant(
        this.selectedCar.id,
        this.selectedVariant.id,
        payload
      )
      .subscribe({
        next: () => {
          const selectedCarId = this.selectedCar?.id;

          this.successMessage =
            'Variant updated successfully. Loan calculator will use the latest variant price.';

          this.isSavingVariant = false;

          if (selectedCarId) {
            this.selectCar(selectedCarId);
          }

          this.cdr.detectChanges();
        },
        error: (error) => {
          console.error('Save variant error:', error);

          this.errorMessage =
            error?.error?.message || 'Unable to update variant.';

          this.isSavingVariant = false;
          this.cdr.detectChanges();
        }
      });
  }

  private buildCarModelPayload(): Partial<CarModel> {
    const value = this.carForm.getRawValue();

    return {
      name: value.name.trim(),
      slug: value.slug.trim(),
      category: value.category as CarModel['category'],
      fuel_type: value.fuel_type as CarModel['fuel_type'],
      estimated_price_from: Number(value.estimated_price_from),
      short_description: value.short_description.trim(),
      best_for: value.best_for.trim(),
      hero_image_url: value.hero_image_url.trim(),
      brochure_url: value.brochure_url.trim() || null,
      is_featured: Boolean(value.is_featured),
      is_active: Boolean(value.is_active),
      data_mode: value.data_mode as CarModel['data_mode'],
      is_mock_data: Boolean(value.is_mock_data),
      data_status: value.data_status.trim()
    };
  }

  private buildVariantPayload(): Partial<CarVariant> {
    const value = this.variantForm.getRawValue();

    return {
      variant_name: value.variant_name.trim(),
      estimated_price: Number(value.estimated_price),
      engine: value.engine.trim(),
      transmission: value.transmission.trim(),
      fuel_type: value.fuel_type as CarVariant['fuel_type'],
      key_highlights: value.key_highlights.trim(),
      recommended_for: value.recommended_for.trim(),
      sort_order: Number(value.sort_order),
      is_active: Boolean(value.is_active),
      data_mode: value.data_mode as CarVariant['data_mode'],
      is_mock_data: Boolean(value.is_mock_data),
      data_status: value.data_status.trim()
    };
  }
}