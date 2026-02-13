import React, { useState, memo, useCallback, useMemo } from "react";
import api from "../api/api";
import { FiHeart, FiBookmark, FiDownload, FiEye } from "react-icons/fi";
import { useAuth } from "../context/AuthContext";

const ResourceCard = memo(({ resource, onUpdate }) => {
  const { isAuthenticated, user } = useAuth();
  
  // Local state
  const [liked, setLiked] = useState(
    user?.likedResources?.includes(resource._id) || false
  );
  const [bookmarked, setBookmarked] = useState(
    user?.bookmarks?.includes(resource._id) || false
  );
  const [likesCount, setLikesCount] = useState(resource.likesCount || 0);
  const [loading, setLoading] = useState(false);

  // Memoized file URL
  const fileUrl = useMemo(() => {
    const baseURL = import.meta.env.VITE_API_URL || 'https://campusshare-backend-1.onrender.com';
    const cleanBaseURL = baseURL.replace(/\/$/, '');
    if (cleanBaseURL.endsWith('/api')) {
      return `${cleanBaseURL}/files/${resource.fileId}`;
    }
    return `${cleanBaseURL}/api/files/${resource.fileId}`;
  }, [resource.fileId]);

  // Memoized type color
  const typeColor = useMemo(() => {
    const colors = {
      Notes: "badge-primary",
      Assignment: "badge-secondary",
      PYQ: "badge-success",
      "Previous Year Question": "badge-success",
      Lab: "badge-warning",
      "Lab Manual": "badge-warning",
    };
    return colors[resource.type] || "badge-primary";
  }, [resource.type]);

  const handleViewPdf = useCallback((e) => {
    e.stopPropagation();
    window.open(fileUrl, '_blank');
  }, [fileUrl]);

  const handleDownloadPdf = useCallback(async (e) => {
    e.stopPropagation();
    setLoading(true);
    
    try {
      // Use fetch with timeout
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 30000); // 30s timeout
      
      const response = await fetch(fileUrl, { signal: controller.signal });
      clearTimeout(timeoutId);
      
      if (!response.ok) throw new Error('Download failed');
      
      const blob = await response.blob();
      const blobUrl = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = blobUrl;
      link.download = resource.fileName || 'document.pdf';
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      window.URL.revokeObjectURL(blobUrl);
    } catch (error) {
      console.error('Download error:', error);
      if (error.name === 'AbortError') {
        alert('Download timed out. Please try again.');
      } else {
        alert('Failed to download file. Please try again.');
      }
    } finally {
      setLoading(false);
    }
  }, [fileUrl, resource.fileName]);

  const handleLike = useCallback(async (e) => {
    e.stopPropagation();

    if (!isAuthenticated) {
      alert("Please login to like resources");
      return;
    }

    // Optimistic update
    const newLiked = !liked;
    const newLikesCount = newLiked ? likesCount + 1 : likesCount - 1;
    
    setLiked(newLiked);
    setLikesCount(newLikesCount);

    try {
      const res = await api.post(`/resources/${resource._id}/like`);
      // If server response doesn't match, revert
      if (res.data.liked !== newLiked) {
        setLiked(res.data.liked);
        setLikesCount(res.data.likesCount);
      }
    } catch (error) {
      console.error("Like error:", error);
      // Revert on error
      setLiked(!newLiked);
      setLikesCount(likesCount);
      alert("Failed to like resource");
    }
  }, [isAuthenticated, resource._id, liked, likesCount]);

  const handleBookmark = useCallback(async (e) => {
    e.stopPropagation();

    if (!isAuthenticated) {
      alert("Please login to bookmark resources");
      return;
    }

    // Optimistic update
    const newBookmarked = !bookmarked;
    setBookmarked(newBookmarked);

    try {
      const res = await api.post(`/resources/${resource._id}/bookmark`);
      if (res.data.bookmarked !== newBookmarked) {
        setBookmarked(res.data.bookmarked);
      }
      if (onUpdate) onUpdate();
    } catch (error) {
      console.error("Bookmark error:", error);
      // Revert on error
      setBookmarked(!newBookmarked);
      alert("Failed to bookmark resource");
    }
  }, [isAuthenticated, resource._id, bookmarked, onUpdate]);

  return (
    <div className="card">
      <div className="card-header">
        <div className="flex-between">
          <h3 className="card-title" style={{ fontSize: '1.1rem' }}>{resource.title}</h3>
          <span className={`badge ${typeColor}`}>
            {resource.type}
          </span>
        </div>
      </div>

      <div className="card-body">
        <p style={{ 
          color: "var(--text-light)", 
          marginBottom: "1rem",
          fontSize: '0.9rem',
          display: '-webkit-box',
          WebkitLineClamp: 3,
          WebkitBoxOrient: 'vertical',
          overflow: 'hidden'
        }}>
          {resource.description}
        </p>

        <div className="flex gap-1" style={{ flexWrap: "wrap", marginBottom: "0.75rem" }}>
          <span className="badge" style={{ background: "var(--bg-light)", color: "var(--text-dark)" }}>
            {resource.branch}
          </span>
          <span className="badge" style={{ background: "var(--bg-light)", color: "var(--text-dark)" }}>
            Sem {resource.semester}
          </span>
          <span className="badge" style={{ background: "var(--bg-light)", color: "var(--text-dark)" }}>
            {resource.subject}
          </span>
        </div>

        {resource.uploadedBy && (
          <p style={{ fontSize: "0.8rem", color: "var(--text-light)" }}>
            By <strong>{resource.uploadedBy.name}</strong>
          </p>
        )}
      </div>

      <div className="card-footer" style={{ padding: '0.75rem 1rem' }}>
        <div className="flex gap-1">
          <button
            onClick={handleLike}
            className="btn btn-sm btn-icon btn-outline"
            style={{ color: liked ? "var(--error)" : "inherit", padding: '0.4rem' }}
            title="Like"
            disabled={loading}
          >
            <FiHeart fill={liked ? "var(--error)" : "none"} />
            <span style={{ fontSize: "0.8rem", marginLeft: "0.25rem" }}>
              {likesCount}
            </span>
          </button>

          <button
            onClick={handleBookmark}
            className="btn btn-sm btn-icon btn-outline"
            style={{ color: bookmarked ? "var(--accent)" : "inherit", padding: '0.4rem' }}
            title="Bookmark"
            disabled={loading}
          >
            <FiBookmark fill={bookmarked ? "var(--accent)" : "none"} />
          </button>
        </div>

        <div className="flex gap-1">
          <button
            onClick={handleViewPdf}
            className="btn btn-sm btn-outline"
            disabled={loading}
            style={{ padding: '0.4rem 0.75rem' }}
          >
            <FiEye /> View
          </button>
          <button
            onClick={handleDownloadPdf}
            className="btn btn-sm btn-primary"
            disabled={loading}
            style={{ padding: '0.4rem 0.75rem' }}
          >
            <FiDownload /> {loading ? '...' : 'Download'}
          </button>
        </div>
      </div>
    </div>
  );
});

export default ResourceCard;