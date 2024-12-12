import { Router } from 'express';
import multer from 'multer';
import { ProfileController } from '../controllers/ProfileController';
import { authenticate, requireAdmin } from '../middleware/authMiddleware';
import { validateProfile } from '../middleware/validationMiddleware';
import { handleUpload } from '../middleware/uploadMiddleware';
import { Logger } from '../utils/logger';
import { fileHelpers } from '../utils/helpers/fileHelpers';

export const router = Router();
const profileController = new ProfileController();
const logger = Logger.getInstance();

const upload = multer({
    storage: multer.memoryStorage(),
    limits: { fileSize: 5 * 1024 * 1024 },
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

// Protected routes with validation
router.put('/', 
    authenticate, 
    requireAdmin,
    validateProfile,
    profileController.updateProfile.bind(profileController)
);

// File upload routes with upload middleware
router.post(
    '/avatar',
    authenticate,
    requireAdmin,
    upload.single('avatar'),
    handleUpload('avatars'),
    profileController.uploadAvatar.bind(profileController)
);

router.post(
    '/resume',
    authenticate,
    requireAdmin,
    upload.single('resume'),
    handleUpload('resumes'),
    profileController.uploadResume.bind(profileController)
);