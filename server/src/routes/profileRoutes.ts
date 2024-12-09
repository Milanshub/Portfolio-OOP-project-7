import { Router } from 'express';
import multer from 'multer';
import { ProfileController } from '../controllers/ProfileController';
import { authMiddleware } from '../middleware/authMiddleware';

const router = Router();
const profileController = new ProfileController();

// Configure multer for memory storage
const upload = multer({
    storage: multer.memoryStorage(),
    limits: {
        fileSize: 5 * 1024 * 1024, // 5MB limit
    }
});

// Public routes
router.get('/', profileController.getProfile.bind(profileController));

// Protected routes
router.put('/', authMiddleware, profileController.updateProfile.bind(profileController));
router.post(
    '/avatar', 
    authMiddleware, 
    upload.single('avatar'),
    profileController.uploadAvatar.bind(profileController)
);
router.post(
    '/resume', 
    authMiddleware, 
    upload.single('resume'),
    profileController.uploadResume.bind(profileController)
);

export const profileRoutes = router;