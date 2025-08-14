import { useState, useEffect } from 'react';
import { Link, NavLink, useLocation } from 'react-router-dom';
import './Navbar.css';

export default function Navbar() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [user, setUser] = useState(null);
  const [userRole, setUserRole] = useState(null);
  const location = useLocation();

  // Check authentication and user role
  useEffect(() => {
    const savedUser = localStorage.getItem('zerowaste_user');
    const savedNgoName = localStorage.getItem('zerowaste_ngo_name');
    
    if (savedUser) {
      const userData = JSON.parse(savedUser);
      setUser(userData);
      setUserRole(userData.role || 'feeder');
    } else if (savedNgoName) {
      // Legacy NGO user
      setUser({ name: savedNgoName, role: 'ngo' });
      setUserRole('ngo');
    } else {
      setUser(null);
      setUserRole(null);
    }
  }, []);

  const toggleMobileMenu = () => {
    setMobileMenuOpen(!mobileMenuOpen);
  };

  const closeMobileMenu = () => {
    setMobileMenuOpen(false);
  };

  const handleLogout = () => {
    localStorage.removeItem('zerowaste_user');
    localStorage.removeItem('zerowaste_ngo_name');
    setUser(null);
    setUserRole(null);
    window.location.href = '/';
  };

  const getCTAText = () => {
    if (!userRole) return null;
    return userRole === 'feeder' ? 'Share a Meal' : 'Find Donations';
  };

  const getCTALink = () => {
    if (!userRole) return '/register';
    return userRole === 'feeder' ? '/donate' : '/listings';
  };

  const getFirstName = (name) => {
    return name ? name.split(' ')[0] : 'User';
  };

  return (
    <header className="nav-header">
      <div className="nav-brand">
        <Link to="/" className="brand-link" onClick={closeMobileMenu}>
          <span className="brand-flag saffron" />
          <span className="brand-flag white" />
          <span className="brand-flag green" />
          <span className="brand-text">ZeroWaste</span>
        </Link>
        <span className="tagline">Freedom from Hunger</span>
      </div>
      
      <button 
        className="mobile-menu-toggle" 
        onClick={toggleMobileMenu}
        aria-label="Toggle navigation menu"
      >
        {mobileMenuOpen ? '✕' : '☰'}
      </button>
      
      <nav className={`nav-links ${mobileMenuOpen ? 'open' : ''}`}>
        {/* Home with hover submenu */}
        <div className="nav-item with-submenu">
          <NavLink to="/" end onClick={closeMobileMenu}>
            Home
          </NavLink>
          <div className="submenu">
            <Link to="/about" onClick={closeMobileMenu}>About Us</Link>
          </div>
        </div>

        {/* Registration - only show when not logged in */}
        {!user && (
          <NavLink to="/register" onClick={closeMobileMenu}>
            Registration
          </NavLink>
        )}

        {/* Login - only show when not logged in */}
        {!user && (
          <NavLink to="/login" onClick={closeMobileMenu}>
            Login
          </NavLink>
        )}

        {/* View Listings */}
        <NavLink to="/listings" onClick={closeMobileMenu}>
          View Listings
        </NavLink>

        {/* CTA Button - moved before user greeting */}
        {getCTAText() && (
          <Link to={getCTALink()} className="btn cta-btn" onClick={closeMobileMenu}>
            {getCTAText()}
          </Link>
        )}

        {/* User greeting with hover logout - only show when logged in */}
        {user && (
          <div className="user-greeting-container">
            <span className="user-greeting">Hi, {getFirstName(user.name)}</span>
            <div className="logout-dropdown">
              <button onClick={handleLogout} className="btn logout-btn">
                Logout
              </button>
            </div>
          </div>
        )}

        {/* Fund the Cause - moved to last position */}
        <NavLink to="/donation" onClick={closeMobileMenu}>
          Fund the Cause
        </NavLink>
      </nav>
    </header>
  );
}