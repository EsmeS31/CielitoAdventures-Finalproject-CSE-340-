# Cielito Adventures

Cielito Adventures is a server-rendered travel agency web application for discovering less typical places in Mexico and requesting curated travel packages through a personal account.

## Current Build Section

This first section sets up the backend scaffold and authentication foundation:

- Express with ESM through `"type": "module"`
- EJS server-rendered pages and partials
- PostgreSQL schema with normalized related tables
- `express-session` with PostgreSQL session storage
- Register and login routes using bcrypt password hashing
- Role-ready middleware for admin, agent, and traveler access
- Admin dashboard frontend based on the attached visual reference
- Global 404 and error handling middleware

## User Roles

- **Admin**: Full management access to users, packages, bookings, destinations, and reviews.
- **Agent**: Management access for travel operations such as bookings and packages.
- **Traveler**: Standard account access for requesting trips, tracking booking status, and writing reviews.

## Database Schema

The schema is in `database/schema.sql` and includes:

- `users`
- `destinations`
- `packages`
- `bookings`
- `booking_status_history`
- `reviews`
- `session`

The design uses foreign keys, enum status values, role values, and workflow history for booking status changes.

## Local Setup

1. Install dependencies:

   ```bash
   npm install
   ```

2. Create a `.env` file from the example:

   ```bash
   cp .env.example .env
   ```

3. Create a PostgreSQL database and update `DATABASE_URL` in `.env`.

4. Run the schema:

   ```bash
   npm run db:schema
   ```

5. Optional seed data:

   ```bash
   psql "$DATABASE_URL" -f database/seed.sql
   ```

6. Start development:

   ```bash
   npm run dev
   ```

## Test Accounts

Use `P@$$w0rd!` for all seeded accounts.

- Admin: `admin@cielito.test`
- Agent: `agent@cielito.test`
- Traveler: `traveler@cielito.test`

## Known Limitations

This is section one of the build. The admin dashboard, schema, and authentication foundation are started, but package management, booking workflows, review CRUD, user management, and deployment configuration still need to be completed in later sections.
