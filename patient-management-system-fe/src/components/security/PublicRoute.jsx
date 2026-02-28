import { Navigate } from "react-router-dom";
import LoadingSpinner from "../common/LoadingSpinner";
import { useAuth } from "./AuthContext";

export default function PublicRoute({ children }) {
  const { userRole, loading } = useAuth();
  if (loading) {
    return <LoadingSpinner />;
  }

  if (userRole) {
    if (userRole === "admin") {
      return <Navigate to="/admin/dashboard" replace />;
    }

    if (userRole === "doctor") {
      return <Navigate to="/doctor/dashboard" replace />;
    }

    return <Navigate to="/login" replace />;
  }

  return children;
}