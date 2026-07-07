import bcrypt from "bcrypt";
import { query } from "../db/pool.js";

const SALT_ROUNDS = 12;

export async function createUser({ firstName, lastName, email, password, role = "traveler" }) {
  const passwordHash = await bcrypt.hash(password, SALT_ROUNDS);

  const result = await query(
    `INSERT INTO users (first_name, last_name, email, password_hash, role)
     VALUES ($1, $2, $3, $4, $5)
     RETURNING id, first_name, last_name, email, role`,
    [firstName, lastName, email.toLowerCase(), passwordHash, role]
  );

  return result.rows[0];
}

export async function findUserByEmail(email) {
  const result = await query(
    `SELECT id, first_name, last_name, email, password_hash, role
     FROM users
     WHERE email = $1`,
    [email.toLowerCase()]
  );

  return result.rows[0] ?? null;
}

export async function findUserById(id) {
  const result = await query(
    `SELECT id, first_name, last_name, email, role
     FROM users
     WHERE id = $1`,
    [id]
  );

  return result.rows[0] ?? null;
}

export async function verifyPassword(password, passwordHash) {
  return bcrypt.compare(password, passwordHash);
}

export async function listUsers() {
  const result = await query(
    `SELECT id, first_name, last_name, email, role, created_at
     FROM users
     ORDER BY created_at DESC`
  );

  return result.rows;
}

export async function updateUserRole(id, role) {
  const result = await query(
    `UPDATE users
     SET role = $1, updated_at = now()
     WHERE id = $2
     RETURNING id, first_name, last_name, email, role`,
    [role, id]
  );

  return result.rows[0] ?? null;
}
