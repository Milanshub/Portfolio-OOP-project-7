import { Request, Response } from 'express';
import { MessageService } from '../services/MessageService';
import { ICreateMessage } from '../types/entities';
import { Logger } from '../utils/logger';
import { messageValidator } from '../utils/validators/messageValidator';
import { Cache } from '../utils/cache';

export class MessageController {
    private messageService: MessageService;
    private logger = Logger.getInstance();
    private cache = new Cache<any>(1 * 60 * 1000); // 1 minute cache for messages

    constructor() {
        this.messageService = new MessageService();
    }

    async getAllMessages(req: Request, res: Response): Promise<void> {
        try {
            const cacheKey = 'all-messages';
            const cached = this.cache.get(cacheKey);
            
            if (cached) {
                this.logger.debug('Serving messages from cache');
                res.status(200).json(cached);
                return;
            }

            const messages = await this.messageService.getAllMessages();
            this.cache.set(cacheKey, messages);
            this.logger.info('Messages fetched successfully');
            res.status(200).json(messages);
        } catch (error: any) {
            this.logger.error('Failed to get messages:', error);
            res.status(500).json({ error: error.message });
        }
    }

    async createMessage(req: Request, res: Response): Promise<void> {
        try {
            const messageData: ICreateMessage = req.body;
            const errors = messageValidator.validateCreate(messageData);
            
            if (errors.length > 0) {
                this.logger.warn('Message validation failed:', errors);
                res.status(400).json({ errors });
                return;
            }

            const message = await this.messageService.createMessage(messageData);
            this.logger.info('Message created successfully:', message.id);
            this.cache.clear(); // Clear cache when data changes
            res.status(201).json(message);
        } catch (error: any) {
            this.logger.error('Failed to create message:', error);
            res.status(400).json({ error: error.message });
        }
    }

    async markAsRead(req: Request, res: Response): Promise<void> {
        try {
            const { id } = req.params;
            const message = await this.messageService.markAsRead(id);
            this.logger.info(`Message ${id} marked as read`);
            this.cache.clear(); // Clear cache when data changes
            res.status(200).json(message);
        } catch (error: any) {
            this.logger.error(`Failed to mark message ${req.params.id} as read:`, error);
            res.status(400).json({ error: error.message });
        }
    }

    // ... similar updates for other methods
}