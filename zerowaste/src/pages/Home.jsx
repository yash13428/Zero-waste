import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import MealCounter from '../components/MealCounter';
import PersonalizedStats from '../components/PersonalizedStats';
import './pages.css';

export default function Home() {
  const [user, setUser] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const savedUser = localStorage.getItem('zerowaste_user');
    const savedNgoName = localStorage.getItem('zerowaste_ngo_name');
    
    if (savedUser) {
      const userData = JSON.parse(savedUser);
      setUser(userData);
    } else if (savedNgoName) {
      setUser({ name: savedNgoName, role: 'ngo' });
    }
  }, []);

  const handleRoleAction = (role) => {
    if (!user) {
      // Not logged in - redirect to login with return URL
      localStorage.setItem('zerowaste_return_url', '/');
      navigate('/login');
      return;
    }
    
    // Already logged in - navigate to role-specific page with correct tab
    if (role === 'feeder') {
      // Navigate to listings with Active Contributions tab for Feeders
      navigate('/listings?tab=active');
    } else if (role === 'ngo') {
      // Navigate to listings with Available Donations tab for NGOs
      navigate('/listings?tab=available');
    }
  };

  return (
    <div className="container">
      <section className="hero">
        <div className="hero-text">
          <h1>ZeroWaste — Freedom from Hunger</h1>
          <p>
            A food surplus redistribution platform for Independence Day —
            connecting donors with NGOs to serve more meals and reduce waste.
          </p>
          {!user ? (
            // Show both buttons when logged out
            <div className="cta-buttons">
              <button 
                onClick={() => handleRoleAction('feeder')} 
                className="btn large saffron"
              >
                I am a Feeder
              </button>
              <button 
                onClick={() => handleRoleAction('ngo')} 
                className="btn large green"
              >
                I am an NGO
              </button>
            </div>
          ) : (
            // Show only relevant button when logged in
            <div className="cta-buttons">
              {user.role === 'feeder' ? (
                <button 
                  onClick={() => handleRoleAction('feeder')} 
                  className="btn large saffron"
                >
                  I am a Feeder
                </button>
              ) : (
                <button 
                  onClick={() => handleRoleAction('ngo')} 
                  className="btn large green"
                >
                  I am an NGO
                </button>
              )}
            </div>
          )}
          <div className="counter-wrap">
            <MealCounter />
          </div>
        </div>
        <div className="hero-flag" aria-hidden>
          <div className="stripe saffron" />
          <div className="stripe white" />
          <div className="stripe green" />
        </div>
      </section>

      {/* Personalized Stats for logged-in users */}
      {user && (
        <section className="personalized-stats-section">
          <PersonalizedStats user={user} />
        </section>
      )}

      <section className="facts-grid">
        <div className="fact-card">
          <h3>India wastes ~50 kg of food per person annually</h3>
          <p>Every kilogram saved can become multiple meals for those in need.</p>
        </div>
        <div className="fact-card">
          <h3>67 million tonnes of food is wasted every year</h3>
          <p>Digital coordination between donors and NGOs can change this.</p>
        </div>
        <div className="fact-card">
          <h3>Over 194 million people in India are undernourished</h3>
          <p>Let's serve more plates, faster. Together.</p>
        </div>
      </section>

      <section className="how-it-works">
        <h2>How it works</h2>
        <ol>
          <li>Feeders post surplus food details with pickup info.</li>
          <li>NGOs view nearby listings and claim pickups.</li>
          <li>Each claim updates the live Total Meals Served counter.</li>
        </ol>
      </section>
    </div>
  );
}