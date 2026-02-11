import React from "react";
import { Routes, Route } from "react-router-dom";

import Navbar from "./components/Navbar";
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
        {/* Public */}
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />

        {/* Student Protected */}
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

        {/* Admin Protected */}
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
      </Routes>
    </>
  );
};

export default App;