# Screen Data Map

> For each screen, lists the API calls made, data sources, and whether the
> screen uses live API data or mock/fallback data.

## Login (`/`)

| Call | Endpoint | Status |
|---|---|---|
| Login | `POST api/v1/admin/login` | **Live** |

Token stored in `localStorage.userToken`. No auth guard on other routes.

## Dashboard (`/dashboard`)

| Element | Endpoint | Status |
|---|---|---|
| Stat cards (sellers, orders, GMV, revenue) | `GET api/v1/admin/dashboard` | **Live** |
| Monthly growth bar chart | `GET api/v1/admin/dashboard/monthly-growth` | **Live** |
| Revenue sources pie chart | `GET api/v1/admin/dashboard/revenue-sources` | **Live** |
| Order status progress bars | `GET api/v1/admin/dashboard/order-status` | **Live** |
| Seller onboarding funnel | `GET api/v1/admin/dashboard/selling-funnel` | **Live** |
| Vendor plan expiry table | `GET api/v1/admin/get-plan-counts` + `GET api/v1/admin/get-vendors-by-plan-expiry` | **Live** |
| Trend percentages on stat cards | Hardcoded in `dataByPeriod` object | **Mock** — trend values are hardcoded per period |
| `orderStatusData` / `revenueSourcesData` fallback arrays | Defined at top of file | **Dead code** — overridden by API responses |

## Sellers (`/sellers`)

| Element | Endpoint | Status |
|---|---|---|
| Seller list table | `GET api/v1/admin/sellers` | **Live** |
| Seller stats (daily chart) | `GET api/v1/admin/sellers/sellerStats` | **Live** |
| Sellers by category chart | `GET api/v1/admin/sellers/sellers-by-category` | **Live** |
| Sellers by city chart | `GET api/v1/admin/sellers/sellers-by-city` | **Live** |
| Subscription plans | `GET api/v1/admin/sellers/subscription-plans` | **Live** |
| Seller activity status | `GET api/v1/analytics/seller-activity-status` | **Live** |
| CSV download | `GET api/v1/admin/sellers/download-seller-data` | **Live** |
| `sellersData` array (10 rows) | Hardcoded at top of file | **Mock** — used as fallback for filter dropdowns |
| `sellerDataByPeriod` | Hardcoded | **Mock** — period stats |

## Seller Detail (`/sellers/:id`)

| Element | Endpoint | Status |
|---|---|---|
| Seller details | From Redux `sellerDetails` (set by Sellers page) | **Live** (passed via state) |
| Documents | `GET api/v1/admin/seller/documents/{id}` | **Live** |
| Finances | `GET api/v1/admin/seller/finances/{id}` | **Live** |
| Orders | `GET api/v1/admin/seller/orders/{id}` | **Live** |
| Products | `GET api/v1/admin/seller/products/{id}` | **Live** |
| Top products | `GET api/v1/admin/sellers/top-products/{id}` | **Live** |
| Recent performance | `GET api/v1/admin/sellers/recent-performance/{id}` | **Live** |
| Toggle vendor status | `POST api/v1/admin/toggle-vendor-status/{id}` | **Live** |
| Toggle test status | `POST api/v1/admin/toggle-vendor-test-status/{id}` | **Live** |
| Update credentials | `POST api/v1/admin/update-vendor-login-credentials/{id}` | **Live** |
| Assign plan | `POST api/v1/admin/assign-plan/{id}` | **Live** |

## Orders (`/orders`)

| Element | Endpoint | Status |
|---|---|---|
| Orders table | `GET api/v1/admin/orders/order-data` | **Live** |
| CSV download | `GET api/v1/admin/orders/download-order-data` | **Live** |
| `orderData` array (8 rows) | Hardcoded at top of file | **Mock** — used for filter dropdown values |
| `statsByPeriod` | Hardcoded | **Mock** — period stats |
| `orderStatusCounts` | Hardcoded | **Mock** |

## Order Detail (`/orders/:id`)

| Element | Endpoint | Status |
|---|---|---|
| Order timeline | `GET api/v1/admin/order-timeline/{id}` | **Live** |

## Revenue (`/revenue`)

| Element | Endpoint | Status |
|---|---|---|
| Revenue stat cards | `GET api/v1/admin/revenue/revenue-data` | **Live** |
| Monthly breakdown chart | `GET api/v1/admin/revenue/monthly-breakdown` | **Live** |
| Revenue sources | `GET api/v1/admin/dashboard/revenue-sources` | **Live** |
| Subscription plan cards | `GET api/v1/admin/revenue/subscription-revenue` | **Live** |
| Top performing stores | `GET api/v1/admin/revenue/top-performing` | **Live** |
| Revenue by city chart | `GET api/v1/admin/revenue/revenue-by-city` | **Live** |
| Revenue by category chart | `GET api/v1/admin/revenue/revenue-by-category` | **Live** |
| Daily revenue chart | `GET api/v1/admin/revenue/revenue-stats` | **Live** (falls back to `mockData` if API returns empty) |
| Seller revenue table | `GET api/v1/admin/revenue/top-performing` | **Live** — uses the same filtered seller revenue response as Top Performing Stores |
| Revenue Report (transaction-level) | `GET api/v1/admin/revenue/vendor-plan-payment-data` + `GET api/v1/admin/export/filtered-vendor-plan-payment-data` | **Live** — paginated transaction data with Excel export. See `docs/SUPER_ADMIN_KNOWLEDGEBASE.md` section 6 |

## Settlements (`/settlements`) — WIP

| Element | Endpoint | Status |
|---|---|---|
| Settlement table | None | **Mock** — `settlementData` array hardcoded |
| Settlement stats | None | **Mock** — `settlementStats` hardcoded |
| Period filter | None | **Mock** — `SettlementPeriodFilter` has mock data |

## Referrals (`/referrals`) — WIP

| Element | Endpoint | Status |
|---|---|---|
| Referrer list | None | **Mock** — `useReferralsData` generates mock referrers |
| Summary stats | None | **Mock** — `useReferralPeriodData` returns mock period data |

## Referral Detail (`/referrals/:id`) — WIP

| Element | Endpoint | Status |
|---|---|---|
| Referrer details | None | **Mock** — from Redux `referrealGivenDetails` |
| Wallet view | None | **Mock** — `generateMockTransactions` in `SellerWalletView` |

## Partners (`/partners`) — WIP

| Element | Endpoint | Status |
|---|---|---|
| Partner list | None | **Mock** — `usePartnersData` generates mock partners |
| Summary stats | None | **Mock** — `usePartnerPeriodData` returns mock period data |
| Performance chart | None | **Mock** — `generateMockData` in `PartnerPerformanceChart` |

## Team (`/team`)

| Element | Endpoint | Status |
|---|---|---|
| Team member list | `GET api/v1/admin/get-superadmins` | **Live** (via `useSuperAdminData`) |
| Add member | `POST api/v1/admin/register-superadmin` | **Live** |
| Remove member | `DELETE api/v1/admin/delete-admin/{id}` | **Live** |
| Toggle status | `POST api/v1/admin/toggle-admin-status/{id}` | **Live** |
| `teamData` array (5 rows) | Hardcoded | **Mock** — used as initial state before API loads |

## Announcements (`/announcements`)

| Element | Endpoint | Status |
|---|---|---|
| Announcements list | Reads from `baseURL` | **Live** — exact endpoint path TBD |

## Settings (`/settings`)

No API calls. UI-only tabbed settings page.

## Help (`/help`)

No API calls. Static help content.
