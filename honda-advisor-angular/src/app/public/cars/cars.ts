import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { CommonModule, CurrencyPipe } from '@angular/common';
import { RouterLink } from '@angular/router';

import { CarsService } from '../../core/services/cars.service';
import { CarModel } from '../../core/models/car.model';

@Component({
  selector: 'app-cars',
  imports: [
    CommonModule,
    RouterLink,
    CurrencyPipe
  ],
  templateUrl: './cars.html',
  styleUrl: './cars.scss'
})
export class Cars implements OnInit {
  cars: CarModel[] = [];
  filteredCars: CarModel[] = [];

  isLoading = true;
  errorMessage = '';
  selectedCategory = 'all';

  constructor(
    private carsService: CarsService,
    private cdr: ChangeDetectorRef
  ) {}

  ngOnInit(): void {
    this.loadCars();
  }

  loadCars(): void {
    this.isLoading = true;
    this.errorMessage = '';

    this.carsService.getCars().subscribe({
      next: (response) => {
        this.cars = response.data || [];
        this.filteredCars = [...this.cars];
        this.isLoading = false;

        this.cdr.detectChanges();
      },
      error: (error) => {
        console.error('Cars API error:', error);

        this.errorMessage =
          'Failed to load Honda models. Please make sure Express API is running at http://localhost:3000.';
        this.isLoading = false;

        this.cdr.detectChanges();
      }
    });
  }

  filterByCategory(category: string): void {
    this.selectedCategory = category;

    if (category === 'all') {
      this.filteredCars = [...this.cars];
      return;
    }

    this.filteredCars = this.cars.filter((car) => car.category === category);
  }
}