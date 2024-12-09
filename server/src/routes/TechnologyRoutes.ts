import { Router } from 'express';
import { TechnologyController } from '../controllers/TechnologyController';
import { authMiddleware } from '../middleware/authMiddleware';

const router = Router();
const technologyController = new TechnologyController();

// Public routes
router.get('/', technologyController.getAllTechnologies.bind(technologyController));
router.get('/:id', technologyController.getTechnologyById.bind(technologyController));
router.get('/category/:category', technologyController.getTechnologiesByCategory.bind(technologyController));

// Protected routes
router.post('/', authMiddleware, technologyController.createTechnology.bind(technologyController));
router.put('/:id', authMiddleware, technologyController.updateTechnology.bind(technologyController));
router.delete('/:id', authMiddleware, technologyController.deleteTechnology.bind(technologyController));
router.put('/:id/proficiency', authMiddleware, technologyController.updateProficiencyLevel.bind(technologyController));

export const technologyRoutes = router;