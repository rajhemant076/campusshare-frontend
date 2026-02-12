import React, { useState, useEffect } from 'react';
import api from '../api/api';
import { useAuth } from '../context/AuthContext';
import { 
  FiUser, FiBook, FiLayers, FiMail, FiEdit2, FiSave, FiX,
  FiPhone, FiHash, FiCalendar, FiHome, FiFileText, FiLinkedin, 
  FiGithub, FiTwitter, FiEye, FiClock
} from 'react-icons/fi';

const Profile = () => {
  const { user, login } = useAuth();
  const [myUploads, setMyUploads] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isEditing, setIsEditing] = useState(false);
  const [editLoading, setEditLoading] = useState(false);
  const [editError, setEditError] = useState('');
  const [editSuccess, setEditSuccess] = useState('');

  // Edit form state with ALL fields
  const [editForm, setEditForm] = useState({
    name: '',
    phone: '',
    enrollmentId: '',
    graduationYear: '',
    college: '',
    bio: '',
    branch: '',
    semester: '',
    socialLinks: {
      linkedin: '',
      github: '',
      twitter: ''
    },
    profileVisibility: 'public'
  });

  // Initialize edit form with user data
  useEffect(() => {
    if (user) {
      setEditForm({
        name: user.name || '',
        phone: user.phone || '',
        enrollmentId: user.enrollmentId || '',
        graduationYear: user.graduationYear || '',
        college: user.college || '',
        bio: user.bio || '',
        branch: user.branch || '',
        semester: user.semester || '',
        socialLinks: {
          linkedin: user.socialLinks?.linkedin || '',
          github: user.socialLinks?.github || '',
          twitter: user.socialLinks?.twitter || ''
        },
        profileVisibility: user.profileVisibility || 'public'
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
    const { name, value } = e.target;
    
    // Handle nested socialLinks
    if (name.startsWith('social.')) {
      const socialField = name.split('.')[1];
      setEditForm({
        ...editForm,
        socialLinks: {
          ...editForm.socialLinks,
          [socialField]: value
        }
      });
    } else {
      setEditForm({
        ...editForm,
        [name]: value
      });
    }
  };

  // Cancel edit
  const handleCancelEdit = () => {
    setIsEditing(false);
    setEditError('');
    setEditSuccess('');
    // Reset form to original user data
    setEditForm({
      name: user?.name || '',
      phone: user?.phone || '',
      enrollmentId: user?.enrollmentId || '',
      graduationYear: user?.graduationYear || '',
      college: user?.college || '',
      bio: user?.bio || '',
      branch: user?.branch || '',
      semester: user?.semester || '',
      socialLinks: {
        linkedin: user?.socialLinks?.linkedin || '',
        github: user?.socialLinks?.github || '',
        twitter: user?.socialLinks?.twitter || ''
      },
      profileVisibility: user?.profileVisibility || 'public'
    });
  };

  // Save profile changes
  const handleSaveProfile = async () => {
    setEditLoading(true);
    setEditError('');
    setEditSuccess('');

    try {
      // Validate required fields
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
        semester: parseInt(editForm.semester),
        phone: editForm.phone,
        enrollmentId: editForm.enrollmentId || undefined,
        graduationYear: editForm.graduationYear ? parseInt(editForm.graduationYear) : null,
        college: editForm.college,
        bio: editForm.bio,
        socialLinks: editForm.socialLinks,
        profileVisibility: editForm.profileVisibility
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
  const graduationYears = [2024, 2025, 2026, 2027, 2028, 2029, 2030];
  const visibilityOptions = ['public', 'private', 'contacts'];

  // Format date
  const formatDate = (dateString) => {
    if (!dateString) return 'N/A';
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  return (
    <div className="container container-md" style={{ marginTop: '3rem', marginBottom: '3rem' }}>
      {/* Header with Edit Button */}
      <div className="flex-between" style={{ marginBottom: '2rem' }}>
        <div>
          <h1 style={{ fontSize: '2.5rem', marginBottom: '0.5rem' }}>
            <FiUser style={{ display: 'inline', marginRight: '0.5rem' }} />
            My Profile
          </h1>
          <p style={{ color: 'var(--text-light)', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <FiClock /> Last active: {formatDate(user?.lastActive)}
          </p>
        </div>
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
            /* ========== VIEW MODE ========== */
            <div className="grid" style={{ gap: '2rem' }}>
              {/* Basic Info Section */}
              <div>
                <h3 style={{ fontSize: '1.25rem', marginBottom: '1rem', color: 'var(--primary)' }}>
                  Basic Information
                </h3>
                <div className="grid" style={{ gridTemplateColumns: 'repeat(2, 1fr)', gap: '1.5rem' }}>
                  <div>
                    <p style={{ color: 'var(--text-light)', marginBottom: '0.25rem', fontSize: '0.875rem' }}>
                      <FiUser /> Full Name
                    </p>
                    <p style={{ fontWeight: 600 }}>{user?.name}</p>
                  </div>
                  <div>
                    <p style={{ color: 'var(--text-light)', marginBottom: '0.25rem', fontSize: '0.875rem' }}>
                      <FiMail /> Email
                    </p>
                    <p style={{ fontWeight: 600 }}>{user?.email}</p>
                  </div>
                  <div>
                    <p style={{ color: 'var(--text-light)', marginBottom: '0.25rem', fontSize: '0.875rem' }}>
                      <FiPhone /> Phone
                    </p>
                    <p style={{ fontWeight: 600 }}>{user?.phone || 'Not provided'}</p>
                  </div>
                  <div>
                    <p style={{ color: 'var(--text-light)', marginBottom: '0.25rem', fontSize: '0.875rem' }}>
                      <FiHash /> Enrollment ID
                    </p>
                    <p style={{ fontWeight: 600 }}>{user?.enrollmentId || 'Not provided'}</p>
                  </div>
                </div>
              </div>

              {/* Academic Info Section */}
              <div>
                <h3 style={{ fontSize: '1.25rem', marginBottom: '1rem', color: 'var(--secondary)' }}>
                  Academic Information
                </h3>
                <div className="grid" style={{ gridTemplateColumns: 'repeat(2, 1fr)', gap: '1.5rem' }}>
                  <div>
                    <p style={{ color: 'var(--text-light)', marginBottom: '0.25rem', fontSize: '0.875rem' }}>
                      <FiBook /> Branch
                    </p>
                    <p style={{ fontWeight: 600 }}>{user?.branch}</p>
                  </div>
                  <div>
                    <p style={{ color: 'var(--text-light)', marginBottom: '0.25rem', fontSize: '0.875rem' }}>
                      <FiLayers /> Semester
                    </p>
                    <p style={{ fontWeight: 600 }}>Semester {user?.semester}</p>
                  </div>
                  <div>
                    <p style={{ color: 'var(--text-light)', marginBottom: '0.25rem', fontSize: '0.875rem' }}>
                      <FiCalendar /> Graduation Year
                    </p>
                    <p style={{ fontWeight: 600 }}>{user?.graduationYear || 'Not provided'}</p>
                  </div>
                  <div>
                    <p style={{ color: 'var(--text-light)', marginBottom: '0.25rem', fontSize: '0.875rem' }}>
                      <FiHome /> College
                    </p>
                    <p style={{ fontWeight: 600 }}>{user?.college || 'Not provided'}</p>
                  </div>
                </div>
              </div>

              {/* Bio Section */}
              <div>
                <h3 style={{ fontSize: '1.25rem', marginBottom: '1rem', color: 'var(--accent)' }}>
                  <FiFileText /> About Me
                </h3>
                <p style={{ 
                  background: 'var(--bg-light)', 
                  padding: '1rem', 
                  borderRadius: '4px',
                  border: '2px solid var(--border)',
                  color: user?.bio ? 'var(--text-dark)' : 'var(--text-light)',
                  fontStyle: user?.bio ? 'normal' : 'italic'
                }}>
                  {user?.bio || 'No bio provided yet.'}
                </p>
              </div>

              {/* Social Links Section */}
              <div>
                <h3 style={{ fontSize: '1.25rem', marginBottom: '1rem', color: 'var(--success)' }}>
                  Social Links
                </h3>
                <div className="grid" style={{ gridTemplateColumns: 'repeat(3, 1fr)', gap: '1rem' }}>
                  <div>
                    <p style={{ color: 'var(--text-light)', marginBottom: '0.25rem', fontSize: '0.875rem' }}>
                      <FiLinkedin /> LinkedIn
                    </p>
                    {user?.socialLinks?.linkedin ? (
                      <a 
                        href={user.socialLinks.linkedin} 
                        target="_blank" 
                        rel="noopener noreferrer"
                        style={{ color: 'var(--primary)', textDecoration: 'none', fontWeight: 600 }}
                      >
                        Profile
                      </a>
                    ) : (
                      <p style={{ color: 'var(--text-light)', fontStyle: 'italic' }}>Not provided</p>
                    )}
                  </div>
                  <div>
                    <p style={{ color: 'var(--text-light)', marginBottom: '0.25rem', fontSize: '0.875rem' }}>
                      <FiGithub /> GitHub
                    </p>
                    {user?.socialLinks?.github ? (
                      <a 
                        href={user.socialLinks.github} 
                        target="_blank" 
                        rel="noopener noreferrer"
                        style={{ color: 'var(--primary)', textDecoration: 'none', fontWeight: 600 }}
                      >
                        Profile
                      </a>
                    ) : (
                      <p style={{ color: 'var(--text-light)', fontStyle: 'italic' }}>Not provided</p>
                    )}
                  </div>
                  <div>
                    <p style={{ color: 'var(--text-light)', marginBottom: '0.25rem', fontSize: '0.875rem' }}>
                      <FiTwitter /> Twitter
                    </p>
                    {user?.socialLinks?.twitter ? (
                      <a 
                        href={user.socialLinks.twitter} 
                        target="_blank" 
                        rel="noopener noreferrer"
                        style={{ color: 'var(--primary)', textDecoration: 'none', fontWeight: 600 }}
                      >
                        Profile
                      </a>
                    ) : (
                      <p style={{ color: 'var(--text-light)', fontStyle: 'italic' }}>Not provided</p>
                    )}
                  </div>
                </div>
              </div>

              {/* Profile Visibility */}
              <div>
                <h3 style={{ fontSize: '1.25rem', marginBottom: '1rem', color: 'var(--warning)' }}>
                  <FiEye /> Profile Visibility
                </h3>
                <span className={`badge ${
                  user?.profileVisibility === 'public' ? 'badge-success' : 
                  user?.profileVisibility === 'private' ? 'badge-error' : 'badge-warning'
                }`}>
                  {user?.profileVisibility?.toUpperCase() || 'PUBLIC'}
                </span>
                <p style={{ fontSize: '0.875rem', color: 'var(--text-light)', marginTop: '0.5rem' }}>
                  {user?.profileVisibility === 'public' && 'Your profile is visible to everyone'}
                  {user?.profileVisibility === 'private' && 'Your profile is only visible to you'}
                  {user?.profileVisibility === 'contacts' && 'Your profile is visible to your contacts'}
                </p>
              </div>

              {/* Account Info */}
              <div>
                <h3 style={{ fontSize: '1.25rem', marginBottom: '1rem', color: 'var(--text-light)' }}>
                  Account Information
                </h3>
                <div className="grid" style={{ gridTemplateColumns: 'repeat(2, 1fr)', gap: '1.5rem' }}>
                  <div>
                    <p style={{ color: 'var(--text-light)', marginBottom: '0.25rem', fontSize: '0.875rem' }}>
                      Member Since
                    </p>
                    <p style={{ fontWeight: 600 }}>{formatDate(user?.createdAt)}</p>
                  </div>
                  <div>
                    <p style={{ color: 'var(--text-light)', marginBottom: '0.25rem', fontSize: '0.875rem' }}>
                      Account Status
                    </p>
                    <span className="badge badge-success" style={{ textTransform: 'uppercase' }}>
                      {user?.accountStatus || 'ACTIVE'}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          ) : (
            /* ========== EDIT MODE ========== */
            <div className="grid" style={{ gap: '2rem' }}>
              {/* Basic Info Edit */}
              <div>
                <h3 style={{ fontSize: '1.25rem', marginBottom: '1rem', color: 'var(--primary)' }}>
                  Basic Information
                </h3>
                <div className="grid" style={{ gridTemplateColumns: 'repeat(2, 1fr)', gap: '1.5rem' }}>
                  <div className="form-group">
                    <label className="form-label">
                      <FiUser /> Full Name *
                    </label>
                    <input
                      type="text"
                      name="name"
                      className="form-input"
                      value={editForm.name}
                      onChange={handleEditChange}
                      required
                    />
                  </div>
                  <div className="form-group">
                    <label className="form-label">
                      <FiMail /> Email
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
                  <div className="form-group">
                    <label className="form-label">
                      <FiPhone /> Phone Number
                    </label>
                    <input
                      type="tel"
                      name="phone"
                      className="form-input"
                      value={editForm.phone}
                      onChange={handleEditChange}
                      placeholder="e.g., +1 234 567 8900"
                    />
                  </div>
                  <div className="form-group">
                    <label className="form-label">
                      <FiHash /> Enrollment ID
                    </label>
                    <input
                      type="text"
                      name="enrollmentId"
                      className="form-input"
                      value={editForm.enrollmentId}
                      onChange={handleEditChange}
                      placeholder="e.g., 2021CSE001"
                    />
                  </div>
                </div>
              </div>

              {/* Academic Info Edit */}
              <div>
                <h3 style={{ fontSize: '1.25rem', marginBottom: '1rem', color: 'var(--secondary)' }}>
                  Academic Information
                </h3>
                <div className="grid" style={{ gridTemplateColumns: 'repeat(2, 1fr)', gap: '1.5rem' }}>
                  <div className="form-group">
                    <label className="form-label">
                      <FiBook /> Branch *
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
                  <div className="form-group">
                    <label className="form-label">
                      <FiLayers /> Semester *
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
                  <div className="form-group">
                    <label className="form-label">
                      <FiCalendar /> Graduation Year
                    </label>
                    <select
                      name="graduationYear"
                      className="form-select"
                      value={editForm.graduationYear}
                      onChange={handleEditChange}
                    >
                      <option value="">Select Year</option>
                      {graduationYears.map(year => (
                        <option key={year} value={year}>{year}</option>
                      ))}
                    </select>
                  </div>
                  <div className="form-group">
                    <label className="form-label">
                      <FiHome /> College/University
                    </label>
                    <input
                      type="text"
                      name="college"
                      className="form-input"
                      value={editForm.college}
                      onChange={handleEditChange}
                      placeholder="e.g., University Name"
                    />
                  </div>
                </div>
              </div>

              {/* Bio Edit */}
              <div>
                <h3 style={{ fontSize: '1.25rem', marginBottom: '1rem', color: 'var(--accent)' }}>
                  <FiFileText /> About Me
                </h3>
                <div className="form-group">
                  <textarea
                    name="bio"
                    className="form-textarea"
                    value={editForm.bio}
                    onChange={handleEditChange}
                    placeholder="Tell us about yourself, your interests, skills, etc. (max 500 characters)"
                    maxLength={500}
                  />
                  <p style={{ fontSize: '0.75rem', color: 'var(--text-light)', textAlign: 'right' }}>
                    {editForm.bio.length}/500 characters
                  </p>
                </div>
              </div>

              {/* Social Links Edit */}
              <div>
                <h3 style={{ fontSize: '1.25rem', marginBottom: '1rem', color: 'var(--success)' }}>
                  Social Links
                </h3>
                <div className="grid" style={{ gridTemplateColumns: 'repeat(2, 1fr)', gap: '1.5rem' }}>
                  <div className="form-group">
                    <label className="form-label">
                      <FiLinkedin /> LinkedIn Profile URL
                    </label>
                    <input
                      type="url"
                      name="social.linkedin"
                      className="form-input"
                      value={editForm.socialLinks.linkedin}
                      onChange={handleEditChange}
                      placeholder="https://linkedin.com/in/username"
                    />
                  </div>
                  <div className="form-group">
                    <label className="form-label">
                      <FiGithub /> GitHub Profile URL
                    </label>
                    <input
                      type="url"
                      name="social.github"
                      className="form-input"
                      value={editForm.socialLinks.github}
                      onChange={handleEditChange}
                      placeholder="https://github.com/username"
                    />
                  </div>
                  <div className="form-group">
                    <label className="form-label">
                      <FiTwitter /> Twitter Profile URL
                    </label>
                    <input
                      type="url"
                      name="social.twitter"
                      className="form-input"
                      value={editForm.socialLinks.twitter}
                      onChange={handleEditChange}
                      placeholder="https://twitter.com/username"
                    />
                  </div>
                </div>
              </div>

              {/* Profile Visibility Edit */}
              <div>
                <h3 style={{ fontSize: '1.25rem', marginBottom: '1rem', color: 'var(--warning)' }}>
                  <FiEye /> Profile Visibility
                </h3>
                <div className="form-group">
                  <select
                    name="profileVisibility"
                    className="form-select"
                    value={editForm.profileVisibility}
                    onChange={handleEditChange}
                  >
                    {visibilityOptions.map(option => (
                      <option key={option} value={option}>
                        {option.charAt(0).toUpperCase() + option.slice(1)}
                      </option>
                    ))}
                  </select>
                  <p style={{ fontSize: '0.875rem', color: 'var(--text-light)', marginTop: '0.5rem' }}>
                    <strong>Public:</strong> Visible to everyone<br />
                    <strong>Private:</strong> Only visible to you<br />
                    <strong>Contacts:</strong> Visible to your contacts
                  </p>
                </div>
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