import { ChangeDetectorRef, Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import {
  FormBuilder,
  ReactiveFormsModule,
  Validators
} from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';

import { SiteContentService } from '../../core/services/site-content.service';
import { HomeContent } from '../../core/models/site-content.model';

type HomeImagePreset = {
  label: string;
  target: 'hero_image_url' | 'advisor_image_url';
  path: string;
  icon: string;
};

@Component({
  selector: 'app-admin-home-content',
  imports: [
    CommonModule,
    MatButtonModule,
    MatCheckboxModule,
    MatFormFieldModule,
    MatIconModule,
    MatInputModule,
    MatProgressSpinnerModule,
    ReactiveFormsModule
  ],
  templateUrl: './admin-home-content.html',
  styleUrl: './admin-home-content.scss'
})
export class AdminHomeContent implements OnInit {
  private readonly formBuilder = inject(FormBuilder);
  private readonly siteContentService = inject(SiteContentService);
  private readonly cdr = inject(ChangeDetectorRef);

  isLoading = true;
  isSaving = false;

  errorMessage = '';
  successMessage = '';

  contentForm = this.formBuilder.nonNullable.group({
    id: [null as number | null],

    hero_badge: ['Trusted Honda Sales Advisor'],
    hero_title: ['', [Validators.required]],
    hero_subtitle: ['', [Validators.required]],
    hero_image_url: [''],

    primary_cta_label: ['Compare Models', [Validators.required]],
    primary_cta_link: ['/compare', [Validators.required]],
    secondary_cta_label: ['View Honda Models', [Validators.required]],
    secondary_cta_link: ['/cars', [Validators.required]],

    advisor_title: ['', [Validators.required]],
    advisor_text: ['', [Validators.required]],
    advisor_image_url: [''],

    announcement_text: [''],
    is_active: [true]
  });

  imagePresets: HomeImagePreset[] = [
    {
      label: 'Dealership visual',
      target: 'hero_image_url' as const,
      path: '/images/home/home-showroom-01.webp',
      icon: 'storefront'
    },
    {
      label: 'Advisor profile',
      target: 'advisor_image_url' as const,
      path: '/images/advisor/advisor-profile.webp',
      icon: 'portrait'
    },
    {
      label: 'Award moment',
      target: 'advisor_image_url' as const,
      path: '/images/advisor/fauziah-award.jpg',
      icon: 'emoji_events'
    },
    {
      label: 'Azlina delivery',
      target: 'hero_image_url' as const,
      path: '/images/testimonials/delivery-azlina-private.jpg',
      icon: 'redeem'
    }
  ];

  ngOnInit(): void {
    this.loadContent();
  }

  loadContent(): void {
    this.isLoading = true;
    this.errorMessage = '';

    this.siteContentService.getAdminHomeContent().subscribe({
      next: (response) => {
        const content = response.data;

        this.contentForm.patchValue({
          id: content.id || null,
          hero_badge: content.hero_badge || 'Trusted Honda Sales Advisor',
          hero_title: content.hero_title || '',
          hero_subtitle: content.hero_subtitle || '',
          hero_image_url: content.hero_image_url || '',
          primary_cta_label: content.primary_cta_label || 'Compare Models',
          primary_cta_link: content.primary_cta_link || '/compare',
          secondary_cta_label: content.secondary_cta_label || 'View Honda Models',
          secondary_cta_link: content.secondary_cta_link || '/cars',
          advisor_title: content.advisor_title || '',
          advisor_text: content.advisor_text || '',
          advisor_image_url: content.advisor_image_url || '',
          announcement_text: content.announcement_text || '',
          is_active: Boolean(content.is_active)
        });

        this.isLoading = false;
        this.cdr.detectChanges();
      },
      error: (error) => {
        console.error('Admin home content load error:', error);

        this.errorMessage =
          error?.error?.message || 'Unable to load homepage content.';

        this.isLoading = false;
        this.cdr.detectChanges();
      }
    });
  }

  saveContent(): void {
    if (this.contentForm.invalid) {
      this.contentForm.markAllAsTouched();
      this.errorMessage = 'Please complete required homepage content fields.';
      return;
    }

    this.isSaving = true;
    this.errorMessage = '';
    this.successMessage = '';

    const payload = this.buildPayload();

    this.siteContentService.updateHomeContent(payload).subscribe({
      next: (response) => {
        this.successMessage =
          'Homepage content updated successfully. Public homepage now uses this latest content.';

        this.contentForm.patchValue({
          id: response.data.id || null
        });

        this.isSaving = false;
        this.cdr.detectChanges();
      },
      error: (error) => {
        console.error('Admin home content save error:', error);

        this.errorMessage =
          error?.error?.message || 'Unable to update homepage content.';

        this.isSaving = false;
        this.cdr.detectChanges();
      }
    });
  }

  applyImagePreset(preset: HomeImagePreset): void {
    this.contentForm.patchValue({
      [preset.target]: preset.path
    });
  }

  clearAnnouncement(): void {
    this.contentForm.patchValue({
      announcement_text: ''
    });
  }

  private buildPayload(): HomeContent {
    const value = this.contentForm.getRawValue();

    return {
      id: value.id,
      hero_badge: value.hero_badge.trim(),
      hero_title: value.hero_title.trim(),
      hero_subtitle: value.hero_subtitle.trim(),
      hero_image_url: value.hero_image_url.trim(),
      primary_cta_label: value.primary_cta_label.trim(),
      primary_cta_link: value.primary_cta_link.trim(),
      secondary_cta_label: value.secondary_cta_label.trim(),
      secondary_cta_link: value.secondary_cta_link.trim(),
      advisor_title: value.advisor_title.trim(),
      advisor_text: value.advisor_text.trim(),
      advisor_image_url: value.advisor_image_url.trim(),
      announcement_text: value.announcement_text.trim(),
      is_active: Boolean(value.is_active)
    };
  }
}
