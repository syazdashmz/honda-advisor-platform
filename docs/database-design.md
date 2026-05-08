# Database Design

The Honda Advisor database is organized around the main website flows: public browsing, lead capture, appointments, loan calculations, customer saves, and admin content management.

## Main Entity Groups

- Access control: `roles`, `users`
- Site content: `site_home_content`, `advisor_profiles`, `dealership_profiles`, `faq_items`, `blog_posts`, `promotions`, `testimonials`, `customer_gallery`
- Vehicle catalog: `car_models`, `car_variants`, `car_features`, `car_colors`, `car_images`
- Customer workflows: `inquiries`, `appointments`, `loan_calculations`, `saved_cars`, `saved_comparisons`, `trade_in_estimations`
- Admin operations: `customer_notes`, `notifications`, `quotation_pdfs`, `admin_activity_logs`

## Setup Flow

Fresh databases should be created with:

1. `database/schema.sql`
2. `database/seed.sql`

Existing databases should be upgraded with migration files from `database/migrations/`. The current migration is `2026-05-08-current-implementation-fixes.sql`.

Manual helper scripts live in `database/maintenance/` and are intentionally separate from normal setup.

## Appointment Slot Protection

Confirmed appointments use a generated `confirmed_slot_key` value and a unique index. This allows multiple pending requests for the same preferred date/time, but prevents two confirmed appointments from occupying the same slot.

## Homepage Content

The homepage uses `site_home_content` so admins can update hero text, CTA labels, images, advisor copy, and announcement text without code changes. Fresh installs create this table in `schema.sql`; existing installs receive it through the 2026-05-08 migration.
