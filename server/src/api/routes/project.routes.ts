import { Router } from 'express';
import { ProjectController } from '../../controllers/ProjectController';
import { authMiddleware } from '../../middleware/authMiddleware.ts';

const router = Router();
const projectController = new ProjectController();

// Public routes
router.get('/', projectController.getAllProjects.bind(projectController));
router.get('/:id', projectController.getProjectById.bind(projectController));
router.get('/featured', projectController.getFeaturedProjects.bind(projectController));

// Protected routes
router.post('/', authMiddleware, projectController.createProject.bind(projectController));
router.put('/:id', authMiddleware, projectController.updateProject.bind(projectController));
router.delete('/:id', authMiddleware, projectController.deleteProject.bind(projectController));

export const projectRoutes = router;
