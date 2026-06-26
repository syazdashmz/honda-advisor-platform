const express = require('express');
const cors = require('cors');
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
const allowedOrigins = (process.env.CLIENT_URLS || process.env.CLIENT_URL || 'http://localhost:4200')
  .split(',')
  .map((origin) => origin.trim())
  .filter(Boolean);

app.use(
  cors({
    origin(origin, callback) {
      if (!origin || allowedOrigins.includes(origin)) {
        callback(null, true);
        return;
      }

      callback(new Error(`CORS origin not allowed: ${origin}`));
    },
    credentials: true,
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
