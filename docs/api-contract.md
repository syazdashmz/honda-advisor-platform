# API Contract — Honda Advisor Platform

Base URL (development): `http://localhost:3000`

All responses follow a consistent shape:

```json
{
  "success": true,
  "message": "Description of result",
  "data": { }
}
```

Error responses include `"success": false` and an appropriate HTTP status code.

---

## Authentication

### POST `/api/auth/register`

Register a new customer account.

**Body:**
```json
{
  "full_name": "Ahmad Rizal",
  "email": "ahmad@example.com",
  "phone_number": "0123456789",
  "password": "securepassword"
}
```

**Response `201`:**
```json
{
  "success": true,
  "message": "Customer account registered successfully",
  "data": {
    "user": { "id": 1, "full_name": "Ahmad Rizal", "email": "...", "role_name": "customer" },
    "token": "<jwt>"
  }
}
```

---

### POST `/api/auth/login`

Login with email and password.

**Body:**
```json
{
  "email": "ahmad@example.com",
  "password": "securepassword"
}
```

**Response `200`:**
```json
{
  "success": true,
  "message": "Login successful",
  "data": {
    "user": { ... },
    "token": "<jwt>"
  }
}
```

---

### GET `/api/auth/profile`

Get the currently logged-in user's profile.

**Headers:** `Authorization: Bearer <token>`

**Response `200`:** Returns user object.

---

### PATCH `/api/auth/profile`

Update name and phone number.

**Headers:** `Authorization: Bearer <token>`

**Body:**
```json
{
  "full_name": "Ahmad Rizal",
  "phone_number": "0129876543"
}
```

---

## Cars (Public)

### GET `/api/cars`

Returns all active car models.

**Auth:** None required

**Response `200`:**
```json
{
  "success": true,
  "data": [
    {
      "id": 1,
      "name": "Honda City",
      "slug": "city",
      "category": "sedan",
      "fuel_type": "petrol",
      "estimated_price_from": 85000,
      "short_description": "...",
      "best_for": "...",
      "hero_image_url": "/images/cars/city/hero.webp",
      "is_featured": true,
      "is_active": true
    }
  ]
}
```

---

### GET `/api/cars/:slug`

Returns full details for a single car model including variants, images, features, and colours.

**Auth:** None required

**Params:** `slug` — e.g. `city`, `civic`, `hr-v`

**Response `200`:**
```json
{
  "success": true,
  "data": {
    "id": 1,
    "name": "Honda City",
    "slug": "city",
    "variants": [ { "variant_name": "E CVT", "estimated_price": 85900, ... } ],
    "images": [ { "image_url": "...", "image_type": "gallery", ... } ],
    "features": [ { "feature_title": "Honda SENSING", "feature_category": "safety", ... } ],
    "colors": [ { "color_name": "Lunar Silver Metallic", "color_hex": "#C0C0C0", ... } ]
  }
}
```

---

## Inquiries

### POST `/api/inquiries`

Submit a customer inquiry.

**Auth:** Optional — if the customer is logged in, their `user_id` is captured automatically.

**Body:**
```json
{
  "full_name": "Siti Norbaya",
  "email": "siti@example.com",
  "phone_number": "0111234567",
  "preferred_model": "Honda HR-V",
  "budget_range": "100000-120000",
  "inquiry_type": "price_inquiry",
  "message": "I am interested in the HR-V e:HEV. Please contact me."
}
```

**Response `201`:** Inquiry created.

---

### GET `/api/inquiries/my`

Get all inquiries submitted by the logged-in customer.

**Headers:** `Authorization: Bearer <token>`

---

## Appointments

### POST `/api/appointments`

Book an appointment request.

**Auth:** None required (customer contact details captured in the body)

**Body:**
```json
{
  "full_name": "Razif Bin Hamid",
  "email": "razif@example.com",
  "phone_number": "0167654321",
  "appointment_type": "test_drive",
  "preferred_model": "Honda WR-V",
  "preferred_date": "2026-07-15",
  "preferred_time": "10:00",
  "notes": "Prefer morning slot"
}
```

---

## Loan Calculator

### GET `/api/loan-calculations`

Returns reference data for loan calculation (interest rates, standard tenures).

**Auth:** None required

---

## Site Content (Public)

### GET `/api/site`

Returns the current active homepage content for the public to read.

**Auth:** None required

---

## Admin — Dashboard

### GET `/api/admin/dashboard`

Returns summary statistics and recent activity for the admin dashboard.

**Headers:** `Authorization: Bearer <admin-token>`

**Response `200`:**
```json
{
  "success": true,
  "data": {
    "total_inquiries": 24,
    "new_inquiries": 5,
    "total_appointments": 12,
    "pending_appointments": 3,
    "recent_inquiries": [ ... ],
    "recent_appointments": [ ... ]
  }
}
```

---

## Admin — Cars

All routes require admin token.

| Method | Route | Description |
|---|---|---|
| `GET` | `/api/admin/cars` | List all car models (including inactive) |
| `GET` | `/api/admin/cars/:id` | Get single car with full details |
| `POST` | `/api/admin/cars` | Create a new car model |
| `PUT` | `/api/admin/cars/:id` | Update a car model |
| `DELETE` | `/api/admin/cars/:id` | Delete a car model |
| `PATCH` | `/api/admin/cars/:id/toggle` | Toggle active/inactive status |

---

## Admin — Inquiries

| Method | Route | Description |
|---|---|---|
| `GET` | `/api/admin/inquiries` | List all inquiries with filters |
| `PATCH` | `/api/admin/inquiries/:id/status` | Update inquiry status |

**Status values:** `new`, `contacted`, `won`, `lost`

---

## Admin — Appointments

| Method | Route | Description |
|---|---|---|
| `GET` | `/api/admin/appointments` | List all appointment requests |
| `PATCH` | `/api/admin/appointments/:id/status` | Update appointment status |

**Status values:** `pending`, `confirmed`, `completed`, `cancelled`

---

## Admin — Site Content

| Method | Route | Description |
|---|---|---|
| `GET` | `/api/admin/site` | Get current homepage content |
| `PUT` | `/api/admin/site` | Update homepage content |

---

## Admin — Account

| Method | Route | Description |
|---|---|---|
| `GET` | `/api/admin/account/profile` | Get admin profile |
| `PUT` | `/api/admin/account/profile` | Update admin profile |
| `PATCH` | `/api/admin/account/password` | Change admin password |
| `POST` | `/api/admin/account/create` | Create new admin account (super_admin only) |

---

## Health Check

### GET `/api/health`

Confirms the API is running.

**Auth:** None

**Response:**
```json
{
  "success": true,
  "message": "Honda Advisor API is running",
  "database": "honda_advisor_db",
  "timestamp": "2026-06-27T10:00:00.000Z"
}
```
