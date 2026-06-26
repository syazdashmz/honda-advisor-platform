import { Component, computed, inject, signal } from '@angular/core';
import { Router, RouterLink, RouterLinkActive } from '@angular/router';
import { MatIconModule } from '@angular/material/icon';

import { AuthService } from '../../../core/services/auth.service';

@Component({
  selector: 'app-navbar',
  imports: [
    MatIconModule,
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
  menuOpen = signal(false);

  isAdmin = computed(() => {
    const currentUser = this.user();
    return currentUser?.role_name === 'admin' || currentUser?.role_name === 'super_admin';
  });

  isCustomer = computed(() => {
    const currentUser = this.user();
    return currentUser?.role_name === 'customer';
  });

  toggleMenu(): void {
    this.menuOpen.update(v => !v);
  }

  closeMenu(): void {
    this.menuOpen.set(false);
  }

  logout(): void {
    const wasAdmin = this.isAdmin();
    this.closeMenu();
    this.authService.logout();

    if (wasAdmin) {
      this.router.navigate(['/admin/login']);
      return;
    }

    this.router.navigate(['/']);
  }
}
