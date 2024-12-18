import { Router } from 'express';
import { TechnologyController } from '../controllers/TechnologyController';
import { authenticate, requireAdmin } from '../middleware/authMiddleware';
import { validateTechnology } from '../middleware/validationMiddleware';

export const router = Router();
const technologyController = new TechnologyController();

// Public routes
router.get('/', technologyController.getAllTechnologies.bind(technologyController));
router.get('/:id', technologyController.getTechnologyById.bind(technologyController));
router.get('/category/:category', technologyController.getTechnologiesByCategory.bind(technologyController));

// Protected routes with validation
router.post('/', 
    authenticate, 
    requireAdmin,
    validateTechnology,
    technologyController.createTechnology.bind(technologyController)
);

router.put('/:id', 
    authenticate, 
    requireAdmin,
    validateTechnology,
    technologyController.updateTechnology.bind(technologyController)
);

router.delete('/:id', 
    authenticate, 
    requireAdmin, 
    technologyController.deleteTechnology.bind(technologyController)
);

router.put('/:id/proficiency', 
    authenticate, 
    requireAdmin,
    validateTechnology,
    technologyController.updateProficiencyLevel.bind(technologyController)
);