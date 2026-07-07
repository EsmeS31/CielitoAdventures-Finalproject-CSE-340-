import { query } from "../db/pool.js";

export async function createBooking({ userId, packageId, travelDate, partySize, totalPrice }) {
  const client = await query("SELECT price FROM packages WHERE id = $1 AND status = 'active'", [
    packageId
  ]);
  const selectedPackage = client.rows[0];

  if (!selectedPackage) {
    const error = new Error("Package is not available for booking.");
    error.status = 404;
    throw error;
  }

  const finalTotal = totalPrice ?? Number(selectedPackage.price) * Number(partySize);
  const result = await query(
    `INSERT INTO bookings (user_id, package_id, travel_date, party_size, total_price)
     VALUES ($1, $2, $3, $4, $5)
     RETURNING *`,
    [userId, packageId, travelDate, Number(partySize), finalTotal]
  );

  await query(
    `INSERT INTO booking_status_history (booking_id, changed_by, old_status, new_status, note)
     VALUES ($1, $2, NULL, 'requested', $3)`,
    [result.rows[0].id, userId, "Traveler requested this package."]
  );

  return result.rows[0];
}

export async function listBookingsForUser(userId) {
  const result = await query(
    `SELECT b.*, p.title AS package_title, p.duration_days, p.category
     FROM bookings b
     JOIN packages p ON p.id = b.package_id
     WHERE b.user_id = $1
     ORDER BY b.created_at DESC`,
    [userId]
  );

  return result.rows;
}

export async function listAllBookings() {
  const result = await query(
    `SELECT b.*, u.first_name, u.last_name, u.email,
            p.title AS package_title, p.duration_days, p.category
     FROM bookings b
     JOIN users u ON u.id = b.user_id
     JOIN packages p ON p.id = b.package_id
     ORDER BY b.created_at DESC`
  );

  return result.rows;
}

export async function getBookingForUser(bookingId, userId) {
  const result = await query(
    `SELECT b.*, p.title AS package_title, p.duration_days, p.category
     FROM bookings b
     JOIN packages p ON p.id = b.package_id
     WHERE b.id = $1 AND b.user_id = $2`,
    [bookingId, userId]
  );

  return result.rows[0] ?? null;
}

export async function getBookingHistory(bookingId) {
  const result = await query(
    `SELECT h.*, u.first_name, u.last_name
     FROM booking_status_history h
     LEFT JOIN users u ON u.id = h.changed_by
     WHERE h.booking_id = $1
     ORDER BY h.created_at ASC`,
    [bookingId]
  );

  return result.rows;
}

export async function updateBookingStatus(bookingId, status, note, changedBy) {
  const existing = await query("SELECT status FROM bookings WHERE id = $1", [bookingId]);
  const booking = existing.rows[0];

  if (!booking) {
    const error = new Error("Booking not found.");
    error.status = 404;
    throw error;
  }

  const result = await query(
    `UPDATE bookings
     SET status = $1, updated_at = now()
     WHERE id = $2
     RETURNING *`,
    [status, bookingId]
  );

  await query(
    `INSERT INTO booking_status_history (booking_id, changed_by, old_status, new_status, note)
     VALUES ($1, $2, $3, $4, $5)`,
    [bookingId, changedBy, booking.status, status, note || "Status updated."]
  );

  return result.rows[0];
}
