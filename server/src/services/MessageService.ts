// server/src/services/MessageService.ts

import { IMessage, ICreateMessage } from '../types/entities';
import { Message } from '../models/Message';
import { Logger } from '../utils/logger';
import { emailValidator } from '../utils/validators/emailValidator';
import { sendEmail } from '../utils/emailSender';
import { AppError } from '../middleware/errorMiddleware';

export class MessageService {
    private messageModel: Message;
    private logger = Logger.getInstance();
    private readonly adminEmail = process.env.ADMIN_EMAIL;

    constructor() {
        this.messageModel = new Message();
    }

    async getAllMessages(): Promise<IMessage[]> {
        try {
            const messages = await this.messageModel.findAll();
            this.logger.info('All messages retrieved successfully');
            return messages;
        } catch (error: any) {
            this.logger.error('Failed to get messages:', error);
            throw new AppError(`Failed to get messages: ${error.message}`, 500);
        }
    }

    async getUnreadMessages(): Promise<IMessage[]> {
        try {
            const messages = await this.messageModel.findAllUnread();
            this.logger.info('Unread messages retrieved successfully');
            return messages;
        } catch (error: any) {
            this.logger.error('Failed to get unread messages:', error);
            throw new AppError(`Failed to get unread messages: ${error.message}`, 500);
        }
    }

    async getUnreadCount(): Promise<number> {
        try {
            const count = await this.messageModel.getUnreadCount();
            this.logger.debug(`Current unread message count: ${count}`);
            return count;
        } catch (error: any) {
            this.logger.error('Failed to get unread count:', error);
            throw new AppError(`Failed to get unread count: ${error.message}`, 500);
        }
    }

    async createMessage(messageData: ICreateMessage): Promise<IMessage> {
        try {
            // Validate email format
            if (!emailValidator.isValidEmail(messageData.senderEmail)) {
                this.logger.warn(`Invalid email format attempted: ${messageData.senderEmail}`);
                throw new AppError('Invalid email format', 400);
            }

            // Validate required fields
            if (!messageData.senderName.trim() || !messageData.message.trim()) {
                this.logger.warn('Attempted to create message with missing required fields');
                throw new AppError('Name and message are required', 400);
            }

            const message = await this.messageModel.create(messageData);

            // Send email notification
            await this.sendEmailNotification(message);

            this.logger.info(`New message created from: ${messageData.senderEmail}`);
            return message;
        } catch (error: any) {
            this.logger.error('Failed to create message:', error);
            throw new AppError(`Failed to create message: ${error.message}`, error.statusCode || 500);
        }
    }

    async markAsRead(id: string): Promise<IMessage> {
        try {
            const message = await this.messageModel.markAsRead(id);
            if (!message) {
                this.logger.warn(`Attempted to mark non-existent message as read: ${id}`);
                throw new AppError('Message not found', 404);
            }
            this.logger.info(`Message marked as read: ${id}`);
            return message;
        } catch (error: any) {
            this.logger.error(`Failed to mark message as read: ${id}`, error);
            throw new AppError(`Failed to mark message as read: ${error.message}`, error.statusCode || 500);
        }
    }

    async deleteMessage(id: string): Promise<boolean> {
        try {
            const message = await this.messageModel.findById(id);
            if (!message) {
                this.logger.warn(`Attempted to delete non-existent message: ${id}`);
                throw new AppError('Message not found', 404);
            }

            const result = await this.messageModel.delete(id);
            if (result) {
                this.logger.info(`Message deleted successfully: ${id}`);
            }
            return result;
        } catch (error: any) {
            this.logger.error(`Failed to delete message: ${id}`, error);
            throw new AppError(`Failed to delete message: ${error.message}`, error.statusCode || 500);
        }
    }

    private async sendEmailNotification(message: IMessage): Promise<void> {
        const emailContent = `
            New Message from Portfolio Contact Form
            
            From: ${message.senderName} (${message.senderEmail})
            Subject: ${message.subject}
            
            Message:
            ${message.message}
            
            Sent at: ${message.createdAt}
        `;

        await sendEmail({
            to: this.adminEmail!,
            subject: `New Contact Form Message from ${message.senderName}`,
            text: emailContent
        });
    }
}