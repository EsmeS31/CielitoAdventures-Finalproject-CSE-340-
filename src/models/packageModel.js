import { query } from "../db/pool.js";

export async function listPublicPackages({ category, sort } = {}) {
  const filters = ["p.status = 'active'"];
  const params = [];

  if (category) {
    params.push(category);
    filters.push(`p.category = $${params.length}`);
  }

  const orderBy =
    sort === "price_asc"
      ? "p.price ASC"
      : sort === "price_desc"
        ? "p.price DESC"
        : "p.created_at DESC";

  const result = await query(
    `SELECT p.*, d.name AS destination_name, d.region, d.image_url,
            COALESCE(ROUND(AVG(r.rating)::numeric, 1), 0) AS average_rating,
            COUNT(r.id)::int AS review_count
     FROM packages p
     LEFT JOIN destinations d ON d.id = p.destination_id
     LEFT JOIN reviews r ON r.package_id = p.id AND r.is_flagged = false
     WHERE ${filters.join(" AND ")}
     GROUP BY p.id, d.id
     ORDER BY ${orderBy}`,
    params
  );

  return result.rows;
}

export async function listAllPackages() {
  const result = await query(
    `SELECT p.*, d.name AS destination_name, d.region
     FROM packages p
     LEFT JOIN destinations d ON d.id = p.destination_id
     ORDER BY p.updated_at DESC`
  );

  return result.rows;
}

export async function getPackageById(id) {
  const result = await query(
    `SELECT p.*, d.name AS destination_name, d.region, d.description AS destination_description,
            d.image_url
     FROM packages p
     LEFT JOIN destinations d ON d.id = p.destination_id
     WHERE p.id = $1`,
    [id]
  );

  return result.rows[0] ?? null;
}

export async function getPackageReviews(packageId) {
  const result = await query(
    `SELECT r.*, u.first_name, u.last_name
     FROM reviews r
     JOIN users u ON u.id = r.user_id
     WHERE r.package_id = $1 AND r.is_flagged = false
     ORDER BY r.created_at DESC`,
    [packageId]
  );

  return result.rows;
}

export async function listDestinations() {
  const result = await query("SELECT * FROM destinations ORDER BY name ASC");
  return result.rows;
}

export async function createPackage(data, createdBy) {
  const result = await query(
    `INSERT INTO packages
       (destination_id, title, category, duration_days, price, description, status, created_by)
     VALUES ($1, $2, $3, $4, $5, $6, $7, $8)
     RETURNING *`,
    [
      data.destinationId || null,
      data.title,
      data.category,
      Number(data.durationDays),
      Number(data.price),
      data.description,
      data.status,
      createdBy
    ]
  );

  return result.rows[0];
}

export async function updatePackage(id, data) {
  const result = await query(
    `UPDATE packages
     SET destination_id = $1,
         title = $2,
         category = $3,
         duration_days = $4,
         price = $5,
         description = $6,
         status = $7,
         updated_at = now()
     WHERE id = $8
     RETURNING *`,
    [
      data.destinationId || null,
      data.title,
      data.category,
      Number(data.durationDays),
      Number(data.price),
      data.description,
      data.status,
      id
    ]
  );

  return result.rows[0] ?? null;
}

export async function deletePackage(id) {
  await query("DELETE FROM packages WHERE id = $1", [id]);
}
