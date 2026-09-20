import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { RootState } from "@/store";
import axios from "axios";
import {
  getCurrentRole,
  setCurrentRole,
  setCurrentUserName,
  setCurrentUserMobile,
  canonicalizeRole,
  getCurrentUserName,
  getCurrentUserMobile,
  type Role,
} from "@/lib/roles";

/**
 * On mount, fetches the admin list from the backend and syncs the
 * current user's role into localStorage. This ensures the role is
 * always correct even if:
 * - The user logged in before role code was deployed
 * - The initial login role fetch failed
 * - The user's role was changed server-side
 *
 * Returns the current role as React state so components re-render
 * when the role is updated.
 */
export function useRoleSync(): Role {
  const [role, setRole] = useState<Role>(() => getCurrentRole());
  const mode = useSelector((state: RootState) => state.modal.mode);

  useEffect(() => {
    const token = localStorage.getItem("userToken");
    if (!token) return;

    const baseURL =
      mode === "dev"
        ? import.meta.env.VITE_BACKEND_DEV_URL
        : import.meta.env.VITE_BACKEND_PROD_URL;

    async function syncRole() {
      try {
        const response = await axios.get(
          `${baseURL}api/v1/admin/get-superadmins`,
          { headers: { Authorization: `Bearer ${token}` } }
        );
        const admins = response.data.data || [];
        if (admins.length === 0) return;

        const currentMobile = getCurrentUserMobile();
        const currentName = getCurrentUserName();
        const storedRole = getCurrentRole();

        // Find the current user by mobile number first (most reliable)
        let me: any = null;
        if (currentMobile) {
          me = admins.find(
            (a: any) =>
              a.mobile_no && String(a.mobile_no) === String(currentMobile)
          );
        }

        // Fall back to name match
        if (!me && currentName) {
          me = admins.find(
            (a: any) =>
              a.name &&
              a.name.toLowerCase().trim() === currentName.toLowerCase().trim()
          );
        }

        // If no match but we're already Super Admin, try to find a Super Admin
        if (!me && storedRole === "Super Admin") {
          me = admins.find(
            (a: any) =>
              canonicalizeRole(a?.role_master?.role_name) === "Super Admin"
          );
        }

        // If still no match, skip — don't downgrade a known Super Admin
        if (!me) return;

        const roleName = me?.role_master?.role_name;
        if (roleName) {
          const newRole = canonicalizeRole(roleName);
          setCurrentRole(roleName);
          setRole(newRole);
          if (me?.name && me.name !== currentName) {
            setCurrentUserName(me.name);
          }
          if (me?.mobile_no && String(me.mobile_no) !== currentMobile) {
            setCurrentUserMobile(String(me.mobile_no));
          }
        }
      } catch (err) {
        console.error("Role sync failed:", err);
      }
    }

    syncRole();
  }, [mode]);

  return role;
}
