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
  key_highlights = EXCLUDED.key_highlights,
  accommodation = EXCLUDED.accommodation,
  transportation = EXCLUDED.transportation,
  duration_days = EXCLUDED.duration_days,
  price = EXCLUDED.price,
  description = EXCLUDED.description,
  key_highlights = EXCLUDED.key_highlights,
  accommodation = EXCLUDED.accommodation,
  transportation = EXCLUDED.transportation,
  status = EXCLUDED.status,
  created_by = EXCLUDED.created_by;

INSERT INTO guided_tours_and_tickets (package_id, description)
SELECT p.id, inclusion.description
FROM packages p
JOIN (
  VALUES
    ('Oaxaca Culinary Tour', 'Guided visit to Mercado Benito Juarez with tastings.'),
    ('Oaxaca Culinary Tour', 'Hands-on cooking class with a local chef.'),
    ('Oaxaca Culinary Tour', 'Reserved mezcal tasting and distillery tour.'),
    ('Tulum Beach Wellness', 'Guided Tulum ruins entrance ticket and tour.'),
    ('Tulum Beach Wellness', 'Cenote entrance ticket with local guide.'),
    ('Tulum Beach Wellness', 'Beach yoga session and wellness workshop.')
) AS inclusion(package_title, description) ON inclusion.package_title = p.title
ON CONFLICT (package_id, description) DO NOTHING;

INSERT INTO bookings (user_id, package_id, status, travel_date, party_size, total_price)
SELECT
  u.id,
  p.id,
  'confirmed'::booking_status,
  CURRENT_DATE + INTERVAL '30 days',
  2,
  p.price * 2
FROM users u
JOIN packages p ON p.title = 'Oaxaca Culinary Tour'
WHERE u.email = 'traveler@cielito.test'
ON CONFLICT (user_id, package_id, travel_date) DO NOTHING;

INSERT INTO reviews (user_id, package_id, rating, comment)
SELECT
  u.id,
  p.id,
  5,
  'Beautifully planned and full of local food experiences.'
FROM users u
JOIN packages p ON p.title = 'Oaxaca Culinary Tour'
WHERE u.email = 'traveler@cielito.test'
ON CONFLICT (user_id, package_id) DO NOTHING;

INSERT INTO contact_messages (name, email, subject, message, status)
VALUES
  (
    'Lucia Lopez',
    'lucia@example.com',
    'Custom family trip',
    'I would like help planning a custom family trip in Yucatan.',
    'received'::contact_status
  );

INSERT INTO guided_tours_and_tickets (package_id, description)
SELECT p.id, 'Kayak guide, boat captain for Pirate''s Canal, Cenote Azul entry'
FROM packages p
WHERE p.title = 'The Seven-Shade Escape'
AND NOT EXISTS (
  SELECT 1 FROM guided_tours_and_tickets gt WHERE gt.package_id = p.id
);

INSERT INTO guided_tours_and_tickets (package_id, description)
SELECT p.id, 'Biosphere Reserve guide, local farm tour, astronomy guide'
FROM packages p
WHERE p.title = 'Mountain Sanctuary Expedition'
AND NOT EXISTS (
  SELECT 1 FROM guided_tours_and_tickets gt WHERE gt.package_id = p.id
);

INSERT INTO guided_tours_and_tickets (package_id, description)
SELECT p.id, 'Surf instructor, private boat tour for Manialtepec Lagoon, Turtle sanctuary'
FROM packages p
WHERE p.title = 'Oaxacan Surf & Soul'
AND NOT EXISTS (
  SELECT 1 FROM guided_tours_and_tickets gt WHERE gt.package_id = p.id
);

INSERT INTO guided_tours_and_tickets (package_id, description)
SELECT p.id, 'Cave exploration guide, Thermal pool day-passes'
FROM packages p
WHERE p.title = 'Thermal Oasis Retreat'
AND NOT EXISTS (
  SELECT 1 FROM guided_tours_and_tickets gt WHERE gt.package_id = p.id
);

INSERT INTO guided_tours_and_tickets (package_id, description)
SELECT p.id, 'Private boat captain, photography workshop lead, City tour'
FROM packages p
WHERE p.title = 'Deep Canyon Discovery'
AND NOT EXISTS (
  SELECT 1 FROM guided_tours_and_tickets gt WHERE gt.package_id = p.id
);

INSERT INTO guided_tours_and_tickets (package_id, description)
SELECT p.id, 'Horseback guide for Cerro del Quemado, Mining museum entry'
FROM packages p
WHERE p.title = 'Desert Mystique Journey'
AND NOT EXISTS (
  SELECT 1 FROM guided_tours_and_tickets gt WHERE gt.package_id = p.id
);

INSERT INTO guided_tours_and_tickets (package_id, description)
SELECT p.id, 'Mangrove kayak instructor, Bioluminescence boat trip'
FROM packages p
WHERE p.title = 'Caribbean Slow-Living'
AND NOT EXISTS (
  SELECT 1 FROM guided_tours_and_tickets gt WHERE gt.package_id = p.id
);

INSERT INTO guided_tours_and_tickets (package_id, description)
SELECT p.id, 'Cooking class host, boat pilot to Janitzio, Copper artisan workshop'
FROM packages p
WHERE p.title = 'Purépecha Cultural Immersion'
AND NOT EXISTS (
  SELECT 1 FROM guided_tours_and_tickets gt WHERE gt.package_id = p.id
);