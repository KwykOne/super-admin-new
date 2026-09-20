import { Navigate } from "react-router-dom";
import { useRoleSync } from "@/hooks/useRoleSync";

interface ProtectedRouteProps {
  children: React.ReactNode;
}

export function SuperAdminRoute({ children }: ProtectedRouteProps) {
  const role = useRoleSync();
  if (role !== "Super Admin") {
    return <Navigate to="/dashboard" replace />;
  }
  return <>{children}</>;
}
