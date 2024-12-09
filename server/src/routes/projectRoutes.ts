import { Router } from 'express';
import multer from 'multer';
import { ProjectController } from '../controllers/ProjectController';
import { authMiddleware } from '../middleware/authMiddleware';

const router = Router();
const projectController = new ProjectController();

// Configure multer for memory storage
const upload = multer({
    storage: multer.memoryStorage(),
    limits: {
        fileSize: 5 * 1024 * 1024, // 5MB limit
    }
});

// Public routes
router.get('/', projectController.getAllProjects.bind(projectController));
router.get('/featured', projectController.getFeaturedProjects.bind(projectController));
router.get('/:id', projectController.getProjectById.bind(projectController));

// Protected routes
router.post('/', authMiddleware, projectController.createProject.bind(projectController));
router.put('/:id', authMiddleware, projectController.updateProject.bind(projectController));
router.delete('/:id', authMiddleware, projectController.deleteProject.bind(projectController));

// File upload routes
router.post(
    '/:id/thumbnail',
    authMiddleware,
    upload.single('thumbnail'),
    projectController.uploadThumbnail.bind(projectController)
);

router.post(
    '/:id/images',
    authMiddleware,
    upload.array('images', 5), // Max 5 images
    projectController.uploadImages.bind(projectController)
);

export const projectRoutes = router;