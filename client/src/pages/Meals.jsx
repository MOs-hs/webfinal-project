import { useEffect, useState } from 'react';
import { API_URL } from '../config';

function Meals({ token }) {
  const [meals, setMeals] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [editingMeal, setEditingMeal] = useState(null);
  const [formData, setFormData] = useState({
    title: '',
    ingredients: '',
    calories: '',
    protein: '',
    carbs: '',
    fats: ''
  });

  useEffect(() => {
    fetchMeals();
  }, []);

  const fetchMeals = async () => {
    try {
      const response = await fetch(`${API_URL}/api/meals`, {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      const data = await response.json();
      setMeals(data);
    } catch (err) {
      console.error('Error fetching meals:', err);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const url = editingMeal 
      ? `${API_URL}/api/meals/${editingMeal.id}`
      : `${API_URL}/api/meals`;
    
    const method = editingMeal ? 'PUT' : 'POST';

    try {
      const response = await fetch(url, {
        method,
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(formData)
      });

      if (response.ok) {
        fetchMeals();
        closeModal();
      }
    } catch (err) {
      console.error('Error saving meal:', err);
    }
  };

  const deleteMeal = async (id) => {
    if (!confirm('Delete this meal?')) return;

    try {
      await fetch(`${API_URL}/api/meals/${id}`, {
        method: 'DELETE',
        headers: { 'Authorization': `Bearer ${token}` }
      });
      fetchMeals();
    } catch (err) {
      console.error('Error deleting meal:', err);
    }
  };

  const openModal = (meal = null) => {
    if (meal) {
      setEditingMeal(meal);
      setFormData({
        title: meal.title,
        ingredients: meal.ingredients,
        calories: meal.calories,
        protein: meal.protein || '',
        carbs: meal.carbs || '',
        fats: meal.fats || ''
      });
    } else {
      setEditingMeal(null);
      setFormData({
        title: '',
        ingredients: '',
        calories: '',
        protein: '',
        carbs: '',
        fats: ''
      });
    }
    setShowModal(true);
  };

  const closeModal = () => {
    setShowModal(false);
    setEditingMeal(null);
  };

  return (
    <div className="container">
      <div style={{ background: 'white', borderRadius: '12px', padding: '24px', minHeight: 'calc(100vh - 140px)' }}>
        <div className="page-header">
          <h1>🍽️ My Meals</h1>
          <button className="btn-small" onClick={() => openModal()}>+ Add Meal</button>
        </div>

        <div className="meals-grid">
          {meals.map(meal => (
            <div key={meal.id} className="meal-card">
              <h3>{meal.title}</h3>
              <p><strong>Ingredients:</strong> {meal.ingredients}</p>
              <div className="nutrition">
                <span>🔥 {meal.calories} cal</span>
                <span>💪 {meal.protein}g protein</span>
                <span>🌾 {meal.carbs}g carbs</span>
                <span>🥑 {meal.fats}g fat</span>
              </div>
              <div style={{ marginTop: '16px' }}>
                <button className="btn-small" onClick={() => openModal(meal)}>Edit</button>
                <button className="btn-small btn-danger" onClick={() => deleteMeal(meal.id)}>Delete</button>
              </div>
            </div>
          ))}
        </div>

        {meals.length === 0 && (
          <div style={{ 
            textAlign: 'center', 
            color: '#999', 
            marginTop: '80px',
            padding: '40px'
          }}>
            <p style={{ fontSize: '18px', marginBottom: '12px' }}>No meals yet. Create your first one!</p>
            <p style={{ fontSize: '14px' }}>Click the "+ Add Meal" button above to get started.</p>
          </div>
        )}
      </div>

      {showModal && (
        <div className="modal-overlay" onClick={closeModal}>
          <div className="modal" onClick={(e) => e.stopPropagation()}>
            <h2>{editingMeal ? 'Edit Meal' : 'Add New Meal'}</h2>
            
            <form onSubmit={handleSubmit}>
              <div className="form-group">
                <label>Meal Title</label>
                <input
                  value={formData.title}
                  onChange={(e) => setFormData({...formData, title: e.target.value})}
                  required
                  placeholder="e.g., Grilled Chicken Salad"
                />
              </div>

              <div className="form-group">
                <label>Ingredients</label>
                <input
                  value={formData.ingredients}
                  onChange={(e) => setFormData({...formData, ingredients: e.target.value})}
                  required
                  placeholder="e.g., Chicken, lettuce, tomatoes..."
                />
              </div>

              <div className="form-group">
                <label>Calories</label>
                <input
                  type="number"
                  value={formData.calories}
                  onChange={(e) => setFormData({...formData, calories: e.target.value})}
                  required
                  placeholder="350"
                />
              </div>

              <div className="form-group">
                <label>Protein (g)</label>
                <input
                  type="number"
                  value={formData.protein}
                  onChange={(e) => setFormData({...formData, protein: e.target.value})}
                  placeholder="35"
                />
              </div>

              <div className="form-group">
                <label>Carbs (g)</label>
                <input
                  type="number"
                  value={formData.carbs}
                  onChange={(e) => setFormData({...formData, carbs: e.target.value})}
                  placeholder="15"
                />
              </div>

              <div className="form-group">
                <label>Fats (g)</label>
                <input
                  type="number"
                  value={formData.fats}
                  onChange={(e) => setFormData({...formData, fats: e.target.value})}
                  placeholder="18"
                />
              </div>

              <div className="modal-buttons">
                <button type="button" className="btn" onClick={closeModal} style={{ background: '#999' }}>Cancel</button>
                <button type="submit" className="btn">Save Meal</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

export default Meals;
