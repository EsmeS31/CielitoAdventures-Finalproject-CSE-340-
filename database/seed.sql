INSERT INTO users (first_name, last_name, email, password_hash, role)
VALUES
  ('Esme', 'Sanchez', 'admin@cielito.test', '$2b$12$T5JGfIX35MMKymw2X4pOROcZI03TCooUI1DB1N860nt0NB7RZsAiK', 'admin'),
  ('Marco', 'Sanchez', 'agent@cielito.test', '$2b$12$T5JGfIX35MMKymw2X4pOROcZI03TCooUI1DB1N860nt0NB7RZsAiK', 'agent'),
  ('Elena', 'Rodriguez', 'traveler@cielito.test', '$2b$12$T5JGfIX35MMKymw2X4pOROcZI03TCooUI1DB1N860nt0NB7RZsAiK', 'traveler')
ON CONFLICT (email) DO NOTHING;

INSERT INTO destinations (name, region, state, description, image_url)
VALUES
  (
    'Oaxaca City',
    'Oaxaca',
    'Oaxaca',
    'Markets, artisan workshops, mezcal tastings, and slow food traditions.',
    '/images/oaxaca.jpg'
  ),
  (
    'Tulum',
    'Quintana Roo',
    'Quintana Roo',
    'Beach wellness, cenotes, and eco-luxury stays near the Caribbean.',
    '/images/tulum.jpg'
  ),
  (
    'Bacalar',
    'Quintana Roo',
    'Quintana Roo',
    'A peaceful lagoon destination known for its crystal-clear waters, cenotes, and relaxed atmosphere.',
    '/images/bacalar.jpg'
  ),
  (
    'Sierra Gorda',
    'Querétaro',
    'Querétaro',
    'A mountain getaway filled with cloud forests, hiking trails, and eco-lodges.',
    '/images/sierra-gorda.jpg'
  ),
  (
    'Puerto Escondido',
    'Oaxaca',
    'Oaxaca',
    'A vibrant beach destination famous for surf, sunsets, and wildlife experiences.',
    '/images/puerto-escondido.jpg'
  ),
  (
    'Grutas de Tolantongo',
    'Hidalgo',
    'Hidalgo',
    'A natural thermal retreat with rivers, caves, and dramatic canyon scenery.',
    '/images/tolantongo.jpg'
  ),
  (
    'Cañón del Sumidero',
    'Chiapas',
    'Chiapas',
    'A dramatic canyon destination with boat rides, cliffs, and scenic viewpoints.',
    '/images/sumidero.jpg'
  ),
  (
    'Real de Catorce',
    'San Luis Potosí',
    'San Luis Potosí',
    'A historic mining town surrounded by desert landscapes and cultural heritage.',
    '/images/real-de-catorce.jpg'
  ),
  (
    'Isla Holbox',
    'Quintana Roo',
    'Quintana Roo',
    'A laid-back island known for calm beaches, mangroves, and bioluminescent nights.',
    '/images/holbox.jpg'
  ),
  (
    'Pátzcuaro',
    'Michoacán',
    'Michoacán',
    'A cultural lakeside destination with traditions, artisan crafts, and colonial charm.',
    '/images/patzcuaro.jpg'
  )
ON CONFLICT (name, region) DO UPDATE SET
  state = EXCLUDED.state,
  description = EXCLUDED.description,
  image_url = EXCLUDED.image_url;

INSERT INTO packages (
  destination_id,
  title,
  category,
  duration_days,
  price,
  description,
  key_highlights,
  accommodation,
  transportation,
  status,
  created_by
)
VALUES
  (
    (SELECT id FROM destinations WHERE name = 'Oaxaca City' AND region = 'Oaxaca'),
    'Oaxaca Culinary Tour',
    'Boutique',
    7,
    1350.00,
    'A week of markets, cooking classes, and village food traditions.',
    'Markets, cooking classes, artisan experiences',
    'Boutique hotel stay',
    'Private transfer',
    'active'::package_status,
    (SELECT id FROM users WHERE email = 'admin@cielito.test')
  ),
  (
    (SELECT id FROM destinations WHERE name = 'Tulum' AND region = 'Quintana Roo'),
    'Tulum Beach Wellness',
    'Eco-Luxury',
    5,
    1800.00,
    'A coastal reset with spa time, cenote swims, and mindful dining.',
    'Spa time, cenote swims, mindful dining',
    'Oceanfront eco-lodge',
    'Private airport transfer',
    'active'::package_status,
    (SELECT id FROM users WHERE email = 'admin@cielito.test')
  ),
  (
    (SELECT id FROM destinations WHERE name = 'Bacalar' AND region = 'Quintana Roo'),
    'The Seven-Shade Escape',
    'Adventure',
    4,
    1299.00,
    'A full immersive escape combining kayaking, swimming, and guided excursions in Bacalar.',
    'Sunrise kayak, cenote swim, Pirate''s Canal excursion.',
    'Rancho Encantado Eco Resort',
    'Private shuttle from Chetumal',
    'active'::package_status,
    (SELECT id FROM users WHERE email = 'admin@cielito.test')
  ),
  (
    (SELECT id FROM destinations WHERE name = 'Sierra Gorda' AND region = 'Querétaro'),
    'Mountain Sanctuary Expedition',
    'Nature',
    5,
    1499.00,
    'A mountain retreat focused on hiking, local food, and stargazing in the Sierra Gorda.',
    'Cloud forest hike, farm-to-table dining, stargazing.',
    'Rincón de Ojo de Agua',
    'Private 4x4 SUV from Querétaro City',
    'active'::package_status,
    (SELECT id FROM users WHERE email = 'admin@cielito.test')
  ),
  (
    (SELECT id FROM destinations WHERE name = 'Puerto Escondido' AND region = 'Oaxaca'),
    'Oaxacan Surf & Soul',
    'Beach',
    5,
    1599.00,
    'A surf-focused getaway with scenic excursions and wildlife encounters near Puerto Escondido.',
    'Sunset surf, bioluminescence tour, turtle sanctuary.',
    'Hotel Terrestre',
    'Private airport transfers from PXM',
    'active'::package_status,
    (SELECT id FROM users WHERE email = 'admin@cielito.test')
  ),
  (
    (SELECT id FROM destinations WHERE name = 'Grutas de Tolantongo' AND region = 'Hidalgo'),
    'Thermal Oasis Retreat',
    'Wellness',
    3,
    1199.00,
    'A relaxing wellness escape with thermal pools, caves, and canyon hiking.',
    'Thermal infinity pools, cave exploration, canyon hiking.',
    'Hotel La Huerta',
    'Executive bus transport from CDMX',
    'active'::package_status,
    (SELECT id FROM users WHERE email = 'admin@cielito.test')
  ),
  (
    (SELECT id FROM destinations WHERE name = 'Cañón del Sumidero' AND region = 'Chiapas'),
    'Deep Canyon Discovery',
    'Adventure',
    4,
    1399.00,
    'A scenic adventure through the canyon with boat rides and photography experiences.',
    'Private boat transit, photography workshop, Chiapa de Corzo.',
    'Hotel Villa Mercedes',
    'Airport pickup (Tuxtla) + Boat charter',
    'active'::package_status,
    (SELECT id FROM users WHERE email = 'admin@cielito.test')
  ),
  (
    (SELECT id FROM destinations WHERE name = 'Real de Catorce' AND region = 'San Luis Potosí'),
    'Desert Mystique Journey',
    'Adventure',
    5,
    1699.00,
    'An off-road and cultural journey through the desert landscapes of Real de Catorce.',
    '4x4 off-road adventure, horseback trekking, desert sunset.',
    'Hotel Boutique Meson de la Abundancia',
    'Private 4x4 transport from San Luis Potosí',
    'active'::package_status,
    (SELECT id FROM users WHERE email = 'admin@cielito.test')
  ),
  (
    (SELECT id FROM destinations WHERE name = 'Isla Holbox' AND region = 'Quintana Roo'),
    'Caribbean Slow-Living',
    'Relaxation',
    4,
    1299.00,
    'A slow-paced island escape featuring gentle adventures and beautiful coastal scenery.',
    'Mangrove kayaking, night beach walks, secret sandbanks.',
    'Casa Las Tortugas',
    'Private transfer to Chiquilá + Ferry',
    'active'::package_status,
    (SELECT id FROM users WHERE email = 'admin@cielito.test')
  ),
  (
    (SELECT id FROM destinations WHERE name = 'Pátzcuaro' AND region = 'Michoacán'),
    'Purépecha Cultural Immersion',
    'Culture',
    4,
    1399.00,
    'A cultural journey through lakeside traditions, artisan workshops, and local cuisine.',
    'Traditional cooking class, Janitzio boat trip, artisan tours.',
    'Casa de las Escaleras',
    'Private rail/car transport from Morelia',
    'active'::package_status,
    (SELECT id FROM users WHERE email = 'admin@cielito.test')
  )
ON CONFLICT (title) DO UPDATE SET
  destination_id = EXCLUDED.destination_id,
  category = EXCLUDED.category,
  duration_days = EXCLUDED.duration_days,
  price = EXCLUDED.price,
  description = EXCLUDED.description,
  key_highlights = EXCLUDED.key_highlights,
  accommodation = EXCLUDED.accommodation,
  transportation = EXCLUDED.transportation,
  status = EXCLUDED.status,
  created_by = EXCLUDED.created_by;

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