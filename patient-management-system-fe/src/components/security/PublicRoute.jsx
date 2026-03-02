import { Navigate } from "react-router-dom";
import LoadingSpinner from "../common/LoadingSpinner";
import { useAuth } from "./AuthContext";

export default function PublicRoute({ children }) {
  const { userRole, loading } = useAuth();
  if (loading) {
    return (
      <div className="relative flex-1">
        {loading && <LoadingSpinner />}
      </div>
    )
  }

  if (userRole) {
    if (userRole === "admin") {
      return <Navigate to="/admin/dashboard" replace />;
    }
    if (userRole === "doctor") {
      return <Navigate to="/doctor/dashboard" replace />;
    }
    if (userRole === "patient") {
      return <Navigate to="/patient/dashboard" replace />;
    }
    if (userRole === "lab") {
      return <Navigate to="/lab/queue" replace />;
    }

    return <Navigate to="/login" replace />;
  }

  return children;
}