import { IMessage, ICreateMessage } from '../types/entities';
import { Message } from '../models/Message';
import { Logger } from '../utils/logger';
import { emailValidator } from '../utils/validators/emailValidator';

export class MessageService {
    private messageModel: Message;
    private logger = Logger.getInstance();

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
            throw new Error(`Failed to get messages: ${error.message}`);
        }
    }

    async getUnreadMessages(): Promise<IMessage[]> {
        try {
            const messages = await this.messageModel.findAllUnread();
            this.logger.info('Unread messages retrieved successfully');
            return messages;
        } catch (error: any) {
            this.logger.error('Failed to get unread messages:', error);
            throw new Error(`Failed to get unread messages: ${error.message}`);
        }
    }

    async getUnreadCount(): Promise<number> {
        try {
            const count = await this.messageModel.getUnreadCount();
            this.logger.debug(`Current unread message count: ${count}`);
            return count;
        } catch (error: any) {
            this.logger.error('Failed to get unread count:', error);
            throw new Error(`Failed to get unread count: ${error.message}`);
        }
    }

    async createMessage(messageData: ICreateMessage): Promise<IMessage> {
        try {
            // Validate email format
            if (!emailValidator.isValidEmail(messageData.senderEmail)) {
                this.logger.warn(`Invalid email format attempted: ${messageData.senderEmail}`);
                throw new Error('Invalid email format');
            }

            // Validate required fields
            if (!messageData.senderName.trim() || !messageData.message.trim()) {
                this.logger.warn('Attempted to create message with missing required fields');
                throw new Error('Name and message are required');
            }

            const message = await this.messageModel.create(messageData);
            this.logger.info(`New message created from: ${messageData.senderEmail}`);
            return message;
        } catch (error: any) {
            this.logger.error('Failed to create message:', error);
            throw new Error(`Failed to create message: ${error.message}`);
        }
    }

    async markAsRead(id: string): Promise<IMessage> {
        try {
            const message = await this.messageModel.markAsRead(id);
            if (!message) {
                this.logger.warn(`Attempted to mark non-existent message as read: ${id}`);
                throw new Error('Message not found');
            }
            this.logger.info(`Message marked as read: ${id}`);
            return message;
        } catch (error: any) {
            this.logger.error(`Failed to mark message as read: ${id}`, error);
            throw new Error(`Failed to mark message as read: ${error.message}`);
        }
    }

    async deleteMessage(id: string): Promise<boolean> {
        try {
            const message = await this.messageModel.findById(id);
            if (!message) {
                this.logger.warn(`Attempted to delete non-existent message: ${id}`);
                throw new Error('Message not found');
            }

            const result = await this.messageModel.delete(id);
            if (result) {
                this.logger.info(`Message deleted successfully: ${id}`);
            }
            return result;
        } catch (error: any) {
            this.logger.error(`Failed to delete message: ${id}`, error);
            throw new Error(`Failed to delete message: ${error.message}`);
        }
    }
}