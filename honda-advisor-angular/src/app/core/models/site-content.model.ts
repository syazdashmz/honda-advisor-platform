export interface HomeContent {
  id?: number | null;

  hero_badge: string;
  hero_title: string;
  hero_subtitle: string;
  hero_image_url?: string | null;

  primary_cta_label: string;
  primary_cta_link: string;
  secondary_cta_label: string;
  secondary_cta_link: string;

  advisor_title: string;
  advisor_text: string;
  advisor_image_url?: string | null;

  announcement_text?: string | null;

  is_active: boolean;

  created_at?: string;
  updated_at?: string;
}