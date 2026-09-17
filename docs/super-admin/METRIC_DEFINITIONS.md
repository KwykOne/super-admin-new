# Metric Definitions

> Metrics displayed on the Super Admin dashboard, their source API fields,
> and how they are computed in the frontend.

## Dashboard stat cards

| Metric | API field | API endpoint | Frontend processing |
|---|---|---|---|
| Total Sellers | `payload.storeCount` | `GET api/v1/admin/dashboard` | `convertNumber()` formatter |
| Total Orders | `payload.orderCount` | `GET api/v1/admin/dashboard` | `convertNumber()` formatter |
| GMV Powered | `payload.totalOrderSales` | `GET api/v1/admin/dashboard` | `convertNumber()` formatter |
| BharatGo Revenue | `payload.revenueData` | `GET api/v1/admin/dashboard` | `convertNumber()` formatter |

> **Note:** Trend percentages shown on stat cards are currently hardcoded in
> the `dataByPeriod` object and do **not** come from the API. This is a known
> mock-data issue.

## Dashboard charts

### Monthly Growth (bar chart)
- **API:** `GET api/v1/admin/dashboard/monthly-growth`
- **Response mapping:**
  - X-axis: `monthName` → `month`
  - Bar 1: `storeCount` → `sellers`
  - Bar 2: `orderCount` → `orders`
  - Bar 3: `revenueData` → `revenue`
- Data is reversed before display (oldest → newest).

### Revenue Sources (pie chart)
- **API:** `GET api/v1/admin/dashboard/revenue-sources`
- **Response:** `revenueSourcesData: [{ name, value }]`
- Colors: `["#3B82F6", "#10B981", "#F59E0B", "#6366F1"]`

### Order Status (progress bars)
- **API:** `GET api/v1/admin/dashboard/order-status`
- **Response:** `orderStatusData: [{ status, count, percentage }]`
- Percentage rounded to 2 decimal places.

### Seller Onboarding Funnel (progress bars)
- **API:** `GET api/v1/admin/dashboard/selling-funnel`
- **Response:** `sellerStatusData: [{ status, count, percentage }]`
- Stages (from Sellers page): OTP Not Entered → Mobile Verified → Profile
  Created → Customization Done/Skipped → Contact Info Verified → Product
  Added/Skipped → Live!

## Sellers page metrics

| Metric | API field | Endpoint |
|---|---|---|
| Total Sellers | from `sellerData` response | `GET api/v1/admin/sellers` |
| Live Sellers | from response | `GET api/v1/admin/sellers` |
| Onboarding Sellers | from response | `GET api/v1/admin/sellers` |
| Daily seller stats | from response | `GET api/v1/admin/sellers/sellerStats` |
| Sellers by category | `data: [{ category, count }]` | `GET api/v1/admin/sellers/sellers-by-category` |
| Sellers by city | `data: [{ city, count }]` | `GET api/v1/admin/sellers/sellers-by-city` |
| Subscription plans | from response | `GET api/v1/admin/sellers/subscription-plans` |
| Activity status | from response | `GET api/v1/analytics/seller-activity-status` |

## Orders page metrics

| Metric | Source | Notes |
|---|---|---|
| Total Orders | API `order-data` response | **Live** |
| Delivered count | Hardcoded `statsByPeriod` | **Mock** |
| In-progress count | Hardcoded `statsByPeriod` | **Mock** |
| Cancelled count | Hardcoded `statsByPeriod` | **Mock** |
| Status counts | Hardcoded `orderStatusCounts` | **Mock** |

## Revenue page metrics

| Metric | API field | Endpoint |
|---|---|---|
| Total Revenue | from `revenueData` | `GET api/v1/admin/revenue/revenue-data` |
| Subscription Revenue | from `revenueData` | same |
| Platform Fee | from `revenueData` | same |
| Wallet Revenue | from `revenueData` | same |
| Monthly breakdown | `monthlyBreakdown: [{ monthName, subscriptionRevenue, totalPlatformFee, walletRevenue, others }]` | `GET api/v1/admin/revenue/monthly-breakdown` |
| Subscription plan cards | `subscriptionData: [{ name, revenue }]` | `GET api/v1/admin/revenue/subscription-revenue` |
| Top performing stores | `topVendors: [{ ... }]` | `GET api/v1/admin/revenue/top-performing` |
| Revenue by city | `data: [{ ... }]` | `GET api/v1/admin/revenue/revenue-by-city` |
| Revenue by category | `data: [{ ... }]` | `GET api/v1/admin/revenue/revenue-by-category` |
| Daily revenue | from response | `GET api/v1/admin/revenue/revenue-stats` |
| Seller revenue table | TBD | API call commented out; currently mock |

## Vendor plan expiry (Dashboard)

| Metric | API field | Endpoint |
|---|---|---|
| Plan counts | from response | `GET api/v1/admin/get-plan-counts` |
| Vendors by expiry | from response | `GET api/v1/admin/get-vendors-by-plan-expiry` |

## Settlements — WIP (all mock)

| Metric | Source | Status |
|---|---|---|
| Total Settlement Amount | Hardcoded `settlementStats` | **Mock** |
| Pending Settlements | Hardcoded | **Mock** |
| Completed Settlements | Hardcoded | **Mock** |
| Settlement rows | `settlementData` array | **Mock** |

## Referrals — WIP (all mock)

| Metric | Source | Status |
|---|---|---|
| Total referrers | `useReferralsData` mock | **Mock** |
| Total points | mock | **Mock** |
| Redeemed points | mock | **Mock** |
| Conversion rate | hardcoded 72% | **Mock** |

## Partners — WIP (all mock)

| Metric | Source | Status |
|---|---|---|
| Total partners | `usePartnersData` mock | **Mock** |
| Active partners | mock | **Mock** |
| Partner types chart | mock | **Mock** |
| Performance chart | `generateMockData()` | **Mock** |

## Team

| Metric | API field | Endpoint |
|---|---|---|
| Team members | from response | `GET api/v1/admin/get-superadmins` |
| Member role | `role_master.role_name` | same |

## Formatting utilities (`src/utils/dataUtils.ts`)

- `convertNumber()` — formats large numbers with Indian numbering (Lakh/Crore).
- `downloadTableAsCSV()` — exports table data to CSV.
- `formatDateTime()` — date/time formatting.
- `formatTableDataForDownload()` — prepares data for CSV export.
