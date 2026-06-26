import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { CommonModule, CurrencyPipe } from '@angular/common';
import { RouterLink } from '@angular/router';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatSelectModule } from '@angular/material/select';

import { CarsService } from '../../core/services/cars.service';
import {
  CarDetail as CarDetailModel,
  CarModel,
  CarVariant
} from '../../core/models/car.model';

interface CompareSlot {
  id: string;
  label: string;
  selectedSlug: string;
  car?: CarDetailModel;
  selectedVariant?: CarVariant;
  isLoading: boolean;
  errorMessage: string;
}

@Component({
  selector: 'app-compare',
  imports: [
    CommonModule,
    CurrencyPipe,
    RouterLink,
    MatButtonModule,
    MatFormFieldModule,
    MatIconModule,
    MatSelectModule
  ],
  templateUrl: './compare.html',
  styleUrl: './compare.scss'
})
export class Compare implements OnInit {
  cars: CarModel[] = [];
  slots: CompareSlot[] = [
    {
      id: 'choice-a',
      label: 'Choice A',
      selectedSlug: '',
      isLoading: false,
      errorMessage: ''
    },
    {
      id: 'choice-b',
      label: 'Choice B',
      selectedSlug: '',
      isLoading: false,
      errorMessage: ''
    },
    {
      id: 'choice-c',
      label: 'Choice C',
      selectedSlug: '',
      isLoading: false,
      errorMessage: ''
    }
  ];

  isLoadingCars = true;
  errorMessage = '';

  quickFilters = [
    {
      icon: 'payments',
      title: 'Budget clarity',
      text: 'Compare starting prices and selected variant prices before asking for a final quote.'
    },
    {
      icon: 'speed',
      title: 'Driving feel',
      text: 'Check engine, transmission, fuel type, and highlights in one clean view.'
    },
    {
      icon: 'person_search',
      title: 'Advisor-ready',
      text: 'Use the shortlist to send a more specific inquiry or appointment request.'
    }
  ];

  constructor(
    private readonly carsService: CarsService,
    private readonly cdr: ChangeDetectorRef
  ) {}

  ngOnInit(): void {
    this.loadCars();
  }

  loadCars(): void {
    this.isLoadingCars = true;
    this.errorMessage = '';

    this.carsService.getCars().subscribe({
      next: (response) => {
        this.cars = response.data || [];
        this.applyDefaultSelection();
        this.isLoadingCars = false;
        this.cdr.detectChanges();
      },
      error: (error) => {
        console.error('Compare cars API error:', error);
        this.errorMessage =
          'Unable to load Honda models for comparison. Please make sure the API is running.';
        this.isLoadingCars = false;
        this.cdr.detectChanges();
      }
    });
  }

  onModelChange(slot: CompareSlot, slug: string): void {
    slot.selectedSlug = slug;
    slot.car = undefined;
    slot.selectedVariant = undefined;
    slot.errorMessage = '';

    if (!slug) {
      this.cdr.detectChanges();
      return;
    }

    this.loadSlotDetail(slot, slug);
  }

  selectVariant(slot: CompareSlot, variant: CarVariant): void {
    slot.selectedVariant = variant;
  }

  getSelectedSummary(): string {
    const selected = this.slots
      .filter((slot) => Boolean(slot.car))
      .map((slot) => slot.car?.name)
      .filter(Boolean);

    if (selected.length === 0) {
      return 'Select up to 3 Honda models to compare.';
    }

    return selected.join(' vs ');
  }

  getVariantPrice(slot: CompareSlot): number {
    return (
      slot.selectedVariant?.estimated_price ||
      slot.car?.estimated_price_from ||
      0
    );
  }

  getHighlights(slot: CompareSlot): string[] {
    const highlights = slot.selectedVariant?.key_highlights || '';

    return highlights
      .split(',')
      .map((item) => item.trim())
      .filter(Boolean)
      .slice(0, 4);
  }

  private applyDefaultSelection(): void {
    const preferredSlugs = ['honda-city', 'honda-hrv', 'honda-civic'];
    const defaultSlugs = preferredSlugs
      .map((slug) => this.cars.find((car) => car.slug === slug)?.slug)
      .filter(Boolean) as string[];

    const fallbackSlugs = this.cars
      .map((car) => car.slug)
      .filter((slug) => !defaultSlugs.includes(slug));

    [...defaultSlugs, ...fallbackSlugs]
      .slice(0, this.slots.length)
      .forEach((slug, index) => {
        this.slots[index].selectedSlug = slug;
        this.loadSlotDetail(this.slots[index], slug);
      });
  }

  private loadSlotDetail(slot: CompareSlot, slug: string): void {
    slot.isLoading = true;
    slot.errorMessage = '';

    this.carsService.getCarBySlug(slug).subscribe({
      next: (response) => {
        slot.car = response.data;
        slot.selectedVariant = slot.car?.variants?.[0];
        slot.isLoading = false;
        this.cdr.detectChanges();
      },
      error: (error) => {
        console.error('Compare slot detail API error:', error);
        slot.errorMessage = 'Unable to load this model detail.';
        slot.isLoading = false;
        this.cdr.detectChanges();
      }
    });
  }
}
