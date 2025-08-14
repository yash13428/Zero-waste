import { useEffect, useState } from 'react';
import { subscribeMealsServed, initStatsIfMissing } from '../services/firestore';

export default function MealCounter() {
  const [meals, setMeals] = useState(0);

  useEffect(() => {
    initStatsIfMissing();
    const unsub = subscribeMealsServed((snap) => {
      const data = snap.data();
      setMeals((data && data.mealsServed) || 0);
    });
    return () => unsub();
  }, []);

  return (
    <div style={{
      display: 'inline-flex',
      alignItems: 'center',
      gap: 10,
      padding: '14px 18px',
      background: '#fff',
      border: '2px solid #ff9933',
      borderRadius: 12,
      fontWeight: 800,
      fontSize: 20,
      color: '#1a1a1a',
      boxShadow: '0 6px 20px rgba(0,0,0,0.06)',
    }}>
      <span role="img" aria-label="plate">🍽️</span>
      <span>Total Meals Served: {meals.toLocaleString()}</span>
    </div>
  );
}