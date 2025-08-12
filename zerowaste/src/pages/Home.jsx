import { Link } from 'react-router-dom';
import MealCounter from '../components/MealCounter';
import './pages.css';

export default function Home() {
  return (
    <div className="container">
      <section className="hero">
        <div className="hero-text">
          <h1>ZeroWaste — Freedom from Hunger</h1>
          <p>
            A food surplus redistribution platform for Independence Day —
            connecting donors with NGOs to serve more meals and reduce waste.
          </p>
          <div className="cta-buttons">
            <Link to="/donate" className="btn large saffron">I am a Donor</Link>
            <Link to="/listings" className="btn large green">I am an NGO</Link>
          </div>
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
          <p>Let’s serve more plates, faster. Together.</p>
        </div>
      </section>

      <section className="how-it-works">
        <h2>How it works</h2>
        <ol>
          <li>Donors post surplus food details with pickup info.</li>
          <li>NGOs view nearby listings and claim pickups.</li>
          <li>Each claim updates the live Meals Served counter.</li>
        </ol>
      </section>
    </div>
  );
}