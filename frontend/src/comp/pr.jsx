import React from "react";
import { Navigate, Outlet } from "react-router-dom";
import { useAuthState } from "react-firebase-hooks/auth";
import { auth } from "../firebase"; // adjust path as needed

const ProtectedRoute = () => {
  const [user, loading] = useAuthState(auth);

  if (loading) return null; // Or show spinner
  if (user) return <Outlet />;
  return <Navigate to="/login" replace />;
};

export default ProtectedRoute;

