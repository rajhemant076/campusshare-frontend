import React, { useState, useEffect } from "react";
import api from "../../api/api";
import ResourceCard from "../../components/ResourceCard";
import { FiTrash2 } from "react-icons/fi";

const ApprovedResources = () => {
  const [resources, setResources] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchApprovedResources();
  }, []);

  const fetchApprovedResources = async () => {
    setLoading(true);
    try {
      const res = await api.get("/admin/resources/approved");
      setResources(res.data.resources);
    } catch (error) {
      console.error("Fetch approved resources error:", error);
      alert("Failed to fetch approved resources");
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this resource? This action cannot be undone.")) {
      return;
    }

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
      <h1 style={{ fontSize: "2.5rem", marginBottom: "2rem" }}>Approved Resources</h1>

      {resources.length === 0 ? (
        <div className="empty-state">
          <div className="empty-state-icon">📚</div>
          <h2 className="empty-state-title">No approved resources</h2>
          <p className="empty-state-text">Approved resources will appear here</p>
        </div>
      ) : (
        <>
          <p style={{ marginBottom: "1.5rem", color: "var(--text-light)", fontWeight: 600 }}>
            {resources.length} approved resource{resources.length !== 1 ? "s" : ""}
          </p>

          <div className="grid grid-3">
            {resources.map((resource) => (
              <div key={resource._id}>
                <ResourceCard resource={resource} />
                <button
                  onClick={() => handleDelete(resource._id)}
                  className="btn btn-outline w-full mt-2"
                  style={{ borderColor: "var(--error)", color: "var(--error)" }}
                >
                  <FiTrash2 /> Delete Resource
                </button>
              </div>
            ))}
          </div>
        </>
      )}
    </div>
  );
};

export default ApprovedResources;