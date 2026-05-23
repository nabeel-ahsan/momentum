import React, { useState } from "react";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import ListSessions from "./pages/ListSessions";
import LogIn from "./pages/LogIn";
import Register from "./pages/Register";
import AuthProvider from "./context/AuthProvider";
import UIProvider from "./context/UIProvider";
import PrivateRoute from "./components/PrivateRoute";
import Profile from "./pages/Profile";
import DashboardLayout from "./components/DashboardLayout";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

function App() {
  return (
    <AuthProvider>
      <UIProvider>
        <ToastContainer theme="dark" />
        <BrowserRouter>
          <Routes>
            <Route path="/login" element={<LogIn />} />
            <Route path="/register" element={<Register />} />

            <Route element={<PrivateRoute />}>
              <Route element={<DashboardLayout />}>
                <Route path="/app" element={<ListSessions />} />
                <Route path="/profile" element={<Profile />} />
              </Route>
            </Route>

            <Route path="*" element={<Navigate to="/app" replace />} />
          </Routes>
        </BrowserRouter>
      </UIProvider>
    </AuthProvider>
  );
}

export default App;
