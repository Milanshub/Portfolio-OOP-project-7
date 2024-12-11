import { Router } from 'express';
import { TechnologyController } from '../controllers/TechnologyController';
import { authenticate } from '../middleware/authMiddleware';

export const router = Router();
const technologyController = new TechnologyController();

// Public routes
router.get('/', technologyController.getAllTechnologies.bind(technologyController));
router.get('/:id', technologyController.getTechnologyById.bind(technologyController));
router.get('/category/:category', technologyController.getTechnologiesByCategory.bind(technologyController));

// Protected routes
router.post('/', authenticate, technologyController.createTechnology.bind(technologyController));
router.put('/:id', authenticate, technologyController.updateTechnology.bind(technologyController));
router.delete('/:id', authenticate, technologyController.deleteTechnology.bind(technologyController));
router.put('/:id/proficiency', authenticate, technologyController.updateProficiencyLevel.bind(technologyController));

