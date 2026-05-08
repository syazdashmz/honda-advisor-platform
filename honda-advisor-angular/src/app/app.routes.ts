import { Routes } from '@angular/router';

import { Home } from './public/home/home';
import { Cars } from './public/cars/cars';
import { CarDetail } from './public/car-detail/car-detail';
import { LoanCalculator } from './public/loan-calculator/loan-calculator';
import { Inquiry } from './public/inquiry/inquiry';
import { Appointment } from './public/appointment/appointment';

import { Login } from './auth/login/login';
import { Register } from './auth/register/register';

import { CustomerDashboard } from './customer/dashboard/customer-dashboard';

import { AdminLogin } from './admin/login/admin-login';
import { Dashboard } from './admin/dashboard/dashboard';
import { AdminCars } from './admin/cars/admin-cars';

import { AdminHomeContent } from './admin/home-content/admin-home-content';
import { AdminAppointments } from './admin/appointments/admin-appointments';
import { AdminInquiries } from './admin/inquiries/admin-inquiries';

import { authGuard } from './core/guards/auth.guard';
import { adminGuard } from './core/guards/admin.guard';

export const routes: Routes = [
  { path: '', component: Home },
  { path: 'cars', component: Cars },
  { path: 'cars/:slug', component: CarDetail },
  { path: 'loan-calculator', component: LoanCalculator },
  { path: 'inquiry', component: Inquiry },
  { path: 'appointment', component: Appointment },

  { path: 'login', component: Login },
  { path: 'register', component: Register },

  {
    path: 'dashboard',
    component: CustomerDashboard,
    canActivate: [authGuard]
  },

  { path: 'admin/login', component: AdminLogin },
  {
    path: 'admin/dashboard',
    component: Dashboard,
    canActivate: [adminGuard]
  },

  {
  path: 'admin/appointments',
  component: AdminAppointments,
  canActivate: [adminGuard]
  },

  {
  path: 'admin/inquiries',
  component: AdminInquiries,
  canActivate: [adminGuard]
  },

  {
  path: 'admin/cars',
  component: AdminCars,
  canActivate: [adminGuard]
  },

  {
  path: 'admin/home-content',
  component: AdminHomeContent,
  canActivate: [adminGuard]
  },

  { path: '**', redirectTo: '' }
];