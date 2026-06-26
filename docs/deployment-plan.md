# Deployment Plan

## Recommended Railway-Only Setup

Use one Railway project with three services:

- `honda-advisor-frontend` - Angular frontend served by `honda-advisor-angular/server.js`.
- `honda-advisor-api` - Express API from `honda-advisor-api`.
- `MySQL` - Railway MySQL database plugin.

This keeps the whole app inside Railway and avoids managing Cloudflare, Render, and Aiven separately.

## Railway Frontend Service

Create a service from the GitHub repo and use:

- Repository: `syazdashmz/honda-advisor-platform`
- Branch: `main`
- Root directory: `honda-advisor-angular`
- Build command: `npm install && npm run build`
- Start command: `npm start`

Set this frontend environment variable after the API service has a public URL:

```text
API_ORIGIN=https://your-api-service.up.railway.app
```

The frontend server proxies `/api/*` to `API_ORIGIN`, so the Angular app can keep calling `/api` in production.

## Railway API Service

Create another service from the same GitHub repo and use:

- Repository: `syazdashmz/honda-advisor-platform`
- Branch: `main`
- Root directory: `honda-advisor-api`
- Build command: `npm install`
- Start command: `npm start`

Set API environment variables:

```text
NODE_ENV=production
JWT_SECRET=generate-a-long-random-secret
JWT_EXPIRES_IN=7d
CLIENT_URLS=https://your-frontend-service.up.railway.app
INQUIRY_TO_EMAIL=syazdashmz@gmail.com
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_SECURE=false
SMTP_USER=your-email@gmail.com
SMTP_PASS=your-gmail-app-password
SMTP_FROM=Fauziah Auto Advisor <your-email@gmail.com>
```

The API automatically supports Railway MySQL variables:

```text
MYSQLHOST
MYSQLUSER
MYSQLPASSWORD
MYSQLDATABASE
MYSQLPORT
```

If the MySQL variables are not auto-injected, manually map them to:

```text
DB_HOST
DB_USER
DB_PASSWORD
DB_NAME
DB_PORT
```

## Railway MySQL

Create a Railway MySQL database service in the same project. Then import SQL in this order:

1. `database/schema.sql`
2. `database/seed.sql`
3. `database/migrations/2026-06-27-publish-polish.sql`

Use Railway's MySQL connection tab or a local MySQL client connected to the Railway public TCP proxy.

## Cloudflare Pages Alternative

Cloudflare Pages is still a strong free frontend option. If you return to Cloudflare later:

- Root directory: `honda-advisor-angular`
- Build command: `npm run build`
- Build output directory: `dist/honda-advisor-angular/browser`
- Environment variable: `API_ORIGIN=https://your-api-service.up.railway.app`

## Final Checks

- Run Angular production build.
- Run Node syntax checks for changed API files.
- Verify `/`, `/cars`, `/compare`, `/inquiry`, `/appointment`, and at least one `/cars/:slug` page.
- Submit a test inquiry after SMTP credentials are configured and confirm the advisor email receives all structured fields.
