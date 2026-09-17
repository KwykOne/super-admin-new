# Implementation Backlog

> Prioritized list of work items. Each item links to the relevant mandatory
> rule in PROJECT_KNOWLEDGE.md.

## P0 — Critical

### 1. Remove mock data from Dashboard stat card trends
- **Rule 7.** Trend percentages on Dashboard stat cards are hardcoded in
  `dataByPeriod`. They should come from the API or be removed.
- **Files:** `src/pages/Dashboard.tsx` (lines 35-156)
- **Status:** Pending

### 2. Remove mock data from Sellers page fallbacks
- **Rule 7.** `sellersData` array (10 rows) and `sellerDataByPeriod` are
  hardcoded. They are used for filter dropdown values and period stats.
  Filter dropdowns should derive values from API response data.
- **Files:** `src/pages/Sellers.tsx` (lines 23-242)
- **Status:** Pending

### 3. Remove mock data from Orders page
- **Rule 7.** `orderData` array (8 rows), `orderStatusCounts`, and
  `statsByPeriod` are hardcoded. Used for filter dropdowns and stats.
  Should come from API.
- **Files:** `src/pages/Orders.tsx` (lines 38-268)
- **Status:** Pending

### 4. Remove mock data from Revenue page
- **Rule 7.** `SellerRevenueTable` uses commented-out API call and hardcoded
  `mockData` array. `RevenuStatsChart` and `DailyStatsChart` fall back to
  `mockData` when API returns empty.
- **Files:**
  - `src/components/revenue/SellerRevenueTable.tsx` (lines 52-145)
  - `src/components/revenue/RevenuStatsChart.tsx` (line 25, line 161)
  - `src/components/dashboard/DailyStatsChart.tsx` (line 25, line 161)
- **Status:** Pending

### 5. Remove mock data from Team page
- **Rule 7.** `teamData` array (5 rows) is used as initial state. Should
  start empty and show loading state until API responds.
- **Files:** `src/pages/Team.tsx` (lines 35-81)
- **Status:** Pending

## P1 — Important

### 6. Settlements page — WIP labeling and API integration
- **Rule 7.** Page currently shows hardcoded mock settlement data with no
  API. Must be explicitly marked WIP in page and sidebar. No demo figures.
- **Files:** `src/pages/Settlements.tsx`, `src/components/Sidebar.tsx`
- **Status:** WIP label added this task. API integration pending backend
  endpoint.

### 7. Referrals page — WIP labeling and API integration
- **Rule 7.** `useReferralsData` and `useReferralPeriodData` generate mock
  data. `SellerWalletView` uses `generateMockTransactions`.
- **Files:**
  - `src/hooks/useReferralsData.tsx`
  - `src/hooks/useReferralPeriodData.tsx`
  - `src/components/referrals/SellerWalletView.tsx`
  - `src/pages/Referrals.tsx`, `src/components/Sidebar.tsx`
- **Status:** WIP label added this task. API integration pending backend
  endpoint.

### 8. Partners page — WIP labeling and API integration
- **Rule 7.** `usePartnersData` and `usePartnerPeriodData` generate mock
  data. `PartnerPerformanceChart` uses `generateMockData`.
- **Files:**
  - `src/hooks/usePartnersData.tsx`
  - `src/hooks/usePartnerPeriodData.tsx`
  - `src/components/partners/PartnerPerformanceChart.tsx`
  - `src/pages/Partners.tsx`, `src/components/Sidebar.tsx`
- **Status:** WIP label added this task. API integration pending backend
  endpoint.

## P2 — Improvements

### 9. Add auth guard on protected routes
- Currently any visitor can navigate to `/dashboard` etc. without a token.
  Pages will render but API calls fail. Add a route guard that redirects to
  `/` if `localStorage.userToken` is missing.
- **Files:** `src/App.tsx`
- **Status:** Pending

### 10. Fix logout to clear localStorage
- `handleLogout` in Sidebar navigates to `/` but does not
  `localStorage.removeItem('userToken')`. The token persists after logout.
- **Files:** `src/components/Sidebar.tsx`
- **Status:** Pending

### 11. Create shared axios instance with auth header
- Every page manually sets `Authorization: Bearer ${token}`. A shared axios
  instance with an interceptor would reduce duplication and ensure
  consistent auth header handling.
- **Status:** Pending

### 12. Verify Announcements endpoint
- The exact API endpoint for the Announcements page is TBD. Inspect
  `src/pages/Announcements.tsx` to document the path.
- **Status:** Pending

### 13. Verify API-to-database mapping
- The actual mapping of `api.bharatgo.com` / `api-dev.bharatgo.com` to the
  RDS instances (`bharatgo-prod`, `bharatgo-develop-1`) is TBD. Must be
  verified from deployment secrets / runtime configuration.
- **Status:** Pending

### 14. Add empty/error states to all live pages
- **Rule 7.** Pages must distinguish loading, empty, zero, and error states.
  Some pages only console.error on failure without showing a user-visible
  error message.
- **Status:** Pending
