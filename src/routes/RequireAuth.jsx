import { useContext } from "react";
import { Navigate, Outlet, useLocation } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";

export default function RequireAuth() {
  const { user, loading } = useContext(AuthContext);
  const location = useLocation();

  // while loading user state
  if (loading) {
    return <p>Loading...</p>;
  }

  // if not logged in → redirect to login
  if (!user) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  // otherwise continue to the protected route
  return <Outlet />;
}

