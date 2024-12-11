import { Router } from 'express';
import multer from 'multer';
import { ProfileController } from '../controllers/ProfileController';
import { authenticate, requireAdmin } from '../middleware/authMiddleware';
import { Logger } from '../utils/logger';
import { fileHelpers } from '../utils/helpers/fileHelpers';

export const router = Router();
const profileController = new ProfileController();
const logger = Logger.getInstance();

// Configure multer for memory storage with file validation
const upload = multer({
    storage: multer.memoryStorage(),
    limits: {
        fileSize: 5 * 1024 * 1024, // 5MB limit
    },
    fileFilter: (req, file, cb) => {
        if (file.fieldname === 'avatar' && !fileHelpers.isValidImageType(file.mimetype)) {
            logger.warn('Invalid avatar file type');
            cb(new Error('Only JPEG and PNG files are allowed for avatars'));
            return;
        }
        if (file.fieldname === 'resume' && !fileHelpers.isValidResumeType(file.mimetype)) {
            logger.warn('Invalid resume file type');
            cb(new Error('Only PDF files are allowed for resumes'));
            return;
        }
        cb(null, true);
    }
});

// Public routes
router.get('/', profileController.getProfile.bind(profileController));

// Protected routes
router.put('/', authenticate, requireAdmin, profileController.updateProfile.bind(profileController));
router.post(
    '/avatar',
    authenticate,
    requireAdmin,
    upload.single('avatar'),
    profileController.uploadAvatar.bind(profileController)
);
router.post(
    '/resume',
    authenticate,
    requireAdmin,
    upload.single('resume'),
    profileController.uploadResume.bind(profileController)
);
