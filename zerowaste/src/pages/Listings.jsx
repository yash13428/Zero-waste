import { useEffect, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import { subscribeAllDonations, claimDonation } from '../services/firestore';
import { groupDonationsByDate } from '../utils/dateGrouping';
import DonationCard from '../components/DonationCard';
import '../components/DonationCard.css';

export default function Listings() {
  const [searchParams, setSearchParams] = useSearchParams();
  const [donations, setDonations] = useState([]);
  const [claiming, setClaiming] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState(null);
  const [userRole, setUserRole] = useState(null);
  const [activeTab, setActiveTab] = useState('available');

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
      // Not authenticated
      setUser(null);
      setUserRole(null);
    }
  }, []);

  // Set initial tab from URL params
  useEffect(() => {
    const tabParam = searchParams.get('tab');
    if (tabParam) {
      setActiveTab(tabParam);
    } else {
      // Set default tab based on user role
      if (userRole === 'feeder') {
        setActiveTab('active');
      } else if (userRole === 'ngo') {
        setActiveTab('available');
      }
    }
  }, [userRole, searchParams]);

  useEffect(() => {
    if (!userRole) {
      setLoading(false);
      return;
    }

    const unsub = subscribeAllDonations((snapshot) => {
      try {
        const items = snapshot.docs.map((d) => ({ id: d.id, ...d.data() }));
        setDonations(items);
      } catch (err) {
        setError('Failed to load donations');
        console.error('Error loading donations:', err);
      } finally {
        setLoading(false);
      }
    }, (error) => {
      setError('Failed to connect to database');
      setLoading(false);
      console.error('Firestore error:', error);
    });

    return () => unsub();
  }, [userRole]);

  const onClaim = async (id, donation) => {
    if (userRole !== 'ngo') {
      setError('Only NGOs can claim donations');
      return;
    }

    try {
      setClaiming(id);
      setError('');
      await claimDonation(id, { name: user.name });
      
      // Switch to claimed tab after successful claim
      setActiveTab('claimed');
      setSearchParams({ tab: 'claimed' });
    } catch (err) {
      setError(err.message || 'Failed to claim donation');
      console.error('Claim error:', err);
    } finally {
      setClaiming('');
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('zerowaste_user');
    localStorage.removeItem('zerowaste_ngo_name');
    setUser(null);
    setUserRole(null);
    window.location.href = '/login';
  };

  const handleTabChange = (tab) => {
    setActiveTab(tab);
    setSearchParams({ tab });
  };

  // Filter donations based on user role and active tab
  const getFilteredDonations = () => {
    if (userRole === 'feeder') {
      // Filter by feeder name
      const userDonations = donations.filter(d => 
        d.feederName === user?.name || d.donorName === user?.name
      );
      
      if (activeTab === 'active') {
        return userDonations.filter(d => d.status === 'Available');
      } else if (activeTab === 'claimed') {
        return userDonations.filter(d => d.status === 'Claimed');
      }
    } else if (userRole === 'ngo') {
      if (activeTab === 'available') {
        return donations.filter(d => d.status === 'Available');
      } else if (activeTab === 'claimed') {
        return donations.filter(d => 
          d.status === 'Claimed' && 
          d.claimedBy?.name === user?.name
        );
      }
    }
    return [];
  };

  // Not authenticated - redirect to login
  if (!userRole) {
    return (
      <div className="container">
        <div className="auth-required">
          <h2>Authentication Required</h2>
          <p>Please log in to view listings.</p>
          <div className="cta-buttons">
            <a href="/login" className="btn large saffron">Log In</a>
            <a href="/register" className="btn large green">Register</a>
          </div>
        </div>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="container">
        <h2>{userRole === 'feeder' ? 'My Contributions' : 'Available Donations'}</h2>
        <div className="loading-container">
          <div className="loading"></div>
          <p>Loading donations...</p>
        </div>
      </div>
    );
  }

  const filteredDonations = getFilteredDonations();
  const groupedDonations = groupDonationsByDate(filteredDonations);

  const getTabConfig = () => {
    if (userRole === 'feeder') {
      return [
        { id: 'active', label: 'Active Contributions' },
        { id: 'claimed', label: 'Claimed Contributions' }
      ];
    } else if (userRole === 'ngo') {
      return [
        { id: 'available', label: 'Available Donations' },
        { id: 'claimed', label: 'Claimed Donations' }
      ];
    }
    return [];
  };

  const tabs = getTabConfig();

  return (
    <div className="container">
      <div className="listings-header">
        <h2>{userRole === 'feeder' ? 'My Contributions' : 'Donations'}</h2>
        {user && (
          <div className="user-info">
            <span>Hi, {user.name}</span>
            <button onClick={handleLogout} className="btn logout-btn">Logout</button>
          </div>
        )}
      </div>

      {/* Tab System */}
      <div className="tab-container">
        <div className="tab-buttons">
          {tabs.map(tab => (
            <button
              key={tab.id}
              className={`tab-button ${activeTab === tab.id ? 'active' : ''}`}
              onClick={() => handleTabChange(tab.id)}
            >
              {tab.label}
            </button>
          ))}
        </div>
      </div>
      
      {filteredDonations.length === 0 && !loading && (
        <div className="empty-state">
          {userRole === 'feeder' ? (
            activeTab === 'active' ? (
              <>
                <p className="muted">You haven't posted any active donations yet.</p>
                <p className="muted">Start by posting your first surplus food donation.</p>
              </>
            ) : (
              <>
                <p className="muted">No claimed contributions yet.</p>
                <p className="muted">Your claimed donations will appear here.</p>
              </>
            )
          ) : (
            activeTab === 'available' ? (
              <>
                <p className="muted">No active donations right now. Please check back soon.</p>
                <p className="muted">Feeders can post surplus food using the "Share a Meal" link above.</p>
              </>
            ) : (
              <>
                <p className="muted">No claimed donations yet.</p>
                <p className="muted">Your claimed donations will appear here.</p>
              </>
            )
          )}
        </div>
      )}
      
      {groupedDonations.map((group) => (
        <div key={group.dateLabel} className="date-group">
          <h3 className="date-header">{group.dateLabel}</h3>
          <div className="grid">
            {group.donations.map((d) => (
              <DonationCard 
                key={d.id} 
                donation={d} 
                onClaim={onClaim}
                isClaiming={claiming}
                userRole={userRole}
                activeTab={activeTab}
              />
            ))}
          </div>
        </div>
      ))}
      
      {error && (
        <div className="error">
          {error}
          <button 
            onClick={() => window.location.reload()} 
            className="btn green"
            style={{ marginLeft: '10px' }}
          >
            Retry
          </button>
        </div>
      )}
    </div>
  );
}