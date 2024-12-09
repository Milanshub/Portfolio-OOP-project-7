import { Router } from 'express';
import { AdminController } from '../controllers/adminController';
import { authMiddleware } from '../middleware/authMiddleware';

const router = Router();
const adminController = new AdminController();

// Public routes
router.post('/login', adminController.login.bind(adminController));

// Protected routes
router.post('/', authMiddleware, adminController.createAdmin.bind(adminController));
router.put('/:id', authMiddleware, adminController.updateAdmin.bind(adminController));
router.delete('/:id', authMiddleware, adminController.deleteAdmin.bind(adminController));

export const adminRoutes = router;