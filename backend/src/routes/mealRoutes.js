import express from 'express';
import { createMeal, getMeals, getMealById, updateMeal, deleteMeal } from '../controllers/mealController.js';
import { authenticateToken } from '../middleware/auth.js';

const router = express.Router();

// All routes require authentication
router.post('/', authenticateToken, createMeal);
router.get('/', authenticateToken, getMeals);
router.get('/:id', authenticateToken, getMealById);
router.put('/:id', authenticateToken, updateMeal);
router.delete('/:id', authenticateToken, deleteMeal);

export default router;
