import { Routes, Route, Navigate } from "react-router-dom";
import React, { useEffect } from "react";
import Home from "./pages/home";
import Login from "./pages/login";
import Details from "./pages/details";
import TimetablePage from "./pages/timetable";
import ProtectedRoute from "./comp/pr";

export default function AppRoutes() {
  useEffect(() => {
    const handleBeforeUnload = () => {
      localStorage.removeItem("authToken");
    };
    window.addEventListener("beforeunload", handleBeforeUnload);
    return () => {
      window.removeEventListener("beforeunload", handleBeforeUnload);
    };
  }, []);
  return (
    <Routes>
      <Route path="/" element={<Navigate to="/home" replace />} />
      
      <Route path="/login" element={<Login />} />
      
        <Route path="/home" element={<Home />} />
      <Route element={<ProtectedRoute />}>
        <Route path="/details" element={<Details />} />
        <Route path="/timetable" element={<TimetablePage />} />
      </Route>
      
      <Route path="*" element={<Navigate to="/home" replace />} />
    </Routes>
  );
}

