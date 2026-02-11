import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { FiHome, FiUpload, FiBookmark, FiUser, FiLogOut, FiShield } from 'react-icons/fi';

const Navbar = () => {
  const { user, logout, isAuthenticated, isAdmin } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <nav className="navbar">
      <div className="navbar-container">
        <Link to="/" className="navbar-logo">
          <span>CampusShare</span>
        </Link>

        <ul className="navbar-links">
          {isAuthenticated ? (
            <>
              <li>
                <Link to="/">
                  <FiHome style={{ display: 'inline', marginRight: '0.3rem' }} />
                  Home
                </Link>
              </li>
              {!isAdmin && (
                <>
                  <li>
                    <Link to="/upload">
                      <FiUpload style={{ display: 'inline', marginRight: '0.3rem' }} />
                      Upload
                    </Link>
                  </li>
                  <li>
                    <Link to="/bookmarks">
                      <FiBookmark style={{ display: 'inline', marginRight: '0.3rem' }} />
                      Bookmarks
                    </Link>
                  </li>
                  <li>
                    <Link to="/profile">
                      <FiUser style={{ display: 'inline', marginRight: '0.3rem' }} />
                      Profile
                    </Link>
                  </li>
                </>
              )}
              {isAdmin && (
                <li>
                  <Link to="/admin">
                    <FiShield style={{ display: 'inline', marginRight: '0.3rem' }} />
                    Admin Panel
                  </Link>
                </li>
              )}
              <li>
                <button onClick={handleLogout} className="btn btn-sm btn-outline">
                  <FiLogOut />
                  Logout
                </button>
              </li>
            </>
          ) : (
            <>
              <li>
                <Link to="/login" className="btn btn-sm btn-secondary">
                  Login
                </Link>
              </li>
              <li>
                <Link to="/signup" className="btn btn-sm btn-primary">
                  Sign Up
                </Link>
              </li>
            </>
          )}
        </ul>
      </div>
    </nav>
  );
};

export default Navbar;