INSERT INTO users (first_name, last_name, email, password_hash, role)
VALUES
  ('Esme', 'Sanchez', 'admin@cielito.test', '$2b$12$T5JGfIX35MMKymw2X4pOROcZI03TCooUI1DB1N860nt0NB7RZsAiK', 'admin'),
  ('Marco', 'Sanchez', 'agent@cielito.test', '$2b$12$T5JGfIX35MMKymw2X4pOROcZI03TCooUI1DB1N860nt0NB7RZsAiK', 'agent'),
  ('Elena', 'Rodriguez', 'traveler@cielito.test', '$2b$12$T5JGfIX35MMKymw2X4pOROcZI03TCooUI1DB1N860nt0NB7RZsAiK', 'traveler')
ON CONFLICT (email) DO NOTHING;

WITH admin_user AS (
  SELECT id FROM users WHERE email = 'admin@cielito.test'
),
oaxaca AS (
  INSERT INTO destinations (name, region, description, image_url)
  VALUES ('Oaxaca City', 'Oaxaca', 'Markets, artisan workshops, mezcal tastings, and slow food traditions.', '/images/oaxaca.jpg')
  ON CONFLICT (name, region) DO UPDATE SET description = EXCLUDED.description
  RETURNING id
),
tulum AS (
  INSERT INTO destinations (name, region, description, image_url)
  VALUES ('Tulum', 'Quintana Roo', 'Beach wellness, cenotes, and eco-luxury stays near the Caribbean.', '/images/tulum.jpg')
  ON CONFLICT (name, region) DO UPDATE SET description = EXCLUDED.description
  RETURNING id
)
INSERT INTO packages (destination_id, title, category, duration_days, price, description, status, created_by)
SELECT oaxaca.id, 'Oaxaca Culinary Tour', 'Boutique', 7, 1350.00, 'A week of markets, cooking classes, and village food traditions.', 'active'::package_status, admin_user.id
FROM oaxaca, admin_user
UNION ALL
SELECT tulum.id, 'Tulum Beach Wellness', 'Eco-Luxury', 5, 1800.00, 'A coastal reset with spa time, cenote swims, and mindful dining.', 'active'::package_status, admin_user.id
FROM tulum, admin_user
ON CONFLICT (title) DO UPDATE SET
  destination_id = EXCLUDED.destination_id,
  category = EXCLUDED.category,
  duration_days = EXCLUDED.duration_days,
  price = EXCLUDED.price,
  description = EXCLUDED.description,
  status = EXCLUDED.status;

INSERT INTO bookings (user_id, package_id, status, travel_date, party_size, total_price)
SELECT u.id, p.id, 'confirmed'::booking_status, CURRENT_DATE + INTERVAL '30 days', 2, p.price * 2
FROM users u
JOIN packages p ON p.title = 'Oaxaca Culinary Tour'
WHERE u.email = 'traveler@cielito.test'
ON CONFLICT (user_id, package_id, travel_date) DO NOTHING;

INSERT INTO reviews (user_id, package_id, rating, comment)
SELECT u.id, p.id, 5, 'Beautifully planned and full of local food experiences.'
FROM users u
JOIN packages p ON p.title = 'Oaxaca Culinary Tour'
WHERE u.email = 'traveler@cielito.test'
ON CONFLICT (user_id, package_id) DO NOTHING;

INSERT INTO contact_messages (name, email, subject, message, status)
VALUES ('Lucia Lopez', 'lucia@example.com', 'Custom family trip', 'I would like help planning a custom family trip in Yucatan.', 'received'::contact_status)
ON CONFLICT DO NOTHING;
