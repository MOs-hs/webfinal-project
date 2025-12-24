import express from 'express';
import { getAllUsers, getStatistics, deleteUser } from '../controllers/adminController.js';
import { authenticateToken, isAdmin } from '../middleware/auth.js';

const router = express.Router();

// All admin routes require authentication AND admin role
router.get('/users', authenticateToken, isAdmin, getAllUsers);
router.get('/statistics', authenticateToken, isAdmin, getStatistics);
router.delete('/users/:userId', authenticateToken, isAdmin, deleteUser);

export default router;
