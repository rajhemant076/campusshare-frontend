import React from "react";
import { Routes, Route, Navigate } from "react-router-dom";

import Navbar from "./components/Navbar";
import Footer from "./components/Footer"; // ✅ ADDED: Footer component
import ProtectedRoute from "./components/ProtectedRoute";

import Home from "./pages/Home";
import Login from "./pages/Login";
import Signup from "./pages/Signup";
import Upload from "./pages/Upload";
import Profile from "./pages/Profile";
import Bookmarks from "./pages/Bookmarks";

import AdminDashboard from "./pages/admin/AdminDashboard";
import PendingResources from "./pages/admin/PendingResources";
import ApprovedResources from "./pages/admin/ApprovedResources";
import RejectedResources from "./pages/admin/RejectedResources";
import UserManagement from "./pages/admin/UserManagement";

const App = () => {
  return (
    <>
      <Navbar />
      <Routes>
        {/* 🔓 PUBLIC ROUTES */}
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />

        {/* 🔐 STUDENT PROTECTED ROUTES */}
        <Route
          path="/upload"
          element={
            <ProtectedRoute>
              <Upload />
            </ProtectedRoute>
          }
        />
        <Route
          path="/profile"
          element={
            <ProtectedRoute>
              <Profile />
            </ProtectedRoute>
          }
        />
        <Route
          path="/bookmarks"
          element={
            <ProtectedRoute>
              <Bookmarks />
            </ProtectedRoute>
          }
        />

        {/* 🛡️ ADMIN PROTECTED ROUTES */}
        <Route
          path="/admin"
          element={
            <ProtectedRoute adminOnly={true}>
              <AdminDashboard />
            </ProtectedRoute>
          }
        />
        <Route
          path="/admin/pending"
          element={
            <ProtectedRoute adminOnly={true}>
              <PendingResources />
            </ProtectedRoute>
          }
        />
        <Route
          path="/admin/approved"
          element={
            <ProtectedRoute adminOnly={true}>
              <ApprovedResources />
            </ProtectedRoute>
          }
        />
        <Route
          path="/admin/rejected"
          element={
            <ProtectedRoute adminOnly={true}>
              <RejectedResources />
            </ProtectedRoute>
          }
        />
        <Route
          path="/admin/users"
          element={
            <ProtectedRoute adminOnly={true}>
              <UserManagement />
            </ProtectedRoute>
          }
        />

        {/* 🔀 404 - Redirect to home */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
      <Footer /> {/* ✅ ADDED: Footer appears on ALL pages */}
    </>
  );
};

export default App;