import React, { useState, useEffect } from "react";
import api from "../../api/api";
import { FiEye, FiDownload, FiTrash2 } from "react-icons/fi";

const RejectedResources = () => {
  const [resources, setResources] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchRejectedResources();
  }, []);

  const fetchRejectedResources = async () => {
    setLoading(true);
    try {
      const res = await api.get("/admin/resources/rejected");
      setResources(res.data.resources);
    } catch (error) {
      console.error("Fetch rejected resources error:", error);
      alert("Failed to fetch rejected resources");
    } finally {
      setLoading(false);
    }
  };

  // 🔥 FIXED: Get full URL for PDF files
  const getFileUrl = (fileId) => {
    // Production - use Render backend URL
    if (import.meta.env.PROD) {
      return `https://campusshare-backend.onrender.com/api/files/${fileId}`;
    }
    // Development - use localhost
    return `http://localhost:5000/api/files/${fileId}`;
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Delete this rejected resource permanently?")) return;

    try {
      await api.delete(`/admin/resources/${id}`);
      setResources((prev) => prev.filter((r) => r._id !== id));
      alert("Resource deleted successfully");
    } catch (error) {
      console.error("Delete error:", error);
      alert("Failed to delete resource");
    }
  };

  if (loading) {
    return <div className="spinner" style={{ margin: "4rem auto" }}></div>;
  }

  return (
    <div className="container" style={{ marginTop: "3rem", marginBottom: "3rem" }}>
      <h1 style={{ fontSize: "2.5rem", marginBottom: "2rem" }}>Rejected Resources</h1>

      {resources.length === 0 ? (
        <div className="empty-state">
          <div className="empty-state-icon">✨</div>
          <h2 className="empty-state-title">No rejected resources</h2>
          <p className="empty-state-text">Rejected resources will appear here</p>
        </div>
      ) : (
        <>
          <p style={{ marginBottom: "1.5rem", color: "var(--text-light)", fontWeight: 600 }}>
            {resources.length} rejected resource{resources.length !== 1 ? "s" : ""}
          </p>

          <div className="grid" style={{ gap: "1.5rem" }}>
            {resources.map((resource) => (
              <div key={resource._id} className="card">
                <div className="card-header">
                  <div className="flex-between">
                    <h3 className="card-title">{resource.title}</h3>
                    <span className="badge badge-error">REJECTED</span>
                  </div>
                </div>

                <div className="card-body">
                  <p style={{ color: "var(--text-light)", marginBottom: "1rem" }}>
                    {resource.description}
                  </p>

                  <div className="flex gap-1" style={{ flexWrap: "wrap", marginBottom: "1rem" }}>
                    <span
                      className="badge"
                      style={{ background: "var(--bg-light)", color: "var(--text-dark)" }}
                    >
                      {resource.type}
                    </span>
                    <span
                      className="badge"
                      style={{ background: "var(--bg-light)", color: "var(--text-dark)" }}
                    >
                      {resource.branch}
                    </span>
                    <span
                      className="badge"
                      style={{ background: "var(--bg-light)", color: "var(--text-dark)" }}
                    >
                      Sem {resource.semester}
                    </span>
                    <span
                      className="badge"
                      style={{ background: "var(--bg-light)", color: "var(--text-dark)" }}
                    >
                      {resource.subject}
                    </span>
                  </div>

                  {resource.rejectionReason && (
                    <div className="alert alert-error" style={{ marginBottom: "1rem" }}>
                      <strong>Rejection Reason:</strong> {resource.rejectionReason}
                    </div>
                  )}

                  {resource.uploadedBy && (
                    <p style={{ fontSize: "0.875rem", color: "var(--text-light)", marginBottom: "0.5rem" }}>
                      Uploaded by: <strong>{resource.uploadedBy.name}</strong> ({resource.uploadedBy.email})
                    </p>
                  )}

                  <p style={{ fontSize: "0.875rem", color: "var(--text-light)" }}>
                    Rejected on {new Date(resource.createdAt).toLocaleString()}
                  </p>
                </div>

                <div className="card-footer">
                  <div className="flex gap-1">
                    <a
                      href={getFileUrl(resource.fileId)}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="btn btn-sm btn-outline"
                    >
                      <FiEye /> View
                    </a>
                    <a
                      href={getFileUrl(resource.fileId)}
                      download
                      className="btn btn-sm btn-outline"
                    >
                      <FiDownload /> Download
                    </a>
                  </div>

                  <button
                    onClick={() => handleDelete(resource._id)}
                    className="btn btn-sm btn-outline"
                    style={{ borderColor: "var(--error)", color: "var(--error)" }}
                  >
                    <FiTrash2 /> Delete
                  </button>
                </div>
              </div>
            ))}
          </div>
        </>
      )}
    </div>
  );
};

export default RejectedResources;