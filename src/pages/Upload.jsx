import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../api/api';
import { FiUpload, FiFile } from 'react-icons/fi';

const Upload = () => {
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    branch: 'CSE',
    semester: '1',
    subject: '',
    type: 'Notes'
  });
  const [file, setFile] = useState(null);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [loading, setLoading] = useState(false);

  const navigate = useNavigate();

  const branches = ['CSE', 'ECE', 'EEE', 'MECH', 'CIVIL', 'IT', 'OTHER'];
  const semesters = [1, 2, 3, 4, 5, 6, 7, 8];
  const types = ['Notes', 'Assignment', 'PYQ', 'Lab'];

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleFileChange = (e) => {
    const selectedFile = e.target.files[0];
    if (selectedFile) {
      if (selectedFile.type !== 'application/pdf') {
        setError('Only PDF files are allowed');
        setFile(null);
        return;
      }
      if (selectedFile.size > 10 * 1024 * 1024) {
        setError('File size must be less than 10MB');
        setFile(null);
        return;
      }
      setFile(selectedFile);
      setError('');
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    if (!file) {
      setError('Please select a PDF file');
      return;
    }

    setLoading(true);

    try {
      const data = new FormData();
      data.append('title', formData.title);
      data.append('description', formData.description);
      data.append('branch', formData.branch);
      data.append('semester', formData.semester);
      data.append('subject', formData.subject);
      data.append('type', formData.type);
      data.append('file', file);

      await api.post('/resources/upload', data, {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      });

      setSuccess('Resource uploaded successfully! Awaiting admin approval.');
      
      setFormData({
        title: '',
        description: '',
        branch: 'CSE',
        semester: '1',
        subject: '',
        type: 'Notes'
      });
      setFile(null);

      setTimeout(() => {
        navigate('/profile');
      }, 2000);

    } catch (err) {
      setError(err.response?.data?.message || 'Upload failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container container-md" style={{ marginTop: '3rem', marginBottom: '3rem' }}>
      <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
        <h1 style={{ fontSize: '2.5rem', marginBottom: '0.5rem' }}>
          <FiUpload style={{ display: 'inline', marginRight: '0.5rem' }} />
          Upload Resource
        </h1>
        <p style={{ color: 'var(--text-light)' }}>Share your notes and help your peers</p>
      </div>

      <div className="card">
        {error && (
          <div className="alert alert-error" style={{ marginBottom: '1.5rem' }}>
            {error}
          </div>
        )}

        {success && (
          <div className="alert alert-success" style={{ marginBottom: '1.5rem' }}>
            {success}
          </div>
        )}

        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label className="form-label">Title *</label>
            <input
              type="text"
              name="title"
              className="form-input"
              placeholder="e.g., Data Structures Complete Notes"
              value={formData.title}
              onChange={handleChange}
              required
            />
          </div>

          <div className="form-group">
            <label className="form-label">Description *</label>
            <textarea
              name="description"
              className="form-textarea"
              placeholder="Describe the content, topics covered, etc."
              value={formData.description}
              onChange={handleChange}
              required
            />
          </div>

          <div className="grid" style={{ gridTemplateColumns: 'repeat(2, 1fr)', gap: '1rem' }}>
            <div className="form-group">
              <label className="form-label">Branch *</label>
              <select
                name="branch"
                className="form-select"
                value={formData.branch}
                onChange={handleChange}
                required
              >
                {branches.map(branch => (
                  <option key={branch} value={branch}>{branch}</option>
                ))}
              </select>
            </div>

            <div className="form-group">
              <label className="form-label">Semester *</label>
              <select
                name="semester"
                className="form-select"
                value={formData.semester}
                onChange={handleChange}
                required
              >
                {semesters.map(sem => (
                  <option key={sem} value={sem}>Semester {sem}</option>
                ))}
              </select>
            </div>
          </div>

          <div className="grid" style={{ gridTemplateColumns: 'repeat(2, 1fr)', gap: '1rem' }}>
            <div className="form-group">
              <label className="form-label">Subject *</label>
              <input
                type="text"
                name="subject"
                className="form-input"
                placeholder="e.g., Data Structures"
                value={formData.subject}
                onChange={handleChange}
                required
              />
            </div>

            <div className="form-group">
              <label className="form-label">Type *</label>
              <select
                name="type"
                className="form-select"
                value={formData.type}
                onChange={handleChange}
                required
              >
                {types.map(type => (
                  <option key={type} value={type}>{type}</option>
                ))}
              </select>
            </div>
          </div>

          <div className="form-group">
            <label className="form-label">
              <FiFile style={{ display: 'inline', marginRight: '0.5rem' }} />
              Upload PDF File *
            </label>
            <input
              type="file"
              accept=".pdf"
              onChange={handleFileChange}
              className="form-input"
              required
            />
            {file && (
              <p style={{ marginTop: '0.5rem', fontSize: '0.875rem', color: 'var(--success)' }}>
                Selected: {file.name} ({(file.size / 1024 / 1024).toFixed(2)} MB)
              </p>
            )}
            <p style={{ marginTop: '0.5rem', fontSize: '0.875rem', color: 'var(--text-light)' }}>
              Maximum file size: 10MB. Only PDF files are allowed.
            </p>
          </div>

          <div className="alert alert-info">
            <strong>Note:</strong> Your upload will be reviewed by an admin before it becomes visible to other students.
          </div>

          <button type="submit" className="btn btn-primary w-full" disabled={loading}>
            {loading ? 'Uploading...' : 'Upload Resource'}
          </button>
        </form>
      </div>
    </div>
  );
};

export default Upload;