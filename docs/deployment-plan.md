# Deployment Plan

## Frontend

- Cloudflare Pages Git integration:
  - Repository: `syazdashmz/honda-advisor-platform`
  - Production branch: `main`
  - Root directory: `honda-advisor-angular`
  - Build command: `npm run build`
  - Build output directory: `dist/honda-advisor-angular/browser`
- The Angular app includes `public/_redirects` so direct visits to routes such as `/compare`, `/inquiry`, and `/appointment` resolve to `index.html`.
- The Angular app includes `public/_headers` for basic security headers and static asset caching.
- The production frontend calls `/api` on non-localhost domains. Cloudflare Pages Function `functions/api/[[path]].js` proxies those requests to the API host configured by `API_ORIGIN`.

## API

- The Express API is a Node server and needs a Node-compatible host, serverless Node target, or a Cloudflare Workers adaptation before full live functionality can work.
- If using Cloudflare Pages for the frontend, set `API_ORIGIN` in Pages environment variables to the deployed API origin, for example `https://your-api-host.example.com`.
- Required environment variables are listed in `honda-advisor-api/.env.example`.
- Inquiry email notifications are sent to `INQUIRY_TO_EMAIL`, currently set to `syazdashmz@gmail.com` for showcase use.
- Configure `SMTP_HOST`, `SMTP_PORT`, `SMTP_SECURE`, `SMTP_USER`, `SMTP_PASS`, and `SMTP_FROM` before expecting live email delivery.

## Final Checks

- Run Angular production build.
- Run Node syntax checks for changed API files.
- Verify `/`, `/cars`, `/compare`, `/inquiry`, `/appointment`, and at least one `/cars/:slug` page.
- Submit a test inquiry after SMTP credentials are configured and confirm the advisor email receives all structured fields.
