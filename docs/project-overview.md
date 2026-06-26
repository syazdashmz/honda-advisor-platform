# Project Overview — Honda Advisor Platform

## Background

### The Problem

**Pn. Fauziah** has worked as a Honda sales advisor at **Tenaga Setia Resources Sdn. Bhd.** in Petaling Jaya for more than 20 years. She is well-trusted by her returning customers and has received long-service recognition from Honda for her dedication.

However, her way of reaching new customers has not changed much with the times:

- She lists cars on **Mudah.com** — a general classifieds website
- She relies heavily on **word-of-mouth** from past customers
- She does not actively use social media

This means that potential new customers who are searching online for a Honda advisor, comparing models, or looking for someone trustworthy to guide them — they simply cannot find her. Her reach is limited to people who already know her.

### The Solution

This website gives Pn. Fauziah a **dedicated professional online presence** where:

- New customers can discover her through search and online sharing
- Customers can explore Honda models, compare options, and estimate monthly payments on their own
- Customers can submit inquiries or book appointments directly — without needing to call first
- Pn. Fauziah can manage everything from a simple admin panel, without any technical knowledge

The platform is designed for someone who is **not an IT person**. Every feature in the admin panel has been kept as simple and clear as possible so that Pn. Fauziah — or any trusted person she assigns — can update the website confidently.

---

## Training Programme Context

| Item | Detail |
|---|---|
| Programme | MyMahir — Malaysian Government Self-Funding Training Initiative |
| Organiser | Agmo Academy |
| Focus | Angular Full Stack Developer Training |
| Cohort | Cohort 2 |
| Project Type | Solo capstone project |
| Developer | Danish Syazani bin Mohd Zakir |

**MyMahir** provides training opportunities for unemployed Malaysian citizens to gain in-demand technology skills and enter the workforce. This project is the capstone submission demonstrating full-stack Angular development capability.

---

## Features

### Public-Facing Features (For Customers)

| Feature | Description |
|---|---|
| Honda model listing | Browse all active models with photos, starting prices, and brief descriptions |
| Car detail page | View full variant list, features, gallery, and colour options for each model |
| Model comparison | Select two models and compare specs, prices, and highlights side by side |
| Loan calculator | Enter car price, down payment, and loan period to estimate monthly repayments |
| Inquiry form | Submit name, contact, preferred model, budget, and message to the advisor |
| Appointment booking | Request a showroom visit or test drive with preferred date and time |
| Customer registration | Create an account to track submitted inquiries and appointment history |
| Customer dashboard | View inquiry statuses and appointment updates when logged in |

### Admin Features (For the Advisor)

| Feature | Description |
|---|---|
| Admin dashboard | View total inquiries, appointments, and recent activity at a glance |
| Car management | Add, edit, show, or hide Honda model listings and their variants |
| Homepage editor | Update hero text, advisor section copy, and announcement text live |
| Inquiry management | Read all inquiries and update their status (new, contacted, won, lost) |
| Appointment management | View all appointment requests and confirm or update each one |
| Admin account settings | Change name, email, phone number, and password from the dashboard |
| Admin account creation | Super admins can create additional admin accounts if needed |

---

## Architecture

This is a **full-stack web application** with a clear separation between frontend and backend.

```
Browser (Customer or Admin)
        |
        | HTTPS
        v
[ Angular Frontend ]          <-- Cloudflare Pages (static hosting)
        |
        | REST API calls (JSON)
        v
[ Express.js Backend API ]    <-- Cloud server / localhost
        |
        | SQL queries (mysql2)
        v
[ MySQL Database ]
```

### Frontend — Angular 21

- **Framework:** Angular 21 with standalone components (no NgModules)
- **UI Library:** Angular Material (rose-red Honda theme)
- **State:** Reactive signals and `inject()` dependency injection
- **Routing:** Client-side routing via `app.routes.ts`
- **Auth:** JWT token stored in `localStorage`, injected via HTTP interceptor
- **Guards:** `authGuard` (customer pages), `adminGuard` (admin pages)

### Backend — Express 5 + Node.js

- **Framework:** Express 5 REST API
- **Database driver:** `mysql2/promise` with connection pooling
- **Authentication:** JWT issued on login, verified in `auth.middleware.js`
- **Role enforcement:** `allowRoles()` middleware restricts admin-only routes
- **Password hashing:** bcrypt (10 salt rounds)
- **Email:** Nodemailer for inquiry notifications

### Database — MySQL

- Relational database with normalised tables
- Foreign key relationships between users, roles, cars, inquiries, and appointments
- `is_active` flags used to show/hide cars without deleting data
- `data_mode` and `is_mock_data` flags used during development phase

---

## User Roles

| Role | What They Can Do |
|---|---|
| **customer** | Browse, inquire, book appointments, view own inquiry and appointment history |
| **admin** | Full admin panel — manage cars, inquiries, appointments, homepage content, own account |
| **super_admin** | Everything admin can do, plus create new admin accounts |

---

## Database Tables

| Table | Purpose |
|---|---|
| `roles` | Defines available roles: customer, admin, super_admin |
| `users` | Stores all user accounts with hashed passwords and role assignment |
| `car_models` | Each Honda model (City, Civic, HR-V, etc.) with category, fuel type, price range |
| `car_variants` | Variants per model (e.g. City E CVT, City V CVT) with price and engine info |
| `car_images` | Gallery images per model |
| `car_features` | Feature highlights per model (safety, tech, comfort categories) |
| `car_colors` | Available colour options with hex values and colour images |
| `inquiries` | Customer inquiries with status tracking |
| `appointments` | Appointment requests with type, date, and status |
| `loan_calculations` | Saved loan calculation records |
| `home_content` | Editable homepage content (hero text, announcements, advisor section) |

---

## API Endpoint Summary

### Authentication

| Method | Route | Auth Required |
|---|---|---|
| `POST` | `/api/auth/register` | None |
| `POST` | `/api/auth/login` | None |
| `GET` | `/api/auth/profile` | Customer token |
| `PATCH` | `/api/auth/profile` | Customer token |

### Public — Cars

| Method | Route | Auth Required |
|---|---|---|
| `GET` | `/api/cars` | None |
| `GET` | `/api/cars/:slug` | None |

### Public — Inquiries & Appointments

| Method | Route | Auth Required |
|---|---|---|
| `POST` | `/api/inquiries` | Optional (captures user ID if logged in) |
| `GET` | `/api/inquiries/my` | Customer token |
| `POST` | `/api/appointments` | None |
| `GET` | `/api/loan-calculations` | None |
| `GET` | `/api/site` | None |

### Admin — Protected Routes

| Method | Route | Auth Required |
|---|---|---|
| `GET` | `/api/admin/dashboard` | Admin token |
| `GET/POST/PUT/DELETE` | `/api/admin/cars` | Admin token |
| `GET/PATCH` | `/api/admin/inquiries` | Admin token |
| `GET/PATCH` | `/api/admin/appointments` | Admin token |
| `GET/PUT` | `/api/admin/site` | Admin token |
| `GET/PUT` | `/api/admin/account` | Admin token |
| `POST` | `/api/admin/account/create` | Super admin token |

---

## Deployment

| Part | Platform |
|---|---|
| Frontend (Angular) | Cloudflare Pages — static build hosting |
| Backend API (Express) | Cloud server (environment variables via `.env`) |
| Database | MySQL — cloud or managed database service |

The Angular app is built with `ng build` and the output from `dist/honda-advisor-angular/browser/` is deployed to Cloudflare Pages.

---

## Design Decisions

**Why standalone Angular components?**
Angular 21 uses standalone components by default — no NgModule boilerplate. This makes each component self-contained and easier to maintain.

**Why JWT in localStorage instead of cookies?**
Simpler to implement for a single-domain application where CSRF is not a primary concern. The token is attached to every API call via the HTTP interceptor.

**Why `is_active` flags instead of deletion?**
Deleting car records could break referencing records (inquiries that mention a model). Hiding with `is_active = false` preserves history while removing the item from public listing.

**Why editable homepage content in the database?**
So Pn. Fauziah can update her own announcement text, hero message, and advisor section without asking her son to change the code. This was one of the main requirements.
