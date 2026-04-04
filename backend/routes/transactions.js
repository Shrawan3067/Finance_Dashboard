import express from 'express';
import { body } from 'express-validator';
import {
  createTransaction,
  getTransactions,
  getTransactionById,
  updateTransaction,
  deleteTransaction
} from '../controllers/transactionController.js';
import { protect, authorize } from '../middleware/auth.js';

const router = express.Router();

// All routes require authentication
router.use(protect);

// Analyst and Admin can access transactions (Viewers are blocked)
router.get('/', authorize('analyst', 'admin'), getTransactions);
router.get('/:id', authorize('analyst', 'admin'), getTransactionById);

// Admin and Analyst can create/update/delete (Viewers are blocked)
router.post('/',
  authorize('admin', 'analyst'),
  [
    body('amount').isFloat({ min: 0 }).withMessage('Amount must be a positive number'),
    body('type').isIn(['income', 'expense']).withMessage('Type must be income or expense'),
    body('category').notEmpty().withMessage('Category is required'),
    body('date').optional().isISO8601().withMessage('Invalid date format')
  ],
  createTransaction
);

router.put('/:id',
  authorize('admin', 'analyst'),
  [
    body('amount').optional().isFloat({ min: 0 }),
    body('type').optional().isIn(['income', 'expense']),
    body('category').optional().notEmpty(),
    body('date').optional().isISO8601()
  ],
  updateTransaction
);

router.delete('/:id',
  authorize('admin', 'analyst'),
  deleteTransaction
);

export default router;