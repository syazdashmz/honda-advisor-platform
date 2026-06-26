# Honda Advisor Platform

> A personal Honda sales advisor website — built with love for a mother who has served Honda customers since 2002.

![Angular](https://img.shields.io/badge/Angular-21-DD0031?style=flat-square&logo=angular&logoColor=white)
![Express](https://img.shields.io/badge/Express-5-000000?style=flat-square&logo=express&logoColor=white)
![MySQL](https://img.shields.io/badge/MySQL-2-4479A1?style=flat-square&logo=mysql&logoColor=white)
![Deployed on Cloudflare](https://img.shields.io/badge/Deployed-Cloudflare%20Pages-F38020?style=flat-square&logo=cloudflare&logoColor=white)

---

## The Story Behind This Project

**Pn. Fauziah** has been a Honda sales advisor at **Tenaga Setia Resources Sdn. Bhd.** in Petaling Jaya since 2002 — that is over 20 years of dedicated service. She has built a loyal base of returning customers who trust her personally.

However, as the world moves online, the way people look for cars has changed. Customers now search Google, browse websites, and compare models before they even contact a sales advisor. Pn. Fauziah's current approach relies on:

- Listings on **Mudah.com**
- Word-of-mouth from past customers
- Walk-in visits to the showroom

This works well for returning customers, but it makes it difficult to reach **new customers** who are discovering Honda for the first time online.

**This website was built to change that.**

The goal is simple: give Pn. Fauziah a professional online presence where new customers can discover her, browse Honda models, submit inquiries, and book appointments — all without her needing to know anything about technology. The admin panel is designed to be so straightforward that she can update her own website without any coding knowledge whatsoever.

---

## Training Program Context

This project is a **solo capstone project** submitted as part of:

| Program | Details |
|---|---|
| **Programme** | MyMahir — Government Self-Funding Training Programme |
| **Organiser** | Agmo Academy |
| **Course** | Angular Full Stack Developer Training |
| **Cohort** | Cohort 2 |
| **Developer** | Danish Syazani bin Mohd Zakir |

**MyMahir** is a Malaysian government-funded initiative that provides training opportunities for unemployed citizens to upskill and land jobs in the technology industry. Agmo Academy delivers this Angular full-stack training cohort in collaboration with the programme.

This project demonstrates end-to-end full-stack development capability — from database design to backend API to Angular frontend — deployed live on Cloudflare.

---

## Live Website

The website is deployed and accessible online via **Cloudflare Pages** (frontend) with the API running on a cloud server.

> See the full admin guide: [docs/admin-guide.md](docs/admin-guide.md)

---

## What This Website Does

### For Customers (The Public)

Anyone who finds the website can:

- **Browse Honda models** — see all available models with photos, prices, and key highlights
- **View car details** — explore variants, colours, features, and specifications for each model
- **Compare models** — put two Honda models side by side to decide which one suits them
- **Calculate loan estimates** — enter a price and see estimated monthly payment options
- **Submit an inquiry** — send their details and questions directly to Pn. Fauziah
- **Book an appointment** — schedule a showroom visit or test drive at a preferred time
- **Register an account** — track their own inquiries and appointment history

### For the Advisor (Admin Panel)

Pn. Fauziah (or anyone she authorises) can log in to the admin panel and:

- **View the dashboard** — see a summary of new inquiries, upcoming appointments, and activity
- **Manage car listings** — update prices, descriptions, variants, and visibility of each Honda model
- **Update homepage content** — change the hero text, announcements, and adviser profile section
- **Review inquiries** — read customer messages and update their status (new, contacted, won, lost)
- **Manage appointments** — see appointment requests and confirm or update their status

---

## Pages Overview

| Page | URL | Who Uses It |
|---|---|---|
| Home | `/` | Customers |
| All Honda Models | `/cars` | Customers |
| Car Detail | `/cars/:model-name` | Customers |
| Compare Models | `/compare` | Customers |
| Loan Calculator | `/loan-calculator` | Customers |
| Submit Inquiry | `/inquiry` | Customers |
| Book Appointment | `/appointment` | Customers |
| Customer Login | `/login` | Registered customers |
| Customer Register | `/register` | New customers |
| Customer Dashboard | `/dashboard` | Logged-in customers |
| Admin Login | `/admin/login` | Advisor / Admin |
| Admin Dashboard | `/admin/dashboard` | Admin only |
| Admin — Manage Cars | `/admin/cars` | Admin only |
| Admin — Homepage Content | `/admin/home-content` | Admin only |
| Admin — Inquiries | `/admin/inquiries` | Admin only |
| Admin — Appointments | `/admin/appointments` | Admin only |

---

## Tech Stack

| Layer | Technology | Purpose |
|---|---|---|
| **Frontend** | Angular 21 | Single-page application framework |
| **UI Components** | Angular Material | Ready-made, clean UI elements |
| **Styling** | SCSS + CSS Variables | Honda red theme, responsive design |
| **Backend API** | Node.js + Express 5 | REST API server |
| **Database** | MySQL 2 | Stores cars, users, inquiries, appointments |
| **Authentication** | JWT (JSON Web Token) | Secure login sessions |
| **Password Security** | bcrypt | Encrypted password storage |
| **Email** | Nodemailer | Send email notifications |
| **Deployment** | Cloudflare Pages | Frontend hosting |
| **Language** | TypeScript (frontend), JavaScript (backend) | |

---

## Project Structure

```
honda-advisor-platform/
│
├── honda-advisor-angular/          # Frontend — Angular application
│   └── src/
│       └── app/
│           ├── public/             # Pages visible to everyone
│           │   ├── home/           # Homepage
│           │   ├── cars/           # All models listing
│           │   ├── car-detail/     # Single model page
│           │   ├── compare/        # Side-by-side comparison
│           │   ├── loan-calculator/# Monthly payment estimator
│           │   ├── inquiry/        # Contact / inquiry form
│           │   └── appointment/    # Appointment booking form
│           ├── admin/              # Pages for admin only
│           │   ├── dashboard/      # Overview and account settings
│           │   ├── cars/           # Manage car listings
│           │   ├── home-content/   # Edit homepage content
│           │   ├── inquiries/      # View and manage inquiries
│           │   └── appointments/   # View and manage appointments
│           ├── auth/               # Login and registration pages
│           ├── customer/           # Customer dashboard
│           ├── core/               # Services, models, guards, interceptors
│           └── shared/             # Reusable components (navbar, footer, card)
│
├── honda-advisor-api/              # Backend — Express.js REST API
│   └── src/
│       ├── server.js               # Entry point, routes registration
│       ├── config/
│       │   └── db.js               # MySQL connection pool
│       ├── routes/                 # API route definitions
│       ├── controllers/            # Business logic handlers
│       ├── middleware/             # Auth and role protection
│       ├── services/               # Email service
│       └── utils/                  # Response helpers, token generator
│
└── docs/                           # Project documentation
    ├── project-overview.md         # Full technical and background overview
    ├── admin-guide.md              # Simple guide for Pn. Fauziah
    ├── api-contract.md             # API endpoints reference
    └── sitemap.md                  # Website pages and routes
```

---

## Getting Started (For Developers)

### Prerequisites

Make sure you have these installed before you begin:

- **Node.js** v18 or newer — [nodejs.org](https://nodejs.org)
- **MySQL** — running locally or via cloud service
- **Angular CLI** — install with `npm install -g @angular/cli`

---

### Step 1 — Clone the Repository

```bash
git clone <your-repo-url>
cd honda-advisor-platform
```

### Step 2 — Set Up the Backend API

```bash
cd honda-advisor-api
npm install
```

Create a `.env` file inside `honda-advisor-api/`:

```env
PORT=3000
DB_HOST=localhost
DB_USER=your_mysql_username
DB_PASSWORD=your_mysql_password
DB_NAME=honda_advisor_db
DB_PORT=3306
JWT_SECRET=your_jwt_secret_key_here
CLIENT_URL=http://localhost:4200
NODE_ENV=development
```

Start the API server:

```bash
npm run dev
```

The API will be available at `http://localhost:3000`

---

### Step 3 — Set Up the Frontend

```bash
cd honda-advisor-angular
npm install
npm start
```

The website will open at `http://localhost:4200`

---

### Step 4 — Database Setup

Set up your MySQL database and import the schema. The database name should match `DB_NAME` in your `.env` file.

Tables used by this application:

| Table | What it stores |
|---|---|
| `users` | All user accounts (customers, admin, super_admin) |
| `roles` | User role definitions |
| `car_models` | Honda model listings |
| `car_variants` | Variant options per model |
| `car_images` | Photos for each model |
| `car_features` | Feature highlights per model |
| `car_colors` | Colour options per model |
| `inquiries` | Customer inquiry submissions |
| `appointments` | Appointment booking requests |
| `loan_calculations` | Saved loan estimates |
| `home_content` | Homepage editable content |

---

## User Roles

| Role | Access Level |
|---|---|
| `customer` | Can browse, submit inquiries, book appointments, view own history |
| `admin` | Full admin panel access — manage cars, inquiries, appointments, content |
| `super_admin` | Same as admin, plus ability to create new admin accounts |

---

## API Quick Reference

| Method | Endpoint | Description |
|---|---|---|
| `POST` | `/api/auth/register` | Register a new customer account |
| `POST` | `/api/auth/login` | Login and receive a token |
| `GET` | `/api/auth/profile` | Get current user profile |
| `PATCH` | `/api/auth/profile` | Update profile (name, phone) |
| `GET` | `/api/cars` | Get all active car models |
| `GET` | `/api/cars/:slug` | Get car details with variants, images, features |
| `POST` | `/api/inquiries` | Submit a customer inquiry |
| `GET` | `/api/inquiries/my` | Get own inquiries (customer) |
| `POST` | `/api/appointments` | Book an appointment |
| `GET` | `/api/loan-calculations` | Loan calculation reference data |
| `GET` | `/api/site` | Get current homepage content |
| `GET` | `/api/admin/dashboard` | Admin dashboard summary |
| `GET/POST/PUT/DELETE` | `/api/admin/cars` | Admin car management |
| `PUT` | `/api/admin/site` | Update homepage content |
| `GET/PATCH` | `/api/admin/account` | Admin account and password management |

> Full endpoint reference: [docs/api-contract.md](docs/api-contract.md)

---

## Developer

**Danish Syazani bin Mohd Zakir**

Built as a solo capstone project for the MyMahir × Agmo Academy Angular Full Stack Developer Training, Cohort 2.

This project is dedicated to **Pn. Fauziah** — a Honda advisor who has spent over two decades serving her customers with warmth, honesty, and dedication. This website is a small way to help her reach the customers she deserves.

---

*For the admin usage guide (how to manage the website without any coding knowledge), see [docs/admin-guide.md](docs/admin-guide.md).*
