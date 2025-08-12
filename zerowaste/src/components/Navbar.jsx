import { Link, NavLink } from 'react-router-dom';
import './Navbar.css';

export default function Navbar() {
  return (
    <header className="nav-header">
      <div className="nav-brand">
        <Link to="/" className="brand-link">
          <span className="brand-flag saffron" />
          <span className="brand-flag white" />
          <span className="brand-flag green" />
          <span className="brand-text">ZeroWaste</span>
        </Link>
        <span className="tagline">Freedom from Hunger</span>
      </div>
      <nav className="nav-links">
        <NavLink to="/" end>Home</NavLink>
        <NavLink to="/donor">Donor Registration</NavLink>
        <NavLink to="/ngo">NGO Registration</NavLink>
        <NavLink to="/donate">Post Donation</NavLink>
        <NavLink to="/listings">View Listings</NavLink>
      </nav>
    </header>
  );
}