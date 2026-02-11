import React, { useState, useEffect } from "react";
import api from "../../api/api";
import { FiCheck, FiX, FiEye, FiDownload } from "react-icons/fi";

const PendingResources = () => {
  const [resources, setResources] = useState([]);
  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState(null);

  useEffect(() => {
    fetchPendingResources();
  }, []);

  const fetchPendingResources = async () => {
    setLoading(true);
    try {
      const res = await api.get("/admin/resources/pending");
      setResources(res.data.resources);
    } catch (error) {
      console.error("Fetch pending resources error:", error);
      alert("Failed to fetch pending resources");
    } finally {
      setLoading(false);
    }
  };

  const handleApprove = async (id) => {
    setActionLoading(id);
    try {
      await api.put(`/admin/resources/${id}/approve`);
      setResources((prev) => prev.filter((r) => r._id !== id));
      alert("Resource approved successfully!");
    } catch (error) {
      console.error("Approve error:", error);
      alert("Failed to approve resource");
    } finally {
      setActionLoading(null);
    }
  };

  const handleReject = async (id) => {
    const reason = prompt("Enter rejection reason:");
    if (!reason) return;

    setActionLoading(id);
    try {
      await api.put(`/admin/resources/${id}/reject`, { reason });
      setResources((prev) => prev.filter((r) => r._id !== id));
      alert("Resource rejected");
    } catch (error) {
      console.error("Reject error:", error);
      alert("Failed to reject resource");
    } finally {
      setActionLoading(null);
    }
  };

  if (loading) {
    return <div className="spinner" style={{ margin: "4rem auto" }}></div>;
  }

  return (
    <div className="container" style={{ marginTop: "3rem", marginBottom: "3rem" }}>
      <h1 style={{ fontSize: "2.5rem", marginBottom: "2rem" }}>Pending Resources</h1>

      {resources.length === 0 ? (
        <div className="empty-state">
          <div className="empty-state-icon">✅</div>
          <h2 className="empty-state-title">All caught up!</h2>
          <p className="empty-state-text">No pending resources to review</p>
        </div>
      ) : (
        <>
          <p style={{ marginBottom: "1.5rem", color: "var(--text-light)", fontWeight: 600 }}>
            {resources.length} resource{resources.length !== 1 ? "s" : ""} awaiting review
          </p>

          <div className="grid" style={{ gap: "1.5rem" }}>
            {resources.map((resource) => (
              <div key={resource._id} className="card">
                <div className="card-header">
                  <div className="flex-between">
                    <h3 className="card-title">{resource.title}</h3>
                    <span className="badge badge-warning">PENDING</span>
                  </div>
                </div>

                <div className="card-body">
                  <p style={{ color: "var(--text-light)", marginBottom: "1rem" }}>
                    {resource.description}
                  </p>

                  <div
                    className="grid"
                    style={{
                      gridTemplateColumns: "repeat(auto-fit, minmax(150px, 1fr))",
                      gap: "0.75rem",
                      marginBottom: "1rem",
                    }}
                  >
                    <div>
                      <p style={{ fontSize: "0.875rem", color: "var(--text-light)" }}>Type</p>
                      <p style={{ fontWeight: 600 }}>{resource.type}</p>
                    </div>
                    <div>
                      <p style={{ fontSize: "0.875rem", color: "var(--text-light)" }}>Branch</p>
                      <p style={{ fontWeight: 600 }}>{resource.branch}</p>
                    </div>
                    <div>
                      <p style={{ fontSize: "0.875rem", color: "var(--text-light)" }}>Semester</p>
                      <p style={{ fontWeight: 600 }}>Sem {resource.semester}</p>
                    </div>
                    <div>
                      <p style={{ fontSize: "0.875rem", color: "var(--text-light)" }}>Subject</p>
                      <p style={{ fontWeight: 600 }}>{resource.subject}</p>
                    </div>
                  </div>

                  {resource.uploadedBy && (
                    <div
                      style={{
                        padding: "1rem",
                        background: "var(--bg-light)",
                        border: "2px solid var(--border)",
                        marginBottom: "1rem",
                      }}
                    >
                      <p style={{ fontSize: "0.875rem", marginBottom: "0.25rem" }}>
                        Uploaded by:
                      </p>
                      <p style={{ fontWeight: 600 }}>{resource.uploadedBy.name}</p>
                      <p style={{ fontSize: "0.875rem", color: "var(--text-light)" }}>
                        {resource.uploadedBy.email} • {resource.uploadedBy.branch} • Sem{" "}
                        {resource.uploadedBy.semester}
                      </p>
                    </div>
                  )}

                  <p style={{ fontSize: "0.875rem", color: "var(--text-light)" }}>
                    Uploaded on {new Date(resource.createdAt).toLocaleString()}
                  </p>
                </div>

                <div
                  className="card-footer"
                  style={{
                    flexDirection: "column",
                    gap: "1rem",
                    alignItems: "stretch",
                  }}
                >
                  <div className="flex gap-1">
                    <a
                      href={resource.fileUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="btn btn-sm btn-outline flex-1"
                    >
                      <FiEye /> Preview
                    </a>
                    <a
                      href={resource.fileUrl}
                      download
                      className="btn btn-sm btn-outline flex-1"
                    >
                      <FiDownload /> Download
                    </a>
                  </div>

                  <div className="flex gap-1">
                    <button
                      onClick={() => handleApprove(resource._id)}
                      className="btn btn-primary flex-1"
                      disabled={actionLoading === resource._id}
                    >
                      <FiCheck />{" "}
                      {actionLoading === resource._id ? "Approving..." : "Approve"}
                    </button>

                    <button
                      onClick={() => handleReject(resource._id)}
                      className="btn btn-outline flex-1"
                      style={{ borderColor: "var(--error)", color: "var(--error)" }}
                      disabled={actionLoading === resource._id}
                    >
                      <FiX /> Reject
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </>
      )}
    </div>
  );
};

export default PendingResources;