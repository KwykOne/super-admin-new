# Architecture

## Frontend Architecture

### Entry point

`src/main.tsx` renders `<App />` inside `React.StrictMode`.

### App structure (`src/App.tsx`)

- **Redux Provider** wraps the entire app (`store` from `src/store.ts`).
- **QueryClientProvider** (TanStack React Query) with `refetchOnWindowFocus: false`, `retry: 1`.
- **BrowserRouter** with the following routes:

| Route | Component | Notes |
|---|---|---|
| `/` | `Login` | No auth guard; token stored in `localStorage` |
| `/dashboard` | `Dashboard` | |
| `/sellers` | `Sellers` | |
| `/sellers/:id` | `SellerDetail` | |
| `/orders` | `Orders` | |
| `/orders/:id` | `OrderDetail` | |
| `/revenue` | `Revenue` | |
| `/settlements` | `Settlements` | **WIP — mock data** |
| `/referrals` | `Referrals` | **WIP — mock data** |
| `/referrals/:id` | `ReferralDetail` | **WIP** |
| `/referrals/:id/:storeName` | `ReferalListDetails` | **WIP** |
| `/partners` | `Partners` | **WIP — mock data** |
| `/partners/:id` | `PartnerDetail` | **WIP** |
| `/team` | `Team` | |
| `/announcements` | `Announcements` | |
| `/settings` | `Settings` | |
| `/help` | `Help` | |
| `*` | `NotFound` | |

### Auth model

- Login sends `mobile_no` + `password` to `POST /api/v1/admin/login`.
- On success, the JWT token from `response.data.token` is stored in
  `localStorage` as `userToken`.
- All subsequent API calls read `localStorage.getItem('userToken')` and send it
  as `Authorization: Bearer <token>`.
- There is **no auth guard on protected routes**. If `userToken` is missing,
  API calls will fail with 401 but the page will still render.
- Logout clears nothing from localStorage currently — it only navigates to `/`
    and shows a toast.

### State management (`src/store.ts` + `src/features/todoSlice.ts`)

Redux Toolkit `dashboardSlice` with this initial state:

| Key | Type | Default | Purpose |
|---|---|---|---|
| `referrealGivenDetails` | object | `{}` | Referral detail context |
| `isSidebarCollapsed` | boolean | `false` | Sidebar collapse state |
| `dataType` | `"both" \| "real" \| "test"` | `"real"` | is_test filter for API calls |
| `sellerDetails` | object \| null | `null` | Selected seller detail |
| `mode` | `"production" \| "dev"` | `"production"` | Environment mode |

Reducers: `setReferrealDetails`, `toggleDashboard`, `changeDataType`,
`setSellerDetails`, `updateVendorStatus`, `updateVendorDetails`, `setDevMode`,
`setProdMode`.

### Environment switching

Every page reads `mode` from Redux and selects the base URL:

```typescript
const baseURL = mode === 'dev'
  ? import.meta.env.VITE_BACKEND_DEV_URL
  : import.meta.env.VITE_BACKEND_PROD_URL;
```

The `dataType` Redux value is passed as `is_test` query parameter:
- `"real"` → `is_test=real` (Actual)
- `"test"` → `is_test=test` (Test)
- `"both"` → `is_test=both` (All)

### Layout

`DashboardLayout` (`src/components/DashboardLayout.tsx`) wraps every
authenticated page. It renders the `Sidebar` and a main content area. The
sidebar is fixed-width on desktop (collapsible) and bottom-nav + sheet on
mobile.

### Sidebar (`src/components/Sidebar.tsx`)

Main navigation items: Dashboard, Sellers, Orders, Settlements, Revenue,
Referrals, Partners, Team, Announcements.

Bottom items: Settings, Help, Log Out.

### Styling

- Tailwind CSS 3 with `tailwindcss-animate`.
- Custom `bharatgo-primary` color family defined in `tailwind.config.ts`.
- shadcn/ui components in `src/components/ui/`.

### Data fetching pattern

Most pages use raw `axios.get`/`axios.post` inside `useEffect` hooks with
local `useState` for loading/data/error. React Query is configured at the app
level but is not used by most pages. There is no global error interceptor or
axios instance with default headers — each call sets `Authorization` manually.

### Backend (verified facts — do not modify from this project)

- **bharatgo-backend-dev**: private Node.js / JavaScript / Sequelize backend.
- `config/databaseConnection.js`: PostgreSQL via Sequelize. Uses env vars
  `DATABASE_HOST`, `DATABASE_PORT`, `DATABASE_USER`,
  `DATABASE_USER_PASSWORD`, `DATABASE_NAME`, `DATABASE_MEMORY`. TLS enabled
  for non-local hosts.
- `config/config.js`: has `development` and `production` configs.
- **AWS Mumbai RDS instances found:**
  - `bharatgo-develop-1` — PostgreSQL 16.13
  - `bharatgo-prod` — PostgreSQL 15.17
- **Actual API-to-database mapping and database names**: TBD — must be
  verified from deployment secrets / runtime configuration.
- **Public API DNS:** `api-dev.bharatgo.com` and `api.bharatgo.com`.
- **Never copy passwords or secrets into docs.**
