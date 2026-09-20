export type Role = "Super Admin" | "Team";

const SUPER_ADMIN_SPELLINGS = new Set([
  "super admin",
  "super_admin",
  "superadmin",
  "super-admin",
  "super_admin_role",
  "super admin role",
  "SUPER_ADMIN",
  "SUPER ADMIN",
  "SUPER-ADMIN",
]);

const TEAM_SPELLINGS = new Set([
  "team",
  "team_member",
  "team member",
  "team-member",
  "TEAM",
  "TEAM_MEMBER",
  "TEAM MEMBER",
]);

export function canonicalizeRole(raw: string | null | undefined): Role {
  if (!raw) return "Team";
  const normalized = raw.trim();
  if (SUPER_ADMIN_SPELLINGS.has(normalized.toLowerCase())) return "Super Admin";
  if (TEAM_SPELLINGS.has(normalized.toLowerCase())) return "Team";
  return "Team";
}

export function isSuperAdmin(role: string | null | undefined): boolean {
  return canonicalizeRole(role) === "Super Admin";
}

const CURRENT_ROLE_KEY = "userRole";
const CURRENT_USER_KEY = "currentUser";
const CURRENT_MOBILE_KEY = "currentUserMobile";

export function getCurrentRole(): Role {
  const raw = localStorage.getItem(CURRENT_ROLE_KEY);
  return canonicalizeRole(raw);
}

export function setCurrentRole(role: string) {
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
