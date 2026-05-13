import React from "react";
import { Navigate, Route, Routes } from "react-router-dom";
import LoginPage from "./pages/LoginPage";
import HomePage from "./pages/HomePage";
import ResetPasswordPage from "./pages/ResetPasswordPage";
import LiveBerthingPage from "./pages/LiveBerthingPage";
import BerthAllocationPage from "./pages/BerthAllocationPage";
import ChartsPage from "./pages/ChartsPage";
import VesselNamePage from "./pages/VesselNamePage";
import NotFoundPage from "./pages/NotFoundPage";
import "./page-overrides.css";

import ProtectedRoute from "./components/ProtectedRoute";

export default function App() {
  return (
    <Routes>
      <Route path="/" element={<Navigate to="/login" replace />} />

      <Route path="/login" element={<LoginPage />} />
      <Route path="/reset-password" element={<ResetPasswordPage />} />
      
      {/* Protected Routes */}
      <Route path="/home" element={<ProtectedRoute><HomePage /></ProtectedRoute>} />
      <Route path="/live-berthing" element={<ProtectedRoute><LiveBerthingPage /></ProtectedRoute>} />
      <Route path="/berth-allocation" element={<ProtectedRoute><BerthAllocationPage /></ProtectedRoute>} />
      <Route path="/charts" element={<ProtectedRoute><ChartsPage /></ProtectedRoute>} />
      <Route path="/vessel-name" element={<ProtectedRoute><VesselNamePage /></ProtectedRoute>} />
      
      <Route path="/not-found" element={<NotFoundPage />} />

      <Route path="/login.html" element={<Navigate to="/login" replace />} />
      <Route path="/home.html" element={<Navigate to="/home" replace />} />
      <Route path="/reset-password.html" element={<Navigate to="/reset-password" replace />} />
      <Route path="/index.html" element={<Navigate to="/live-berthing" replace />} />
      <Route path="/berth-allocation.html" element={<Navigate to="/berth-allocation" replace />} />
      <Route path="/charts.html" element={<Navigate to="/charts" replace />} />
      <Route path="/vessel_name.html" element={<Navigate to="/vessel-name" replace />} />
      <Route path="/404.html" element={<Navigate to="/not-found" replace />} />

      <Route path="*" element={<Navigate to="/not-found" replace />} />
    </Routes>
  );
}
