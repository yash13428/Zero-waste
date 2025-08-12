import { useEffect, useState } from 'react';
import { subscribeAvailableDonations, claimDonation } from '../services/firestore';
import DonationCard from '../components/DonationCard';
import '../components/DonationCard.css';

export default function Listings() {
  const [donations, setDonations] = useState([]);
  const [claiming, setClaiming] = useState('');
  const [error, setError] = useState('');

  useEffect(() => {
    const unsub = subscribeAvailableDonations((snapshot) => {
      const items = snapshot.docs.map((d) => ({ id: d.id, ...d.data() }));
      setDonations(items);
    });
    return () => unsub();
  }, []);

  const onClaim = async (id, donation) => {
    const ngoName = window.prompt('Enter your NGO name to confirm claim:');
    if (!ngoName) return;
    try {
      setClaiming(id);
      await claimDonation(id, { name: ngoName });
    } catch (err) {
      setError(err.message || 'Failed to claim donation');
    } finally {
      setClaiming('');
    }
  };

  return (
    <div className="container">
      <h2>Available Donations</h2>
      {donations.length === 0 && <div className="muted">No active donations right now. Please check back soon.</div>}
      <div className="grid">
        {donations.map((d) => (
          <DonationCard key={d.id} donation={d} onClaim={onClaim} />
        ))}
      </div>
      {claiming && <div className="muted">Claiming {claiming}…</div>}
      {error && <div className="error">{error}</div>}
    </div>
  );
}