import React from "react";
import { Navigate, Outlet } from "react-router-dom";

const ProtectedRoute = () => {
  const token = sessionStorage.getItem("authToken");
  const submit = sessionStorage.getItem("submitted");
  if (!token) {
    return <Navigate to="/login" replace />;
  } 
  if (!submitted){
    return <Navigate to="/details" replace />;
  }
  return <Outlet />;
};

export default ProtectedRoute;

