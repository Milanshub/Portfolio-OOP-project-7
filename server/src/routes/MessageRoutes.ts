import { Router } from 'express';
import { MessageController } from '../controllers/MessageController';
import { authMiddleware } from '../middleware/authMiddleware';

const router = Router();
const messageController = new MessageController();

// Public routes
router.post('/', messageController.createMessage.bind(messageController));

// Protected routes
router.get('/', authMiddleware, messageController.getAllMessages.bind(messageController));
router.get('/unread', authMiddleware, messageController.getUnreadMessages.bind(messageController));
router.get('/unread/count', authMiddleware, messageController.getUnreadCount.bind(messageController));
router.put('/:id/read', authMiddleware, messageController.markAsRead.bind(messageController));
router.delete('/:id', authMiddleware, messageController.deleteMessage.bind(messageController));

export const messageRoutes = router;