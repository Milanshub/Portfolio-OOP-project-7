import { IMessage, ICreateMessage, IUpdateMessage } from '../types/entities';
import { Message } from '../models/Message';

export class MessageService {
    private messageModel: Message;

    constructor() {
        this.messageModel = new Message();
    }

    async getAllMessages(): Promise<IMessage[]> {
        try {
            return await this.messageModel.findAll();
        } catch (error: any) {
            throw new Error(`Failed to get messages: ${error.message}`);
        }
    }

    async getUnreadMessages(): Promise<IMessage[]> {
        try {
            return await this.messageModel.findAllUnread();
        } catch (error: any) {
            throw new Error(`Failed to get unread messages: ${error.message}`);
        }
    }

    async getUnreadCount(): Promise<number> {
        try {
            return await this.messageModel.getUnreadCount();
        } catch (error: any) {
            throw new Error(`Failed to get unread count: ${error.message}`);
        }
    }

    async createMessage(messageData: ICreateMessage): Promise<IMessage> {
        try {
            // Validate email format
            if (!this.isValidEmail(messageData.senderEmail)) {
                throw new Error('Invalid email format');
            }

            // Validate required fields
            if (!messageData.senderName.trim() || !messageData.message.trim()) {
                throw new Error('Name and message are required');
            }

            return await this.messageModel.create(messageData);
        } catch (error: any) {
            throw new Error(`Failed to create message: ${error.message}`);
        }
    }

    async markAsRead(id: string): Promise<IMessage> {
        try {
            const message = await this.messageModel.markAsRead(id);
            if (!message) {
                throw new Error('Message not found');
            }
            return message;
        } catch (error: any) {
            throw new Error(`Failed to mark message as read: ${error.message}`);
        }
    }

    async deleteMessage(id: string): Promise<boolean> {
        try {
            const message = await this.messageModel.findById(id);
            if (!message) {
                throw new Error('Message not found');
            }
            return await this.messageModel.delete(id);
        } catch (error: any) {
            throw new Error(`Failed to delete message: ${error.message}`);
        }
    }

    private isValidEmail(email: string): boolean {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return emailRegex.test(email);
    }
}