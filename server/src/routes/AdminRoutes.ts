import { Router } from 'express';
import { AdminController } from '../controllers/AdminController';
import { authenticate, requireAdmin } from '../middleware/authMiddleware';
import express from 'express';


export const router = express.Router();
const adminController = new AdminController();

// Public routes
router.post('/login', adminController.login.bind(adminController));

// Protected routes
router.post('/', authenticate, requireAdmin, adminController.createAdmin.bind(adminController));
router.put('/:id', authenticate, requireAdmin, adminController.updateAdmin.bind(adminController));
router.delete('/:id', authenticate, requireAdmin, adminController.deleteAdmin.bind(adminController));

export const adminRoutes = router;