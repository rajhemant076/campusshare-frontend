import React from 'react';
import { Link } from 'react-router-dom';
import { 
  FiHeart, 
  FiGithub, 
  FiTwitter, 
  FiLinkedin, 
  FiMail, 
  FiMapPin, 
  FiPhone,
  FiBook,
  FiShield,
  FiHelpCircle,
  FiFileText,
  FiInstagram,
  FiYoutube
} from 'react-icons/fi';

const Footer = () => {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="footer">
      <div className="footer-container">
        {/* ========== TOP SECTION ========== */}
        <div className="footer-top">
          {/* Brand Section */}
          <div className="footer-brand">
            <Link to="/" className="footer-logo">
              <span>CampusShare</span>
            </Link>
            <p className="footer-tagline">
              Share knowledge, grow together. A platform for students to share and discover academic resources.
            </p>
            <div className="footer-social">
              <a 
                href="https://github.com/rajhemant076" 
                target="_blank" 
                rel="noopener noreferrer"
                className="social-icon"
                aria-label="GitHub"
              >
                <FiGithub />
              </a>
              {/* <a 
                href="https://twitter.com" 
                target="_blank" 
                rel="noopener noreferrer"
                className="social-icon"
                aria-label="Twitter"
              >
                <FiTwitter />
              </a> */}
              <a 
                href="https://www.linkedin.com/in/hemant-raj-04452a326" 
                target="_blank" 
                rel="noopener noreferrer"
                className="social-icon"
                aria-label="LinkedIn"
              >
                <FiLinkedin />
              </a>
              <a 
                href="https://www.instagram.com/hemant_raj1401?igsh=MThoMXR2ZTQxcmRieQ==" 
                target="_blank" 
                rel="noopener noreferrer"
                className="social-icon"
                aria-label="Instagram"
              >
                <FiInstagram />
              </a>
              {/* <a 
                href="https://youtube.com" 
                target="_blank" 
                rel="noopener noreferrer"
                className="social-icon"
                aria-label="YouTube"
              >
                <FiYoutube />
              </a> */}
            </div>
          </div>

          {/* Quick Links Section */}
          <div className="footer-links">
            <h3 className="footer-title">Quick Links</h3>
            <ul>
              <li>
                <Link to="/">
                  <FiBook /> Browse Resources
                </Link>
              </li>
              <li>
                <Link to="/upload">
                  <FiFileText /> Upload Resource
                </Link>
              </li>
              <li>
                <Link to="/bookmarks">
                  <FiHeart /> My Bookmarks
                </Link>
              </li>
              <li>
                <Link to="/profile">
                  <FiShield /> My Profile
                </Link>
              </li>
            </ul>
          </div>

          {/* Support Section */}
          <div className="footer-links">
            <h3 className="footer-title">Support</h3>
            <ul>
              <li>
                <Link to="/help">
                  <FiHelpCircle /> Help Center
                </Link>
              </li>
              <li>
                <Link to="/faq">
                  <FiHelpCircle /> FAQ
                </Link>
              </li>
              <li>
                <Link to="/contact">
                  <FiMail /> Contact Us
                </Link>
              </li>
              <li>
                <Link to="/report">
                  <FiShield /> Report Issue
                </Link>
              </li>
            </ul>
          </div>

          {/* Contact Section */}
          <div className="footer-contact">
            <h3 className="footer-title">Contact Us</h3>
            <ul>
              <li>
                <FiMapPin />
                <span>123 Campus Share,Patna Bihar</span>
              </li>
              <li>
                <FiPhone />
                <span>+91 9876543211</span>
              </li>
              <li>
                <FiMail />
                <a href="mailto:support@campusshare.com">support@campusshare.com</a>
              </li>
            </ul>
          </div>
        </div>

        {/* ========== BOTTOM SECTION ========== */}
        <div className="footer-bottom">
          <div className="footer-bottom-content">
            <p className="copyright">
              © {currentYear} CampusShare. All rights reserved.
            </p>
            <div className="footer-bottom-links">
              <Link to="/privacy">Privacy Policy</Link>
              <span className="separator">•</span>
              <Link to="/terms">Terms of Service</Link>
              <span className="separator">•</span>
              <Link to="/cookies">Cookie Policy</Link>
            </div>
          </div>
          <div className="footer-credit">
            <p>
              Made with <FiHeart style={{ color: 'var(--error)', display: 'inline' }} /> for students
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;