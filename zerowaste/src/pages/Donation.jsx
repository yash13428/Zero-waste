import './pages.css';

export default function Donation() {
  return (
    <div className="container narrow">
      <h1>Support ZeroWaste</h1>
      <p className="hero-text">
        Help us continue our mission of reducing food waste and serving more meals to those in need.
      </p>

      <div className="demo-notice">
        <div className="notice-header">
          <h3>🚧 Demo Notice</h3>
        </div>
        <p>
          <strong>This is a demonstration page for the hackathon.</strong> The payment functionality shown below 
          is for display purposes only and does not process real transactions.
        </p>
      </div>

      <section className="donation-options">
        <h2>Donation Options</h2>
        
        <div className="donation-card">
          <h3>UPI Payment</h3>
          <div className="upi-details">
            <p><strong>UPI ID:</strong> zerowaste@demo</p>
            <p><strong>Name:</strong> ZeroWaste Demo</p>
            <div className="qr-placeholder">
              <div className="qr-code">
                <span>QR Code</span>
                <small>Demo Only</small>
              </div>
            </div>
          </div>
        </div>

        <div className="donation-card">
          <h3>Bank Transfer</h3>
          <div className="bank-details">
            <p><strong>Account Name:</strong> ZeroWaste Demo</p>
            <p><strong>Account Number:</strong> 1234567890</p>
            <p><strong>IFSC Code:</strong> DEMO0001234</p>
            <p><strong>Bank:</strong> Demo Bank</p>
          </div>
        </div>

        <div className="donation-card">
          <h3>Suggested Amounts</h3>
          <div className="amount-options">
            <button className="btn amount-btn">₹100</button>
            <button className="btn amount-btn">₹250</button>
            <button className="btn amount-btn">₹500</button>
            <button className="btn amount-btn">₹1000</button>
            <button className="btn amount-btn">Custom</button>
          </div>
        </div>
      </section>

      <section className="impact-section">
        <h2>Your Impact</h2>
        <div className="impact-grid">
          <div className="impact-item">
            <h4>₹100</h4>
            <p>Provides 10 meals to those in need</p>
          </div>
          <div className="impact-item">
            <h4>₹250</h4>
            <p>Helps reduce 25kg of food waste</p>
          </div>
          <div className="impact-item">
            <h4>₹500</h4>
            <p>Supports platform development</p>
          </div>
          <div className="impact-item">
            <h4>₹1000</h4>
            <p>Enables 100+ meal connections</p>
          </div>
        </div>
      </section>

      <section className="disclaimer-section">
        <h2>Important Information</h2>
        <div className="disclaimer-content">
          <p><strong>Demo Purpose:</strong> This page is created for demonstration purposes during the hackathon. No real payments are processed.</p>
          <p><strong>Real Implementation:</strong> In a production environment, this would integrate with secure payment gateways like Razorpay, PayU, or similar services.</p>
          <p><strong>Security:</strong> Real payment pages would include SSL encryption, PCI compliance, and secure payment processing.</p>
        </div>
      </section>

      <div className="cta-section">
        <p className="muted">
          Ready to make a real impact? <a href="/about">Learn more about ZeroWaste</a> or 
          <a href="/register"> register as a Feeder or NGO</a> to start reducing food waste today.
        </p>
      </div>
    </div>
  );
}
