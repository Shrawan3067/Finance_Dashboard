// backend/routes/dashboard.js
import express from 'express';
import { getDashboardSummary } from '../controllers/dashboardController.js';
import { protect, authorize } from '../middleware/auth.js';

const router = express.Router();

// Viewer and above can view dashboard
router.get('/summary', protect, authorize('viewer', 'analyst', 'admin'), getDashboardSummary);

export default router;