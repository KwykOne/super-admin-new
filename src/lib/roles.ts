export type Role = "Super Admin" | "Team";

const VERIFIED_ROLE_KEY = "verifiedUserRole";

export function canonicalizeRole(raw: string | number | null | undefined): Role {
  if (raw === null || raw === undefined) return "Team";
  const value = String(raw).trim();
  if (value === "3") return "Super Admin";
  if (value === "6") return "Team";
  const normalized = value.toLowerCase().replace(/[-_]+/g, " ").replace(/\s+/g, " ").trim();
  if (normalized === "super admin" || normalized === "superadmin" || normalized.includes("super admin")) {
    return "Super Admin";
  }
  return "Team";
}

export function isSuperAdmin(role: string | number | null | undefined): boolean {
  return canonicalizeRole(role) === "Super Admin";
}

const CURRENT_ROLE_KEY = "userRole";
const CURRENT_USER_KEY = "currentUser";
const CURRENT_MOBILE_KEY = "currentUserMobile";
const CURRENT_USER_ID_KEY = "currentUserId";

export function getCurrentRole(): Role {
  return canonicalizeRole(localStorage.getItem(CURRENT_ROLE_KEY));
}

export function getVerifiedRole(): Role | null {
  const raw = localStorage.getItem(VERIFIED_ROLE_KEY);
  return raw ? canonicalizeRole(raw) : null;
}

export function setCurrentRole(role: string | number): void {
  const canonicalRole = canonicalizeRole(role);
  localStorage.setItem(CURRENT_ROLE_KEY, canonicalRole);
  localStorage.setItem(VERIFIED_ROLE_KEY, canonicalRole);
}

export function getCurrentUserName(): string | null {
  return localStorage.getItem(CURRENT_USER_KEY);
}

export function setCurrentUserName(name: string): void {
  localStorage.setItem(CURRENT_USER_KEY, name);
}

export function getCurrentUserMobile(): string | null {
  return localStorage.getItem(CURRENT_MOBILE_KEY);
}

export function setCurrentUserMobile(mobile: string): void {
  localStorage.setItem(CURRENT_MOBILE_KEY, mobile.replace(/\D/g, ""));
}

export function getCurrentUserId(): string | null {
  return localStorage.getItem(CURRENT_USER_ID_KEY);
}

export function setCurrentUserId(id: string | number): void {
  localStorage.setItem(CURRENT_USER_ID_KEY, String(id));
}

export function clearCurrentUser(): void {
  localStorage.removeItem(CURRENT_ROLE_KEY);
  localStorage.removeItem(VERIFIED_ROLE_KEY);
  localStorage.removeItem(CURRENT_USER_KEY);
  localStorage.removeItem(CURRENT_MOBILE_KEY);
  localStorage.removeItem(CURRENT_USER_ID_KEY);
}

export const SUPER_ADMIN_API_ID = "3";
export const TEAM_API_ID = "6";

export function roleToApiId(role: Role): string {
  return role === "Super Admin" ? SUPER_ADMIN_API_ID : TEAM_API_ID;
}

export function apiIdToRole(id: string | number | undefined): Role {
  return canonicalizeRole(id);
}
