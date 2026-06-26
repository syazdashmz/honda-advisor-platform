import { ChangeDetectorRef, Component, OnInit, computed, inject } from '@angular/core';
import { RouterLink } from '@angular/router';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';

import { AuthService } from '../../core/services/auth.service';
import { SiteContentService } from '../../core/services/site-content.service';
import { HomeContent } from '../../core/models/site-content.model';

const fallbackHomeContent: HomeContent = {
  id: null,
  hero_badge: 'Trusted Honda Sales Advisor',
  hero_title: "Meet Pn. Fauziah, your personal Honda advisor",
  hero_subtitle:
    'A warm, experienced Honda sales advisor at Tenaga Setia Resources Sdn. Bhd. who guides customers clearly from model discovery to delivery day.',
  hero_image_url: '/images/home/home-showroom-01.webp',
  primary_cta_label: 'Compare Models',
  primary_cta_link: '/compare',
  secondary_cta_label: 'View Honda Models',
  secondary_cta_link: '/cars',
  advisor_title: 'Tenaga Setia Resources Honda showroom support',
  advisor_text:
    'Visit the showroom for model viewing, test-drive arrangement, loan discussion, and delivery coordination. Final stock, promotions, quotation, and color availability are confirmed personally during advisor follow-up.',
  advisor_image_url: '/images/advisor/advisor-profile.webp',
  announcement_text: 'Recognized for long-service excellence and trusted by loyal Honda customers across many years.',
  is_active: true
};

@Component({
  selector: 'app-home',
  imports: [
    MatButtonModule,
    MatIconModule,
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
      icon: 'emoji_events',
      title: 'Long-Service Recognition',
      text: 'Awarded for dedicated Honda service'
    },
    {
      icon: 'forum',
      title: 'Direct Advisor Flow',
      text: 'Inquiry details go to the advisor'
    },
    {
      icon: 'compare_arrows',
      title: 'Model Compare',
      text: 'Shortlist models and variants clearly'
    },
    {
      icon: 'location_on',
      title: 'Tenaga Setia',
      text: 'Based in Petaling Jaya'
    }
  ];

  adminCards = [
    {
      icon: 'dashboard',
      title: 'Admin Dashboard',
      text: 'View system summary, recent leads, appointment activity, and platform metrics.',
      link: '/admin/dashboard'
    },
    {
      icon: 'directions_car',
      title: 'Manage Cars',
      text: 'Update Honda model information, estimated prices, variant data, and model visibility.',
      link: '/admin/cars'
    },
    {
      icon: 'web',
      title: 'Homepage Content',
      text: 'Update homepage hero text, front-view image, advisor section, and call-to-action buttons.',
      link: '/admin/home-content'
    },
    {
      icon: 'mark_email_unread',
      title: 'Inquiries',
      text: 'Review and manage customer inquiries. Update lead status from new to contacted, won, or lost.',
      link: '/admin/inquiries'
    },
    {
      icon: 'event_note',
      title: 'Appointments',
      text: 'View appointment requests, confirm time slots, and update appointment status for each customer.',
      link: '/admin/appointments'
    }
  ];

  advisorHighlights = [
    {
      icon: 'verified',
      title: 'Advisor you can speak to',
      text: 'Customers get a real person who can explain model differences, monthly planning, promotions, and the next step without pressure.'
    },
    {
      icon: 'military_tech',
      title: 'Recognized service journey',
      text: "Fauziah's Honda career includes long-service recognition with Tenaga Setia Resources, reflecting consistency and customer care."
    },
    {
      icon: 'favorite',
      title: 'Returning-customer trust',
      text: 'Loyal customers returning again over the years are a strong sign of confidence, comfort, and advisor follow-through.'
    }
  ];

  showroomHighlights = [
    {
      icon: 'storefront',
      title: 'Showroom visit',
      text: 'Arrange model viewing and discussion at Tenaga Setia Resources with appointment support.'
    },
    {
      icon: 'drive_eta',
      title: 'Test-drive planning',
      text: 'Choose a preferred model and time so the advisor can prepare the visit properly.'
    },
    {
      icon: 'request_quote',
      title: 'Quotation clarity',
      text: 'Confirm final price, package, promotion, color availability, and delivery timeline before deciding.'
    }
  ];

  promotionPoster = '/images/promotions/honda-hybrid-joy-june-2026.png';

  promotionHighlights = [
    {
      icon: 'payments',
      title: 'Rewards up to RM34,000*',
      text: 'Selected June 2026 Honda Malaysia rewards include 2025 e:N1 with total value listed at RM34,000*.'
    },
    {
      icon: 'electric_car',
      title: 'Hybrid ownership support',
      text: 'Participating Honda hybrid models include RM2,000 Hybrid Support and 2 years free labour cost*.'
    },
    {
      icon: 'favorite',
      title: 'Joy Reward and Bonanza',
      text: 'Selected models include Joy Reward or City Bonanza benefits based on Honda Malaysia terms.'
    }
  ];

  promotionModelRewards = [
    {
      image: '/images/cars/city/hero.webp',
      model: 'City',
      reward: 'Up to RM10k*',
      note: 'Selected variants'
    },
    {
      image: '/images/cars/wr-v/hero.webp',
      model: 'WR-V',
      reward: 'RM11k*',
      note: 'Joy Reward eligible'
    },
    {
      image: '/images/cars/civic/hero.webp',
      model: 'Civic',
      reward: 'Up to RM12k*',
      note: 'e:HEV support available'
    },
    {
      image: '/images/cars/hr-v/hero.webp',
      model: 'HR-V',
      reward: 'Up to RM11k*',
      note: 'Selected variants'
    }
  ];

  loyalMemories = [
    {
      photo: '/images/loyal-customers/loyal-return-01-private.jpg',
      title: 'First Honda memory',
      text: 'A meaningful handover that began a long relationship built on trust and personal follow-up.',
      badge: 'Loyal Customer Story'
    },
    {
      photo: '/images/loyal-customers/loyal-return-02-private.jpg',
      title: 'Returned again',
      text: 'A returning customer choosing Honda again after years of advisor support and ownership confidence.',
      badge: 'Repeat Buyer'
    },
    {
      photo: '/images/loyal-customers/loyal-return-03-private.jpg',
      title: 'Third-time trust',
      text: 'A special repeat purchase moment showing how good guidance can turn one delivery into many.',
      badge: 'Trusted Relationship'
    }
  ];

  buyerJourney = [
    {
      icon: 'search',
      title: 'Discover Models',
      text: 'Browse Honda models with prices, specs, and best-for recommendations to narrow down your choice.'
    },
    {
      icon: 'compare_arrows',
      title: 'Compare Choices',
      text: 'Compare models and variants side by side to understand price, engine, features, and suitability.'
    },
    {
      icon: 'calculate',
      title: 'Plan Your Budget',
      text: 'Use the loan calculator to estimate monthly payments based on your down payment and loan tenure.'
    },
    {
      icon: 'forum',
      title: 'Submit Inquiry',
      text: 'Send an inquiry with your budget, preferred model, and timeline. The advisor follows up personally.'
    },
    {
      icon: 'event_available',
      title: 'Book Appointment',
      text: 'Schedule a showroom visit, test drive, or loan consultation at your preferred date and time.'
    },
    {
      icon: 'handshake',
      title: 'Confirm & Finalize',
      text: 'Finalize model, variant, colour, and loan arrangement with full advisor guidance at every step.'
    },
    {
      icon: 'directions_car',
      title: 'Drive Home Happy',
      text: 'Collect your new Honda at the dealership — with the red bow, just like our happy customers here.'
    }
  ];

  testimonials = [
    {
      photo: '/images/testimonials/delivery-azlina-private.jpg',
      name: 'Azlina',
      car: 'Honda WR-V RS',
      story: 'A completed handover moment after model guidance, documentation follow-up, and delivery coordination.',
      badge: 'Delivery Handover'
    },
    {
      photo: '/images/testimonials/delivery-aisyah-private.jpg',
      name: 'Pn. Aisyah',
      car: 'Honda City',
      story: 'A new owner delivery arranged with clear advisor communication from interest to collection day.',
      badge: 'New Owner'
    },
    {
      photo: '/images/testimonials/delivery-danish-private.jpg',
      name: 'Danish',
      car: 'Honda City RS',
      story: 'A sporty City RS handover supported by variant explanation and purchase-process guidance.',
      badge: 'City RS Delivery'
    },
    {
      photo: '/images/testimonials/delivery-zamri-private.jpg',
      name: 'Zamri',
      car: 'Honda WR-V RS',
      story: 'A delivery-day proof point for customers who want practical advice, timely updates, and a smooth collection experience.',
      badge: 'Customer Delivery'
    }
  ];

  awardImage = '/images/advisor/fauziah-award.jpg';

  ngOnInit(): void {
    this.loadHomeContent();
  }

  loadHomeContent(): void {
    this.siteContentService.getPublicHomeContent().subscribe({
      next: (response) => {
        this.homeContent = this.resolveHomeContent(response.data);
        this.cdr.detectChanges();
      },
      error: (error) => {
        console.error('Home content loading error:', error);
        this.homeContent = fallbackHomeContent;
        this.cdr.detectChanges();
      }
    });
  }

  private resolveHomeContent(content?: HomeContent | null): HomeContent {
    if (!content) {
      return fallbackHomeContent;
    }

    const isPlaceholderAnnouncement =
      !content.announcement_text ||
      content.announcement_text.includes('Sample homepage content') ||
      content.announcement_text.includes('Admin can update this from the admin panel');

    const isOldHero =
      content.hero_title === 'Meet your personal Honda sales advisor';

    const isOldAdvisor =
      content.advisor_title === 'Serving Honda customers since 2002';

    return {
      ...fallbackHomeContent,
      ...content,
      hero_badge: isOldHero
        ? fallbackHomeContent.hero_badge
        : content.hero_badge || fallbackHomeContent.hero_badge,
      hero_title: isOldHero
        ? fallbackHomeContent.hero_title
        : content.hero_title || fallbackHomeContent.hero_title,
      hero_subtitle: isOldHero
        ? fallbackHomeContent.hero_subtitle
        : content.hero_subtitle || fallbackHomeContent.hero_subtitle,
      primary_cta_label: isOldHero
        ? fallbackHomeContent.primary_cta_label
        : content.primary_cta_label || fallbackHomeContent.primary_cta_label,
      primary_cta_link: isOldHero
        ? fallbackHomeContent.primary_cta_link
        : content.primary_cta_link || fallbackHomeContent.primary_cta_link,
      secondary_cta_label: isOldHero
        ? fallbackHomeContent.secondary_cta_label
        : content.secondary_cta_label || fallbackHomeContent.secondary_cta_label,
      secondary_cta_link: isOldHero
        ? fallbackHomeContent.secondary_cta_link
        : content.secondary_cta_link || fallbackHomeContent.secondary_cta_link,
      advisor_title: isOldAdvisor
        ? fallbackHomeContent.advisor_title
        : content.advisor_title || fallbackHomeContent.advisor_title,
      advisor_text: isOldAdvisor
        ? fallbackHomeContent.advisor_text
        : content.advisor_text || fallbackHomeContent.advisor_text,
      announcement_text: isPlaceholderAnnouncement
        ? fallbackHomeContent.announcement_text
        : content.announcement_text,
      hero_image_url:
        content.hero_image_url?.trim() || fallbackHomeContent.hero_image_url,
      advisor_image_url:
        content.advisor_image_url?.trim() || fallbackHomeContent.advisor_image_url
    };
  }
}
