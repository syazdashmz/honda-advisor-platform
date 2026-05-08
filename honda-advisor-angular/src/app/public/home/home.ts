import { ChangeDetectorRef, Component, OnInit, computed, inject } from '@angular/core';
import { RouterLink } from '@angular/router';

import { AuthService } from '../../core/services/auth.service';
import { SiteContentService } from '../../core/services/site-content.service';
import { HomeContent } from '../../core/models/site-content.model';

const fallbackHomeContent: HomeContent = {
  id: null,
  hero_badge: 'Trusted Honda Advisor',
  hero_title: 'Meet your personal Honda sales advisor',
  hero_subtitle:
    'Serving Honda customers since 2002 at Tenaga Setia Resources Sdn. Bhd. with personal guidance from inquiry to delivery.',
  hero_image_url: '',
  primary_cta_label: 'View Honda Models',
  primary_cta_link: '/cars',
  secondary_cta_label: 'Calculate Loan',
  secondary_cta_link: '/loan-calculator',
  advisor_title: 'Serving Honda customers since 2002',
  advisor_text:
    'This platform is designed as a personal online showroom for a Honda sales advisor based at Tenaga Setia Resources Sdn. Bhd. It helps customers explore models, estimate monthly payment, submit inquiries, and arrange appointments.',
  advisor_image_url: '',
  announcement_text: 'Sample homepage content. Admin can update this from the admin panel.',
  is_active: true
};

@Component({
  selector: 'app-home',
  imports: [
    RouterLink
  ],
  templateUrl: './home.html',
  styleUrl: './home.scss'
})
export class Home implements OnInit {
  private readonly authService = inject(AuthService);
  private readonly siteContentService = inject(SiteContentService);
  private readonly cdr = inject(ChangeDetectorRef);

  user = this.authService.currentUser;

  isAdmin = computed(() => {
    const currentUser = this.user();
    return currentUser?.role_name === 'admin' || currentUser?.role_name === 'super_admin';
  });

  homeContent: HomeContent = fallbackHomeContent;

  trustBadges = [
    {
      icon: '🏆',
      title: 'Since 2002',
      text: 'Long-term Honda advisor experience'
    },
    {
      icon: '💬',
      title: 'Personal Guidance',
      text: 'Clear explanation before booking'
    },
    {
      icon: '🧮',
      title: 'Loan Estimate',
      text: 'Monthly payment reference'
    },
    {
      icon: '📍',
      title: 'Tenaga Setia',
      text: 'Based in Petaling Jaya'
    }
  ];

  adminCards = [
    {
      icon: '📊',
      title: 'Admin Dashboard',
      text: 'View system summary, recent leads, appointment activity, and platform metrics.',
      link: '/admin/dashboard'
    },
    {
      icon: '🚗',
      title: 'Manage Cars',
      text: 'Update Honda model information, estimated prices, variant data, and model visibility.',
      link: '/admin/cars'
    },
    {
      icon: '🖼️',
      title: 'Homepage Content',
      text: 'Update homepage hero text, front-view image, advisor section, and call-to-action buttons.',
      link: '/admin/home-content'
    }
  ];

  ngOnInit(): void {
    this.loadHomeContent();
  }

  loadHomeContent(): void {
    this.siteContentService.getPublicHomeContent().subscribe({
      next: (response) => {
        this.homeContent = response.data || fallbackHomeContent;
        this.cdr.detectChanges();
      },
      error: (error) => {
        console.error('Home content loading error:', error);
        this.homeContent = fallbackHomeContent;
        this.cdr.detectChanges();
      }
    });
  }
}