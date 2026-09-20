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

  // While role is being synced from the backend, show a loading shell.
  // This prevents redirecting a Super Admin before their role is confirmed.
  if (status === "loading") {
    return <LoadingShell />;
  }

  if (role !== "Super Admin") {
    return <Navigate to="/dashboard" replace />;
  }

  return <>{children}</>;
}
