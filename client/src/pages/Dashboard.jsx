import { useEffect, useState } from 'react';
import { API_URL } from '../config';

function Dashboard({ user, token }) {
  const [stats, setStats] = useState({ meals: 0, plans: 0 });

  useEffect(() => {
    fetchStats();
  }, []);

  const fetchStats = async () => {
    try {
      const mealsRes = await fetch(`${API_URL}/api/meals`, {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      const meals = await mealsRes.json();

      const plansRes = await fetch(`${API_URL}/api/mealplans`, {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      const plans = await plansRes.json();

      setStats({
        meals: meals.length || 0,
        plans: plans.length || 0
      });
    } catch (err) {
      console.error('Error fetching stats:', err);
    }
  };

  return (
    <div className="container">
      <div className="dashboard">
        <h1>Welcome back, {user.name}! 👋</h1>
        <p style={{ color: '#666', marginTop: '8px' }}>Track your healthy eating journey</p>

        <div className="stats-grid">
          <div className="stat-card">
            <h3>{stats.meals}</h3>
            <p>Total Meals</p>
          </div>

          <div className="stat-card">
            <h3>{stats.plans}</h3>
            <p>Meal Plans</p>
          </div>

          <div className="stat-card">
            <h3>🎯</h3>
            <p>Keep Going!</p>
          </div>
        </div>

        <div style={{ marginTop: '32px', padding: '24px', background: '#f9f9f9', borderRadius: '12px' }}>
          <h3 style={{ marginBottom: '12px' }}>Quick Actions</h3>
          <p>✅ Create your first meal in the Meals section</p>
          <p>✅ Plan your week in Meal Plans</p>
          <p>✅ Track your nutrition progress</p>
        </div>
      </div>
    </div>
  );
}

export default Dashboard;
