import { Navigate } from "react-router-dom";
import { useRole } from "@/components/RoleProvider";

interface ProtectedRouteProps {
  children: React.ReactNode;
}

function LoadingShell() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-gray-50">
      <div className="flex flex-col items-center gap-3">
        <div className="h-8 w-8 animate-spin rounded-full border-4 border-gray-200 border-t-blue-600" />
        <p className="text-sm text-gray-500">Verifying access…</p>
      </div>
    </div>
  );
}

export function SuperAdminRoute({ children }: ProtectedRouteProps) {
  const { role, status } = useRole();

  // While the role is being synced or errored, do NOT redirect.
  // A Super Admin must never be bounced before their role is confirmed.
  if (status === "loading") return <LoadingShell />;
  if (status === "error") return <LoadingShell />;

  if (role !== "Super Admin") return <Navigate to="/dashboard" replace />;
  return <>{children}</>;
}
