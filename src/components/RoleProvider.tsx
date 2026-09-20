import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useState,
  type ReactNode,
} from "react";
import { useSelector } from "react-redux";
import { RootState } from "@/store";
import axios from "axios";
import {
  canonicalizeRole,
  getCurrentUserId,
  getCurrentUserMobile,
  getCurrentUserName,
  getVerifiedRole,
  setCurrentRole,
  setCurrentUserId,
  setCurrentUserMobile,
  setCurrentUserName,
  type Role,
} from "@/lib/roles";

type RoleStatus = "loading" | "synced" | "error";

interface RoleContextValue {
  role: Role | null;
  status: RoleStatus;
  userName: string | null;
  isAuthenticated: boolean;
  isSuperAdmin: boolean;
  errorMessage: string | null;
  refreshRole: () => Promise<void>;
}

const RoleContext = createContext<RoleContextValue>({
  role: null,
  status: "loading",
  userName: null,
  isAuthenticated: false,
  isSuperAdmin: false,
  errorMessage: null,
  refreshRole: async () => {},
});

export function useRole(): RoleContextValue {
  return useContext(RoleContext);
}

function normalizeDigits(value: unknown): string {
  return value == null ? "" : String(value).replace(/\D/g, "");
}

function firstValue(record: any, keys: string[]): unknown {
  for (const key of keys) {
    const value = record?.[key];
    if (value !== undefined && value !== null && value !== "") return value;
  }
  return undefined;
}

function adminId(admin: any): string {
  return String(firstValue(admin, ["id", "admin_id", "adminId", "user_id", "userId"]) ?? "");
}

function adminMobile(admin: any): string {
  return normalizeDigits(firstValue(admin, [
    "mobile_no", "mobileNo", "mobile", "phone", "phone_no", "phoneNumber",
  ]));
}

function extractRoleValue(record: any, depth = 0): unknown {
  if (!record || depth > 2) return undefined;
  const direct = firstValue(record, ["role_name", "roleName", "role_id", "roleId"]);
  if (direct !== undefined) return direct;
  const nested = firstValue(record, ["role_master", "roleMaster", "role", "roles", "permission", "access"]);
  if (Array.isArray(nested)) {
    for (const item of nested) {
      const nestedValue = extractRoleValue(item, depth + 1);
      if (nestedValue !== undefined) return nestedValue;
    }
  }
  if (nested !== undefined && typeof nested !== "string" && typeof nested !== "number") {
    return extractRoleValue(nested, depth + 1);
  }
  if (typeof nested === "string" || typeof nested === "number") return nested;
  return undefined;
}

function extractRole(admin: any): Role | null {
  const value = extractRoleValue(admin);
  return value === undefined ? null : canonicalizeRole(value as string | number);
}

function extractAdmins(responseData: any): any[] {
  const candidates = [
    responseData?.data,
    responseData?.admins,
    responseData?.users,
    responseData?.payload,
    responseData,
  ];
  for (const candidate of candidates) {
    if (Array.isArray(candidate)) return candidate;
    for (const key of ["data", "admins", "users", "rows", "results", "items", "payload"]) {
      if (Array.isArray(candidate?.[key])) return candidate[key];
    }
  }
  return [];
}

function decodeTokenIdentity(token: string): { id: string; mobile: string } {
  try {
    const payload = token.split(".")[1];
    if (!payload) return { id: "", mobile: "" };
    const decoded = JSON.parse(atob(payload.replace(/-/g, "+").replace(/_/g, "/")));
    return {
      id: String(firstValue(decoded, ["id", "admin_id", "adminId", "user_id", "userId", "sub"]) ?? ""),
      mobile: normalizeDigits(firstValue(decoded, ["mobile_no", "mobileNo", "mobile", "phone", "phoneNumber"])),
    };
  } catch {
    return { id: "", mobile: "" };
  }
}

function hydrateIdentityFromToken(token: string): void {
  const identity = decodeTokenIdentity(token);
  if (identity.id && !getCurrentUserId()) setCurrentUserId(identity.id);
  if (identity.mobile && !getCurrentUserMobile()) setCurrentUserMobile(identity.mobile);
}

export function RoleProvider({ children }: { children: ReactNode }) {
  const verifiedRole = getVerifiedRole();
  const [role, setRole] = useState<Role | null>(verifiedRole === "Super Admin" ? verifiedRole : null);
  const [status, setStatus] = useState<RoleStatus>("loading");
  const [userName, setUserName] = useState<string | null>(() => getCurrentUserName());
  const [sessionVersion, setSessionVersion] = useState(0);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const mode = useSelector((state: RootState) => state.modal.mode);

  const refreshRole = useCallback(async () => {
    const token = localStorage.getItem("userToken");
    if (!token) {
      setRole(null);
      setStatus("synced");
      setErrorMessage(null);
      return;
    }

    hydrateIdentityFromToken(token);
    setStatus("loading");
    setErrorMessage(null);

    const baseURL = mode === "dev"
      ? import.meta.env.VITE_BACKEND_DEV_URL
      : import.meta.env.VITE_BACKEND_PROD_URL;

    try {
      const response = await axios.get(`${baseURL}api/v1/admin/get-superadmins`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      const admins = extractAdmins(response.data);
      const currentId = getCurrentUserId();
      const currentMobile = normalizeDigits(getCurrentUserMobile());
      const currentName = (getCurrentUserName() || "").trim().toLowerCase();

      const sameMobile = (admin: any): boolean => {
        if (!currentMobile) return false;
        const adminMobileVal = adminMobile(admin);
        return Boolean(adminMobileVal && (
          adminMobileVal === currentMobile
          || adminMobileVal.endsWith(currentMobile)
          || currentMobile.endsWith(adminMobileVal)
        ));
      };
      const sameId = (admin: any): boolean => Boolean(currentId && adminId(admin) === currentId);
      const sameName = (admin: any): boolean => Boolean(
        currentName && String(admin?.name ?? "").trim().toLowerCase() === currentName
      );
      const hasRole = (admin: any): boolean => extractRole(admin) !== null;

      const matchedAdmin = admins.find((admin: any) => sameMobile(admin) && hasRole(admin))
        ?? admins.find((admin: any) => sameId(admin) && hasRole(admin))
        ?? admins.find((admin: any) => sameName(admin) && hasRole(admin))
        ?? admins.find((admin: any) => sameMobile(admin))
        ?? admins.find((admin: any) => sameId(admin))
        ?? admins.find((admin: any) => sameName(admin));

      if (!matchedAdmin) {
        const message = "Could not identify the signed-in admin in the backend admin list.";
        console.error(`[RoleProvider] ${message}`, { currentId, currentMobile, adminCount: admins.length });
        setErrorMessage(message);
        setStatus("error");
        return;
      }

      const resolvedRole = extractRole(matchedAdmin);
      if (!resolvedRole) {
        const adminKeys = Object.keys(matchedAdmin);
        const roleMasterKeys = matchedAdmin.role_master ? Object.keys(matchedAdmin.role_master) : "no role_master";
        const message = `No role data found on admin record. Admin keys: [${adminKeys.join(", ")}]. role_master keys: [${roleMasterKeys}].`;
        console.error(`[RoleProvider] ${message}`, matchedAdmin);
        setErrorMessage(message);
        setStatus("error");
        return;
      }

      setRole(resolvedRole);
      setCurrentRole(resolvedRole);
      setStatus("synced");
      setErrorMessage(null);

      const id = adminId(matchedAdmin);
      const mobile = adminMobile(matchedAdmin);
      if (id) setCurrentUserId(id);
      if (mobile) setCurrentUserMobile(mobile);
      if (matchedAdmin.name) {
        setCurrentUserName(String(matchedAdmin.name));
        setUserName(String(matchedAdmin.name));
      }
    } catch (error) {
      const message = "Role verification failed. Check the backend response and try again.";
      console.error(`[RoleProvider] ${message}`, error);
      setErrorMessage(message);
      setStatus("error");
    }
  }, [mode]);

  useEffect(() => {
    const handleSessionChanged = () => setSessionVersion((value) => value + 1);
    window.addEventListener("bharatgo-auth-changed", handleSessionChanged);
    return () => window.removeEventListener("bharatgo-auth-changed", handleSessionChanged);
  }, []);

  useEffect(() => {
    void refreshRole();
  }, [refreshRole, sessionVersion]);

  const isAuthenticated = Boolean(localStorage.getItem("userToken"));
  return (
    <RoleContext.Provider value={{
      role,
      status,
      userName,
      isAuthenticated,
      isSuperAdmin: role === "Super Admin",
      errorMessage,
      refreshRole,
    }}>
      {children}
    </RoleContext.Provider>
  );
}

export function storeLoginIdentity(response: any, mobile: string): void {
  const source = response?.user ?? response?.admin ?? response?.data ?? response;
  const id = firstValue(source, ["id", "admin_id", "adminId", "user_id", "userId"]);
  const responseMobile = firstValue(source, ["mobile_no", "mobileNo", "mobile", "phone", "phone_no", "phoneNumber"]);
  if (id !== undefined) setCurrentUserId(String(id));
  setCurrentUserMobile(normalizeDigits(responseMobile ?? mobile));
}
