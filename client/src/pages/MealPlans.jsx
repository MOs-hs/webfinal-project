import { useEffect, useState } from 'react';
import { API_URL } from '../config';

const DAYS_OF_WEEK = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];
const MEAL_TYPES = ['breakfast', 'lunch', 'dinner'];

function MealPlans({ token }) {
  const [plans, setPlans] = useState([]);
  const [selectedPlan, setSelectedPlan] = useState(null);
  const [planDetails, setPlanDetails] = useState(null);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [showAddMealModal, setShowAddMealModal] = useState(false);
  const [availableMeals, setAvailableMeals] = useState([]);
  const [mealSelection, setMealSelection] = useState({
    day: '',
    mealType: '',
    mealId: ''
  });
  const [formData, setFormData] = useState({
    week_start: '',
    week_end: ''
  });

  useEffect(() => {
    fetchPlans();
    fetchAvailableMeals();
  }, []);

  const fetchPlans = async () => {
    try {
      const response = await fetch(`${API_URL}/api/mealplans`, {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      const data = await response.json();
      setPlans(data);
    } catch (err) {
      console.error('Error fetching plans:', err);
    }
  };

  const fetchAvailableMeals = async () => {
    try {
      const response = await fetch(`${API_URL}/api/meals`, {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      const data = await response.json();
      setAvailableMeals(data);
    } catch (err) {
      console.error('Error fetching meals:', err);
    }
  };

  const fetchPlanDetails = async (planId) => {
    try {
      const response = await fetch(`${API_URL}/api/mealplans/${planId}`, {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      const data = await response.json();
      
      // Organize meals by day and type
      const organized = {};
      DAYS_OF_WEEK.forEach(day => {
        organized[day] = { breakfast: null, lunch: null, dinner: null };
      });

      data.forEach(row => {
        if (row.meal_id && row.day_of_week) {
          organized[row.day_of_week][row.meal_type] = {
            id: row.meal_id,
            title: row.title,
            calories: row.calories,
            protein: row.protein,
            carbs: row.carbs,
            fats: row.fats
          };
        }
      });

      setPlanDetails({
        id: planId,
        week_start: data[0]?.week_start,
        week_end: data[0]?.week_end,
        meals: organized
      });
    } catch (err) {
      console.error('Error fetching plan details:', err);
    }
  };

  const handleCreatePlan = async (e) => {
    e.preventDefault();

    try {
      const response = await fetch(`${API_URL}/api/mealplans`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(formData)
      });

      if (response.ok) {
        fetchPlans();
        setShowCreateModal(false);
        setFormData({ week_start: '', week_end: '' });
      }
    } catch (err) {
      console.error('Error creating plan:', err);
    }
  };

  const handleAddMeal = async (e) => {
    e.preventDefault();

    try {
      const response = await fetch(`${API_URL}/api/mealplans/${selectedPlan}/meals`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          meal_id: mealSelection.mealId,
          day_of_week: mealSelection.day,
          meal_type: mealSelection.mealType
        })
      });

      if (response.ok) {
        fetchPlanDetails(selectedPlan);
        setShowAddMealModal(false);
        setMealSelection({ day: '', mealType: '', mealId: '' });
      }
    } catch (err) {
      console.error('Error adding meal:', err);
    }
  };

  const deletePlan = async (id) => {
    if (!confirm('Delete this meal plan?')) return;

    try {
      await fetch(`${API_URL}/api/mealplans/${id}`, {
        method: 'DELETE',
        headers: { 'Authorization': `Bearer ${token}` }
      });
      fetchPlans();
      if (selectedPlan === id) {
        setSelectedPlan(null);
        setPlanDetails(null);
      }
    } catch (err) {
      console.error('Error deleting plan:', err);
    }
  };

  const viewPlanDetails = (planId) => {
    setSelectedPlan(planId);
    fetchPlanDetails(planId);
  };

  const openAddMealModal = (day, mealType) => {
    setMealSelection({ day, mealType, mealId: '' });
    setShowAddMealModal(true);
  };

  const getMealIcon = (mealType) => {
    switch(mealType) {
      case 'breakfast': return '🌅';
      case 'lunch': return '🌞';
      case 'dinner': return '🌙';
      default: return '🍽️';
    }
  };

  if (planDetails) {
    return (
      <div className="container" style={{ maxWidth: '100%', padding: '20px' }}>
        <div style={{ background: 'white', borderRadius: '12px', padding: '24px', minHeight: 'calc(100vh - 180px)' }}>
          <div className="page-header">
            <div>
              <button 
                className="btn-small" 
                onClick={() => { setSelectedPlan(null); setPlanDetails(null); }}
                style={{ marginBottom: '12px' }}
              >
                ← Back to Plans
              </button>
              <h1 style={{ margin: '0' }}>📅 Weekly Meal Plan</h1>
              <p style={{ color: '#666', marginTop: '8px' }}>
                {new Date(planDetails.week_start).toLocaleDateString()} - {new Date(planDetails.week_end).toLocaleDateString()}
              </p>
            </div>
            <button className="btn-small" onClick={() => setShowAddMealModal(true)}>+ Add Meal</button>
          </div>

          <div style={{ overflowX: 'auto', marginTop: '24px' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse', minWidth: '800px' }}>
              <thead>
                <tr style={{ background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)', color: 'white' }}>
                  <th style={{ padding: '16px', textAlign: 'left', borderRadius: '8px 0 0 0' }}>Day</th>
                  <th style={{ padding: '16px', textAlign: 'left' }}>🌅 Breakfast</th>
                  <th style={{ padding: '16px', textAlign: 'left' }}>🌞 Lunch</th>
                  <th style={{ padding: '16px', textAlign: 'left', borderRadius: '0 8px 0 0' }}>🌙 Dinner</th>
                </tr>
              </thead>
              <tbody>
                {DAYS_OF_WEEK.map((day, idx) => (
                  <tr key={day} style={{ borderBottom: '1px solid #e0e0e0', background: idx % 2 === 0 ? '#f9f9f9' : 'white' }}>
                    <td style={{ padding: '16px', fontWeight: '600', color: '#667eea' }}>{day}</td>
                    {MEAL_TYPES.map(mealType => {
                      const meal = planDetails.meals[day][mealType];
                      return (
                        <td key={mealType} style={{ padding: '12px' }}>
                          {meal ? (
                            <div style={{ 
                              background: 'white', 
                              padding: '12px', 
                              borderRadius: '8px',
                              border: '2px solid #e0e0e0',
                              boxShadow: '0 2px 4px rgba(0,0,0,0.05)'
                            }}>
                              <div style={{ fontWeight: '600', color: '#333', marginBottom: '6px' }}>{meal.title}</div>
                              <div style={{ fontSize: '12px', color: '#666' }}>
                                🔥 {meal.calories} cal | 💪 {meal.protein}g
                              </div>
                            </div>
                          ) : (
                            <button 
                              onClick={() => openAddMealModal(day, mealType)}
                              style={{
                                width: '100%',
                                padding: '20px',
                                background: '#f0f0f0',
                                border: '2px dashed #ccc',
                                borderRadius: '8px',
                                cursor: 'pointer',
                                color: '#999',
                                fontSize: '14px',
                                transition: 'all 0.2s'
                              }}
                              onMouseOver={(e) => {
                                e.target.style.background = '#e8e8e8';
                                e.target.style.borderColor = '#667eea';
                              }}
                              onMouseOut={(e) => {
                                e.target.style.background = '#f0f0f0';
                                e.target.style.borderColor = '#ccc';
                              }}
                            >
                              + Add
                            </button>
                          )}
                        </td>
                      );
                    })}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Add Meal Modal */}
        {showAddMealModal && (
          <div className="modal-overlay" onClick={() => setShowAddMealModal(false)}>
            <div className="modal" onClick={(e) => e.stopPropagation()}>
              <h2>Add Meal to Plan</h2>
              
              <form onSubmit={handleAddMeal}>
                <div className="form-group">
                  <label>Day of Week</label>
                  <select
                    value={mealSelection.day}
                    onChange={(e) => setMealSelection({...mealSelection, day: e.target.value})}
                    required
                    style={{ width: '100%', padding: '12px', borderRadius: '8px', border: '2px solid #e0e0e0' }}
                  >
                    <option value="">Select day...</option>
                    {DAYS_OF_WEEK.map(day => (
                      <option key={day} value={day}>{day}</option>
                    ))}
                  </select>
                </div>

                <div className="form-group">
                  <label>Meal Type</label>
                  <select
                    value={mealSelection.mealType}
                    onChange={(e) => setMealSelection({...mealSelection, mealType: e.target.value})}
                    required
                    style={{ width: '100%', padding: '12px', borderRadius: '8px', border: '2px solid #e0e0e0' }}
                  >
                    <option value="">Select type...</option>
                    <option value="breakfast">🌅 Breakfast</option>
                    <option value="lunch">🌞 Lunch</option>
                    <option value="dinner">🌙 Dinner</option>
                  </select>
                </div>

                <div className="form-group">
                  <label>Select Meal</label>
                  <select
                    value={mealSelection.mealId}
                    onChange={(e) => setMealSelection({...mealSelection, mealId: e.target.value})}
                    required
                    style={{ width: '100%', padding: '12px', borderRadius: '8px', border: '2px solid #e0e0e0' }}
                  >
                    <option value="">Choose from your meals...</option>
                    {availableMeals.map(meal => (
                      <option key={meal.id} value={meal.id}>
                        {meal.title} ({meal.calories} cal)
                      </option>
                    ))}
                  </select>
                </div>

                <div className="modal-buttons">
                  <button type="button" className="btn" onClick={() => setShowAddMealModal(false)} style={{ background: '#999' }}>Cancel</button>
                  <button type="submit" className="btn">Add Meal</button>
                </div>
              </form>
            </div>
          </div>
        )}
      </div>
    );
  }

  return (
    <div className="container">
      <div style={{ background: 'white', borderRadius: '12px', padding: '24px', minHeight: 'calc(100vh - 140px)' }}>
        <div className="page-header">
          <h1>📅 Meal Plans</h1>
          <button className="btn-small" onClick={() => setShowCreateModal(true)}>+ New Plan</button>
        </div>

        <div className="meals-grid">
          {plans.map(plan => (
            <div key={plan.id} className="meal-card">
              <h3>📆 Week Plan</h3>
              <p><strong>Start:</strong> {new Date(plan.week_start).toLocaleDateString()}</p>
              <p><strong>End:</strong> {new Date(plan.week_end).toLocaleDateString()}</p>
              <p><strong>Total Calories:</strong> {plan.total_calories || 0}</p>
              <div style={{ marginTop: '16px', display: 'flex', gap: '8px' }}>
                <button className="btn-small" onClick={() => viewPlanDetails(plan.id)}>View Details</button>
                <button className="btn-small btn-danger" onClick={() => deletePlan(plan.id)}>Delete</button>
              </div>
            </div>
          ))}
        </div>

        {plans.length === 0 && (
          <div style={{ 
            textAlign: 'center', 
            color: '#999', 
            marginTop: '80px',
            padding: '40px'
          }}>
            <p style={{ fontSize: '18px', marginBottom: '12px' }}>No meal plans yet. Create your weekly plan!</p>
            <p style={{ fontSize: '14px' }}>Click the "+ New Plan" button above to get started.</p>
          </div>
        )}
      </div>

      {/* Create Plan Modal */}
      {showCreateModal && (
        <div className="modal-overlay" onClick={() => setShowCreateModal(false)}>
          <div className="modal" onClick={(e) => e.stopPropagation()}>
            <h2>Create Meal Plan</h2>
            
            <form onSubmit={handleCreatePlan}>
              <div className="form-group">
                <label>Week Start Date</label>
                <input
                  type="date"
                  value={formData.week_start}
                  onChange={(e) => setFormData({...formData, week_start: e.target.value})}
                  required
                />
              </div>

              <div className="form-group">
                <label>Week End Date</label>
                <input
                  type="date"
                  value={formData.week_end}
                  onChange={(e) => setFormData({...formData, week_end: e.target.value})}
                  required
                />
              </div>

              <div className="modal-buttons">
                <button type="button" className="btn" onClick={() => setShowCreateModal(false)} style={{ background: '#999' }}>Cancel</button>
                <button type="submit" className="btn">Create Plan</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

export default MealPlans;
