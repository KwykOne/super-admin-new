# API Contracts

> All endpoints are relative to the base URL:
> - Production: `https://api.bharatgo.com/`
> - Development: `https://api-dev.bharatgo.com/`
>
> Every authenticated request includes
> `Authorization: Bearer <token from localStorage userToken>`.

## Auth

### POST `api/v1/admin/login`
- **Body:** `{ mobile_no: string, password: string }`
- **Success:** `{ token: string }` — stored in `localStorage.userToken`
- **Errors:** 400 = invalid credentials; 500 = server error
- **Used by:** Login page

## Dashboard

### GET `api/v1/admin/dashboard`
- **Query:** `is_test`, `date` (period name or `customData` with `startDate`/`endDate`)
- **Response:** `{ payload: { storeCount, orderCount, totalOrderSales, revenueData, ... } }`
- **Used by:** Dashboard — stat cards

### GET `api/v1/admin/dashboard/monthly-growth`
- **Query:** `is_test`
- **Response:** `{ payload: [{ monthName, storeCount, orderCount, revenueData }] }`
- **Used by:** Dashboard — monthly growth bar chart

### GET `api/v1/admin/dashboard/revenue-sources`
- **Query:** `is_test`
- **Response:** `{ revenueSourcesData: [{ name, value }] }`
- **Used by:** Dashboard — revenue sources pie chart; Revenue page

### GET `api/v1/admin/dashboard/order-status`
- **Query:** `is_test`
- **Response:** `{ orderStatusData: [{ status, count, percentage }] }`
- **Used by:** Dashboard — order status progress bars

### GET `api/v1/admin/dashboard/selling-funnel`
- **Query:** `is_test`, `date` (period or `customData` with date range)
- **Response:** `{ sellerStatusData: [{ status, count, percentage }] }`
- **Used by:** Dashboard — seller onboarding funnel

## Sellers

### GET `api/v1/admin/sellers`
- **Query:** `is_test`, `date` (period or `customData` with `startDate`/`endDate`)
- **Response:** seller list with pagination metadata
- **Used by:** Sellers page

### GET `api/v1/admin/sellers/sellerStats`
- **Query:** `date`, `is_test`
- **Response:** daily seller stats
- **Used by:** Sellers page — DailyStatsChart

### GET `api/v1/admin/sellers/sellers-by-category`
- **Query:** `is_test`, `date` (or `customData` with date range)
- **Response:** `{ data: [{ category, count, ... }] }`
- **Used by:** Sellers page — distribution chart

### GET `api/v1/admin/sellers/sellers-by-city`
- **Query:** `is_test`, `date` (or `customData` with date range)
- **Response:** `{ data: [{ city, count, ... }] }`
- **Used by:** Sellers page — distribution chart

### GET `api/v1/admin/sellers/subscription-plans`
- **Query:** `is_test`, `date` (or `customData` with date range); variant: `date=all&oneTimePlans=true`
- **Response:** subscription plan data
- **Used by:** Sellers page — plan charts

### GET `api/v1/admin/sellers/download-seller-data`
- **Query:** `status`, `is_test`, `q`, `categories`, `cities`, `stages`
- **Used by:** Sellers page — CSV download

### GET `api/v1/admin/sellers/recent-performance/{id}`
- **Query:** `date=all`
- **Used by:** SellerDetail page

### GET `api/v1/admin/seller/documents/{id}`
- **Used by:** SellerDetail page

### GET `api/v1/admin/seller/finances/{id}`
- **Used by:** SellerDetail page

### GET `api/v1/admin/seller/orders/{id}`
- **Query:** `date`, `page`, `order_type`, `payment_mode`, `status`, `search`
- **Used by:** SellerDetail page

### GET `api/v1/admin/seller/products/{id}`
- **Query:** `date`, `page`
- **Used by:** SellerDetail page

### GET `api/v1/admin/sellers/top-products/{id}`
- **Query:** `date=all`
- **Used by:** SellerDetail page

## Seller actions (writes)

### GET `api/v1/admin/getStoreToken/{mobile}`
- **Used by:** SellerTableActions — get impersonation token for a store

### POST `api/v1/admin/toggle-vendor-status/{id}`
- **Body:** `{}`
- **Used by:** SellerTableActions — toggle active/inactive

### POST `api/v1/admin/toggle-vendor-test-status/{id}`
- **Body:** `{}`
- **Used by:** SellerTableActions — toggle test status

### POST `api/v1/admin/update-vendor-login-credentials/{id}`
- **Body:** updated credentials
- **Used by:** SellerDetail — update login

### POST `api/v1/admin/assign-plan/{id}`
- **Body:** plan assignment data
- **Used by:** SellerDetail — assign subscription plan

## Orders

### GET `api/v1/admin/orders/order-data`
- **Query:** `is_test`, `date`
- **Used by:** Orders page

### GET `api/v1/admin/orders/download-order-data`
- **Query:** `is_test`, `date`, `page`, `order_status`, `payment_mode`, `delivery_type`, `delivery_partner`, `query`, `rows_per_page`
- **Used by:** Orders page — CSV download

### GET `api/v1/admin/order-timeline/{id}`
- **Used by:** OrderDetail page

## Revenue

### GET `api/v1/admin/revenue/revenue-data`
- **Query:** `is_test`, `date` (or `startDate`/`endDate`)
- **Response:** `{ revenueData: { ... } }`
- **Used by:** Revenue page — stat cards

### GET `api/v1/admin/revenue/monthly-breakdown`
- **Query:** `is_test`
- **Response:** `{ monthlyBreakdown: [{ monthName, subscriptionRevenue, totalPlatformFee, walletRevenue, others }] }`
- **Used by:** Revenue page — distribution chart

### GET `api/v1/admin/revenue/subscription-revenue`
- **Query:** `is_test`, `date` (or `from`/`to`)
- **Response:** `{ subscriptionData: [{ name, revenue, ... }] }`
- **Used by:** Revenue page — subscription plan cards

### GET `api/v1/admin/revenue/top-performing`
- **Query:** `is_test`, `date` (or `from`/`to`)
- **Response:** `{ topVendors: [{ ... }] }`
- **Used by:** Revenue page — top performing stores

### GET `api/v1/admin/revenue/revenue-by-city`
- **Query:** `is_test`, `date` (or `from`/`to`)
- **Response:** `{ data: [{ ... }] }`
- **Used by:** Revenue page — city chart

### GET `api/v1/admin/revenue/revenue-by-category`
- **Query:** `is_test`, `date` (or `from`/`to`)
- **Response:** `{ data: [{ ... }] }`
- **Used by:** Revenue page — category chart

### GET `api/v1/admin/revenue/revenue-stats`
- **Query:** `date`, `is_test`
- **Used by:** Revenue page — RevenueStatsChart

### GET `api/v1/admin/revenue/top-performing`
- **Query:** `is_test`, `date` (or `from`/`to`)
- **Response:** `{ topVendors: [{ business_name, city, plan_name, delivered_orders, gmv, total_revenue, ... }] }`
- **Used by:** Revenue page — TopPerformingStores and Revenue by Seller table

## Vendor plan expiry (Dashboard)

### GET `api/v1/admin/get-plan-counts`
- **Query:** `is_test`, `date` (and other params)
- **Used by:** VendorExpiryTable

### GET `api/v1/admin/get-vendors-by-plan-expiry`
- **Query:** `is_test`, `date` (and other params)
- **Used by:** VendorExpiryTable

## Team

### GET `api/v1/admin/get-superadmins`
- **Headers:** `Authorization: Bearer <token>`
- **Used by:** Team page — via `useSuperAdminData` hook

### POST `api/v1/admin/register-superadmin`
- **Body:** `{ name, mobile_no, password }`
- **Used by:** Team page — add member

### DELETE `api/v1/admin/delete-admin/{id}`
- **Used by:** Team page — remove member

### POST `api/v1/admin/toggle-admin-status/{id}`
- **Body:** `{}`
- **Used by:** Team page — toggle active/inactive

## Analytics

### GET `api/v1/analytics/seller-activity-status`
- **Used by:** Sellers page — activity data

## Announcements

### GET `api/v1/admin/dashboard` (reused) or announcement-specific endpoint
- The Announcements page reads from `VITE_BACKEND_DEV_URL` / `VITE_BACKEND_PROD_URL`.
- Exact endpoint: TBD — inspect `src/pages/Announcements.tsx` for current path.

### GET `api/v1/admin/revenue/seller-revenue` -- DOES NOT EXIST
- **Status:** 404. Confirmed not found. Do not use.
- **Note:** The older repository (github.com/Bharat-Go/super-admin-dashboard-bg)
  had a commented-out reference to this endpoint but it never worked.

### GET `api/v1/admin/revenue/vendor-plan-payment-data`
- **Query:** `is_test` (both/real/test), `page` (1-based), `limit` (50/100, backend caps at 100), `date` (period keyword), `month`, `year`, `startDate`, `endDate`
- **Auth:** `Authorization: Bearer <token>` -- protected by `superAdminOnly` middleware
- **Response:** `{ status, count, page, limit, totalPages, summary: { subscriptionRevenue, walletRevenue, totalRevenue }, data: [{ sn, customerPaymentDate, amountReceivedDate, type, channel, entityName, gstin, businessName, businessMobile, planName, invoiceDate, invoiceManual, invoiceSystem, hsnSac, planPrice, gstOnPlan, otherFees, gstOnOtherFees, totalPaid, razorpayFee, razorpayTax, tds, amountReceived, comment }] }`
- **Used by:** Revenue page -- Revenue Report (per-transaction CA/GST table)
- **See:** `docs/SUPER_ADMIN_KNOWLEDGEBASE.md` section 6 for full contract

### GET `api/v1/admin/export/filtered-vendor-plan-payment-data`
- **Query:** Same `is_test` and period params as above (no `page`/`limit`)
- **Auth:** `Authorization: Bearer <token>` -- protected by `superAdminOnly` middleware
- **Response:** XLSX file blob
- **Used by:** Revenue page -- Revenue Report Excel export

## Unknown / TBD endpoints

- **Settlements:** No API endpoint found in source. Page uses hardcoded mock
  data. Endpoint is TBD.
- **Referrals:** No API endpoint found in source. Hooks
  (`useReferralsData`, `useReferralPeriodData`) generate mock data.
  Endpoint is TBD.
- **Partners:** No API endpoint found in source. Hooks
  (`usePartnersData`, `usePartnerPeriodData`) generate mock data.
  Endpoint is TBD.
