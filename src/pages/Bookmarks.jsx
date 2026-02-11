import React, { useState, useEffect } from 'react';
import api from '../api/api';
import ResourceCard from '../components/ResourceCard';
import { FiBookmark } from 'react-icons/fi';

const Bookmarks = () => {
  const [bookmarks, setBookmarks] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchBookmarks();
  }, []);

  const fetchBookmarks = async () => {
    setLoading(true);
    try {
      const res = await api.get('/resources/user/bookmarks');
      setBookmarks(res.data.bookmarks);
    } catch (error) {
      console.error('Fetch bookmarks error:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container">
      <div style={{ margin: '3rem 0 2rem 0' }}>
        <h1 style={{ fontSize: '2.5rem', marginBottom: '0.5rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          <FiBookmark />
          My Bookmarks
        </h1>
        <p style={{ color: 'var(--text-light)' }}>
          Resources you've saved for later
        </p>
      </div>

      {loading ? (
        <div className="spinner"></div>
      ) : bookmarks.length === 0 ? (
        <div className="empty-state">
          <div className="empty-state-icon">🔖</div>
          <h2 className="empty-state-title">No bookmarks yet</h2>
          <p className="empty-state-text">
            Start bookmarking resources to save them for later!
          </p>
        </div>
      ) : (
        <>
          <p style={{ marginBottom: '1.5rem', color: 'var(--text-light)', fontWeight: 600 }}>
            {bookmarks.length} bookmark{bookmarks.length !== 1 ? 's' : ''}
          </p>
          <div className="grid grid-3">
            {bookmarks.map(resource => (
              <ResourceCard key={resource._id} resource={resource} onUpdate={fetchBookmarks} />
            ))}
          </div>
        </>
      )}
    </div>
  );
};

export default Bookmarks;