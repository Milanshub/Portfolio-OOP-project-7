import { Router } from 'express';
import multer from 'multer';
import { AdminProfileController } from '../controllers/AdminProfileController';
import { authenticate, requireAdmin } from '../middleware/authMiddleware';
import { handleUpload } from '../middleware/uploadMiddleware';
import { Logger } from '../utils/logger';
import { fileHelpers } from '../utils/helpers/fileHelpers';

export const router = Router();
const adminProfileController = new AdminProfileController();
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

// All routes require authentication and admin privileges
router.put('/:adminId/profile', 
    authenticate, 
    requireAdmin,
    adminProfileController.manageProfile.bind(adminProfileController)
);

router.post('/:adminId/avatar',
    authenticate,
    requireAdmin,
    upload.single('avatar'),
    handleUpload('avatars'),
    adminProfileController.updateAvatar.bind(adminProfileController)
);

router.post('/:adminId/resume',
    authenticate,
    requireAdmin,
    upload.single('resume'),
    handleUpload('resumes'),
    adminProfileController.updateResume.bind(adminProfileController)
);