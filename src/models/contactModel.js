import { query } from "../db/pool.js";

export async function createContactMessage({ userId, name, email, subject, message }) {
  const result = await query(
    `INSERT INTO contact_messages (user_id, name, email, subject, message)
     VALUES ($1, $2, $3, $4, $5)
     RETURNING *`,
    [userId || null, name, email.toLowerCase(), subject, message]
  );

  return result.rows[0];
}

export async function listContactMessages() {
  const result = await query(
    `SELECT m.*, u.first_name, u.last_name
     FROM contact_messages m
     LEFT JOIN users u ON u.id = m.user_id
     ORDER BY m.created_at DESC`
  );

  return result.rows;
}

export async function updateContactStatus(id, status, responseNote) {
  await query(
    `UPDATE contact_messages
     SET status = $1, response_note = $2, updated_at = now()
     WHERE id = $3`,
    [status, responseNote || null, id]
  );
}
