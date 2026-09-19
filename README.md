# inventory-app

Express + PostgreSQL app for managing car parts inventory, with vehicle fitment tracking. Includes a JSON API and a server-rendered (EJS) web UI, both backed by the same PostgreSQL database.

## Setup

1. Install dependencies:
   ```
   npm install
   ```
2. Copy `.env.example` to `.env` and fill in your Postgres credentials:
   ```
   cp .env.example .env
   ```
3. Create the database (name must match `PGDATABASE` in `.env`):
   ```
   createdb inventory_app
   ```
4. Apply the schema:
   ```
   npm run db:migrate
   ```
5. (Optional) Load sample data:
   ```
   npm run db:seed
   ```
6. Start the server:
   ```
   npm run dev
   ```
7. Visit `http://localhost:3000` for the web UI, or use the JSON API below.

## Web UI

Server-rendered pages (EJS) for browsing and managing inventory:

| Path               | Description                                |
| ------------------ | ------------------------------------------ |
| /                  | Dashboard - part/vehicle counts, low stock |
| /parts             | List parts (filter by `?category=`, `?q=`) |
| /parts/new         | New part form                              |
| /parts/:id         | Part detail + linked vehicles              |
| /parts/:id/edit    | Edit part form                             |
| /vehicles          | List vehicles                              |
| /vehicles/new      | New vehicle form                           |
| /vehicles/:id      | Vehicle detail + linked parts              |
| /vehicles/:id/edit | Edit vehicle form                          |

Form submissions are validated and sanitized with `express-validator`; invalid input re-renders the form with error messages and the values you entered.

## API

| Method | Path                    | Description                        |
| ------ | ----------------------- | ---------------------------------- |
| GET    | /api/parts              | List parts (optional `?category=`) |
| GET    | /api/parts/low-stock    | Parts at or below reorder level    |
| GET    | /api/parts/:id          | Get one part                       |
| POST   | /api/parts              | Create a part                      |
| PUT    | /api/parts/:id          | Update a part                      |
| DELETE | /api/parts/:id          | Delete a part                      |
| GET    | /api/vehicles           | List vehicles                      |
| GET    | /api/vehicles/:id       | Get one vehicle                    |
| GET    | /api/vehicles/:id/parts | Parts that fit this vehicle        |
| POST   | /api/vehicles           | Create a vehicle                   |
| PUT    | /api/vehicles/:id       | Update a vehicle                   |
| DELETE | /api/vehicles/:id       | Delete a vehicle                   |
| POST   | /api/fitment            | Link a part to a vehicle           |
| DELETE | /api/fitment/:id        | Remove a part-vehicle link         |
| GET    | /health                 | Health check                       |

All API routes validate request bodies/params with `express-validator` and respond `400` with an `errors` array on invalid input.
