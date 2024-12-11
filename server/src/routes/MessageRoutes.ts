import { Router } from 'express';
import { MessageController } from '../controllers/MessageController';
import { authenticate } from '../middleware/authMiddleware';

export const router = Router();
const messageController = new MessageController();

// Public routes
router.post('/', messageController.createMessage.bind(messageController));

// Protected routes
router.get('/', authenticate, messageController.getAllMessages.bind(messageController));
router.get('/unread', authenticate, messageController.getUnreadMessages.bind(messageController));
router.get('/unread/count', authenticate, messageController.getUnreadCount.bind(messageController));
router.put('/:id/read', authenticate, messageController.markAsRead.bind(messageController));
router.delete('/:id', authenticate, messageController.deleteMessage.bind(messageController));


