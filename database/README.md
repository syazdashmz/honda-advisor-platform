# Honda Advisor Database

This folder separates the database workflow by purpose so the project is easier to publish, restore, and maintain.

## Files

- `schema.sql` - Fresh database structure. Use this when setting up a new local or hosted MySQL database.
- `seed.sql` - Starter/sample data for development and demo use. Run this after `schema.sql`.
- `migrations/` - Upgrade scripts for an existing database that already has data.
- `maintenance/` - Optional manual scripts for checks or admin fixes. These are not part of the normal setup flow.

## Fresh Setup

Run these in MySQL Workbench in this order:

```sql
SOURCE database/schema.sql;
SOURCE database/seed.sql;
```

If you are using MySQL Workbench directly, open `schema.sql`, run it, then open `seed.sql` and run it.

## Existing Database Upgrade

For a database that already exists, do not run `schema.sql` because it drops and recreates tables. Run only the needed migration file:

```sql
SOURCE database/migrations/2026-05-08-current-implementation-fixes.sql;
```

The 2026-05-08 migration adds the admin-editable homepage content table, aligns appointment statuses with the API, and protects confirmed appointment slots from duplicate date/time bookings.

## Manual Maintenance

- `maintenance/promote-user-to-admin.sql` - Change one configured user email to the `admin` role.
- `maintenance/check-confirmed-appointment-slots.sql` - Check duplicate confirmed appointment slots and confirm related indexes exist.

Update the variables near the top of a maintenance file before running it.

## App Connection

The API expects the database name to match the backend environment configuration. In local development this project uses:

```env
DB_NAME=honda_advisor_db
```

Keep the backend `.env` database values aligned with your MySQL Workbench schema.
