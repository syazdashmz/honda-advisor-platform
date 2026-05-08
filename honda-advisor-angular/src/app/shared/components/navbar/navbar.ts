import { Component, computed, inject } from '@angular/core';
import { Router, RouterLink, RouterLinkActive } from '@angular/router';

import { AuthService } from '../../../core/services/auth.service';

@Component({
  selector: 'app-navbar',
  imports: [
    RouterLink,
    RouterLinkActive
  ],
  templateUrl: './navbar.html',
  styleUrl: './navbar.scss'
})
export class Navbar {
  private readonly authService = inject(AuthService);
  private readonly router = inject(Router);

  user = this.authService.currentUser;

  isAdmin = computed(() => {
    const currentUser = this.user();
    return currentUser?.role_name === 'admin' || currentUser?.role_name === 'super_admin';
  });

  isCustomer = computed(() => {
    const currentUser = this.user();
    return currentUser?.role_name === 'customer';
  });

  logout(): void {
    const wasAdmin = this.isAdmin();

    this.authService.logout();

    if (wasAdmin) {
      this.router.navigate(['/admin/login']);
      return;
    }

    this.router.navigate(['/']);
  }
}