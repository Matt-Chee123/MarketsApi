# MarketsApi

## Stack

- **Node.js + Express 5**
- **PostgreSQL 16**
- **Zod** -- request validation
- **`pg`** -- database access
- **Jest + Supertest** -- integration tests against the database
- **Docker**

## Setup

Requires Docker and Docker Compose

```bash
git clone git@github.com:Matt-Chee123/MarketsApi.git
cd MarketsApi
cp .env.example .env
docker compose up -d
```

Postgres takes around 30s on first boot. Once ready: 

```bash
curl http://localhost:3000/health
# {"ok":true}
```

The API runs at `http://localhost:3000`

### Run Tests Command

```bash
docker compose exec app npm test
```
### Reset to clean slate

```bash
docker compose down -v
docker compose up -d
```

## API reference

The API implements the spec in the API doc

- **Funds** -- `GET /funds`, `GET /funds/:id`, `POST /funds`, `PUT /funds`
- **Investors** -- `GET /investors`, `POST /investors`
- **Investments** -- `GET /funds/:fund_id/investments`, `POST /funds/:fund_id/investments`

Plus a non-spec health endpoint:

- `GET /health` -- returns `{"ok":true}` - acts as a quick smoke test

The database is seeded with sample data on the first boot: 3 funds, 4 investors, 4 investments

## Assumptions

- **`vintage_year` constrained to 1900–2100.** The spec lists vintage_year as an integer with no bounds. I added a CHECK constraint restricting it to a sensible range.
- **Monetary fields must be positive.** The spec lists `target_size_usd` and `amount_usd` as decimal numbers with no bounds. I enforce `> 0` via CHECK constraints.
- **Investor emails are unique.** The spec doesn't explicitly say emails must be unique, but treating email as unique is conventional. Enforced via a UNIQUE constraint on the column; duplicate POST attempts return 409.
- **PUT /funds requires all fields, not just changed ones.** The spec example shows a full body, but doesn't explicitly say whether missing fields are allowed. I treated it as a strict PUT rather than partial update (more similar to PATCH). The alternative would be to require only `id` and update only the fields sent.

## Design decisions

- **Language: Node.js** -- Closest to TypeScript among languages I'm fluent in. Type safety preserved at the API layer via Zod.
- **Raw parameterized SQL** -- Three tables and eight endpoints don't require ORM. Raw SQL keeps database queries easily readable and parameterized queries prevent injection.
- **Centralized error handling** -- `src/errors.js` maps every error type to the right HTTP response in one place. Route handlers stay small and error responses stay consistent.
- **Docker Compose for the full stack** -- both Postgres and the Node app run in containers; `docker compose up` is the only setup command needed.
- **Foreign keys with `ON DELETE RESTRICT`** -- Investments have a many-to-one relationship with funds and investors. Cascading deletes would silently destroy investment records when a parent is deleted, restrict makes the caller decide.
- **Money as strings, not numbers** -- NUMERIC columns return as strings rather than JavaScript numbers, preventing precision loss on large values.
- **Validation: silently strip unknown fields** -- Zod default behaviour allows clients flexibility and provides forward compatibility for future schema additions.
- **Health endpoint outside the spec** -- `GET /health` runs `SELECT 1` against the database as a quick smoke check.

## AI Usage

I used Claude for boilerplate (routing scaffolds, Docker Compose setup, test scaffolding), dependency lookups (Zod specifics, Postgres SQLSTATE codes, Express `mergeParams`), and as a sounding board on tradeoffs. Every output was peer-reviewed and adjusted if needed before committing.

Judgment calls stayed with me - schema design, foreign-key behaviour, spec interpretations, and the choices in Design Decisions. AI compressed execution; the thinking was mine.
