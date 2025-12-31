import db from '../config/db.js';

// Create meal plan
export const createMealPlan = (req, res) => {
  const { week_start, week_end } = req.body;
  const userId = req.user.id;

  if (!week_start || !week_end) {
    return res.status(400).json({ error: 'Week start and end dates are required' });
  }

  db.query(
    'INSERT INTO MealPlans (user_id, week_start, week_end) VALUES ($1, $2, $3) RETURNING id',
    [userId, week_start, week_end],
    (err, result) => {
      if (err) return res.status(500).json({ error: 'Failed to create meal plan' });

      res.status(201).json({
        message: 'Meal plan created successfully',
        planId: result.rows[0].id
      });
    }
  );
};

// Get all meal plans for user
export const getMealPlans = (req, res) => {
  const userId = req.user.id;

  db.query('SELECT * FROM MealPlans WHERE user_id = $1 ORDER BY created_at DESC', [userId], (err, results) => {
    if (err) return res.status(500).json({ error: 'Database error' });
    res.json(results.rows);
  });
};

// Add meal to plan
export const addMealToPlan = (req, res) => {
  const { planId } = req.params;
  const { meal_id, day_of_week, meal_type } = req.body;

  db.query(
    'INSERT INTO MealPlanMeals (meal_plan_id, meal_id, day_of_week, meal_time) VALUES ($1, $2, $3, $4)',
    [planId, meal_id, day_of_week, meal_type],
    (err) => {
      if (err) return res.status(500).json({ error: 'Failed to add meal to plan' });
      res.json({ message: 'Meal added to plan successfully' });
    }
  );
};

// Get meal plan details with all meals
export const getMealPlanDetails = (req, res) => {
  const { planId } = req.params;

  const query = `
    SELECT 
      mp.id, mp.week_start, mp.week_end,
      m.id as meal_id, m.name as title, m.description as ingredients, m.calories,
      mpm.day_of_week, mpm.meal_time
    FROM MealPlans mp
    LEFT JOIN MealPlanMeals mpm ON mp.id = mpm.meal_plan_id
    LEFT JOIN Meals m ON mpm.meal_id = m.id
    WHERE mp.id = $1
  `;

  db.query(query, [planId], (err, results) => {
    if (err) return res.status(500).json({ error: 'Database error' });
    res.json(results.rows);
  });
};

// Delete meal plan
export const deleteMealPlan = (req, res) => {
  const { planId } = req.params;

  db.query('DELETE FROM MealPlans WHERE id = $1', [planId], (err) => {
    if (err) return res.status(500).json({ error: 'Failed to delete meal plan' });
    res.json({ message: 'Meal plan deleted successfully' });
  });
};
