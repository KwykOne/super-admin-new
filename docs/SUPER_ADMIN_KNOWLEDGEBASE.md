# Super Admin Knowledgebase

> Verified findings about the BharatGo super-admin dashboard. This file is
> documentation only -- no database, no schema changes, no migrations.

## 1. Environment base URLs

| Environment | Base URL | Env var |
|---|---|---|
| Production | `https://api.bharatgo.com/` | `VITE_BACKEND_PROD_URL` |
| Development | `https://api-dev.bharatgo.com/` | `VITE_BACKEND_DEV_URL` |

The active base URL is selected by the **Production/Development mode toggle**
stored in Redux (`state.modal.mode`). When `mode === "dev"`, the app uses
`VITE_BACKEND_DEV_URL`; otherwise it uses `VITE_BACKEND_PROD_URL`.

Every authenticated request includes
`Authorization: Bearer <token from localStorage userToken>`.

## 2. All / Actual / Test store filter

The **All / Actual / Test** filter is the store `is_test` flag. It is passed
as the `is_test` query parameter on API calls and is **separate from** the
Production/Development environment mode. The value comes from Redux
(`state.modal.dataType`).

- **All** -- `is_test=both` (includes both real and test stores)
- **Actual** -- `is_test=real` (real stores only)
- **Test** -- `is_test=test` (test stores only)

Environment mode and the is_test filter are independent dimensions:

| | is_test = both (All) | is_test = real (Actual) | is_test = test (Test) |
|---|---|---|---|
| **Production** | prod API, all stores | prod API, real stores | prod API, test stores |
| **Development** | dev API, all stores | dev API, real stores | dev API, test stores |

## 3. Revenue by Seller vs Revenue Report

These are **two separate sections** on the Revenue page with different
purposes and data sources:

### Revenue by Seller (management aggregate table)

- **Purpose:** Management overview of total revenue per seller across all
  revenue heads for the selected period.
- **Data source:** `GET api/v1/admin/revenue/top-performing` -- returns
  per-seller aggregates (subscription revenue, platform fees, wallet
  recharge, other services, total revenue, total orders, total GMV).
- **Columns:** Store, City, Plan, Subscription Revenue, Platform Fees,
  Wallet Recharge, Other Services, Total Revenue, Total Orders, Total GMV,
  Registration Date.
- **Filtering:** Only sellers with at least one revenue head > 0 in the
  selected period are shown. Default period: this month.
- **Each row = one seller.**

### Revenue Report (per-transaction CA/GST table)

- **Purpose:** Transaction-level records for a CA to understand, calculate,
  and file GST returns.
- **Data source:** `GET api/v1/admin/revenue/vendor-plan-payment-data`
  (paginated) and `GET api/v1/admin/export/filtered-vendor-plan-payment-data`
  (Excel export). See section 6 for full contract.
- **Sorting:** Oldest transaction first (backend returns rows ordered by
  payment_date ASC).
- **Each row = one transaction.**
- **24 columns in exact order:**
  1. S. N.
  2. Customer Payment Date
  3. Amount Received Date
  4. Type
  5. Channel
  6. Entity Name
  7. GSTIN
  8. Business Name
  9. Mobile Number
  10. Plan Name
  11. Invoice Date
  12. Invoice # (Manual)
  13. Invoice # (System Generated)
  14. HSN/SAC
  15. Plan Price
  16. GST on Plan Price
  17. Other Fees
  18. GST on Other Fees
  19. Total Amount Paid by Customer
  20. RazorPay Fees
  21. Tax on RazorPay Fees
  22. TDS Deducted
  23. Amount Received in BharatGo Bank
  24. Comment

## 4. Rules for revenue data

1. **Never synthesize transaction rows** from `top-performing` or any other
   seller-aggregate endpoint. Aggregate data cannot produce individual
   transactions.
2. **Never generate** invoice numbers, invoice dates, payment channels, GST
   amounts, HSN/SAC codes, or per-transaction payment dates from seller
   registration dates or aggregate revenue figures.
3. **Never use** `api/v1/admin/revenue/seller-revenue` -- confirmed 404.
4. **Never copy** the mock-only `SellerRevenueTable` from the older
   repository (github.com/Bharat-Go/super-admin-dashboard-bg). Its main/master
   branch has five hardcoded sellers (Joshi Jewellers, Sharma Electronics,
   Reddy Handicrafts, Kumar Furniture, Patel Fashion) and a commented-out
   request to the 404 endpoint. It does not contain a transaction-level
   Revenue Report component and does not explain the live transaction table.
5. The live Revenue Report is implemented in the original repository's
   active siddhesh branch via `src/components/revenue/RevenueExportPanel.tsx`
   and `src/utils/revenueExportUtils.ts`, not the old mock SellerRevenueTable.
6. Use real row field values exactly as returned by the backend, including
   `-` and `Not generated` placeholder values. Do not replace them.

## 5. Database and backend constraints

1. **No Bolt Database / Supabase** usage for this dashboard's data. The AWS
   PostgreSQL database and BharatGo backend APIs are the source of truth.
2. **No schema changes, migrations, seeders, table/column additions or
   deletions** from this frontend project.
3. **No direct database access** from the frontend. All data comes through
   authenticated API calls to the BharatGo backend.
4. **Do not add or modify backend endpoints** from Bolt. If a needed endpoint
   is missing, document the gap and show an error state in the UI.

## 6. Verified backend contract: transaction ledger endpoints

> Found in the original repository's active siddhesh branch. Both endpoints
> require `Authorization: Bearer {localStorage userToken}` and are protected
> by backend `superAdminOnly` middleware.

### 6.1 Paginated table data

```
GET {baseURL}api/v1/admin/revenue/vendor-plan-payment-data
```

**Query parameters:**

| Param | Value | Notes |
|---|---|---|
| `is_test` | `both` / `real` / `test` | Maps from All / Actual / Test filter |
| `page` | 1-based integer | Page number |
| `limit` | 50 or 100 | Backend caps at 100; do not request 200/500 in one call |
| `date` | Period keyword | See period mapping below |
| `month` | 1-12 | Required for thisMonth/lastMonth |
| `year` | YYYY | Required for thisMonth/lastMonth |
| `startDate` | ISO string | Required for customData |
| `endDate` | ISO string | Required for customData |

**Period mapping:**

| UI period | `date` param | Extra params |
|---|---|---|
| allTime / all | `all` | none |
| last7days / lastSeven | `lastSeven` | none |
| last30days / lastThirty | `lastThirty` | none |
| thisMonth | `thisMonth` | `month=1..12&year=YYYY` |
| lastMonth | `lastMonth` | `month=1..12&year=YYYY` |
| customRange | `customData` | `startDate=ISO&endDate=ISO` |
| Other values | pass through as `date={value}` | none |

**Response shape:**

```json
{
  "status": true,
  "count": 150,
  "page": 1,
  "limit": 50,
  "totalPages": 3,
  "summary": {
    "subscriptionRevenue": 50000,
    "walletRevenue": 30000,
    "totalRevenue": 80000
  },
  "data": [ { ... row fields ... } ]
}
```

The backend combines `VendorPlanPaymentMaster` rows with qualifying orphan
wallet topups, filters dates and vendor `is_test`, sorts by payment date
ASC, and formats each row for the client.

**Data row fields (24):**

| Field | Description |
|---|---|
| `sn` | Serial number |
| `customerPaymentDate` | Date the customer made the payment |
| `amountReceivedDate` | Date amount was received |
| `type` | Revenue head (Plan Purchase, Wallet Recharge, etc.) |
| `channel` | Payment channel (Razorpay, etc.) |
| `entityName` | Legal entity name |
| `gstin` | Entity GSTIN |
| `businessName` | Business/store name |
| `businessMobile` | Seller's mobile number |
| `planName` | Subscription plan name |
| `invoiceDate` | Invoice date |
| `invoiceManual` | Manually entered invoice number |
| `invoiceSystem` | System-generated invoice number |
| `hsnSac` | HSN or SAC code |
| `planPrice` | Plan price (pre-tax) |
| `gstOnPlan` | GST on plan price |
| `otherFees` | Other fees |
| `gstOnOtherFees` | GST on other fees |
| `totalPaid` | Total amount paid by customer |
| `razorpayFee` | Razorpay processing fee |
| `razorpayTax` | Tax on Razorpay fee |
| `tds` | TDS deducted |
| `amountReceived` | Amount received in BharatGo bank |
| `comment` | Comment/notes |

### 6.2 Excel export

```
GET {baseURL}api/v1/admin/export/filtered-vendor-plan-payment-data
```

**Query parameters:** Same `is_test` and period params as 6.1 (no `page`/
`limit`).

**Response:** XLSX file blob (`Content-Type:
application/vnd.openxmlformats-officedocument.spreadsheetml.sheet`).
Download with `responseType: "blob"`.

### 6.3 Summary cards

Summary cards should use the `summary` object from the list response, not
reconstructed UI values. Available fields: `subscriptionRevenue`,
`walletRevenue`, `totalRevenue`, and potentially others.

### 6.4 Pagination

- Default page size: 50
- UI page size options: 50, 100 (backend caps at 100)
- Do not request 200 or 500 rows in a single API call -- paginate instead
- Page numbers are 1-based

## 7. Roles and authorization

### 7.1 Canonical roles

There are exactly **two user-facing roles**:

| Role | API role_id | Description |
|---|---|---|
| Super Admin | `"3"` | Full access to all areas including Settings, Revenue, Team |
| Team | `"4"` | Standard access; cannot see Settings, Revenue, or Team |

### 7.2 Role canonicalization

The backend may return role names in various spellings. The frontend
canonicalizes them in `src/lib/roles.ts`:

- **Super Admin** spellings: `Super Admin`, `super_admin`, `SUPER_ADMIN`,
  `superadmin`, `super-admin`, etc.
- **Team** spellings: `Team`, `team`, `TEAM`, `team_member`, `TEAM_MEMBER`,
  etc.
- **Missing or unknown roles default to Team** for least privilege.

### 7.3 How the role is read and persisted

1. On login (`POST api/v1/admin/login`), the token is stored in
   `localStorage.userToken`.
2. Immediately after login, the app calls `GET api/v1/admin/get-superadmins`
   to fetch the admin list, finds the current user by `mobile_no`, and stores
   their `role_master.role_name` in `localStorage.userRole` (canonicalized)
   and their name in `localStorage.currentUser`.
3. All role checks throughout the app read from `localStorage.userRole` via
   `getCurrentRole()` in `src/lib/roles.ts`.
4. Role changes are persisted **only** through the existing team-member API
   (`POST api/v1/admin/update-admin-role/{id}` with `{ role_id }`). Never
   write directly to PostgreSQL/AWS. Never alter schema, tables, columns,
   migrations, or seeds.

### 7.4 Protected routes and UI elements

The following are restricted to **Super Admin only**:

| Protected item | Guard mechanism |
|---|---|
| `/settings` route | `SuperAdminRoute` wrapper in `App.tsx` |
| `/revenue` route | `SuperAdminRoute` wrapper in `App.tsx` |
| `/team` route | `SuperAdminRoute` wrapper in `App.tsx` |
| Sidebar entries for Revenue, Team, Settings | Filtered out in `Sidebar.tsx` |
| BharatGo Revenue stat card on Dashboard | Conditionally rendered in `Dashboard.tsx` |

Team users who navigate directly to a protected URL are redirected to
`/dashboard` with no protected content flash.

### 7.5 Existing user role correction

Existing team member roles should be corrected **only** through the
`POST api/v1/admin/update-admin-role/{id}` API:

- Every existing user should be **Team** except **Pravin Adik**, who should
  be **Super Admin**.
- This correction is performed from the Team page's per-member role actions
  (Make Super Admin / Make Team in the actions dropdown).
- **Never hardcode a user name as the authorization rule.** Pravin's Super
  Admin status must come from the persisted role returned by the API, not
  from a client-side name check.

### 7.6 Team page role dropdown

The Add New Team Member modal has exactly two role options: **Super Admin**
and **Team**. The selected role's `role_id` is sent as `role_id` in the
`POST api/v1/admin/register-superadmin` request body.

## 8. Endpoints confirmed insufficient for transaction-level data

These aggregate/analytics endpoints cannot produce per-transaction rows:

| Endpoint | Returns | Why it's insufficient |
|---|---|---|
| `GET api/v1/admin/revenue/revenue-data` | Aggregate revenue totals | No per-transaction data |
| `GET api/v1/admin/revenue/monthly-breakdown` | Monthly aggregates | No per-transaction data |
| `GET api/v1/admin/revenue/subscription-revenue` | Per-plan aggregates | No per-transaction data |
| `GET api/v1/admin/revenue/top-performing` | Per-seller aggregates | No per-transaction data |
| `GET api/v1/admin/revenue/revenue-by-city` | Per-city aggregates | No per-transaction data |
| `GET api/v1/admin/revenue/revenue-by-category` | Per-category aggregates | No per-transaction data |
| `GET api/v1/admin/revenue/revenue-stats` | Daily aggregates | No per-transaction data |
| `GET api/v1/admin/revenue/seller-revenue` | **404 -- does not exist** | Endpoint not found |
