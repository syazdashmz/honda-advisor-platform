import { ChangeDetectorRef, Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterLink } from '@angular/router';
import {
  FormBuilder,
  ReactiveFormsModule,
  Validators
} from '@angular/forms';
import { MatIconModule } from '@angular/material/icon';

import { AuthService } from '../../core/services/auth.service';
import { AdminDashboardService } from '../../core/services/admin-dashboard.service';
import { AdminAccountService } from '../../core/services/admin-account.service';

import {
  AdminDashboardData,
  AdminRecentAppointment,
  AdminRecentInquiry
} from '../../core/models/admin-dashboard.model';

@Component({
  selector: 'app-dashboard',
  imports: [
    CommonModule,
    MatIconModule,
    ReactiveFormsModule,
    RouterLink,
  ],
  templateUrl: './dashboard.html',
  styleUrl: './dashboard.scss'
})
export class Dashboard implements OnInit {
  private readonly formBuilder = inject(FormBuilder);
  private readonly authService = inject(AuthService);
  private readonly adminDashboardService = inject(AdminDashboardService);
  private readonly adminAccountService = inject(AdminAccountService);
  private readonly router = inject(Router);
  private readonly cdr = inject(ChangeDetectorRef);

  user = this.authService.currentUser;

  dashboardData?: AdminDashboardData;

  isLoadingDashboard = true;
  isSavingProfile = false;
  isChangingPassword = false;
  isCreatingAdmin = false;

  dashboardErrorMessage = '';
  profileErrorMessage = '';
  profileSuccessMessage = '';
  passwordErrorMessage = '';
  passwordSuccessMessage = '';
  createAdminErrorMessage = '';
  createAdminSuccessMessage = '';

  profileForm = this.formBuilder.nonNullable.group({
    full_name: ['', [Validators.required, Validators.minLength(3)]],
    email: ['', [Validators.required, Validators.email]],
    phone_number: ['']
  });

  passwordForm = this.formBuilder.nonNullable.group({
    current_password: ['', [Validators.required]],
    new_password: ['', [Validators.required, Validators.minLength(8)]],
    confirm_password: ['', [Validators.required]]
  });

  createAdminForm = this.formBuilder.nonNullable.group({
    full_name: ['', [Validators.required, Validators.minLength(3)]],
    email: ['', [Validators.required, Validators.email]],
    phone_number: [''],
    password: ['', [Validators.required, Validators.minLength(8)]],
    role_name: ['admin' as 'admin' | 'super_admin', [Validators.required]]
  });

  ngOnInit(): void {
    this.patchProfileForm();
    this.loadDashboard();
  }

  patchProfileForm(): void {
    const currentUser = this.user();

    if (!currentUser) {
      return;
    }

    this.profileForm.patchValue({
      full_name: currentUser.full_name || '',
      email: currentUser.email || '',
      phone_number: currentUser.phone_number || ''
    });
  }

  loadDashboard(): void {
    this.isLoadingDashboard = true;
    this.dashboardErrorMessage = '';

    this.adminDashboardService.getDashboard().subscribe({
      next: (response) => {
        this.dashboardData = response.data;
        this.isLoadingDashboard = false;
        this.cdr.detectChanges();
      },
      error: (error) => {
        console.error('Admin dashboard load error:', error);

        this.dashboardErrorMessage =
          error?.error?.message || 'Unable to load admin dashboard data.';

        this.isLoadingDashboard = false;
        this.cdr.detectChanges();
      }
    });
  }

  saveProfile(): void {
    this.profileErrorMessage = '';
    this.profileSuccessMessage = '';

    if (this.profileForm.invalid) {
      this.profileForm.markAllAsTouched();
      this.profileErrorMessage = 'Please complete your profile details correctly.';
      return;
    }

    this.isSavingProfile = true;

    const value = this.profileForm.getRawValue();

    this.adminAccountService.updateProfile({
      full_name: value.full_name.trim(),
      email: value.email.trim(),
      phone_number: value.phone_number.trim() || null
    }).subscribe({
      next: (response) => {
        this.authService.updateCurrentUser(response.data.user);

        this.profileSuccessMessage = 'Profile updated successfully.';
        this.isSavingProfile = false;
        this.cdr.detectChanges();
      },
      error: (error) => {
        console.error('Admin profile update error:', error);

        this.profileErrorMessage =
          error?.error?.message || 'Unable to update profile.';

        this.isSavingProfile = false;
        this.cdr.detectChanges();
      }
    });
  }

  changePassword(): void {
    this.passwordErrorMessage = '';
    this.passwordSuccessMessage = '';

    if (this.passwordForm.invalid) {
      this.passwordForm.markAllAsTouched();
      this.passwordErrorMessage = 'Please complete all password fields.';
      return;
    }

    const value = this.passwordForm.getRawValue();

    if (value.new_password !== value.confirm_password) {
      this.passwordErrorMessage = 'New password and confirm password do not match.';
      return;
    }

    this.isChangingPassword = true;

    this.adminAccountService.changePassword({
      current_password: value.current_password,
      new_password: value.new_password
    }).subscribe({
      next: () => {
        this.passwordSuccessMessage = 'Password updated successfully.';
        this.passwordForm.reset({
          current_password: '',
          new_password: '',
          confirm_password: ''
        });

        this.isChangingPassword = false;
        this.cdr.detectChanges();
      },
      error: (error) => {
        console.error('Admin password update error:', error);

        this.passwordErrorMessage =
          error?.error?.message || 'Unable to change password.';

        this.isChangingPassword = false;
        this.cdr.detectChanges();
      }
    });
  }

  createAdmin(): void {
    this.createAdminErrorMessage = '';
    this.createAdminSuccessMessage = '';

    if (this.createAdminForm.invalid) {
      this.createAdminForm.markAllAsTouched();
      this.createAdminErrorMessage = 'Please complete admin account details correctly.';
      return;
    }

    this.isCreatingAdmin = true;

    const value = this.createAdminForm.getRawValue();

    this.adminAccountService.createAdmin({
      full_name: value.full_name.trim(),
      email: value.email.trim(),
      phone_number: value.phone_number.trim() || null,
      password: value.password,
      role_name: value.role_name
    }).subscribe({
      next: () => {
        this.createAdminSuccessMessage = 'New admin account created successfully.';

        this.createAdminForm.reset({
          full_name: '',
          email: '',
          phone_number: '',
          password: '',
          role_name: 'admin'
        });

        this.isCreatingAdmin = false;
        this.cdr.detectChanges();
      },
      error: (error) => {
        console.error('Create admin error:', error);

        this.createAdminErrorMessage =
          error?.error?.message || 'Unable to create admin account.';

        this.isCreatingAdmin = false;
        this.cdr.detectChanges();
      }
    });
  }

  logout(): void {
    this.authService.logout();
    this.router.navigate(['/admin/login']);
  }

  formatStatus(status: string): string {
    return status.replaceAll('_', ' ');
  }

  formatType(value: string): string {
    return value.replaceAll('_', ' ');
  }

  getRecentInquiries(): AdminRecentInquiry[] {
    return this.dashboardData?.recent_inquiries || [];
  }

  getRecentAppointments(): AdminRecentAppointment[] {
    return this.dashboardData?.recent_appointments || [];
  }
}
