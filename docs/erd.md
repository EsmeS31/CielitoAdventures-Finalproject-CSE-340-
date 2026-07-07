# Entity Relationship Diagram

Use this diagram as the project ERD reference. For final submission, export the same relationship structure from pgAdmin as an image and add it to the README if your instructor requires a pgAdmin image specifically.

```mermaid
erDiagram
  USERS ||--o{ BOOKINGS : requests
  USERS ||--o{ REVIEWS : writes
  USERS ||--o{ CONTACT_MESSAGES : sends
  USERS ||--o{ BOOKING_STATUS_HISTORY : changes
  DESTINATIONS ||--o{ PACKAGES : contains
  PACKAGES ||--o{ BOOKINGS : receives
  PACKAGES ||--o{ REVIEWS : receives
  BOOKINGS ||--o{ BOOKING_STATUS_HISTORY : tracks

  USERS {
    uuid id PK
    varchar first_name
    varchar last_name
    varchar email UK
    text password_hash
    user_role role
  }

  DESTINATIONS {
    uuid id PK
    varchar name
    varchar region
    text description
  }

  PACKAGES {
    uuid id PK
    uuid destination_id FK
    varchar title UK
    numeric price
    package_status status
  }

  BOOKINGS {
    uuid id PK
    uuid user_id FK
    uuid package_id FK
    booking_status status
    date travel_date
    numeric total_price
  }

  BOOKING_STATUS_HISTORY {
    uuid id PK
    uuid booking_id FK
    uuid changed_by FK
    booking_status old_status
    booking_status new_status
  }

  REVIEWS {
    uuid id PK
    uuid user_id FK
    uuid package_id FK
    integer rating
    text comment
  }

  CONTACT_MESSAGES {
    uuid id PK
    uuid user_id FK
    varchar email
    contact_status status
  }
```
