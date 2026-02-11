import React, { useState, useEffect } from "react";
import api from "../../api/api";
import { FiTrash2, FiUser } from "react-icons/fi";

const UserManagement = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);

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

  if (loading) {
    return <div className="spinner" style={{ margin: "4rem auto" }}></div>;
  }

  return (
    <div className="container" style={{ marginTop: "3rem", marginBottom: "3rem" }}>
      <h1 style={{ fontSize: "2.5rem", marginBottom: "2rem" }}>User Management</h1>

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

          <div className="card">
            <div style={{ overflowX: "auto" }}>
              <table style={{ width: "100%", borderCollapse: "collapse" }}>
                <thead>
                  <tr style={{ borderBottom: "2px solid var(--border)" }}>
                    <th style={{ padding: "1rem", textAlign: "left", fontWeight: 700 }}>Name</th>
                    <th style={{ padding: "1rem", textAlign: "left", fontWeight: 700 }}>Email</th>
                    <th style={{ padding: "1rem", textAlign: "left", fontWeight: 700 }}>Branch</th>
                    <th style={{ padding: "1rem", textAlign: "left", fontWeight: 700 }}>Semester</th>
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
                      }}
                    >
                      <td style={{ padding: "1rem" }}>
                        <div style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}>
                          <FiUser />
                          <strong>{user.name}</strong>
                        </div>
                      </td>
                      <td style={{ padding: "1rem", color: "var(--text-light)" }}>{user.email}</td>
                      <td style={{ padding: "1rem" }}>
                        <span className="badge" style={{ background: "var(--bg-light)", color: "var(--text-dark)" }}>
                          {user.branch}
                        </span>
                      </td>
                      <td style={{ padding: "1rem" }}>
                        <span className="badge" style={{ background: "var(--bg-light)", color: "var(--text-dark)" }}>
                          Sem {user.semester}
                        </span>
                      </td>
                      <td style={{ padding: "1rem", fontSize: "0.875rem", color: "var(--text-light)" }}>
                        {new Date(user.createdAt).toLocaleDateString()}
                      </td>
                      <td style={{ padding: "1rem", textAlign: "center" }}>
                        <button
                          onClick={() => handleDeleteUser(user._id, user.name)}
                          className="btn btn-sm btn-outline"
                          style={{ borderColor: "var(--error)", color: "var(--error)" }}
                        >
                          <FiTrash2 /> Delete
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </>
      )}
    </div>
  );
};

export default UserManagement;