# Permissions and Write Actions

> All write actions go through existing BharatGo backend APIs. There are no
> direct browser-to-database connections. Team-member and seller-plan changes
> must be record-level actions through approved APIs only.

## Write actions by screen

### Team (`/team`)

| Action | Method | Endpoint | Body | Notes |
|---|---|---|---|---|
| Add team member | POST | `api/v1/admin/register-superadmin` | `{ name, mobile_no, password }` | Creates a new super admin. Role is hardcoded to `3` (Super Admin). Other roles are commented out. |
| Remove team member | DELETE | `api/v1/admin/delete-admin/{id}` | — | Deletes by admin ID |
| Toggle member status | POST | `api/v1/admin/toggle-admin-status/{id}` | `{}` | Toggles active/inactive |

### Sellers — Seller Detail (`/sellers/:id`)

| Action | Method | Endpoint | Body | Notes |
|---|---|---|---|---|
| Toggle vendor status | POST | `api/v1/admin/toggle-vendor-status/{id}` | `{}` | Active/inactive toggle |
| Toggle vendor test status | POST | `api/v1/admin/toggle-vendor-test-status/{id}` | `{}` | Test/real toggle |
| Update login credentials | POST | `api/v1/admin/update-vendor-login-credentials/{id}` | credentials object | Update store login |
| Assign plan | POST | `api/v1/admin/assign-plan/{id}` | plan data | Assign subscription plan |

### Sellers — Table Actions (`/sellers`)

| Action | Method | Endpoint | Body | Notes |
|---|---|---|---|---|
| Get store token (impersonation) | GET | `api/v1/admin/getStoreToken/{mobile}` | — | Fetches a token to impersonate a store |

### Login (`/`)

| Action | Method | Endpoint | Body | Notes |
|---|---|---|---|---|
| Login | POST | `api/v1/admin/login` | `{ mobile_no, password }` | Returns JWT token |

## Access control model

- **Frontend:** No route-level auth guard. Any visitor can navigate to any
  route. Pages rely on the API returning 401 to fail gracefully.
- **Backend:** The BharatGo backend enforces authentication via JWT and
  authorization via role checks. The frontend does not implement its own
  permission system.
- **Roles (from Team page):** Only `Super Admin` (role id `3`) is currently
  selectable. Other roles (Admin, Finance Manager, Seller Support, Analyst)
  are commented out in the source.
- **Role display:** The Team page reads `role_master.role_name` from the API
  response to display each member's role.

## Rules for write actions

1. Team-member and seller-plan changes must use the existing APIs listed
   above. Do not add direct browser-to-PostgreSQL connections.
2. All writes must be record-level actions (one record at a time by ID). No
   bulk operations from the frontend.
3. Do not put AWS, PostgreSQL, database, admin passwords, private keys, or
   private analytics secrets in frontend code or `VITE_` variables.
4. A new database table requires explicit owner approval before creation. Do
   not infer approval from a feature request.

## Screens with no write actions

- Dashboard — read-only
- Orders — read-only (table + detail)
- Revenue — read-only
- Settlements — WIP, no API
- Referrals — WIP, no API
- Partners — WIP, no API
- Announcements — read-only (TBD if writes exist)
- Settings — UI-only, no API calls
- Help — static content
