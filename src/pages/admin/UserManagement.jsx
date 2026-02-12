import React, { useState, useEffect } from "react";
import api from "../../api/api";
import { FiTrash2, FiUser, FiEdit2, FiShield, FiMail, FiBook, FiLayers } from "react-icons/fi";
import EditUserModal from "./EditUserModal";

const UserManagement = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedUserId, setSelectedUserId] = useState(null);
  const [showEditModal, setShowEditModal] = useState(false);

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    setLoading(true);
    try {
      const res = await api.get("/admin/users");
      setUsers(res.data.users);
    } catch (error) {
      console.error("Fetch users error:", error);
      alert("Failed to fetch users");
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteUser = async (id, name) => {
    if (!window.confirm(`Delete user "${name}"? This will also delete all their uploads.`)) {
      return;
    }

    try {
      await api.delete(`/admin/users/${id}`);
      setUsers((prev) => prev.filter((u) => u._id !== id));
      alert("User deleted successfully");
    } catch (error) {
      console.error("Delete user error:", error);
      alert("Failed to delete user");
    }
  };

  const handleEditUser = (userId) => {
    setSelectedUserId(userId);
    setShowEditModal(true);
  };

  const handleUserUpdated = (updatedUser) => {
    setUsers((prev) => 
      prev.map((user) => 
        user._id === updatedUser._id ? updatedUser : user
      )
    );
  };

  const getStatusBadge = (status) => {
    const badges = {
      'active': 'badge-success',
      'suspended': 'badge-error',
      'deactivated': 'badge-warning'
    };
    return badges[status] || 'badge-warning';
  };

  if (loading) {
    return <div className="spinner" style={{ margin: "4rem auto" }}></div>;
  }

  return (
    <div className="container" style={{ marginTop: "3rem", marginBottom: "3rem" }}>
      <div className="flex-between" style={{ marginBottom: "2rem" }}>
        <div>
          <h1 style={{ fontSize: "2.5rem", marginBottom: "0.5rem" }}>
            <FiUser style={{ display: "inline", marginRight: "0.5rem" }} />
            User Management
          </h1>
          <p style={{ color: "var(--text-light)" }}>
            View, edit, and manage platform users
          </p>
        </div>
        <button 
          onClick={fetchUsers}
          className="btn btn-outline"
        >
          Refresh
        </button>
      </div>

      {users.length === 0 ? (
        <div className="empty-state">
          <div className="empty-state-icon">👥</div>
          <h2 className="empty-state-title">No users found</h2>
        </div>
      ) : (
        <>
          <p style={{ marginBottom: "1.5rem", color: "var(--text-light)", fontWeight: 600 }}>
            {users.length} registered user{users.length !== 1 ? "s" : ""}
          </p>

          <div className="card" style={{ padding: 0, overflow: "hidden" }}>
            <div style={{ overflowX: "auto" }}>
              <table style={{ width: "100%", borderCollapse: "collapse" }}>
                <thead>
                  <tr style={{ borderBottom: "2px solid var(--border)", background: "var(--bg-light)" }}>
                    <th style={{ padding: "1rem", textAlign: "left", fontWeight: 700 }}>User</th>
                    <th style={{ padding: "1rem", textAlign: "left", fontWeight: 700 }}>Contact</th>
                    <th style={{ padding: "1rem", textAlign: "left", fontWeight: 700 }}>Academic</th>
                    <th style={{ padding: "1rem", textAlign: "left", fontWeight: 700 }}>Status</th>
                    <th style={{ padding: "1rem", textAlign: "left", fontWeight: 700 }}>Joined</th>
                    <th style={{ padding: "1rem", textAlign: "center", fontWeight: 700 }}>Actions</th>
                  </tr>
                </thead>

                <tbody>
                  {users.map((user, index) => (
                    <tr
                      key={user._id}
                      style={{
                        borderBottom: index !== users.length - 1 ? "1px solid var(--border)" : "none",
                        background: user.accountStatus !== 'active' ? 'rgba(239, 68, 68, 0.05)' : 'white'
                      }}
                    >
                      <td style={{ padding: "1rem" }}>
                        <div style={{ display: "flex", alignItems: "center", gap: "0.75rem" }}>
                          <div style={{ 
                            width: "40px", 
                            height: "40px", 
                            borderRadius: "50%", 
                            background: "var(--bg-light)",
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center",
                            fontWeight: "bold"
                          }}>
                            {user.name.charAt(0).toUpperCase()}
                          </div>
                          <div>
                            <strong>{user.name}</strong>
                            {user.role === 'admin' && (
                              <span className="badge badge-primary" style={{ marginLeft: "0.5rem", fontSize: "0.7rem" }}>
                                ADMIN
                              </span>
                            )}
                          </div>
                        </div>
                      </td>
                      <td style={{ padding: "1rem" }}>
                        <div>
                          <div style={{ display: "flex", alignItems: "center", gap: "0.5rem", marginBottom: "0.25rem" }}>
                            <FiMail style={{ fontSize: "0.8rem", color: "var(--text-light)" }} />
                            <span style={{ fontSize: "0.9rem" }}>{user.email}</span>
                          </div>
                          {user.phone && (
                            <div style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}>
                              <FiUser style={{ fontSize: "0.8rem", color: "var(--text-light)" }} />
                              <span style={{ fontSize: "0.9rem", color: "var(--text-light)" }}>{user.phone}</span>
                            </div>
                          )}
                        </div>
                      </td>
                      <td style={{ padding: "1rem" }}>
                        <div>
                          <div style={{ display: "flex", alignItems: "center", gap: "0.5rem", marginBottom: "0.25rem" }}>
                            <FiBook style={{ fontSize: "0.8rem", color: "var(--text-light)" }} />
                            <span style={{ fontWeight: 600 }}>{user.branch}</span>
                          </div>
                          <div style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}>
                            <FiLayers style={{ fontSize: "0.8rem", color: "var(--text-light)" }} />
                            <span style={{ fontSize: "0.9rem", color: "var(--text-light)" }}>Sem {user.semester}</span>
                          </div>
                          {user.enrollmentId && (
                            <div style={{ fontSize: "0.8rem", color: "var(--text-light)", marginTop: "0.25rem" }}>
                              ID: {user.enrollmentId}
                            </div>
                          )}
                        </div>
                      </td>
                      <td style={{ padding: "1rem" }}>
                        <span className={`badge ${getStatusBadge(user.accountStatus)}`}>
                          {user.accountStatus?.toUpperCase() || 'ACTIVE'}
                        </span>
                      </td>
                      <td style={{ padding: "1rem", fontSize: "0.875rem", color: "var(--text-light)" }}>
                        {new Date(user.createdAt).toLocaleDateString()}
                      </td>
                      <td style={{ padding: "1rem", textAlign: "center" }}>
                        <div style={{ display: "flex", gap: "0.5rem", justifyContent: "center" }}>
                          <button
                            onClick={() => handleEditUser(user._id)}
                            className="btn btn-sm btn-outline"
                            title="Edit User"
                            disabled={user.role === 'admin'}
                          >
                            <FiEdit2 /> Edit
                          </button>
                          <button
                            onClick={() => handleDeleteUser(user._id, user.name)}
                            className="btn btn-sm btn-outline"
                            style={{ borderColor: "var(--error)", color: "var(--error)" }}
                            title="Delete User"
                            disabled={user.role === 'admin'}
                          >
                            <FiTrash2 /> Delete
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          <p style={{ marginTop: "1rem", fontSize: "0.875rem", color: "var(--text-light)", fontStyle: "italic" }}>
            * Admin users cannot be edited or deleted
          </p>
        </>
      )}

      {/* Edit User Modal */}
      {showEditModal && selectedUserId && (
        <EditUserModal
          userId={selectedUserId}
          onClose={() => {
            setShowEditModal(false);
            setSelectedUserId(null);
          }}
          onUserUpdated={handleUserUpdated}
        />
      )}
    </div>
  );
};

export default UserManagement;