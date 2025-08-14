import { useEffect, useState } from 'react';
import { subscribeAvailableDonations } from '../services/firestore';

export default function PersonalizedStats({ user }) {
  const [personalStats, setPersonalStats] = useState({
    totalMeals: 0,
    totalDonations: 0
  });

  useEffect(() => {
    if (!user) return;

    const unsub = subscribeAvailableDonations((snapshot) => {
      try {
        const items = snapshot.docs.map((d) => ({ id: d.id, ...d.data() }));
        
        if (user.role === 'feeder') {
          // Count total meals donated by this feeder
          const feederDonations = items.filter(d => 
            (d.feederName === user.name || d.donorName === user.name)
          );
          
          const totalMeals = feederDonations.reduce((sum, donation) => {
            return sum + (donation.estimatedMeals || 0);
          }, 0);
          
          setPersonalStats({
            totalMeals,
            totalDonations: feederDonations.length
          });
          
        } else if (user.role === 'ngo') {
          // Count total meals received by this NGO
          const ngoClaims = items.filter(d => 
            d.status === 'Claimed' && 
            d.claimedBy && 
            d.claimedBy.name === user.name
          );
          
          const totalMeals = ngoClaims.reduce((sum, donation) => {
            return sum + (donation.estimatedMeals || 0);
          }, 0);
          
          setPersonalStats({
            totalMeals,
            totalDonations: ngoClaims.length
          });
        }
      } catch (err) {
        console.error('Error loading personal stats:', err);
      }
    });

    return () => unsub();
  }, [user]);

  if (!user) return null;

  return (
    <div className="personalized-stats">
      <h3>Your Impact</h3>
      <div className="stats-grid">
        <div className="stat-item">
          <span className="stat-number">{personalStats.totalMeals.toLocaleString()}</span>
          <span className="stat-label">
            {user.role === 'feeder' ? 'Meals Donated' : 'Meals Received'}
          </span>
        </div>
        <div className="stat-item">
          <span className="stat-number">{personalStats.totalDonations}</span>
          <span className="stat-label">
            {user.role === 'feeder' ? 'Donations Made' : 'Claims Made'}
          </span>
        </div>
      </div>
    </div>
  );
}
