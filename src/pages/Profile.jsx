import React, { useState, useEffect } from 'react';
import api from '../api/api';
import { useAuth } from '../context/AuthContext';
import { FiUser, FiBook, FiLayers, FiMail, FiEdit2, FiSave, FiX } from 'react-icons/fi';

const Profile = () => {
  const { user, login } = useAuth();
  const [myUploads, setMyUploads] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isEditing, setIsEditing] = useState(false);
  const [editLoading, setEditLoading] = useState(false);
  const [editError, setEditError] = useState('');
  const [editSuccess, setEditSuccess] = useState('');

  // Edit form state
  const [editForm, setEditForm] = useState({
    name: '',
    branch: '',
    semester: ''
  });

  // Initialize edit form with user data
  useEffect(() => {
    if (user) {
      setEditForm({
        name: user.name || '',
        branch: user.branch || '',
        semester: user.semester || ''
      });
    }
  }, [user]);

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

  // Handle edit form changes
  const handleEditChange = (e) => {
    setEditForm({
      ...editForm,
      [e.target.name]: e.target.value
    });
  };

  // Cancel edit
  const handleCancelEdit = () => {
    setIsEditing(false);
    setEditError('');
    setEditSuccess('');
    // Reset form to original user data
    setEditForm({
      name: user?.name || '',
      branch: user?.branch || '',
      semester: user?.semester || ''
    });
  };

  // Save profile changes
  const handleSaveProfile = async () => {
    setEditLoading(true);
    setEditError('');
    setEditSuccess('');

    try {
      // Validate inputs
      if (!editForm.name.trim()) {
        throw new Error('Name is required');
      }
      if (!editForm.branch) {
        throw new Error('Branch is required');
      }
      if (!editForm.semester) {
        throw new Error('Semester is required');
      }

      // API call to update profile
      const res = await api.put('/auth/profile', {
        name: editForm.name,
        branch: editForm.branch,
        semester: parseInt(editForm.semester)
      });

      // Update auth context with new user data
      login(localStorage.getItem('token'), res.data.user);
      
      setEditSuccess('Profile updated successfully!');
      setIsEditing(false);
      
      // Clear success message after 3 seconds
      setTimeout(() => setEditSuccess(''), 3000);
    } catch (error) {
      setEditError(error.response?.data?.message || error.message || 'Failed to update profile');
    } finally {
      setEditLoading(false);
    }
  };

  const branches = ['CSE', 'ECE', 'EEE', 'MECH', 'CIVIL', 'IT', 'OTHER'];
  const semesters = [1, 2, 3, 4, 5, 6, 7, 8];

  return (
    <div className="container container-md" style={{ marginTop: '3rem', marginBottom: '3rem' }}>
      {/* Header with Edit Button */}
      <div className="flex-between" style={{ marginBottom: '2rem' }}>
        <h1 style={{ fontSize: '2.5rem' }}>
          <FiUser style={{ display: 'inline', marginRight: '0.5rem' }} />
          My Profile
        </h1>
        {!isEditing ? (
          <button
            onClick={() => setIsEditing(true)}
            className="btn btn-outline"
            style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}
          >
            <FiEdit2 /> Edit Profile
          </button>
        ) : (
          <div className="flex gap-1">
            <button
              onClick={handleSaveProfile}
              className="btn btn-primary"
              disabled={editLoading}
            >
              <FiSave /> {editLoading ? 'Saving...' : 'Save'}
            </button>
            <button
              onClick={handleCancelEdit}
              className="btn btn-outline"
              disabled={editLoading}
            >
              <FiX /> Cancel
            </button>
          </div>
        )}
      </div>

      {/* Profile Information Card */}
      <div className="card" style={{ marginBottom: '2rem' }}>
        <div className="card-header">
          <h2 className="card-title">Profile Information</h2>
        </div>
        <div className="card-body">
          {/* Success/Error Messages */}
          {editSuccess && (
            <div className="alert alert-success" style={{ marginBottom: '1.5rem' }}>
              {editSuccess}
            </div>
          )}
          {editError && (
            <div className="alert alert-error" style={{ marginBottom: '1.5rem' }}>
              {editError}
            </div>
          )}

          {!isEditing ? (
            /* VIEW MODE - Display user info */
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
          ) : (
            /* EDIT MODE - Form to edit user info */
            <div className="grid" style={{ gridTemplateColumns: 'repeat(2, 1fr)', gap: '1.5rem' }}>
              {/* Name Field */}
              <div className="form-group">
                <label className="form-label">
                  <FiUser style={{ display: 'inline', marginRight: '0.3rem' }} />
                  Full Name *
                </label>
                <input
                  type="text"
                  name="name"
                  className="form-input"
                  value={editForm.name}
                  onChange={handleEditChange}
                  placeholder="Enter your full name"
                  required
                />
              </div>

              {/* Email Field - READ ONLY */}
              <div className="form-group">
                <label className="form-label">
                  <FiMail style={{ display: 'inline', marginRight: '0.3rem' }} />
                  Email
                </label>
                <input
                  type="email"
                  className="form-input"
                  value={user?.email || ''}
                  disabled
                  style={{ background: 'var(--bg-light)', cursor: 'not-allowed' }}
                />
                <p style={{ fontSize: '0.75rem', color: 'var(--text-light)', marginTop: '0.25rem' }}>
                  Email cannot be changed
                </p>
              </div>

              {/* Branch Field */}
              <div className="form-group">
                <label className="form-label">
                  <FiBook style={{ display: 'inline', marginRight: '0.3rem' }} />
                  Branch *
                </label>
                <select
                  name="branch"
                  className="form-select"
                  value={editForm.branch}
                  onChange={handleEditChange}
                  required
                >
                  <option value="">Select Branch</option>
                  {branches.map(branch => (
                    <option key={branch} value={branch}>{branch}</option>
                  ))}
                </select>
              </div>

              {/* Semester Field */}
              <div className="form-group">
                <label className="form-label">
                  <FiLayers style={{ display: 'inline', marginRight: '0.3rem' }} />
                  Semester *
                </label>
                <select
                  name="semester"
                  className="form-select"
                  value={editForm.semester}
                  onChange={handleEditChange}
                  required
                >
                  <option value="">Select Semester</option>
                  {semesters.map(sem => (
                    <option key={sem} value={sem}>Semester {sem}</option>
                  ))}
                </select>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* My Uploads Section */}
      <div className="flex-between" style={{ marginBottom: '1.5rem' }}>
        <h2 style={{ fontSize: '1.75rem' }}>My Uploads</h2>
        <span className="badge badge-primary" style={{ fontSize: '1rem', padding: '0.5rem 1rem' }}>
          Total: {myUploads.length}
        </span>
      </div>

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