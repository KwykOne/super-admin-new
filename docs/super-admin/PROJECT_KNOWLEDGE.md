# BharatGo Super Admin — Project Knowledge

> **Repository:** `KwykOne/super-admin-new` (Bolt project)
> **Last updated:** 2026-09-17
> **Owner:** BharatGo team

## Purpose

This is the **BharatGo Super Admin dashboard** — a React + TypeScript single-page
application that gives BharatGo operations staff a consolidated view of sellers,
orders, revenue, settlements, referrals, partners, team members, and
announcements. The frontend talks exclusively to the existing BharatGo backend
HTTPS APIs. It does **not** use Bolt Database / Supabase for business data.

## Tech Stack (verified from `package.json` and source)

| Layer | Technology |
|---|---|
| Build tool | Vite 5 |
| Framework | React 18 |
| Language | TypeScript 5 |
| Routing | react-router-dom 6 |
| State | Redux Toolkit (`dashboardSlice`) + React hooks |
| Server state | TanStack React Query 5 (QueryClient configured but most pages use raw axios) |
| HTTP | axios |
| UI components | shadcn/ui (Radix primitives) + Tailwind CSS 3 |
| Charts | Recharts 2 |
| Forms | react-hook-form + zod |
| Icons | lucide-react |

## MANDATORY RULES — read before any change

1. **Existing PostgreSQL tables and columns are protected.** Never alter,
   rename, delete, truncate, migrate, seed, reset, or bulk-replace existing
   tables, columns, indexes, constraints, views, functions, triggers, or
   business data. Never run Sequelize migrations or seeders automatically.
   Never use ORM schema synchronization (`sequelize.sync()`).

2. **A new table is allowed only after explicit owner approval** for that
   specific table, purpose, columns, indexes, retention, and target
   environment. Do not infer approval from a feature request. Ask for approval
   immediately before any such operation.

3. **Team-member and seller-plan changes may be implemented only through
   existing approved APIs** and must be record-level actions. Do not add direct
   browser-to-PostgreSQL connections. Do not put AWS, PostgreSQL, database,
   admin passwords, private keys, or private analytics secrets in frontend code
   or `VITE_` variables.

4. **Use the existing BharatGo HTTPS APIs as the source of truth.** Bolt
   Database / Supabase is **not** part of this architecture and must not be
   introduced for business data.

5. **Production Mode globally uses `https://api.bharatgo.com/` and Development
   Mode globally uses `https://api-dev.bharatgo.com/`.** Environment switching
   must affect every page, request, cache, token, login, and action
   consistently; never mix environments.

6. **All / Actual / Test is separate from environment mode.** In production,
   Actual means `is_test=false`, Test means `is_test=true`, All means both.
   Development should show development data without applying a production
   test-store assumption unless the backend contract explicitly supports it.

7. **Remove all sample, dummy, random, mock, hardcoded, or fallback business
   data.** Sellers, Orders, Revenue, and Dashboard must show only API-backed
   data; distinguish loading, empty, zero, and error. Settlements, Referrals,
   and Partners must be explicitly marked **WIP** in the page and sidebar and
   show no demo figures.

8. **Before changing a screen, read the relevant docs and inspect the current
   API call/response handling.** Update documentation when behavior changes.
   Run build/tests and verify the affected screen. Never claim live-login/API
   success without actually verifying it.

## Project history note

This project was originally built in Lovable, exported to GitHub, and imported
into Bolt via the `KwykOne/super-admin-new` repository. The original `.env`
(backend URL) was lost during the GitHub transfer because `.env` is
git-ignored. The backend URLs have been restored in the Bolt project `.env`.

## Related documents

- [ARCHITECTURE.md](./ARCHITECTURE.md) — frontend architecture, routing, state
- [API_CONTRACTS.md](./API_CONTRACTS.md) — every backend endpoint used
- [SCREEN_DATA_MAP.md](./SCREEN_DATA_MAP.md) — which screen calls which API
- [METRIC_DEFINITIONS.md](./METRIC_DEFINITIONS.md) — metric names and meaning
- [ENVIRONMENT_AND_SECURITY.md](./ENVIRONMENT_AND_SECURITY.md) — env vars, secrets, CORS
- [PERMISSIONS_AND_WRITES.md](./PERMISSIONS_AND_WRITES.md) — write actions and access control
- [IMPLEMENTATION_BACKLOG.md](./IMPLEMENTATION_BACKLOG.md) — pending work items
