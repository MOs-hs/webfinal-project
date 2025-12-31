import db from '../config/db.js';

// Create new meal
export const createMeal = (req, res) => {
  const { title, ingredients, calories, protein, carbs, fats } = req.body;
  const userId = req.user.id;

  // Simple validation
  if (!title || !ingredients || !calories) {
    return res.status(400).json({ error: 'Title, ingredients, and calories are required' });
  }

  db.query(
    'INSERT INTO Meals (title, ingredients, calories, protein, carbs, fats, user_id) VALUES ($1, $2, $3, $4, $5, $6, $7) RETURNING id',
    [title, ingredients, calories, protein || 0, carbs || 0, fats || 0, userId],
    (err, result) => {
      if (err) return res.status(500).json({ error: 'Failed to create meal' });

      res.status(201).json({
        message: 'Meal created successfully',
        mealId: result.rows[0].id
      });
    }
  );
};

// Get all meals (for current user or all if admin)
export const getMeals = (req, res) => {
  const userId = req.user.id;
  const isAdmin = req.user.role === 'admin';

  const query = isAdmin 
    ? 'SELECT * FROM Meals ORDER BY created_at DESC'
    : 'SELECT * FROM Meals WHERE user_id = $1 ORDER BY created_at DESC';

  const params = isAdmin ? [] : [userId];

  db.query(query, params, (err, results) => {
    if (err) return res.status(500).json({ error: 'Database error' });
    res.json(results.rows);
  });
};

// Get single meal by ID
export const getMealById = (req, res) => {
  const mealId = req.params.id;

  db.query('SELECT * FROM Meals WHERE id = $1', [mealId], (err, results) => {
    if (err) return res.status(500).json({ error: 'Database error' });
    
    if (results.rows.length === 0) {
      return res.status(404).json({ error: 'Meal not found' });
    }

    res.json(results.rows[0]);
  });
};

// Update meal
export const updateMeal = (req, res) => {
  const mealId = req.params.id;
  const { title, ingredients, calories, protein, carbs, fats } = req.body;
  const userId = req.user.id;

  // Check if meal belongs to user (unless admin)
  const checkQuery = req.user.role === 'admin' 
    ? 'SELECT * FROM Meals WHERE id = $1'
    : 'SELECT * FROM Meals WHERE id = $1 AND user_id = $2';
  
  const checkParams = req.user.role === 'admin' ? [mealId] : [mealId, userId];

  db.query(checkQuery, checkParams, (err, results) => {
    if (err) return res.status(500).json({ error: 'Database error' });
    
    if (results.rows.length === 0) {
      return res.status(404).json({ error: 'Meal not found or unauthorized' });
    }

    db.query(
      'UPDATE Meals SET title = $1, ingredients = $2, calories = $3, protein = $4, carbs = $5, fats = $6 WHERE id = $7',
      [title, ingredients, calories, protein || 0, carbs || 0, fats || 0, mealId],
      (err) => {
        if (err) return res.status(500).json({ error: 'Failed to update meal' });
        res.json({ message: 'Meal updated successfully' });
      }
    );
  });
};

// Delete meal
export const deleteMeal = (req, res) => {
  const mealId = req.params.id;
  const userId = req.user.id;

  // Check if meal belongs to user (unless admin)
  const checkQuery = req.user.role === 'admin' 
    ? 'SELECT * FROM Meals WHERE id = $1'
    : 'SELECT * FROM Meals WHERE id = $1 AND user_id = $2';
  
  const checkParams = req.user.role === 'admin' ? [mealId] : [mealId, userId];

  db.query(checkQuery, checkParams, (err, results) => {
    if (err) return res.status(500).json({ error: 'Database error' });
    
    if (results.rows.length === 0) {
      return res.status(404).json({ error: 'Meal not found or unauthorized' });
    }

    db.query('DELETE FROM Meals WHERE id = $1', [mealId], (err) => {
      if (err) return res.status(500).json({ error: 'Failed to delete meal' });
      res.json({ message: 'Meal deleted successfully' });
    });
  });
};
