import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { CommonModule, CurrencyPipe } from '@angular/common';
import { RouterLink } from '@angular/router';
import { MatButtonModule } from '@angular/material/button';
import { MatButtonToggleModule } from '@angular/material/button-toggle';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';

import { CarsService } from '../../core/services/cars.service';
import { CarModel } from '../../core/models/car.model';

@Component({
  selector: 'app-cars',
  imports: [
    CommonModule,
    MatButtonModule,
    MatButtonToggleModule,
    MatFormFieldModule,
    MatIconModule,
    MatInputModule,
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
  searchTerm = '';

  categoryFilters = [
    { value: 'all', label: 'All' },
    { value: 'sedan', label: 'Sedan' },
    { value: 'hatchback', label: 'Hatchback' },
    { value: 'suv', label: 'SUV' },
    { value: 'ev', label: 'EV' },
    { value: 'performance', label: 'Performance' }
  ];

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
        this.applyFilters();
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
    this.applyFilters();
  }

  onSearchInput(event: Event): void {
    const input = event.target as HTMLInputElement;
    this.searchTerm = input.value;
    this.applyFilters();
  }

  clearSearch(): void {
    this.searchTerm = '';
    this.applyFilters();
  }

  private applyFilters(): void {
    const term = this.searchTerm.trim().toLowerCase();

    this.filteredCars = this.cars.filter((car) => {
      const matchesCategory =
        this.selectedCategory === 'all' || car.category === this.selectedCategory;

      const searchableText = [
        car.name,
        car.category,
        car.fuel_type,
        car.short_description,
        car.best_for
      ].join(' ').toLowerCase();

      const matchesSearch = !term || searchableText.includes(term);

      return matchesCategory && matchesSearch;
    });
  }

  getResultLabel(): string {
    const count = this.filteredCars.length;
    const noun = count === 1 ? 'model' : 'models';
    return `${count} ${noun} available`;
  }
}
