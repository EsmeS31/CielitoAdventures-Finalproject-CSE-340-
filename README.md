# Cielito Adventures

Cielito Adventures is a server-side rendered travel agency application built with Node.js, Express.js, EJS, and PostgreSQL. It allows visitors to browse travel packages, create accounts, request bookings, submit reviews, and send contact messages. Admins and agents can manage destinations, packages, bookings, reviews, and users from protected dashboards.

## Technology Stack
- Node.js and Express.js
- ESM via `"type": "module"`
- EJS for server-side rendering
- PostgreSQL with normalized relational tables
- `express-session` for session-based authentication
- `bcrypt` for password hashing
- Render deployment target

## Major Features
- Public browsing of travel packages and package details
- User registration, login, logout, and protected routes
- Three user roles: admin, agent, and traveler
- Traveler dashboard for bookings, status tracking, and review management
- Multi-stage booking workflow: requested, confirmed, completed, cancelled
- Admin dashboard with operational data
- Admin CRUD for destinations and packages
- Admin user role management
- Review moderation and contact message management
- Parameterized PostgreSQL queries and server-side form validation

## Database Schema
The database schema is defined in [`database/schema.sql`](database/schema.sql), and the seed data is in [`database/seed.sql`](database/seed.sql).

Tables include:
- `users`, `destinations`, `packages`, `bookings`, `booking_status_history`, `reviews`, `contact_messages`, `session`

ERD (required)
- Export an ERD image from pgAdmin or DBeaver and save it as `docs/erd.png`.
- Add the exported image to the repo and reference it here:
  `![ERD](docs/erd.png)`

## User Roles
- **Admin/Owner**: Full access
- **Agent**: Booking/review/message management (no role management)
- **Traveler**: Browse packages, request bookings, manage own reviews

## Test Accounts
Use `P@$$w0rd!` for seeded accounts:
- Admin: `admin@cielito.test`
- Agent: `agent@cielito.test`
- Traveler: `traveler@cielito.test`

## Local Setup
1. Install:
   ```bash
   npm install
   ```
2. Copy example env:
   ```bash
   cp .env.example .env
   ```
   Ensure `.env` uses `DATABASE_URL` (not `DB_URL`).
3. Create DB and run:
   ```bash
   npm run db:setup
   npm run db:check
   npm run dev
   ```
4. Open `http://localhost:3000`

## Render Deployment
Include `DATABASE_URL`, `SESSION_SECRET`, `NODE_ENV=production` on Render. Use the provided `render.yaml`. After deploy run `npm run db:setup` in Render Shell.

## Security Notes
- Passwords hashed with bcrypt
- Sessions use secure cookie settings in production
- Parameterized SQL queries
- Validate/sanitize input with `express-validator`
- Do not commit `.env` or secrets

## Known Limitations
- Images are currently referenced by URL only; no file-upload pipeline.
- No pagination on package lists (may be slow with many records).
- Admin dashboard is intentionally minimal (no analytics).
- Some form validation may be missing on edge-case fields — validate before final grading.

