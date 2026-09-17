# Environment and Security

## Environment variables

All variables are prefixed with `VITE_` (exposed to the browser by Vite).
They are stored in the project `.env` file, which is git-ignored (see
`.gitignore` line 10: `.env`).

| Variable | Production value | Development value | Purpose |
|---|---|---|---|
| `VITE_BACKEND_PROD_URL` | `https://api.bharatgo.com/` | `https://api.bharatgo.com/` | Base URL for API calls when `mode=production` |
| `VITE_BACKEND_DEV_URL` | `https://api-dev.bharatgo.com/` | `https://api-dev.bharatgo.com/` | Base URL for API calls when `mode=dev` |
| `VITE_BACKEND_URL` | `https://api-dev.bharatgo.com/` | `https://api-dev.bharatgo.com/` | Added per owner request; not currently referenced in source |
| `VITE_SUPABASE_URL` | Provisioned Bolt Supabase URL | same | Bolt-provided; not used for business data |
| `VITE_SUPABASE_ANON_KEY` | Provisioned Bolt Supabase anon key | same | Bolt-provided; not used for business data |

> **Rule:** Never put AWS, PostgreSQL, database, admin passwords, private keys,
> or private analytics secrets in frontend code or `VITE_` variables. `VITE_`
> variables are embedded in the browser bundle and are publicly readable.

## Environment mode switching

Controlled by Redux `mode` field (`"production"` or `"dev"`).

- `setProdMode()` → `mode = "production"` → uses `VITE_BACKEND_PROD_URL`
- `setDevMode()` → `mode = "dev"` → uses `VITE_BACKEND_DEV_URL`

Every page that makes API calls reads `mode` from Redux and selects the base
URL accordingly. There is no page that should hardcode a base URL.

> **Mandatory:** Environment switching must affect every page, request, cache,
> token, login, and action consistently. Never mix environments.

## Data type filter (All / Actual / Test)

Controlled by Redux `dataType` field (`"both"`, `"real"`, `"test"`).

- Sent as `is_test` query parameter on every API call.
- `"real"` → `is_test=real` (Actual data)
- `"test"` → `is_test=test` (Test data)
- `"both"` → `is_test=both` (All data)

> This is separate from environment mode. See PROJECT_KNOWLEDGE.md rule 6.

## Authentication

- **Method:** JWT token from `POST /api/v1/admin/login`
- **Storage:** `localStorage.userToken`
- **Usage:** `Authorization: Bearer <token>` header on every API call
- **No auth guard** on protected routes currently — pages render even without
  a token; API calls will fail with 401 if token is missing or expired.
- **Logout:** navigates to `/` and shows a toast. Does **not** clear
  `localStorage.userToken`. This is a known issue.

## CORS

- The BharatGo backend must allow requests from the Bolt-hosted domain.
- If the backend does not send `Access-Control-Allow-Origin` for the Bolt
  preview domain, the browser will block the request with a CORS error.
- **Fix location:** backend CORS configuration (not fixable from this frontend
  project).
- **Symptom:** "Network error or server not reachable" toast on login, or
  console errors mentioning CORS.

## Backend infrastructure (verified facts)

- **bharatgo-backend-dev:** private Node.js / JavaScript / Sequelize backend
- **Database connection** (`config/databaseConnection.js`): PostgreSQL via
  Sequelize. Env vars: `DATABASE_HOST`, `DATABASE_PORT`, `DATABASE_USER`,
  `DATABASE_USER_PASSWORD`, `DATABASE_NAME`, `DATABASE_MEMORY`. TLS for
  non-local hosts.
- **Config** (`config/config.js`): `development` and `production` configs.
- **AWS Mumbai RDS:**
  - `bharatgo-develop-1` — PostgreSQL 16.13
  - `bharatgo-prod` — PostgreSQL 15.17
- **API-to-database mapping:** TBD — must be verified from deployment secrets.
- **Public DNS:** `api-dev.bharatgo.com`, `api.bharatgo.com`
- **Never copy passwords or secrets into docs or frontend code.**

## What must NOT be introduced

- Bolt Database / Supabase for business data.
- Direct browser-to-PostgreSQL connections.
- ORM schema sync, Sequelize migrations, or seeders run from this project.
- Any `VITE_` variable containing passwords, private keys, or database
  credentials.
