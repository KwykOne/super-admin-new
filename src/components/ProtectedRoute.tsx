import { Navigate } from "react-router-dom";
import { getCurrentRole } from "@/lib/roles";

interface ProtectedRouteProps {
  children: React.ReactNode;
}

export function SuperAdminRoute({ children }: ProtectedRouteProps) {
  const role = getCurrentRole();
  if (role !== "Super Admin") {
    return <Navigate to="/dashboard" replace />;
  }
  return <>{children}</>;
}
