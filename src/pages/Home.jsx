import React, { useState, useEffect } from 'react';
import api from '../api/api';
import ResourceCard from '../components/ResourceCard';
import { FiSearch, FiFilter } from 'react-icons/fi';

const Home = () => {
  const [resources, setResources] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filters, setFilters] = useState({
    branch: '',
    semester: '',
    subject: '',
    type: '',
    search: ''
  });

  const branches = ['CSE', 'ECE', 'EEE', 'MECH', 'CIVIL', 'IT', 'OTHER'];
  const semesters = [1, 2, 3, 4, 5, 6, 7, 8];
  const types = ['Notes', 'Assignment', 'PYQ', 'Lab'];

  useEffect(() => {
    fetchResources();
  }, [filters]);

  const fetchResources = async () => {
    setLoading(true);
    try {
      const params = {};
      if (filters.branch) params.branch = filters.branch;
      if (filters.semester) params.semester = filters.semester;
      if (filters.subject) params.subject = filters.subject;
      if (filters.type) params.type = filters.type;
      if (filters.search) params.search = filters.search;

      const res = await api.get('/resources', { params });
      setResources(res.data.resources);
    } catch (error) {
      console.error('Fetch resources error:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleFilterChange = (e) => {
    setFilters({ ...filters, [e.target.name]: e.target.value });
  };

  const clearFilters = () => {
    setFilters({
      branch: '',
      semester: '',
      subject: '',
      type: '',
      search: ''
    });
  };

  return (
    <div className="container">
      <div style={{ textAlign: 'center', margin: '3rem 0 2rem 0' }}>
        <h1 style={{ fontSize: '3rem', marginBottom: '0.5rem' }}>
          Discover <span style={{ 
            background: 'linear-gradient(135deg, var(--primary), var(--secondary))',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
            backgroundClip: 'text'
          }}>Resources</span>
        </h1>
        <p style={{ color: 'var(--text-light)', fontSize: '1.1rem' }}>
          Find notes, assignments, PYQs and more from your peers
        </p>
      </div>

      <div className="filter-container">
        <div className="flex-between mb-2">
          <h3 style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <FiFilter /> Filters
          </h3>
          <button onClick={clearFilters} className="btn btn-sm btn-outline">
            Clear All
          </button>
        </div>

        <div className="form-group">
          <div style={{ position: 'relative' }}>
            <FiSearch style={{ position: 'absolute', left: '1rem', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-light)' }} />
            <input
              type="text"
              name="search"
              className="form-input"
              placeholder="Search resources..."
              value={filters.search}
              onChange={handleFilterChange}
              style={{ paddingLeft: '2.5rem' }}
            />
          </div>
        </div>

        <div className="filter-grid">
          <div>
            <select
              name="branch"
              className="form-select"
              value={filters.branch}
              onChange={handleFilterChange}
            >
              <option value="">All Branches</option>
              {branches.map(branch => (
                <option key={branch} value={branch}>{branch}</option>
              ))}
            </select>
          </div>

          <div>
            <select
              name="semester"
              className="form-select"
              value={filters.semester}
              onChange={handleFilterChange}
            >
              <option value="">All Semesters</option>
              {semesters.map(sem => (
                <option key={sem} value={sem}>Semester {sem}</option>
              ))}
            </select>
          </div>

          <div>
            <input
              type="text"
              name="subject"
              className="form-input"
              placeholder="Subject (e.g., Mathematics)"
              value={filters.subject}
              onChange={handleFilterChange}
            />
          </div>

          <div>
            <select
              name="type"
              className="form-select"
              value={filters.type}
              onChange={handleFilterChange}
            >
              <option value="">All Types</option>
              {types.map(type => (
                <option key={type} value={type}>{type}</option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {loading ? (
        <div className="spinner"></div>
      ) : resources.length === 0 ? (
        <div className="empty-state">
          <div className="empty-state-icon">📚</div>
          <h2 className="empty-state-title">No resources found</h2>
          <p className="empty-state-text">
            Try adjusting your filters or be the first to upload!
          </p>
        </div>
      ) : (
        <>
          <p style={{ marginBottom: '1.5rem', color: 'var(--text-light)', fontWeight: 600 }}>
            Found {resources.length} resource{resources.length !== 1 ? 's' : ''}
          </p>
          <div className="grid grid-3">
            {resources.map(resource => (
              <ResourceCard key={resource._id} resource={resource} />
            ))}
          </div>
        </>
      )}
    </div>
  );
};

export default Home;