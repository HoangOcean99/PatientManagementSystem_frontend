import { Navigate } from "react-router-dom";
import LoadingSpinner from "../common/LoadingSpinner";
import { useAuth } from "./AuthContext";
import { supabase } from "../../../supabaseClient";

export default function ProtectedRoute({ children, allowedRoles }) {
  const { userId, userRole, loading } = useAuth();

  if (loading || !supabase.auth.getSession()) {
    return (
      <LoadingSpinner />
    )
  }

  if (!userRole) {
    return <Navigate to="/login" replace />;
  }

  if (allowedRoles && !allowedRoles.includes(userRole)) {
    return <Navigate to="/login" replace />;
  }

  return children;
}