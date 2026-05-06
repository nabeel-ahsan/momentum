import React from "react";
import "./App.css";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import ListSessions from "./pages/ListSessions";
import LogIn from "./pages/LogIn";
import Register from "./pages/Register";
import AddSessions from "./pages/AddSessions";
import AuthProvider from "./context/AuthProvider";
import UIProvider from "./context/UIProvider";
import PrivateRoute from "./components/PrivateRoute";

function App() {
  return (
    <AuthProvider>
      <UIProvider>
        <BrowserRouter>
          <Routes>
            <Route path="/login" element={<LogIn />} />
            <Route path="/register" element={<Register />} />
            <Route element={<PrivateRoute />}>
              <Route path="/app" element={<ListSessions />} />
              <Route path="/add" element={<AddSessions />} />
            </Route>
          </Routes>
        </BrowserRouter>
      </UIProvider>
    </AuthProvider>
  );
}

export default App;
