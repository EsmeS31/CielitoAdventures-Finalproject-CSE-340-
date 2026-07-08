import dotenv from "dotenv";
import pg from "pg";

dotenv.config();

if (!process.env.DATABASE_URL) {
  console.error("DATABASE_URL is missing. Add it to .env locally or Render environment variables.");
  process.exit(1);
}

const pool = new pg.Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: process.env.NODE_ENV === "production" ? { rejectUnauthorized: false } : false
});

try {
  const result = await pool.query("SELECT current_database() AS database, current_user AS user");
  const { database, user } = result.rows[0];
  console.log(`Connected to PostgreSQL database "${database}" as "${user}".`);
} catch (error) {
  console.error("Could not connect to PostgreSQL.");
  console.error(error.message);
  process.exitCode = 1;
} finally {
  await pool.end();
}
