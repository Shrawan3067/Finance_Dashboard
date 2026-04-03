// backend/routes/users.js
import express from 'express';
import { getUsers, updateUser, deleteUser } from '../controllers/userController.js';
import { protect, authorize } from '../middleware/auth.js';

const router = express.Router();

// Only admin can access user management
router.use(protect, authorize('admin'));

router.get('/', getUsers);
router.put('/:id', updateUser);
router.delete('/:id', deleteUser);

export default router;