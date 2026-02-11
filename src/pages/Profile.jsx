import React, { useState, useEffect } from 'react';
import api from '../api/api';
import { useAuth } from '../context/AuthContext';
import { FiUser, FiBook, FiLayers, FiMail } from 'react-icons/fi';

const Profile = () => {
  const { user } = useAuth();
  const [myUploads, setMyUploads] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchMyUploads();
  }, []);

  const fetchMyUploads = async () => {
    setLoading(true);
    try {
      const res = await api.get('/resources/user/my-uploads');
      setMyUploads(res.data.resources);
    } catch (error) {
      console.error('Fetch uploads error:', error);
    } finally {
      setLoading(false);
    }
  };

  const getStatusBadge = (status) => {
    const badges = {
      'pending': 'badge-warning',
      'approved': 'badge-success',
      'rejected': 'badge-error'
    };
    return badges[status] || 'badge-warning';
  };

  return (
    <div className="container container-md" style={{ marginTop: '3rem', marginBottom: '3rem' }}>
      <h1 style={{ fontSize: '2.5rem', marginBottom: '2rem' }}>
        <FiUser style={{ display: 'inline', marginRight: '0.5rem' }} />
        My Profile
      </h1>

      <div className="card" style={{ marginBottom: '2rem' }}>
        <div className="card-header">
          <h2 className="card-title">Profile Information</h2>
        </div>
        <div className="card-body">
          <div className="grid" style={{ gridTemplateColumns: 'repeat(2, 1fr)', gap: '1.5rem' }}>
            <div>
              <p style={{ color: 'var(--text-light)', marginBottom: '0.25rem', fontSize: '0.875rem' }}>
                <FiUser style={{ display: 'inline', marginRight: '0.3rem' }} />
                Full Name
              </p>
              <p style={{ fontWeight: 600, fontSize: '1.1rem' }}>{user?.name}</p>
            </div>

            <div>
              <p style={{ color: 'var(--text-light)', marginBottom: '0.25rem', fontSize: '0.875rem' }}>
                <FiMail style={{ display: 'inline', marginRight: '0.3rem' }} />
                Email
              </p>
              <p style={{ fontWeight: 600, fontSize: '1.1rem' }}>{user?.email}</p>
            </div>

            <div>
              <p style={{ color: 'var(--text-light)', marginBottom: '0.25rem', fontSize: '0.875rem' }}>
                <FiBook style={{ display: 'inline', marginRight: '0.3rem' }} />
                Branch
              </p>
              <p style={{ fontWeight: 600, fontSize: '1.1rem' }}>{user?.branch}</p>
            </div>

            <div>
              <p style={{ color: 'var(--text-light)', marginBottom: '0.25rem', fontSize: '0.875rem' }}>
                <FiLayers style={{ display: 'inline', marginRight: '0.3rem' }} />
                Semester
              </p>
              <p style={{ fontWeight: 600, fontSize: '1.1rem' }}>Semester {user?.semester}</p>
            </div>
          </div>
        </div>
      </div>

      <h2 style={{ fontSize: '1.75rem', marginBottom: '1.5rem' }}>My Uploads</h2>

      {loading ? (
        <div className="spinner"></div>
      ) : myUploads.length === 0 ? (
        <div className="empty-state">
          <div className="empty-state-icon">📤</div>
          <h3 className="empty-state-title">No uploads yet</h3>
          <p className="empty-state-text">
            Start sharing resources with your peers!
          </p>
        </div>
      ) : (
        <div className="grid" style={{ gap: '1rem' }}>
          {myUploads.map(resource => (
            <div key={resource._id} className="card">
              <div className="flex-between" style={{ marginBottom: '1rem' }}>
                <div style={{ flex: 1 }}>
                  <h3 style={{ fontSize: '1.1rem', marginBottom: '0.5rem' }}>{resource.title}</h3>
                  <p style={{ color: 'var(--text-light)', fontSize: '0.9rem', marginBottom: '0.75rem' }}>
                    {resource.description}
                  </p>
                  <div className="flex gap-1" style={{ flexWrap: 'wrap' }}>
                    <span className="badge" style={{ background: 'var(--bg-light)', color: 'var(--text-dark)' }}>
                      {resource.type}
                    </span>
                    <span className="badge" style={{ background: 'var(--bg-light)', color: 'var(--text-dark)' }}>
                      {resource.branch}
                    </span>
                    <span className="badge" style={{ background: 'var(--bg-light)', color: 'var(--text-dark)' }}>
                      Sem {resource.semester}
                    </span>
                    <span className="badge" style={{ background: 'var(--bg-light)', color: 'var(--text-dark)' }}>
                      {resource.subject}
                    </span>
                  </div>
                </div>
                <span className={`badge ${getStatusBadge(resource.status)}`} style={{ height: 'fit-content' }}>
                  {resource.status.toUpperCase()}
                </span>
              </div>
              
              {resource.status === 'rejected' && resource.rejectionReason && (
                <div className="alert alert-error" style={{ marginTop: '1rem' }}>
                  <strong>Rejection Reason:</strong> {resource.rejectionReason}
                </div>
              )}

              <div style={{ fontSize: '0.875rem', color: 'var(--text-light)', marginTop: '0.75rem' }}>
                Uploaded on {new Date(resource.createdAt).toLocaleDateString()}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default Profile;