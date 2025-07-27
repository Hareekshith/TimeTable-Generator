import React from "react";
import { Navigate, Outlet } from "react-router-dom";

const ProtectedRoute = () => {
  const canAccess = sessionStorage.getItem("canAccessTimetable") === "true";

  return canAccess ? <Outlet /> : <Navigate to="/details" replace />;
};

export default ProtectedRoute;
