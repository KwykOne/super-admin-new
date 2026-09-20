export type Role = "Super Admin" | "Team";

const SUPER_ADMIN_SPELLINGS = new Set([
  "super admin",
  "super_admin",
  "superadmin",
  "super-admin",
  "super_admin_role",
  "super admin role",
  "super admin role",
  "super-admin role",
]);

const TEAM_SPELLINGS = new Set([
  "team",
  "team_member",
  "team member",
  "team-member",
  "team role",
]);

/**
 * Canonicalizes a role string or role id to "Super Admin" or "Team".
 *
 * Accepts:
 * - role_master.role_name values: "Super Admin", "super_admin", "SUPER ADMIN", etc.
 * - role id strings/numbers: "3" → Super Admin, "4" → Team
 * - null/undefined/unknown → Team (least privilege)
 */
export function canonicalizeRole(raw: string | number | null | undefined): Role {
  if (raw === null || raw === undefined) return "Team";

  const s = String(raw).trim();
  if (s === "") return "Team";

  // Role ID matching
  if (s === "3") return "Super Admin";
  if (s === "4") return "Team";

  const lower = s.toLowerCase();
  if (SUPER_ADMIN_SPELLINGS.has(lower)) return "Super Admin";
  if (TEAM_SPELLINGS.has(lower)) return "Team";

  // Partial match for super admin variants
  if (lower.includes("super") && lower.includes("admin")) return "Super Admin";

  // Partial match for team variants
  if (lower === "team" || lower.startsWith("team")) return "Team";

  // Unknown → least privilege
  return "Team";
}

export function isSuperAdmin(role: string | number | null | undefined): boolean {
  return canonicalizeRole(role) === "Super Admin";
}

const CURRENT_ROLE_KEY = "userRole";
const CURRENT_USER_KEY = "currentUser";
const CURRENT_MOBILE_KEY = "currentUserMobile";

export function getCurrentRole(): Role {
  const raw = localStorage.getItem(CURRENT_ROLE_KEY);
  return canonicalizeRole(raw);
}

export function setCurrentRole(role: string | number) {
  localStorage.setItem(CURRENT_ROLE_KEY, canonicalizeRole(role));
}

export function getCurrentUserName(): string | null {
  return localStorage.getItem(CURRENT_USER_KEY);
}

export function setCurrentUserName(name: string) {
  localStorage.setItem(CURRENT_USER_KEY, name);
}

export function getCurrentUserMobile(): string | null {
  return localStorage.getItem(CURRENT_MOBILE_KEY);
}

export function setCurrentUserMobile(mobile: string) {
  localStorage.setItem(CURRENT_MOBILE_KEY, mobile);
}

export function clearCurrentUser() {
  localStorage.removeItem(CURRENT_ROLE_KEY);
  localStorage.removeItem(CURRENT_USER_KEY);
  localStorage.removeItem(CURRENT_MOBILE_KEY);
}

export const SUPER_ADMIN_API_ID = "3";
export const TEAM_API_ID = "4";

export function roleToApiId(role: Role): string {
  return role === "Super Admin" ? SUPER_ADMIN_API_ID : TEAM_API_ID;
}

export function apiIdToRole(id: string | number | undefined): Role {
  const s = String(id ?? "");
  if (s === SUPER_ADMIN_API_ID) return "Super Admin";
  return "Team";
}
