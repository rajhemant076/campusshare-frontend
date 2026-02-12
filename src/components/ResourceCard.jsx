import React, { useState } from "react";
import api from "../api/api";
import { FiHeart, FiBookmark, FiDownload, FiEye } from "react-icons/fi";
import { useAuth } from "../context/AuthContext";

const ResourceCard = ({ resource, onUpdate }) => {
  const { isAuthenticated, user } = useAuth();

  const [liked, setLiked] = useState(
    user?.likedResources?.includes(resource._id) || false
  );
  const [bookmarked, setBookmarked] = useState(
    user?.bookmarks?.includes(resource._id) || false
  );
  const [likesCount, setLikesCount] = useState(resource.likesCount || 0);

  // 🔥 CRITICAL FIX: Get the FULL backend URL for PDF files
  const getFileUrl = () => {
    // Production - use Render backend URL
    if (import.meta.env.PROD) {
      return `https://campusshare-backend-1.onrender.com/api/files/${resource.fileId}`;
    }
    // Development - use localhost
    return `http://localhost:5000/api/files/${resource.fileId}`;
  };

  const handleLike = async (e) => {
    e.stopPropagation();

    if (!isAuthenticated) {
      alert("Please login to like resources");
      return;
    }

    try {
      const res = await api.post(`/resources/${resource._id}/like`);
      setLiked(res.data.liked);
      setLikesCount(res.data.likesCount);
    } catch (error) {
      console.error("Like error:", error);
      alert("Failed to like resource");
    }
  };

  const handleBookmark = async (e) => {
    e.stopPropagation();

    if (!isAuthenticated) {
      alert("Please login to bookmark resources");
      return;
    }

    try {
      const res = await api.post(`/resources/${resource._id}/bookmark`);
      setBookmarked(res.data.bookmarked);
      if (onUpdate) onUpdate();
    } catch (error) {
      console.error("Bookmark error:", error);
      alert("Failed to bookmark resource");
    }
  };

  const handleViewPdf = (e) => {
    e.stopPropagation();
    const url = getFileUrl();
    window.open(url, '_blank');
  };

  const handleDownloadPdf = (e) => {
    e.stopPropagation();
    const url = getFileUrl();
    
    // For download, we need to fetch the file first
    fetch(url)
      .then(response => response.blob())
      .then(blob => {
        const blobUrl = window.URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.href = blobUrl;
        link.download = resource.fileName || 'document.pdf';
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        window.URL.revokeObjectURL(blobUrl);
      })
      .catch(error => {
        console.error('Download error:', error);
        alert('Failed to download file. Please try again.');
      });
  };

  const getTypeColor = (type) => {
    const colors = {
      Notes: "badge-primary",
      Assignment: "badge-secondary",
      PYQ: "badge-success",
      Lab: "badge-warning",
    };
    return colors[type] || "badge-primary";
  };

  return (
    <div className="card">
      <div className="card-header">
        <div className="flex-between">
          <h3 className="card-title">{resource.title}</h3>
          <span className={`badge ${getTypeColor(resource.type)}`}>
            {resource.type}
          </span>
        </div>
      </div>

      <div className="card-body">
        <p style={{ color: "var(--text-light)", marginBottom: "1rem" }}>
          {resource.description}
        </p>

        <div
          className="flex gap-1"
          style={{ flexWrap: "wrap", marginBottom: "0.75rem" }}
        >
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

        {resource.uploadedBy && (
          <p style={{ fontSize: "0.875rem", color: "var(--text-light)" }}>
            Uploaded by: <strong>{resource.uploadedBy.name}</strong>
          </p>
        )}
      </div>

      <div className="card-footer">
        <div className="flex gap-1">
          <button
            onClick={handleLike}
            className="btn btn-sm btn-icon btn-outline"
            style={{ color: liked ? "var(--error)" : "inherit" }}
            title="Like"
          >
            <FiHeart fill={liked ? "var(--error)" : "none"} />
            <span style={{ fontSize: "0.875rem", marginLeft: "0.25rem" }}>
              {likesCount}
            </span>
          </button>

          <button
            onClick={handleBookmark}
            className="btn btn-sm btn-icon btn-outline"
            style={{ color: bookmarked ? "var(--accent)" : "inherit" }}
            title="Bookmark"
          >
            <FiBookmark fill={bookmarked ? "var(--accent)" : "none"} />
          </button>
        </div>

        <div className="flex gap-1">
          <button
            onClick={handleViewPdf}
            className="btn btn-sm btn-outline"
          >
            <FiEye /> View
          </button>
          <button
            onClick={handleDownloadPdf}
            className="btn btn-sm btn-primary"
          >
            <FiDownload /> Download
          </button>
        </div>
      </div>
    </div>
  );
};

export default ResourceCard;