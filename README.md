# Cielito Adventures

Cielito Adventures is a server-rendered travel agency web application for travelers who want curated, less typical Mexico travel experiences. Visitors can browse travel packages, create an account, request bookings, track booking status, submit reviews, and send contact messages. Admins and agents can manage operational data from protected dashboards.

## Technology Stack

- Node.js and Express.js
- ESM imports/exports through `"type": "module"`
- EJS server-rendered views
- PostgreSQL with normalized relational tables
- `express-session` with PostgreSQL session storage
- `bcrypt` password hashing
- Render deployment target

## Major Features

- Public package browsing with filtering and dynamic package detail pages
- Register, login, logout, and protected routes
- Three roles: admin, agent, traveler
- Traveler dashboard with booking requests, status history, and review create/edit/delete management
- Multi-stage booking workflow: requested, confirmed, completed, cancelled
- Admin dashboard with operational stats
- Admin package CRUD for core site content
- Admin user role management
- Agent/admin booking status updates with workflow history
- Review moderation through flag/delete actions
- Contact form saved to the database with admin response status
- Parameterized PostgreSQL queries and server-side form validation

## Database Schema

The SQL schema is in [`database/schema.sql`](database/schema.sql).

Tables:

- `users`
- `destinations`
- `packages`
- `bookings`
- `booking_status_history`
- `reviews`
- `contact_messages`
- `session`

ERD reference: [`docs/erd.md`](docs/erd.md)

For final submission, export an ERD image from pgAdmin using the same table relationships and add it to this README if your instructor requires the pgAdmin export specifically.

## User Roles

- **Admin/Owner**: Can manage users and roles, add/edit/delete packages, update bookings, moderate reviews, view messages, and access all dashboard data.
- **Agent**: Can view operations, update booking statuses, moderate reviews, and respond to contact messages. Agents cannot manage users or delete core package content.
- **Traveler**: Can browse packages, request bookings, view their booking status history, create/edit/delete their own reviews, and send contact messages.

## Test Accounts

Use `P@$$w0rd!` for all seeded accounts.

- Admin: `admin@cielito.test`
- Agent: `agent@cielito.test`
- Traveler: `traveler@cielito.test`

Do not commit real passwords or secrets. The seeded password is stored only as a bcrypt hash in `database/seed.sql`.

## PostgreSQL Connection

The app connects to PostgreSQL through this environment variable:

```bash
DATABASE_URL=postgres://USER:PASSWORD@HOST:PORT/DATABASE
DATABASE_SSL=false
```

More setup details are in [`docs/postgresql-setup.md`](docs/postgresql-setup.md).

## Local Setup

1. Install dependencies:

   ```bash
   npm install
   ```

2. Create a `.env` file:

   ```bash
   cp .env.example .env
   ```

3. Create a PostgreSQL database and update `DATABASE_URL` in `.env`.

4. Run schema and seed data:

   ```bash
   npm run db:setup
   ```

5. Confirm the app can connect to PostgreSQL:

   ```bash
   npm run db:check
   ```

6. Start development:

   ```bash
   npm run dev
   ```

7. Open:

   ```text
   http://localhost:3000
   ```

## Render Deployment

This repo includes [`render.yaml`](render.yaml) as a starting blueprint.

Required Render environment variables:

```text
NODE_ENV=production
SESSION_SECRET=<long random generated value>
DATABASE_URL=<Render PostgreSQL internal connection string>
```

After deploying, open the Render Shell and run:

```bash
npm run db:setup
npm run db:check
```

That creates the tables and seeds the test accounts.

## Security Notes

- Passwords are hashed with bcrypt.
- Sessions use `httpOnly`, `sameSite`, and production-only secure cookies.
- SQL queries use parameterized placeholders.
- User input is validated with `express-validator`.
- `.env` is ignored and should never be committed.
- Production disables the development preview route.

## Known Limitations

- Destination CRUD is represented in the schema and package form relationship, but a dedicated destination management screen is not built yet.
- Payment checkout is intentionally out of scope; bookings are requests, not paid orders.
- The README links to an ERD reference, but a pgAdmin-exported ERD image still needs to be added if required by the instructor.
