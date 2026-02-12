import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { 
  FiHome, 
  FiUpload, 
  FiBookmark, 
  FiUser, 
  FiLogOut, 
  FiShield, 
  FiMenu, 
  FiX, 
  FiInfo, 
  FiMail, 
  FiUsers 
} from 'react-icons/fi';

const Navbar = () => {
  const { user, logout, isAuthenticated, isAdmin } = useAuth();
  const navigate = useNavigate();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isMobile, setIsMobile] = useState(window.innerWidth <= 768);

  // Check if mobile on resize
  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth <= 768);
      // Close menu when switching to desktop
      if (window.innerWidth > 768) {
        setIsMenuOpen(false);
      }
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  // Close menu when navigating
  const handleNavClick = () => {
    setIsMenuOpen(false);
  };

  const handleLogout = () => {
    logout();
    navigate('/login');
    handleNavClick();
  };

  // Toggle menu
  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  return (
    <nav className="navbar">
      <div className="navbar-container">
        {/* Logo */}
        <Link to="/" className="navbar-logo" onClick={handleNavClick}>
          <span>CampusShare</span>
        </Link>

        {/* Hamburger Icon - Visible only on mobile */}
        <button 
          className="hamburger-btn" 
          onClick={toggleMenu}
          aria-label="Toggle menu"
        >
          {isMenuOpen ? <FiX size={24} /> : <FiMenu size={24} />}
        </button>

        {/* Navigation Links */}
        <ul className={`navbar-links ${isMenuOpen ? 'active' : ''}`}>
          {/* Home link - ALWAYS visible */}
          <li>
            <Link to="/" onClick={handleNavClick}>
              <FiHome style={{ display: 'inline', marginRight: '0.3rem' }} />
              Home
            </Link>
          </li>

          {/* ✅ FEATURES LINK - Public */}
          <li>
            <Link to="/features" onClick={handleNavClick}>
              <FiInfo style={{ display: 'inline', marginRight: '0.3rem' }} />
              Features
            </Link>
          </li>

          {/* ✅ ABOUT LINK - Public */}
          <li>
            <Link to="/about" onClick={handleNavClick}>
              <FiUsers style={{ display: 'inline', marginRight: '0.3rem' }} />
              About
            </Link>
          </li>

          {/* ✅ CONTACT LINK - Public */}
          <li>
            <Link to="/contact" onClick={handleNavClick}>
              <FiMail style={{ display: 'inline', marginRight: '0.3rem' }} />
              Contact
            </Link>
          </li>

          {/* LINKS FOR AUTHENTICATED USERS */}
          {isAuthenticated ? (
            <>
              {/* Student-only links */}
              {!isAdmin && (
                <>
                  <li>
                    <Link to="/upload" onClick={handleNavClick}>
                      <FiUpload style={{ display: 'inline', marginRight: '0.3rem' }} />
                      Upload
                    </Link>
                  </li>
                  <li>
                    <Link to="/bookmarks" onClick={handleNavClick}>
                      <FiBookmark style={{ display: 'inline', marginRight: '0.3rem' }} />
                      Bookmarks
                    </Link>
                  </li>
                  <li>
                    <Link to="/profile" onClick={handleNavClick}>
                      <FiUser style={{ display: 'inline', marginRight: '0.3rem' }} />
                      Profile
                    </Link>
                  </li>
                </>
              )}
              
              {/* Admin-only links */}
              {isAdmin && (
                <li>
                  <Link to="/admin" onClick={handleNavClick}>
                    <FiShield style={{ display: 'inline', marginRight: '0.3rem' }} />
                    Admin Panel
                  </Link>
                </li>
              )}
              
              {/* Logout button */}
              <li className="logout-item">
                <button onClick={handleLogout} className="btn btn-sm btn-outline logout-btn">
                  <FiLogOut style={{ display: 'inline', marginRight: '0.3rem' }} />
                  Logout
                </button>
              </li>
            </>
          ) : (
            /* LINKS FOR NON-AUTHENTICATED USERS */
            <>
              <li>
                <Link to="/login" className="btn btn-sm btn-secondary" onClick={handleNavClick}>
                  Login
                </Link>
              </li>
              <li>
                <Link to="/signup" className="btn btn-sm btn-primary" onClick={handleNavClick}>
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