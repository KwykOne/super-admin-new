import { Navigate } from "react-router-dom";
import { useRole } from "@/components/RoleProvider";

interface ProtectedRouteProps {
  children: React.ReactNode;
}

function RoleVerificationState({ errorMessage, onRetry }: { errorMessage: string | null; onRetry: () => void }) {
  return (
    <div className="flex min-h-screen items-center justify-center bg-gray-50 p-6">
      <div className="w-full max-w-md rounded-lg border bg-white p-6 text-center shadow-sm">
        <h1 className="text-lg font-semibold text-gray-900">Verifying access</h1>
        <p className="mt-2 text-sm text-gray-600">
          {errorMessage || "Checking your backend admin role…"}
        </p>
        <button
          type="button"
          onClick={onRetry}
          className="mt-4 rounded-md bg-bharatgo-primary px-4 py-2 text-sm font-medium text-white hover:opacity-90"
        >
          Retry verification
        </button>
      </div>
    </div>
  );
}

export function SuperAdminRoute({ children }: ProtectedRouteProps) {
  const { role, status, errorMessage, refreshRole } = useRole();

  if (status === "loading" || status === "error") {
    return <RoleVerificationState errorMessage={errorMessage} onRetry={() => void refreshRole()} />;
  }

  if (role !== "Super Admin") return <Navigate to="/dashboard" replace />;
  return <>{children}</>;
}
