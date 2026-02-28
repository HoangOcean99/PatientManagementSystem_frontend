import { Navigate } from "react-router-dom";
import LoadingSpinner from "../common/LoadingSpinner";
import { useAuth } from "./AuthContext";

export default function ProtectedRoute({ children, allowedRoles }) {
  const { userRole, loading } = useAuth();
  if (loading) {
    return <LoadingSpinner />;
  }

  if (!userRole) {
    return <Navigate to="/login" replace />;
  }

  if (allowedRoles && !allowedRoles.includes(userRole)) {
    return <Navigate to="/login" replace />;
  }

  return children;
}