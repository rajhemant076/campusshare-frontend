import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import api from "../../api/api";
import { FiUsers, FiUpload, FiClock, FiCheckCircle, FiXCircle, FiMail } from 'react-icons/fi';

const AdminDashboard = () => {
  const [stats, setStats] = useState(null);
  const [messageCount, setMessageCount] = useState(0);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchStats();
    fetchMessageCount();
  }, []);

  const fetchStats = async () => {
    setLoading(true);
    try {
      const res = await api.get("/admin/stats");
      setStats(res.data.stats);
    } catch (error) {
      console.error('Fetch stats error:', error);
    } finally {
      setLoading(false);
    }
  };

  const fetchMessageCount = async () => {
    try {
      const res = await api.get("/admin/contact-messages");
      const unreadCount = res.data.messages?.filter(m => m.status === 'unread').length || 0;
      setMessageCount(unreadCount);
    } catch (error) {
      console.error('Fetch messages error:', error);
    }
  };

  if (loading) {
    return <div className="spinner" style={{ margin: '4rem auto' }}></div>;
  }

  return (
    <div className="container" style={{ marginTop: '3rem', marginBottom: '3rem' }}>
      <h1 style={{ fontSize: '2.5rem', marginBottom: '2rem' }}>Admin Dashboard</h1>

      <div className="stats-grid">
        <div className="stat-card">
          <FiUsers style={{ fontSize: '2.5rem', color: 'var(--primary)', marginBottom: '0.5rem' }} />
          <div className="stat-value">{stats?.totalUsers || 0}</div>
          <div className="stat-label">Total Users</div>
        </div>

        <div className="stat-card">
          <FiUpload style={{ fontSize: '2.5rem', color: 'var(--secondary)', marginBottom: '0.5rem' }} />
          <div className="stat-value">{stats?.totalUploads || 0}</div>
          <div className="stat-label">Total Uploads</div>
        </div>

        <div className="stat-card">
          <FiClock style={{ fontSize: '2.5rem', color: 'var(--warning)', marginBottom: '0.5rem' }} />
          <div className="stat-value">{stats?.pendingApprovals || 0}</div>
          <div className="stat-label">Pending Approvals</div>
        </div>

        <div className="stat-card">
          <FiCheckCircle style={{ fontSize: '2.5rem', color: 'var(--success)', marginBottom: '0.5rem' }} />
          <div className="stat-value">{stats?.approvedResources || 0}</div>
          <div className="stat-label">Approved Resources</div>
        </div>

        <div className="stat-card">
          <FiXCircle style={{ fontSize: '2.5rem', color: 'var(--error)', marginBottom: '0.5rem' }} />
          <div className="stat-value">{stats?.rejectedResources || 0}</div>
          <div className="stat-label">Rejected Resources</div>
        </div>
      </div>

      <h2 style={{ fontSize: '1.75rem', marginTop: '3rem', marginBottom: '1.5rem' }}>Quick Actions</h2>

      <div className="grid grid-2">
        <Link to="/admin/pending" className="card" style={{ textDecoration: 'none', color: 'inherit' }}>
          <div className="flex-between">
            <div>
              <h3 className="card-title">Pending Resources</h3>
              <p style={{ color: 'var(--text-light)' }}>Review and approve uploads</p>
            </div>
            <div className="badge badge-warning" style={{ fontSize: '1.5rem', padding: '0.5rem 1rem' }}>
              {stats?.pendingApprovals || 0}
            </div>
          </div>
        </Link>

        <Link to="/admin/approved" className="card" style={{ textDecoration: 'none', color: 'inherit' }}>
          <div className="flex-between">
            <div>
              <h3 className="card-title">Approved Resources</h3>
              <p style={{ color: 'var(--text-light)' }}>Manage approved content</p>
            </div>
            <div className="badge badge-success" style={{ fontSize: '1.5rem', padding: '0.5rem 1rem' }}>
              {stats?.approvedResources || 0}
            </div>
          </div>
        </Link>

        <Link to="/admin/rejected" className="card" style={{ textDecoration: 'none', color: 'inherit' }}>
          <div className="flex-between">
            <div>
              <h3 className="card-title">Rejected Resources</h3>
              <p style={{ color: 'var(--text-light)' }}>View rejected uploads</p>
            </div>
            <div className="badge badge-error" style={{ fontSize: '1.5rem', padding: '0.5rem 1rem' }}>
              {stats?.rejectedResources || 0}
            </div>
          </div>
        </Link>

        <Link to="/admin/users" className="card" style={{ textDecoration: 'none', color: 'inherit' }}>
          <div className="flex-between">
            <div>
              <h3 className="card-title">User Management</h3>
              <p style={{ color: 'var(--text-light)' }}>View, edit, and manage users</p>
            </div>
            <div className="badge badge-primary" style={{ fontSize: '1.5rem', padding: '0.5rem 1rem' }}>
              {stats?.totalUsers || 0}
            </div>
          </div>
        </Link>

        {/* ✅ NEW: Contact Messages Card */}
        <Link to="/admin/contact-messages" className="card" style={{ textDecoration: 'none', color: 'inherit' }}>
          <div className="flex-between">
            <div>
              <h3 className="card-title">Contact Messages</h3>
              <p style={{ color: 'var(--text-light)' }}>View user inquiries and feedback</p>
            </div>
            <div style={{ position: 'relative' }}>
              <div className="badge badge-secondary" style={{ fontSize: '1.5rem', padding: '0.5rem 1rem' }}>
                <FiMail />
              </div>
              {messageCount > 0 && (
                <span style={{
                  position: 'absolute',
                  top: '-10px',
                  right: '-10px',
                  background: 'var(--error)',
                  color: 'white',
                  borderRadius: '50%',
                  width: '24px',
                  height: '24px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontSize: '0.8rem',
                  fontWeight: 'bold'
                }}>
                  {messageCount}
                </span>
              )}
            </div>
          </div>
        </Link>
      </div>
    </div>
  );
};

export default AdminDashboard;