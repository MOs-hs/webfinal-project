import db from '../config/db.js';
import { authenticateToken, isAdmin } from '../middleware/auth.js';

export const getAllUsers = (req, res) => {
  db.query('SELECT id, name, email, role, created_at FROM Users', (err, results) => {
    if (err) return res.status(500).json({ error: 'Database error' });
    res.json(results);
  });
};

export const getStatistics = (req, res) => {
  const queries = {
    users: 'SELECT COUNT(*) as count FROM Users',
    meals: 'SELECT COUNT(*) as count FROM Meals',
    plans: 'SELECT COUNT(*) as count FROM MealPlans'
  };

  const stats = {};

  db.query(queries.users, (err, results) => {
    if (err) return res.status(500).json({ error: 'Database error' });
    stats.totalUsers = results[0].count;

    db.query(queries.meals, (err, results) => {
      if (err) return res.status(500).json({ error: 'Database error' });
      stats.totalMeals = results[0].count;

      db.query(queries.plans, (err, results) => {
        if (err) return res.status(500).json({ error: 'Database error' });
        stats.totalPlans = results[0].count;

        res.json(stats);
      });
    });
  });
};

export const deleteUser = (req, res) => {
  const { userId } = req.params;

  db.query('DELETE FROM Users WHERE id = ?', [userId], (err) => {
    if (err) return res.status(500).json({ error: 'Failed to delete user' });
    res.json({ message: 'User deleted successfully' });
  });
};
