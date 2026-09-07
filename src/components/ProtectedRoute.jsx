/**
 * Role-based routing guard.
 *   <ProtectedRoute>                — any authenticated user
 *   <ProtectedRoute requiredRole="admin"> — admins only
 *
 * Rules:
 *   guest visits a protected page   → /login (remembers origin)
 *   user visits /admin              → /user
 *   admin visits customer /user     → /admin
 *
 * These checks exist purely for UX/navigation. Django enforces the
 * real authorization on every API call.
 */

import { Navigate, useLocation } from "react-router-dom";
import { useAuth } from "@/context/AuthContext";
import { PageLoader } from "./Loading";

export default function ProtectedRoute({ children, requiredRole }) {
  const { isAuthenticated, isAdmin, initializing } = useAuth();
  const location = useLocation();

  if (initializing) {
    return (
      <div className="container" style={{ paddingTop: "22vh" }}>
        <PageLoader label="Checking your session…" />
      </div>
    );
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" state={{ from: location.pathname + location.search }} replace />;
  }

  if (requiredRole === "admin" && !isAdmin) {
    return <Navigate to="/user" replace />;
  }

  if (requiredRole === "user" && isAdmin) {
    return <Navigate to="/admin" replace />;
  }

  return children;
}

/** Wraps login/register/verify — already-authenticated users skip them. */
export function GuestOnly({ children }) {
  const { isAuthenticated, role, initializing } = useAuth();
  const location = useLocation();
  if (initializing) return null;
  if (isAuthenticated) {
    const dest = (location.state && location.state.from) || (role === "admin" ? "/admin" : "/user");
    return <Navigate to={dest === "/login" ? (role === "admin" ? "/admin" : "/user") : dest} replace />;
  }
  return children;
}
