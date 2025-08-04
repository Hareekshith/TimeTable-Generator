import React from "react";
import { Navigate, Outlet } from "react-router-dom";

const ProtectedRoute = () => {
  const canAccess = sessionStorage.getItem("canAccessTimetable") === "true";
  // If the user can access protected content, render child routes
  if (canAccess) {
    return <Outlet />;
  } 
  // Otherwise, redirect to login page
  return <Navigate to="/login" replace />;
};

export default ProtectedRoute;
