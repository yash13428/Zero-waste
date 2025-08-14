import { Link } from 'react-router-dom';
import './pages.css';

export default function AboutUs() {
  return (
    <div className="container narrow">
      <h1>About ZeroWaste</h1>
      <p className="hero-text">
        ZeroWaste is a food surplus redistribution platform connecting Feeders (restaurants, event organizers, households) 
        with NGOs to reduce food waste and serve more meals to those in need.
      </p>

      <section className="how-it-works-section">
        <h2>How it Works</h2>
        
        <div className="role-section">
          <h3>For Feeders</h3>
          <ol>
            <li><strong>Register as Feeder</strong> → Complete registration and verify your email address</li>
            <li><strong>Log in</strong> → Access your dashboard to post food donations</li>
            <li><strong>Post a donation</strong> with details:
              <ul>
                <li>Your name and contact information</li>
                <li>Food type and quantity</li>
                <li>Estimated number of meals</li>
                <li>Expiry date and time</li>
                <li>Pickup location and time window</li>
                <li>Additional notes (dietary restrictions, packaging info)</li>
              </ul>
            </li>
            <li><strong>Get notified</strong> → Nearby NGOs are automatically notified based on your city/area</li>
            <li><strong>Status updates</strong> → See when an NGO books your donation</li>
            <li><strong>Handover</strong> → Coordinate pickup at the scheduled time</li>
          </ol>
        </div>

        <div className="role-section">
          <h3>For NGOs</h3>
          <ol>
            <li><strong>Register as NGO</strong> → Provide your organization details and coverage areas (e.g., Chandigarh)</li>
            <li><strong>Receive notifications</strong> → Get alerts for matching donations in your registered areas</li>
            <li><strong>Browse listings</strong> → Open "View Listings" to see available donations</li>
            <li><strong>Book donations</strong> → Select suitable donations and confirm booking</li>
            <li><strong>Coordinate pickup</strong> → Arrange collection within the stated time window</li>
            <li><strong>Distribute meals</strong> → Serve the collected food to beneficiaries</li>
          </ol>
        </div>
      </section>

      <section className="faq-section">
        <h2>Frequently Asked Questions</h2>
        
        <div className="faq-item">
          <h4>Who can register as a Feeder?</h4>
          <p>Restaurants, caterers, event organizers, households, and any individual or organization with surplus food can register as Feeders.</p>
        </div>

        <div className="faq-item">
          <h4>Who can register as an NGO?</h4>
          <p>Registered non-governmental organizations, charitable trusts, community kitchens, and food banks working to serve meals to those in need.</p>
        </div>

        <div className="faq-item">
          <h4>What food safety guidelines should I follow?</h4>
          <p>
            • Only donate food that is safe to consume<br/>
            • Maintain proper temperature control<br/>
            • Use clean, sealed containers<br/>
            • Include expiry dates and storage instructions<br/>
            • Avoid donating food that has been sitting out for more than 2 hours
          </p>
        </div>

        <div className="faq-item">
          <h4>How do I estimate the number of meals?</h4>
          <p>
            • 1 kg of cooked food ≈ 3-4 meals<br/>
            • 1 serving of rice/dal ≈ 1 meal<br/>
            • 1 kg of bread ≈ 8-10 meals<br/>
            • When in doubt, estimate conservatively
          </p>
        </div>

        <div className="faq-item">
          <h4>What happens if no NGO claims my donation?</h4>
          <p>If your donation isn't claimed within the pickup window, it will be marked as expired. You can repost with adjusted timing or quantity.</p>
        </div>

        <div className="faq-item">
          <h4>Is there a cost to use the platform?</h4>
          <p>No, ZeroWaste is completely free to use. We believe in making food redistribution accessible to everyone.</p>
        </div>

        <div className="faq-item">
          <h4>What about the Donation page?</h4>
          <p><strong>Note:</strong> The Donation page is for demonstration purposes only. It shows UPI/QR payment options but does not process real payments. This is a demo feature for the hackathon.</p>
        </div>
      </section>

      <section className="cta-section">
        <h2>Ready to Get Started?</h2>
        <div className="cta-buttons">
          <Link to="/register" className="btn large saffron">Register as Feeder</Link>
          <Link to="/register" className="btn large green">Register as NGO</Link>
        </div>
        <p className="muted">Already have an account? <Link to="/login">Log in here</Link></p>
      </section>
    </div>
  );
}
