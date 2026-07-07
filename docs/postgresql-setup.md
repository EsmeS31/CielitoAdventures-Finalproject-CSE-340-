# PostgreSQL Setup

The app connects to PostgreSQL through one environment variable:

```bash
DATABASE_URL=postgres://USER:PASSWORD@HOST:PORT/DATABASE
```

`src/db/pool.js` reads that value and creates a shared `pg.Pool`. Every model file uses parameterized queries through that pool, which protects the project from SQL injection.

## Local Setup

1. Install PostgreSQL locally.
2. Create a database:

   ```bash
   createdb cielito_adventures
   ```

3. Create `.env` from `.env.example`:

   ```bash
   cp .env.example .env
   ```

4. Set `DATABASE_URL` in `.env`, for example:

   ```bash
   DATABASE_URL=postgres://postgres:postgres@localhost:5432/cielito_adventures
   ```

5. Run the schema and seed data:

   ```bash
   npm run db:setup
   ```

6. Start the app:

   ```bash
   npm run dev
   ```

## Render Setup

1. Create a new PostgreSQL database on Render.
2. Create a new Web Service from this GitHub repository.
3. Add these environment variables in Render:

   ```text
   NODE_ENV=production
   SESSION_SECRET=<long random value>
   DATABASE_URL=<Render PostgreSQL internal connection string>
   ```

4. Deploy the app.
5. Open Render Shell for the web service and run:

   ```bash
   npm run db:setup
   ```

After that, login with the seeded accounts listed in the README.
