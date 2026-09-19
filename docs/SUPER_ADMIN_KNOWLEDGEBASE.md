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

- **All** -- includes both real and test stores
- **Actual** -- real stores only (`is_test` = false)
- **Test** -- test stores only (`is_test` = true)

Environment mode and the is_test filter are independent dimensions:

| | is_test = All | is_test = Actual | is_test = Test |
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
- **Data source:** A backend transaction-ledger endpoint that returns
  individual payment/invoice records. **This endpoint has not yet been
  located** (see section 5).
- **Required columns (exact order):**
  1. S.N. (serial number)
  2. Customer Payment Date
  3. Type (e.g. Plan Purchase, Wallet Recharge)
  4. Payment Channel
  5. Entity Name
  6. Entity GSTIN
  7. Business Name
  8. Mobile Number
  9. Invoice Date
  10. Invoice Number
  11. HSN/SAC
  12. Base Amount
  13. GST on Base Amount
  14. Total Amount
- **Sorting:** Oldest transaction first (ascending by customer payment date).
- **Each row = one transaction.**

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
5. The transaction-level table visible at `https://super.bharatgo.com/revenue`
   comes from a code version or backend endpoint not present in this
   repository's committed main/master source.

## 5. Database and backend constraints

1. **No Bolt Database / Supabase** usage for this dashboard's data. The AWS
   PostgreSQL database and BharatGo backend APIs are the source of truth.
2. **No schema changes, migrations, seeders, table/column additions or
   deletions** from this frontend project.
3. **No direct database access** from the frontend. All data comes through
   authenticated API calls to the BharatGo backend.
4. **Do not add or modify backend endpoints** from Bolt. If a needed endpoint
   is missing, document the gap and show an error state in the UI.

## 6. Missing backend contract: transaction ledger endpoint

### What is missing

A backend endpoint that returns individual revenue transactions with these
fields (or equivalent under different names):

| Field | Description |
|---|---|
| `invoice_number` | Real invoice number per transaction |
| `invoice_date` | Date the invoice was generated |
| `payment_ref` / `payment_id` | Payment reference from the payment gateway |
| `amount_received` | Total amount received for this transaction |
| `razorpay_fee` / `payment_gateway_fee` | Fee charged by the payment gateway |
| `razorpay_tax` / `payment_gateway_tax` | Tax on the gateway fee |
| `hsn_sac` / `hsn` / `sac` | HSN or SAC code for the service |
| `entity_gstin` | GSTIN of the seller entity |
| `customer_payment_date` | Date the customer made the payment |
| `type` / `revenue_type` | Revenue head (Plan Purchase, Wallet Recharge, etc.) |
| `payment_channel` | Payment channel (Razorpay, bank transfer, etc.) |
| `entity_name` | Legal entity name |
| `business_name` | Business/store name |
| `mobile_number` | Seller's mobile number |
| `base_amount` | Pre-tax amount |
| `gst_amount` | GST charged on the base amount |
| `total_amount` | Base + GST (should match amount_received) |

### Endpoints checked and confirmed insufficient

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

### Likely backend tables (not accessible from frontend)

Based on field names, the transaction data likely lives in tables such as:
- `vendor_plan_payment_master` -- plan subscription payments
- A wallet recharge ledger table
- An invoice master table with `invoice_number`, `invoice_date`, HSN/SAC

These are backend database tables accessed by server-side controllers, not
by the frontend. The frontend can only consume them through an API endpoint.

### Current UI state

The Revenue Report section currently shows a clear "Backend transaction
endpoint required" error state with the exact column headers in place. No
fake or derived data is displayed. When the real endpoint is identified,
the component at `src/components/revenue/RevenueReport.tsx` should be
updated to call it with the standard `Authorization` header, `is_test`
query parameter, and `date`/`from`/`to` period parameters, then map the
actual response fields to the 14 columns listed in section 3.

## 7. Next steps to resolve the missing contract

1. Inspect the deployed `super.bharatgo.com` app's network requests (with
   an authenticated admin session) to identify the exact API call that
   populates the transaction table on the Revenue page.
2. Alternatively, search the BharatGo backend repository for controllers
   referencing `vendor_plan_payment_master`, `invoice_number`, `amount_received`,
   or `hsn_sac`.
3. Once the endpoint path, HTTP method, query parameters, and response
   structure are confirmed, update `API_CONTRACTS.md` and wire
   `RevenueReport.tsx` to use it.
