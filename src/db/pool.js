
import pg from "pg";
import dotenv from "dotenv";

dotenv.config();

const raw = process.env.DATABASE_URL || process.env.DB_URL || "";
const connectionString = raw ? raw.trim() : null;

if (!connectionString) {
  throw new Error(
    "Database connection string missing. Set DATABASE_URL (or DB_URL) in your environment."
  );
}

const useSsl = process.env.NODE_ENV === "production" || process.env.DATABASE_SSL === "true";

export const pool = new pg.Pool({
  connectionString,
  ssl: useSsl ? { rejectUnauthorized: false } : false,
});

export async function query(text, params) {
  return pool.query(text, params);
}
