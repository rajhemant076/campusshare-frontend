import React, { useState, useEffect, useCallback, useMemo } from 'react';
import api from '../api/api';
import ResourceCard from '../components/ResourceCard';
import { FiSearch, FiFilter, FiX } from 'react-icons/fi';
import { debounce } from 'lodash';

const Home = () => {
  const [resources, setResources] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [pagination, setPagination] = useState({
    page: 1,
    totalPages: 1,
    total: 0
  });
  
  const [filters, setFilters] = useState({
    branch: '',
    semester: '',
    subject: '',
    type: '',
    search: ''
  });

  const [showFilters, setShowFilters] = useState(false);

  const branches = ['CSE', 'ECE', 'EEE', 'MECH', 'CIVIL', 'IT', 'OTHER'];
  const semesters = [1, 2, 3, 4, 5, 6, 7, 8];
  const types = ['Notes', 'Assignment', 'PYQ', 'Lab'];

  // Memoized query params
  const queryParams = useMemo(() => {
    const params = new URLSearchParams();
    params.append('page', pagination.page);
    params.append('limit', 12);
    
    if (filters.branch) params.append('branch', filters.branch);
    if (filters.semester) params.append('semester', filters.semester);
    if (filters.subject) params.append('subject', filters.subject);
    if (filters.type) params.append('type', filters.type);
    if (filters.search) params.append('search', filters.search);
    
    return params;
  }, [filters, pagination.page]);

  // Debounced search
  const debouncedSearch = useCallback(
    debounce((searchTerm) => {
      setFilters(prev => ({ ...prev, search: searchTerm }));
      setPagination(prev => ({ ...prev, page: 1 }));
    }, 500),
    []
  );

  const handleSearchChange = (e) => {
    debouncedSearch(e.target.value);
  };

  const fetchResources = useCallback(async () => {
    setLoading(true);
    setError(null);
    
    try {
      const res = await api.get(`/resources?${queryParams.toString()}`);
      
      if (pagination.page === 1) {
        setResources(res.data.resources);
      } else {
        setResources(prev => [...prev, ...res.data.resources]);
      }
      
      setPagination({
        page: res.data.page || 1,
        totalPages: res.data.totalPages || 1,
        total: res.data.total || res.data.resources.length
      });
    } catch (error) {
      console.error('Fetch resources error:', error);
      setError('Failed to load resources. Please try again.');
    } finally {
      setLoading(false);
    }
  }, [queryParams, pagination.page]);

  useEffect(() => {
    fetchResources();
  }, [fetchResources]);

  const handleFilterChange = (e) => {
    const { name, value } = e.target;
    setFilters(prev => ({ ...prev, [name]: value }));
    setPagination(prev => ({ ...prev, page: 1 }));
  };

  const clearFilters = () => {
    setFilters({
      branch: '',
      semester: '',
      subject: '',
      type: '',
      search: ''
    });
    setPagination(prev => ({ ...prev, page: 1 }));
  };

  const loadMore = () => {
    if (pagination.page < pagination.totalPages) {
      setPagination(prev => ({ ...prev, page: prev.page + 1 }));
    }
  };

  const activeFilterCount = Object.values(filters).filter(Boolean).length;

  return (
    <div className="container">
      <div style={{ textAlign: 'center', margin: '2rem 0 1.5rem 0' }}>
        <h1 style={{ fontSize: '2.5rem', marginBottom: '0.5rem' }}>
          Discover <span style={{ 
            background: 'linear-gradient(135deg, var(--primary), var(--secondary))',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
            backgroundClip: 'text'
          }}>Resources</span>
        </h1>
        <p style={{ color: 'var(--text-light)' }}>
          Find notes, assignments, PYQs and more from your peers
        </p>
      </div>

      {/* Search Bar - Always visible */}
      <div style={{ marginBottom: '1rem' }}>
        <div style={{ position: 'relative' }}>
          <FiSearch style={{ 
            position: 'absolute', 
            left: '1rem', 
            top: '50%', 
            transform: 'translateY(-50%)', 
            color: 'var(--text-light)' 
          }} />
          <input
            type="text"
            className="form-input"
            placeholder="Search resources by title, subject, or description..."
            onChange={handleSearchChange}
            defaultValue={filters.search}
            style={{ 
              paddingLeft: '2.5rem',
              paddingRight: activeFilterCount > 0 ? '3rem' : '1rem'
            }}
          />
          {activeFilterCount > 0 && (
            <button
              onClick={clearFilters}
              style={{
                position: 'absolute',
                right: '1rem',
                top: '50%',
                transform: 'translateY(-50%)',
                background: 'none',
                border: 'none',
                color: 'var(--primary)',
                cursor: 'pointer',
                fontSize: '0.875rem'
              }}
            >
              Clear {activeFilterCount} filter{activeFilterCount > 1 ? 's' : ''}
            </button>
          )}
        </div>
      </div>

      {/* Filter Toggle for Mobile */}
      <button
        onClick={() => setShowFilters(!showFilters)}
        className="btn btn-outline w-full mb-2 md:hidden"
        style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.5rem' }}
      >
        <FiFilter /> {showFilters ? 'Hide Filters' : 'Show Filters'}
      </button>

      {/* Filters Section */}
      <div className={`filter-container ${showFilters ? 'block' : 'hidden md:block'}`}>
        <div className="flex-between mb-2">
          <h3 style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <FiFilter /> Filters
          </h3>
          <button onClick={clearFilters} className="btn btn-sm btn-outline">
            Clear All
          </button>
        </div>

        <div className="filter-grid">
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

          <input
            type="text"
            name="subject"
            className="form-input"
            placeholder="Subject"
            value={filters.subject}
            onChange={handleFilterChange}
          />

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

      {/* Error State */}
      {error && (
        <div className="alert alert-error" style={{ margin: '2rem 0' }}>
          {error}
          <button 
            onClick={fetchResources}
            className="btn btn-sm btn-outline ml-4"
          >
            Try Again
          </button>
        </div>
      )}

      {/* Loading Skeletons */}
      {loading && pagination.page === 1 ? (
        <div className="grid grid-3" style={{ gap: '1.5rem', marginTop: '2rem' }}>
          {[1, 2, 3, 4, 5, 6].map(i => (
            <div key={i} className="card" style={{ height: '250px' }}>
              <div className="animate-pulse">
                <div className="h-4 bg-gray-200 rounded w-3/4 mb-4"></div>
                <div className="h-3 bg-gray-200 rounded w-full mb-2"></div>
                <div className="h-3 bg-gray-200 rounded w-5/6 mb-4"></div>
                <div className="flex gap-2 mb-4">
                  <div className="h-6 bg-gray-200 rounded w-16"></div>
                  <div className="h-6 bg-gray-200 rounded w-16"></div>
                </div>
                <div className="flex gap-2">
                  <div className="h-8 bg-gray-200 rounded w-20"></div>
                  <div className="h-8 bg-gray-200 rounded w-20"></div>
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : resources.length === 0 ? (
        <div className="empty-state" style={{ margin: '3rem 0' }}>
          <div className="empty-state-icon">📚</div>
          <h2 className="empty-state-title">No resources found</h2>
          <p className="empty-state-text">
            Try adjusting your filters or be the first to upload!
          </p>
        </div>
      ) : (
        <>
          <p style={{ margin: '1.5rem 0', color: 'var(--text-light)', fontWeight: 600 }}>
            Found {pagination.total} resource{pagination.total !== 1 ? 's' : ''}
          </p>
          
          <div className="grid grid-3">
            {resources.map(resource => (
              <ResourceCard key={resource._id} resource={resource} />
            ))}
          </div>

          {/* Load More Button */}
          {pagination.page < pagination.totalPages && (
            <div style={{ textAlign: 'center', marginTop: '2rem' }}>
              <button
                onClick={loadMore}
                className="btn btn-outline"
                disabled={loading}
              >
                {loading ? 'Loading...' : `Load More (${pagination.page}/${pagination.totalPages})`}
              </button>
            </div>
          )}
        </>
      )}
    </div>
  );
};

export default Home;