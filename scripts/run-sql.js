import fs from "node:fs/promises";
import path from "node:path";
import process from "node:process";
import dotenv from "dotenv";
import pg from "pg";

dotenv.config();

const sqlFile = process.argv[2];

if (!sqlFile) {
  console.error("Usage: node scripts/run-sql.js <path-to-sql-file>");
  process.exit(1);
}

if (!process.env.DATABASE_URL) {
  console.error("DATABASE_URL is missing. Add it to .env locally or Render environment variables.");
  process.exit(1);
}

const absoluteSqlFile = path.resolve(sqlFile);
const sql = await fs.readFile(absoluteSqlFile, "utf8");
const pool = new pg.Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: process.env.NODE_ENV === "production" ? { rejectUnauthorized: false } : false
});

try {
  await pool.query(sql);
  console.log(`Ran ${sqlFile} successfully.`);
} catch (error) {
  console.error(`Could not run ${sqlFile}.`);
  console.error(error.message);
  process.exitCode = 1;
} finally {
  await pool.end();
}
