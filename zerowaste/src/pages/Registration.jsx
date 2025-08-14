import { Link } from 'react-router-dom';
import './pages.css';

export default function Registration() {
  return (
    <div className="container narrow">
      <h1>Choose Your Registration Type</h1>
      <p className="hero-text">
        Select how you'd like to participate in reducing food waste and serving more meals.
      </p>

      <div className="registration-cards">
        <div className="registration-card feeder">
          <div className="card-header">
            <h2>I'm a Feeder</h2>
            <p>I have surplus food to donate</p>
          </div>
          <div className="card-content">
            <ul>
              <li>Restaurants & Caterers</li>
              <li>Event Organizers</li>
              <li>Households</li>
              <li>Food Businesses</li>
            </ul>
            <p>Post your surplus food and connect with NGOs who can collect and distribute it to those in need.</p>
          </div>
          <div className="card-actions">
            <Link to="/feeder" className="btn large saffron">Register as Feeder</Link>
          </div>
        </div>

        <div className="registration-card ngo">
          <div className="card-header">
            <h2>I'm an NGO</h2>
            <p>I distribute food to those in need</p>
          </div>
          <div className="card-content">
            <ul>
              <li>Charitable Organizations</li>
              <li>Community Kitchens</li>
              <li>Food Banks</li>
              <li>Non-Profit Organizations</li>
            </ul>
            <p>Browse available donations in your area and coordinate pickups to serve more meals.</p>
          </div>
          <div className="card-actions">
            <Link to="/ngo" className="btn large green">Register as NGO</Link>
          </div>
        </div>
      </div>

      <div className="registration-footer">
        <p className="muted">Already have an account? <Link to="/login">Log in here</Link></p>
      </div>
    </div>
  );
}
