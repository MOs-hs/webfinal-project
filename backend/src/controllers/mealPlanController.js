import db from '../config/db.js';

export const createMealPlan = (req, res) => {
  const { week_start, week_end } = req.body;
  const userId = req.user.id;

  if (!week_start || !week_end) {
    return res.status(400).json({ error: 'Week start and end dates are required' });
  }

  db.query(
    'INSERT INTO MealPlans (user_id, week_start, week_end) VALUES (?, ?, ?)',
    [userId, week_start, week_end],
    (err, result) => {
      if (err) return res.status(500).json({ error: 'Failed to create meal plan' });

      res.status(201).json({
        message: 'Meal plan created successfully',
        planId: result.insertId
      });
    }
  );
};

export const getMealPlans = (req, res) => {
  const userId = req.user.id;

  db.query('SELECT * FROM MealPlans WHERE user_id = ? ORDER BY created_at DESC', [userId], (err, results) => {
    if (err) return res.status(500).json({ error: 'Database error' });
    res.json(results);
  });
};

export const addMealToPlan = (req, res) => {
  const { planId } = req.params;
  const { meal_id, day_of_week, meal_type } = req.body;

  db.query(
    'INSERT INTO MealPlanMeals (mealplan_id, meal_id, day_of_week, meal_type) VALUES (?, ?, ?, ?)',
    [planId, meal_id, day_of_week, meal_type],
    (err) => {
      if (err) return res.status(500).json({ error: 'Failed to add meal to plan' });
      res.json({ message: 'Meal added to plan successfully' });
    }
  );
};

export const getMealPlanDetails = (req, res) => {
  const { planId } = req.params;

  const query = `
    SELECT 
      mp.id, mp.week_start, mp.week_end,
      m.id as meal_id, m.title, m.ingredients, m.calories,
      mpm.day_of_week, mpm.meal_type
    FROM MealPlans mp
    LEFT JOIN MealPlanMeals mpm ON mp.id = mpm.mealplan_id
    LEFT JOIN Meals m ON mpm.meal_id = m.id
    WHERE mp.id = ?
  `;

  db.query(query, [planId], (err, results) => {
    if (err) return res.status(500).json({ error: 'Database error' });
    res.json(results);
  });
};

export const deleteMealPlan = (req, res) => {
  const { planId } = req.params;

  db.query('DELETE FROM MealPlans WHERE id = ?', [planId], (err) => {
    if (err) return res.status(500).json({ error: 'Failed to delete meal plan' });
    res.json({ message: 'Meal plan deleted successfully' });
  });
};
