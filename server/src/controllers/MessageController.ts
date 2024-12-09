import { Request, Response } from 'express';
import { MessageService } from '../services/MessageService';
import { ICreateMessage } from '../types/entities';

export class MessageController {
    private messageService: MessageService;

    constructor() {
        this.messageService = new MessageService();
    }

    async getAllMessages(req: Request, res: Response): Promise<void> {
        try {
            const messages = await this.messageService.getAllMessages();
            res.status(200).json(messages);
        } catch (error: any) {
            res.status(500).json({ error: error.message });
        }
    }

    async getUnreadMessages(req: Request, res: Response): Promise<void> {
        try {
            const messages = await this.messageService.getUnreadMessages();
            res.status(200).json(messages);
        } catch (error: any) {
            res.status(500).json({ error: error.message });
        }
    }

    async getUnreadCount(req: Request, res: Response): Promise<void> {
        try {
            const count = await this.messageService.getUnreadCount();
            res.status(200).json({ count });
        } catch (error: any) {
            res.status(500).json({ error: error.message });
        }
    }

    async createMessage(req: Request, res: Response): Promise<void> {
        try {
            const messageData: ICreateMessage = req.body;
            const message = await this.messageService.createMessage(messageData);
            res.status(201).json(message);
        } catch (error: any) {
            res.status(400).json({ error: error.message });
        }
    }

    async markAsRead(req: Request, res: Response): Promise<void> {
        try {
            const { id } = req.params;
            const message = await this.messageService.markAsRead(id);
            res.status(200).json(message);
        } catch (error: any) {
            res.status(400).json({ error: error.message });
        }
    }

    async deleteMessage(req: Request, res: Response): Promise<void> {
        try {
            const { id } = req.params;
            await this.messageService.deleteMessage(id);
            res.status(200).json({ message: 'Message deleted successfully' });
        } catch (error: any) {
            res.status(400).json({ error: error.message });
        }
    }
}