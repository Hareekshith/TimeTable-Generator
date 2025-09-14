import React from "react";
import { Navigate, Outlet } from "react-router-dom";

const ProtectedRoute = () => {
  const token = sessionStorage.getItem("authToken");
  if (!token) {
    return <Navigate to="/home" replace />;
  } 
  return <Outlet />;
};

export default ProtectedRoute;

