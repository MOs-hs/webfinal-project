import express from 'express';
import { createMealPlan, getMealPlans, addMealToPlan, getMealPlanDetails, deleteMealPlan } from '../controllers/mealPlanController.js';
import { authenticateToken } from '../middleware/auth.js';

const router = express.Router();

// All routes require authentication
router.post('/', authenticateToken, createMealPlan);
router.get('/', authenticateToken, getMealPlans);
router.post('/:planId/meals', authenticateToken, addMealToPlan);
router.get('/:planId', authenticateToken, getMealPlanDetails);
router.delete('/:planId', authenticateToken, deleteMealPlan);

export default router;
