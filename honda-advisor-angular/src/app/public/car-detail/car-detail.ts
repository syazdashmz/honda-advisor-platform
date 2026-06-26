import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { CommonModule, CurrencyPipe } from '@angular/common';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';

import { CarsService } from '../../core/services/cars.service';
import {
  CarDetail as CarDetailModel,
  CarColor,
  CarVariant
} from '../../core/models/car.model';

interface ReferenceImage {
  image_url: string;
  alt_text: string;
  image_type: string;
}

const curatedModelImages: Record<string, ReferenceImage[]> = {
  'honda-city': [
    {
      image_url: '/images/cars/city/gallery-interior.jpg',
      alt_text: 'Honda City interior reference',
      image_type: 'interior'
    }
  ],
  'honda-hrv': [
    {
      image_url: '/images/cars/hr-v/gallery-interior.png',
      alt_text: 'Honda HR-V interior reference',
      image_type: 'interior'
    },
    {
      image_url: '/images/cars/hr-v/gallery-sensing.png',
      alt_text: 'Honda HR-V Honda SENSING reference',
      image_type: 'safety'
    }
  ],
  'honda-civic': [
    {
      image_url: '/images/cars/civic/gallery-interior.jpg',
      alt_text: 'Honda Civic interior reference',
      image_type: 'interior'
    },
    {
      image_url: '/images/cars/civic/gallery-cabin-detail.jpg',
      alt_text: 'Honda Civic cabin detail reference',
      image_type: 'cabin'
    }
  ],
  'honda-crv': [
    {
      image_url: '/images/cars/cr-v/gallery-interior.png',
      alt_text: 'Honda CR-V interior reference',
      image_type: 'interior'
    }
  ]
};

@Component({
  selector: 'app-car-detail',
  imports: [
    CommonModule,
    MatButtonModule,
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
  selectedColor?: CarColor;
  referenceImages: ReferenceImage[] = [];

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

    this.carsService.getCarBySlug(slug).subscribe({
      next: (response) => {
        this.car = response.data;
        this.selectedVariant = this.car?.variants?.[0];
        this.selectedColor = this.car?.colors?.[0];
        this.referenceImages = this.buildReferenceImages(this.car);

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

  selectColor(color: CarColor): void {
    this.selectedColor = color;
  }

  getDisplayImage(): string {
    if (this.selectedColor?.image_url?.startsWith('/images/')) {
      return this.selectedColor.image_url;
    }

    return this.car?.hero_image_url || '';
  }

  getSelectedColorLabel(): string {
    return this.selectedColor?.color_name || 'Advisor confirmation';
  }

  private buildReferenceImages(car: CarDetailModel): ReferenceImage[] {
    const existingImages = (car.images || []).map((image) => ({
      image_url: image.image_url,
      alt_text: image.alt_text,
      image_type: image.image_type
    }));

    const curatedImages = curatedModelImages[car.slug] || [];
    const seen = new Set<string>();

    return [...existingImages, ...curatedImages].filter((image) => {
      if (!image.image_url || seen.has(image.image_url)) {
        return false;
      }

      seen.add(image.image_url);
      return true;
    });
  }
}
