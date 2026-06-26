const express = require('express');
const cors = require('cors');
const fs = require('node:fs');
const path = require('node:path');
require('dotenv').config();

const { testDatabaseConnection } = require('./config/db');

const authRoutes = require('./routes/auth.routes');
const carsRoutes = require('./routes/cars.routes');
const adminCarsRoutes = require('./routes/admin-cars.routes');
const inquiriesRoutes = require('./routes/inquiries.routes');
const appointmentsRoutes = require('./routes/appointments.routes');
const loanCalculationsRoutes = require('./routes/loan-calculations.routes');
const adminDashboardRoutes = require('./routes/admin-dashboard.routes');
const siteContentRoutes = require('./routes/site-content.routes');
const adminSiteContentRoutes = require('./routes/admin-site-content.routes');
const adminAccountRoutes = require('./routes/admin-account.routes');

const app = express();

const PORT = process.env.PORT || 3000;
const configuredOrigins = (process.env.CLIENT_URLS || process.env.CLIENT_URL || 'http://localhost:4200')
  .split(',')
  .map((origin) => origin.trim())
  .filter(Boolean);

function isSameOriginRequest(origin, req) {
  try {
    const originUrl = new URL(origin);
    return originUrl.host === req.get('host');
  } catch {
    return false;
  }
}

app.use(
  cors((req, callback) => {
    callback(null, {
      origin(origin, originCallback) {
        if (!origin || configuredOrigins.includes(origin) || isSameOriginRequest(origin, req)) {
          originCallback(null, true);
          return;
        }

        originCallback(new Error(`CORS origin not allowed: ${origin}`));
      },
      credentials: true,
    });
  })
);

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.get('/api/health', (req, res) => {
  res.json({
    success: true,
    message: 'Honda Advisor API is running',
    database: process.env.DB_NAME,
    timestamp: new Date().toISOString(),
  });
});

app.use('/api/auth', authRoutes);
app.use('/api/cars', carsRoutes);
app.use('/api/inquiries', inquiriesRoutes);
app.use('/api/appointments', appointmentsRoutes);
app.use('/api/loan-calculations', loanCalculationsRoutes);
app.use('/api/admin/dashboard', adminDashboardRoutes);
app.use('/api/admin/cars', adminCarsRoutes);
app.use('/api/site', siteContentRoutes);
app.use('/api/admin/site', adminSiteContentRoutes);
app.use('/api/admin/account', adminAccountRoutes);

const frontendDistPath = path.resolve(
  process.env.FRONTEND_DIST_DIR || path.join(__dirname, '../../honda-advisor-angular/dist/honda-advisor-angular/browser')
);
const frontendIndexPath = path.join(frontendDistPath, 'index.html');
const hasFrontendBuild = fs.existsSync(frontendIndexPath);

if (hasFrontendBuild) {
  app.use(
    express.static(frontendDistPath, {
      index: false,
      maxAge: process.env.NODE_ENV === 'production' ? '1y' : 0,
    })
  );

  app.use((req, res, next) => {
    if (req.path.startsWith('/api')) {
      next();
      return;
    }

    res.sendFile(frontendIndexPath);
  });
}

app.use((req, res) => {
  res.status(404).json({
    success: false,
    message: 'API route not found',
  });
});

app.use((error, req, res, next) => {
  console.error('Unhandled server error:', error);

  res.status(500).json({
    success: false,
    message: 'Internal server error',
  });
});

async function startServer() {
  await testDatabaseConnection();

  app.listen(PORT, () => {
    console.log(`Honda Advisor API running on http://localhost:${PORT}`);
  });
}

startServer();
