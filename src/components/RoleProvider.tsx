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
  getCurrentRole,
  setCurrentRole,
  getCurrentUserId,
  setCurrentUserId,
  getCurrentUserName,
  setCurrentUserName,
  getCurrentUserMobile,
  setCurrentUserMobile,
  type Role,
} from "@/lib/roles";

type RoleStatus = "loading" | "synced" | "error";

interface RoleContextValue {
  role: Role;
  status: RoleStatus;
  userName: string | null;
  isAuthenticated: boolean;
  isSuperAdmin: boolean;
  refreshRole: () => Promise<void>;
}

const RoleContext = createContext<RoleContextValue>({
  role: "Team",
  status: "loading",
  userName: null,
  isAuthenticated: false,
  isSuperAdmin: false,
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
    if (record?.[key] !== undefined && record?.[key] !== null && record[key] !== "") {
      return record[key];
    }
  }
  return undefined;
}

function adminId(admin: any): string {
  return String(firstValue(admin, ["id", "admin_id", "adminId", "user_id", "userId"]) ?? "");
}

function adminMobile(admin: any): string {
  return normalizeDigits(
    firstValue(admin, ["mobile_no", "mobileNo", "mobile", "phone", "phone_no", "phoneNumber"])
  );
}

function extractRoleValue(admin: any): unknown {
  return firstValue(admin, ["role_name", "roleName", "role", "role_id", "roleId"]) ??
    firstValue(admin?.role_master, ["role_name", "roleName", "name", "role_id", "roleId", "id"]);
}

function extractRole(admin: any): Role | null {
  const value = extractRoleValue(admin);
  if (value === undefined) return null;
  return canonicalizeRole(value as string | number);
}

function getLoginIdentity(response: any): { id: string; mobile: string } {
  const source = response?.user ?? response?.admin ?? response?.data ?? response;
  return {
    id: String(firstValue(source, ["id", "admin_id", "adminId", "user_id", "userId"]) ?? ""),
    mobile: normalizeDigits(
      firstValue(source, ["mobile_no", "mobileNo", "mobile", "phone", "phone_no", "phoneNumber"])
    ),
  };
}

export function RoleProvider({ children }: { children: ReactNode }) {
  const [role, setRole] = useState<Role>(() => getCurrentRole());
  const [status, setStatus] = useState<RoleStatus>("loading");
  const [userName, setUserName] = useState<string | null>(() => getCurrentUserName());
  const [tokenVersion, setTokenVersion] = useState(0);
  const mode = useSelector((state: RootState) => state.modal.mode);

  const refreshRole = useCallback(async () => {
    const token = localStorage.getItem("userToken");
    if (!token) {
      setStatus("synced");
      return;
    }

    setStatus("loading");
    const baseURL = mode === "dev"
      ? import.meta.env.VITE_BACKEND_DEV_URL
      : import.meta.env.VITE_BACKEND_PROD_URL;

    try {
      const response = await axios.get(`${baseURL}api/v1/admin/get-superadmins`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      const admins = Array.isArray(response.data?.data) ? response.data.data : [];
      const currentId = getCurrentUserId();
      const currentMobile = normalizeDigits(getCurrentUserMobile());
      const currentName = (getCurrentUserName() || "").trim().toLowerCase();

      const matchedAdmin = admins.find((admin: any) => {
        const id = adminId(admin);
        const mobile = adminMobile(admin);
        return (currentId && id === currentId) || (currentMobile && mobile === currentMobile);
      }) ?? admins.find((admin: any) =>
        currentName && String(admin?.name ?? "").trim().toLowerCase() === currentName
      );

      if (!matchedAdmin) {
        console.error("[RoleProvider] Could not identify the authenticated admin in get-superadmins.");
        setStatus("error");
        return;
      }

      const resolvedRole = extractRole(matchedAdmin);
      if (!resolvedRole) {
        console.error("[RoleProvider] Authenticated admin record has no role data.", matchedAdmin);
        setStatus("error");
        return;
      }

      setRole(resolvedRole);
      setCurrentRole(resolvedRole);
      setStatus("synced");

      const id = adminId(matchedAdmin);
      const mobile = adminMobile(matchedAdmin);
      if (id) setCurrentUserId(id);
      if (mobile) setCurrentUserMobile(mobile);
      if (matchedAdmin.name) {
        setCurrentUserName(String(matchedAdmin.name));
        setUserName(String(matchedAdmin.name));
      }
    } catch (error) {
      console.error("[RoleProvider] Role sync failed:", error);
      setStatus("error");
    }
  }, [mode]);

  useEffect(() => {
    const handleSessionChanged = () => setTokenVersion((value) => value + 1);
    window.addEventListener("bharatgo-auth-changed", handleSessionChanged);
    return () => window.removeEventListener("bharatgo-auth-changed", handleSessionChanged);
  }, []);

  useEffect(() => {
    void refreshRole();
  }, [refreshRole, tokenVersion]);

  const isAuthenticated = Boolean(localStorage.getItem("userToken"));
  return (
    <RoleContext.Provider value={{
      role,
      status,
      userName,
      isAuthenticated,
      isSuperAdmin: role === "Super Admin",
      refreshRole,
    }}>
      {children}
    </RoleContext.Provider>
  );
}

export function storeLoginIdentity(response: any, mobile: string): void {
  const identity = getLoginIdentity(response);
  if (identity.id) setCurrentUserId(identity.id);
  setCurrentUserMobile(identity.mobile || normalizeDigits(mobile));
}
