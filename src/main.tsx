import React from "react";
import ReactDOM from "react-dom/client";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import "./index.css";

import Login from "./pages/Login";
import SignUp from "./pages/SignUp";
import Services from "./pages/Services";
import Bookings from "./pages/Bookings";
import Profile from "./pages/Profile";

// Helper to check if user is logged in
const isLoggedIn = () => localStorage.getItem("isLoggedIn") === "true";

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <BrowserRouter>
      <Routes>
        {/* Default route redirects based on login status */}
        <Route
          path="/"
          element={<Navigate to={isLoggedIn() ? "/services" : "/login"} />}
        />

        {/* Auth pages */}
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<SignUp />} />

        {/* Protected pages */}
        <Route
          path="/services"
          element={isLoggedIn() ? <Services /> : <Navigate to="/login" />}
        />
        <Route
          path="/bookings"
          element={isLoggedIn() ? <Bookings /> : <Navigate to="/login" />}
        />
        <Route
          path="/profile"
          element={isLoggedIn() ? <Profile /> : <Navigate to="/login" />}
        />
      </Routes>
    </BrowserRouter>
  </React.StrictMode>
);
