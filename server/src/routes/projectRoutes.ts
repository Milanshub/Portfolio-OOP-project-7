import { Router } from 'express';
import multer from 'multer';
import { ProjectController } from '../controllers/ProjectController';
import { authenticate, requireAdmin } from '../middleware/authMiddleware';
import { Logger } from '../utils/logger';
import { fileHelpers } from '../utils/helpers/fileHelpers';

export const router = Router();
const projectController = new ProjectController();
const logger = Logger.getInstance();

// Configure multer for memory storage with file validation
const upload = multer({
    storage: multer.memoryStorage(),
    limits: {
        fileSize: 5 * 1024 * 1024, // 5MB limit
    },
    fileFilter: (req, file, cb) => {
        if (!fileHelpers.isValidImageType(file.mimetype)) {
            logger.warn('Invalid file type attempted to upload');
            cb(new Error('Only JPEG and PNG files are allowed'));
            return;
        }
        cb(null, true);
    }
});

// Public routes
router.get('/', projectController.getAllProjects.bind(projectController));
router.get('/featured', projectController.getFeaturedProjects.bind(projectController));
router.get('/:id', projectController.getProjectById.bind(projectController));

// Protected routes
router.post('/', authenticate, requireAdmin, projectController.createProject.bind(projectController));
router.put('/:id', authenticate, requireAdmin, projectController.updateProject.bind(projectController));
router.delete('/:id', authenticate, requireAdmin, projectController.deleteProject.bind(projectController));

// File upload routes
router.post(
    '/:id/thumbnail',
    authenticate,
    requireAdmin,
    upload.single('thumbnail'),
    projectController.uploadThumbnail.bind(projectController)
);

router.post(
    '/:id/images',
    authenticate,
    requireAdmin,
    upload.array('images', 5),
    projectController.uploadImages.bind(projectController)
);

