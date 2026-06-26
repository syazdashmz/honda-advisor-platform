# Sitemap — Honda Advisor Platform

This document lists all pages available on the website, who can access them, and what each page is for.

---

## Public Pages

These pages are open to everyone — no login required.

| URL | Page Name | What It Does |
|---|---|---|
| `/` | Home | Landing page — introduces Pn. Fauziah, highlights Honda models, shows current promotions, customer stories, and the buyer journey |
| `/cars` | Honda Models | Lists all active Honda models with photos, starting prices, and brief descriptions. Customers can filter and browse |
| `/cars/:slug` | Car Detail | Full detail page for one model — shows variants, estimated prices, gallery images, available colours, and key features |
| `/compare` | Compare Models | Side-by-side comparison of two Honda models. Customers choose two models to see how they differ in price, specs, and features |
| `/loan-calculator` | Loan Calculator | Helps customers estimate their monthly car loan repayment based on car price, down payment, interest rate, and loan period |
| `/inquiry` | Submit Inquiry | A form where customers can send a message to Pn. Fauziah — their preferred model, budget, contact details, and questions |
| `/appointment` | Book Appointment | A form to request a showroom visit, test drive, or loan consultation — includes preferred date and time |

---

## Customer Account Pages

These pages are for customers who want to create an account to track their inquiries and appointments.

| URL | Page Name | What It Does |
|---|---|---|
| `/register` | Register | Create a customer account with name, email, phone, and password |
| `/login` | Login | Log in to an existing customer account |
| `/dashboard` | Customer Dashboard | Shows the customer's submitted inquiries and appointment requests with current statuses |

> The `/dashboard` page requires the customer to be logged in. If they are not, they are redirected to `/login`.

---

## Admin Pages

These pages are for the advisor (Pn. Fauziah) and any authorised admin accounts only.

| URL | Page Name | Who Can Access | What It Does |
|---|---|---|---|
| `/admin/login` | Admin Login | Anyone with admin credentials | Login page specifically for admin accounts |
| `/admin/dashboard` | Admin Dashboard | Admin, Super Admin | Overview of all inquiries, appointments, and recent activity. Also includes admin profile settings |
| `/admin/cars` | Manage Cars | Admin, Super Admin | Add, edit, hide, or remove Honda model listings |
| `/admin/home-content` | Edit Homepage | Admin, Super Admin | Update the hero text, announcements, advisor section, and call-to-action buttons on the homepage |
| `/admin/inquiries` | Manage Inquiries | Admin, Super Admin | View all customer inquiries and update their status |
| `/admin/appointments` | Manage Appointments | Admin, Super Admin | View all appointment requests and confirm or update their status |

> All `/admin/*` pages (except `/admin/login`) require an admin token. Unauthorised access is blocked by the `adminGuard`.

---

## Route Guards

| Guard | Protects | What Happens If Not Authenticated |
|---|---|---|
| `authGuard` | `/dashboard` | Redirects to `/login` |
| `adminGuard` | All `/admin/*` pages (except login) | Redirects to `/admin/login` |

---

## Redirect Behaviour

| URL Pattern | Redirects To |
|---|---|
| Any unknown URL (`**`) | `/` (Homepage) |

---

## API Routes

The backend API is accessible at `/api/*`. These are not pages — they are data endpoints used by the Angular frontend behind the scenes.

See [api-contract.md](api-contract.md) for the full list of API endpoints.
