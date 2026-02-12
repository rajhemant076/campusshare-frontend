import React, { useState, useEffect } from "react";
import api from "../../api/api";
import { FiSave, FiX, FiUser, FiMail, FiBook, FiLayers, FiPhone, FiHash, FiCalendar, FiHome, FiFileText, FiShield } from "react-icons/fi";

const EditUserModal = ({ userId, onClose, onUserUpdated }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    branch: "",
    semester: "",
    phone: "",
    enrollmentId: "",
    graduationYear: "",
    college: "",
    bio: "",
    accountStatus: "active",
    role: "student"
  });
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const branches = ['CSE', 'ECE', 'EEE', 'MECH', 'CIVIL', 'IT', 'OTHER'];
  const semesters = [1, 2, 3, 4, 5, 6, 7, 8];
  const graduationYears = [2024, 2025, 2026, 2027, 2028, 2029, 2030];
  const accountStatuses = ['active', 'suspended', 'deactivated'];

  useEffect(() => {
    fetchUser();
  }, [userId]);

  const fetchUser = async () => {
    setLoading(true);
    try {
      const res = await api.get(`/admin/users/${userId}`);
      const userData = res.data.user;
      setUser(userData);
      setFormData({
        name: userData.name || "",
        email: userData.email || "",
        branch: userData.branch || "",
        semester: userData.semester || "",
        phone: userData.phone || "",
        enrollmentId: userData.enrollmentId || "",
        graduationYear: userData.graduationYear || "",
        college: userData.college || "",
        bio: userData.bio || "",
        accountStatus: userData.accountStatus || "active",
        role: userData.role || "student"
      });
    } catch (error) {
      console.error("Fetch user error:", error);
      setError("Failed to fetch user details");
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");
    setSaving(true);

    try {
      const res = await api.put(`/admin/users/${userId}`, formData);
      setSuccess("User updated successfully!");
      if (onUserUpdated) onUserUpdated(res.data.user);
      
      // Auto-hide success message
      setTimeout(() => setSuccess(""), 3000);
    } catch (error) {
      console.error("Update user error:", error);
      setError(error.response?.data?.message || "Failed to update user");
    } finally {
      setSaving(false);
    }
  };

  const handleResetPassword = async () => {
    const newPassword = prompt("Enter new password (min 6 characters):");
    if (!newPassword) return;
    if (newPassword.length < 6) {
      alert("Password must be at least 6 characters");
      return;
    }

    try {
      await api.put(`/admin/users/${userId}/reset-password`, { newPassword });
      alert("Password reset successfully!");
    } catch (error) {
      console.error("Reset password error:", error);
      alert(error.response?.data?.message || "Failed to reset password");
    }
  };

  const handleToggleStatus = async () => {
    try {
      const res = await api.put(`/admin/users/${userId}/toggle-status`);
      setFormData(prev => ({ ...prev, accountStatus: res.data.accountStatus }));
      alert(`User ${res.data.accountStatus === 'active' ? 'activated' : 'suspended'} successfully`);
    } catch (error) {
      console.error("Toggle status error:", error);
      alert(error.response?.data?.message || "Failed to toggle status");
    }
  };

  if (loading) {
    return (
      <div style={{
        position: "fixed",
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        background: "rgba(0,0,0,0.5)",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        zIndex: 2000
      }}>
        <div style={{ background: "white", padding: "2rem", borderRadius: "1rem" }}>
          <div className="spinner"></div>
        </div>
      </div>
    );
  }

  return (
    <div style={{
      position: "fixed",
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      background: "rgba(0,0,0,0.5)",
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      zIndex: 2000,
      padding: "1rem",
      overflow: "auto"
    }}>
      <div style={{
        background: "white",
        borderRadius: "1rem",
        maxWidth: "800px",
        width: "100%",
        maxHeight: "90vh",
        overflow: "auto",
        border: "4px solid var(--text-dark)",
        boxShadow: "var(--shadow-brutal)"
      }}>
        <div style={{ padding: "2rem" }}>
          <div className="flex-between" style={{ marginBottom: "1.5rem" }}>
            <div>
              <h2 style={{ fontSize: "1.75rem", marginBottom: "0.25rem" }}>
                <FiUser style={{ display: "inline", marginRight: "0.5rem" }} />
                Edit User
              </h2>
              <p style={{ color: "var(--text-light)" }}>
                {user?.email}
              </p>
            </div>
            <button 
              onClick={onClose}
              className="btn btn-sm btn-outline"
            >
              <FiX /> Close
            </button>
          </div>

          {error && (
            <div className="alert alert-error" style={{ marginBottom: "1.5rem" }}>
              {error}
            </div>
          )}

          {success && (
            <div className="alert alert-success" style={{ marginBottom: "1.5rem" }}>
              {success}
            </div>
          )}

          <form onSubmit={handleSubmit}>
            <div style={{ marginBottom: "2rem" }}>
              <h3 style={{ fontSize: "1.2rem", marginBottom: "1rem", color: "var(--primary)" }}>
                Basic Information
              </h3>
              <div className="grid" style={{ gridTemplateColumns: "repeat(2, 1fr)", gap: "1.5rem" }}>
                <div className="form-group">
                  <label className="form-label">
                    <FiUser /> Full Name *
                  </label>
                  <input
                    type="text"
                    name="name"
                    className="form-input"
                    value={formData.name}
                    onChange={handleChange}
                    required
                  />
                </div>
                <div className="form-group">
                  <label className="form-label">
                    <FiMail /> Email *
                  </label>
                  <input
                    type="email"
                    name="email"
                    className="form-input"
                    value={formData.email}
                    onChange={handleChange}
                    required
                  />
                </div>
              </div>
            </div>

            <div style={{ marginBottom: "2rem" }}>
              <h3 style={{ fontSize: "1.2rem", marginBottom: "1rem", color: "var(--secondary)" }}>
                Academic Information
              </h3>
              <div className="grid" style={{ gridTemplateColumns: "repeat(2, 1fr)", gap: "1.5rem" }}>
                <div className="form-group">
                  <label className="form-label">
                    <FiBook /> Branch *
                  </label>
                  <select
                    name="branch"
                    className="form-select"
                    value={formData.branch}
                    onChange={handleChange}
                    required
                  >
                    <option value="">Select Branch</option>
                    {branches.map(branch => (
                      <option key={branch} value={branch}>{branch}</option>
                    ))}
                  </select>
                </div>
                <div className="form-group">
                  <label className="form-label">
                    <FiLayers /> Semester *
                  </label>
                  <select
                    name="semester"
                    className="form-select"
                    value={formData.semester}
                    onChange={handleChange}
                    required
                  >
                    <option value="">Select Semester</option>
                    {semesters.map(sem => (
                      <option key={sem} value={sem}>Semester {sem}</option>
                    ))}
                  </select>
                </div>
                <div className="form-group">
                  <label className="form-label">
                    <FiHash /> Enrollment ID
                  </label>
                  <input
                    type="text"
                    name="enrollmentId"
                    className="form-input"
                    value={formData.enrollmentId}
                    onChange={handleChange}
                    placeholder="e.g., 2021CSE001"
                  />
                </div>
                <div className="form-group">
                  <label className="form-label">
                    <FiCalendar /> Graduation Year
                  </label>
                  <select
                    name="graduationYear"
                    className="form-select"
                    value={formData.graduationYear}
                    onChange={handleChange}
                  >
                    <option value="">Select Year</option>
                    {graduationYears.map(year => (
                      <option key={year} value={year}>{year}</option>
                    ))}
                  </select>
                </div>
                <div className="form-group">
                  <label className="form-label">
                    <FiHome /> College
                  </label>
                  <input
                    type="text"
                    name="college"
                    className="form-input"
                    value={formData.college}
                    onChange={handleChange}
                    placeholder="University/College name"
                  />
                </div>
                <div className="form-group">
                  <label className="form-label">
                    <FiPhone /> Phone
                  </label>
                  <input
                    type="tel"
                    name="phone"
                    className="form-input"
                    value={formData.phone}
                    onChange={handleChange}
                    placeholder="+1 234 567 8900"
                  />
                </div>
              </div>
            </div>

            <div style={{ marginBottom: "2rem" }}>
              <h3 style={{ fontSize: "1.2rem", marginBottom: "1rem", color: "var(--accent)" }}>
                <FiFileText /> Bio
              </h3>
              <div className="form-group">
                <textarea
                  name="bio"
                  className="form-textarea"
                  value={formData.bio}
                  onChange={handleChange}
                  placeholder="User bio..."
                  rows="3"
                  maxLength={500}
                />
                <p style={{ fontSize: "0.75rem", color: "var(--text-light)", textAlign: "right" }}>
                  {formData.bio.length}/500 characters
                </p>
              </div>
            </div>

            <div style={{ marginBottom: "2rem" }}>
              <h3 style={{ fontSize: "1.2rem", marginBottom: "1rem", color: "var(--warning)" }}>
                <FiShield /> Account Settings
              </h3>
              <div className="grid" style={{ gridTemplateColumns: "repeat(2, 1fr)", gap: "1.5rem" }}>
                <div className="form-group">
                  <label className="form-label">Account Status</label>
                  <select
                    name="accountStatus"
                    className="form-select"
                    value={formData.accountStatus}
                    onChange={handleChange}
                  >
                    {accountStatuses.map(status => (
                      <option key={status} value={status}>
                        {status.charAt(0).toUpperCase() + status.slice(1)}
                      </option>
                    ))}
                  </select>
                </div>
                <div className="form-group">
                  <label className="form-label">User Role</label>
                  <select
                    name="role"
                    className="form-select"
                    value={formData.role}
                    onChange={handleChange}
                    disabled
                  >
                    <option value="student">Student</option>
                  </select>
                  <p style={{ fontSize: "0.75rem", color: "var(--text-light)", marginTop: "0.25rem" }}>
                    Role cannot be changed
                  </p>
                </div>
              </div>
            </div>

            <div className="flex-between" style={{ marginTop: "2rem" }}>
              <div className="flex gap-1">
                <button
                  type="submit"
                  className="btn btn-primary"
                  disabled={saving}
                >
                  <FiSave /> {saving ? "Saving..." : "Save Changes"}
                </button>
                <button
                  type="button"
                  onClick={handleResetPassword}
                  className="btn btn-outline"
                >
                  Reset Password
                </button>
                <button
                  type="button"
                  onClick={handleToggleStatus}
                  className="btn btn-outline"
                  style={{ 
                    borderColor: formData.accountStatus === 'active' ? 'var(--warning)' : 'var(--success)',
                    color: formData.accountStatus === 'active' ? 'var(--warning)' : 'var(--success)'
                  }}
                >
                  {formData.accountStatus === 'active' ? 'Suspend Account' : 'Activate Account'}
                </button>
              </div>
              <button
                type="button"
                onClick={onClose}
                className="btn btn-outline"
              >
                Cancel
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default EditUserModal;