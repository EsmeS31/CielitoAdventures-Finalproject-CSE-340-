import { query } from "../db/pool.js";

export async function createReview({ userId, packageId, rating, comment }) {
  const result = await query(
    `INSERT INTO reviews (user_id, package_id, rating, comment)
     VALUES ($1, $2, $3, $4)
     ON CONFLICT (user_id, package_id)
     DO UPDATE SET rating = EXCLUDED.rating, comment = EXCLUDED.comment, updated_at = now()
     RETURNING *`,
    [userId, packageId, Number(rating), comment]
  );

  return result.rows[0];
}

export async function listReviewsForUser(userId) {
  const result = await query(
    `SELECT r.*, p.title AS package_title
     FROM reviews r
     JOIN packages p ON p.id = r.package_id
     WHERE r.user_id = $1
     ORDER BY r.updated_at DESC`,
    [userId]
  );

  return result.rows;
}

export async function listAllReviews() {
  const result = await query(
    `SELECT r.*, u.first_name, u.last_name, u.email, p.title AS package_title
     FROM reviews r
     JOIN users u ON u.id = r.user_id
     JOIN packages p ON p.id = r.package_id
     ORDER BY r.created_at DESC`
  );

  return result.rows;
}

export async function deleteOwnReview(reviewId, userId) {
  await query("DELETE FROM reviews WHERE id = $1 AND user_id = $2", [reviewId, userId]);
}

export async function updateOwnReview(reviewId, userId, { rating, comment }) {
  const result = await query(
    `UPDATE reviews
     SET rating = $1, comment = $2, is_flagged = false, updated_at = now()
     WHERE id = $3 AND user_id = $4
     RETURNING *`,
    [Number(rating), comment, reviewId, userId]
  );

  return result.rows[0] ?? null;
}

export async function deleteReview(reviewId) {
  await query("DELETE FROM reviews WHERE id = $1", [reviewId]);
}

export async function setReviewFlag(reviewId, isFlagged) {
  await query("UPDATE reviews SET is_flagged = $1, updated_at = now() WHERE id = $2", [
    isFlagged,
    reviewId
  ]);
}
