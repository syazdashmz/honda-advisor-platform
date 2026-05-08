import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { CommonModule, CurrencyPipe } from '@angular/common';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { MatIconModule } from '@angular/material/icon';

import { CarsService } from '../../core/services/cars.service';
import {
  CarDetail as CarDetailModel,
  CarVariant
} from '../../core/models/car.model';

@Component({
  selector: 'app-car-detail',
  imports: [
    CommonModule,
    MatIconModule,
    RouterLink,
    CurrencyPipe
  ],
  templateUrl: './car-detail.html',
  styleUrl: './car-detail.scss'
})
export class CarDetail implements OnInit {
  car?: CarDetailModel;
  selectedVariant?: CarVariant;

  isLoading = true;
  errorMessage = '';

  constructor(
    private route: ActivatedRoute,
    private carsService: CarsService,
    private cdr: ChangeDetectorRef
  ) {}

  ngOnInit(): void {
    const slug = this.route.snapshot.paramMap.get('slug');

    if (!slug) {
      this.errorMessage = 'Car model slug is missing.';
      this.isLoading = false;
      this.cdr.detectChanges();
      return;
    }

    this.loadCarDetail(slug);
  }

  loadCarDetail(slug: string): void {
    this.isLoading = true;
    this.errorMessage = '';

    console.log('Fetching car detail for slug:', slug);

    this.carsService.getCarBySlug(slug).subscribe({
      next: (response) => {
        console.log('Car detail API response:', response);

        this.car = response.data;
        this.selectedVariant = this.car?.variants?.[0];

        this.isLoading = false;
        this.cdr.detectChanges();
      },
      error: (error) => {
        console.error('Car detail API error:', error);

        this.errorMessage =
          'Failed to load car details. Please make sure Express API is running and this car slug exists.';
        this.isLoading = false;

        this.cdr.detectChanges();
      }
    });
  }

  selectVariant(variant: CarVariant): void {
    this.selectedVariant = variant;
  }
}
