import {
  createContext,
  useContext,
  useEffect,
  useState,
  useCallback,
  type ReactNode,
} from "react";
import { useSelector } from "react-redux";
import { RootState } from "@/store";
import axios from "axios";
import {
  canonicalizeRole,
  getCurrentRole,
  setCurrentRole,
  getCurrentUserName,
  setCurrentUserName,
  getCurrentUserMobile,
  setCurrentUserMobile,
  clearCurrentUser,
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

function normalizeDigits(s: string | null | undefined): string {
  if (!s) return "";
  return String(s).replace(/\D/g, "");
}

/**
 * Extracts a canonical role from an admin object, checking every
 * possible field shape the backend might return:
 *   role_master.role_name, role_name, role, roleName, role_id, roleId
 */
function extractRole(admin: any): Role {
  if (!admin) return "Team";

  const direct =
    admin.role_name ||
    admin.roleName ||
    admin.role ||
    admin.role_master?.role_name ||
    admin.role_master?.name ||
    null;

  if (direct) return canonicalizeRole(String(direct));

  const idVal = admin.role_id ?? admin.roleId ?? admin.role_master?.role_id ?? admin.role_master?.id;
  if (idVal != null) {
    const idStr = String(idVal);
    if (idStr === "3") return "Super Admin";
    if (idStr === "4") return "Team";
  }

  return "Team";
}

export function RoleProvider({ children }: { children: ReactNode }) {
  const [role, setRole] = useState<Role>(() => getCurrentRole());
  const [status, setStatus] = useState<RoleStatus>("loading");
  const [userName, setUserName] = useState<string | null>(() => getCurrentUserName());
  const mode = useSelector((state: RootState) => state.modal.mode);

  const token = typeof window !== "undefined" ? localStorage.getItem("userToken") : null;

  const syncRole = useCallback(async () => {
    if (!token) {
      setStatus("synced");
      return;
    }

    const baseURL =
      mode === "dev"
        ? import.meta.env.VITE_BACKEND_DEV_URL
        : import.meta.env.VITE_BACKEND_PROD_URL;

    try {
      const response = await axios.get(`${baseURL}api/v1/admin/get-superadmins`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      const admins = response.data?.data || [];
      if (admins.length === 0) {
        setStatus("synced");
        return;
      }

      const currentMobile = normalizeDigits(getCurrentUserMobile());
      const currentName = (getCurrentUserName() || "").toLowerCase().trim();
      const storedRole = getCurrentRole();

      // Match by mobile number first (most reliable)
      let me: any = null;
      if (currentMobile) {
        me = admins.find(
          (a: any) => normalizeDigits(a.mobile_no) === currentMobile
        );
      }

      // Fall back to name match
      if (!me && currentName) {
        me = admins.find(
          (a: any) =>
            a.name && a.name.toLowerCase().trim() === currentName
        );
      }

      // If no match but we're already Super Admin, find the Super Admin in the list
      if (!me && storedRole === "Super Admin") {
        me = admins.find((a: any) => extractRole(a) === "Super Admin");
      }

      // If still no match, don't downgrade — keep the stored role
      if (!me) {
        setStatus("synced");
        return;
      }

      const newRole = extractRole(me);
      setCurrentRole(me.role_master?.role_name || String(newRole));
      setRole(newRole);

      if (me.name) {
        setCurrentUserName(me.name);
        setUserName(me.name);
      }
      if (me.mobile_no) {
        setCurrentUserMobile(normalizeDigits(me.mobile_no));
      }

      setStatus("synced");
    } catch (err) {
      console.error("[RoleProvider] Role sync failed:", err);
      // Keep the last known role — only downgrade if it was already Team
      setStatus("error");
    }
  }, [token, mode]);

  useEffect(() => {
    syncRole();
  }, [syncRole]);

  const value: RoleContextValue = {
    role,
    status,
    userName,
    isAuthenticated: !!token,
    isSuperAdmin: role === "Super Admin",
    refreshRole: syncRole,
  };

  return <RoleContext.Provider value={value}>{children}</RoleContext.Provider>;
}
