import { Router } from 'express';
import { StorageController } from '../controllers/StorageController';
import { authenticate, requireAdmin } from '../middleware/authMiddleware';
import multer from 'multer';

const upload = multer({ storage: multer.memoryStorage() });
export const router = Router();
const storageController = new StorageController();

router.post('/upload', 
    authenticate, 
    requireAdmin,
    upload.single('file'),
    storageController.uploadFile.bind(storageController)
);

router.post('/upload/multiple', 
    authenticate, 
    requireAdmin,
    upload.array('files', 5),
    storageController.uploadMultipleFiles.bind(storageController)
);

router.delete('/', 
    authenticate, 
    requireAdmin,
    storageController.deleteFile.bind(storageController)
);