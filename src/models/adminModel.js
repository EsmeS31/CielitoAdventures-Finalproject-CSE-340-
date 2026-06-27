import { query } from "../db/pool.js";

export async function getAdminOverview() {
  const [users, packages, revenue, bookings] = await Promise.all([
    query("SELECT COUNT(*)::int AS count FROM users"),
    query("SELECT COUNT(*)::int AS count FROM packages WHERE status = 'active'"),
    query(
      `SELECT COALESCE(SUM(total_price), 0)::numeric(10, 2) AS total
       FROM bookings
       WHERE created_at >= date_trunc('month', CURRENT_DATE)`
    ),
    query(
      `SELECT b.id, b.status, b.travel_date, b.total_price,
              u.first_name, u.last_name, u.email,
              p.title AS package_title, p.duration_days, p.category
       FROM bookings b
       JOIN users u ON u.id = b.user_id
       JOIN packages p ON p.id = b.package_id
       ORDER BY b.created_at DESC
       LIMIT 5`
    )
  ]);

  return {
    stats: {
      users: users.rows[0].count,
      activePackages: packages.rows[0].count,
      monthlyRevenue: revenue.rows[0].total
    },
    bookings: bookings.rows
  };
}
