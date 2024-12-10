import { IMessage } from '../types/entities';
import { IMessageModel } from './interfaces/IMessageModel';
import { supabase } from '../config/supabase';
import { Logger } from '../utils/logger';
import { AppError } from '../middleware/errorMiddleware';

export class Message implements IMessageModel {
    private logger = Logger.getInstance();
    private tableName = 'messages';

    async findAll(): Promise<IMessage[]> {
        try {
            this.logger.debug('Fetching all messages');
            const { data, error } = await supabase
                .from(this.tableName)
                .select('*')
                .order('createdAt', { ascending: false });
            
            if (error) throw error;
            return data as IMessage[];
        } catch (error: any) {
            this.logger.error('Failed to fetch messages:', error);
            throw new AppError(`Database error: ${error.message}`, 500);
        }
    }

    async findById(id: string): Promise<IMessage | null> {
        try {
            this.logger.debug(`Fetching message with id: ${id}`);
            const { data, error } = await supabase
                .from(this.tableName)
                .select('*')
                .eq('id', id)
                .single();
            
            if (error) throw error;
            return data as IMessage;
        } catch (error: any) {
            this.logger.error(`Failed to fetch message ${id}:`, error);
            throw new AppError(`Database error: ${error.message}`, 500);
        }
    }

    async create(message: Omit<IMessage, 'id' | 'createdAt' | 'read'>): Promise<IMessage> {
        try {
            this.logger.debug('Creating new message:', message);
            const { data, error } = await supabase
                .from(this.tableName)
                .insert({
                    ...message,
                    createdAt: new Date(),
                    read: false
                })
                .select()
                .single();
            
            if (error) throw error;
            return data as IMessage;
        } catch (error: any) {
            this.logger.error('Failed to create message:', error);
            throw new AppError(`Database error: ${error.message}`, 500);
        }
    }

    async update(id: string, message: Partial<IMessage>): Promise<IMessage | null> {
        try {
            this.logger.debug(`Updating message ${id}:`, message);
            const { data, error } = await supabase
                .from(this.tableName)
                .update(message)
                .eq('id', id)
                .select()
                .single();
            
            if (error) throw error;
            return data as IMessage;
        } catch (error: any) {
            this.logger.error(`Failed to update message ${id}:`, error);
            throw new AppError(`Database error: ${error.message}`, 500);
        }
    }

    async delete(id: string): Promise<boolean> {
        try {
            this.logger.debug(`Deleting message ${id}`);
            const { error } = await supabase
                .from(this.tableName)
                .delete()
                .eq('id', id);
            
            if (error) throw error;
            return true;
        } catch (error: any) {
            this.logger.error(`Failed to delete message ${id}:`, error);
            throw new AppError(`Database error: ${error.message}`, 500);
        }
    }

    // Message-specific methods
    async markAsRead(id: string): Promise<IMessage | null> {
        try {
            this.logger.debug(`Marking message ${id} as read`);
            const { data, error } = await supabase
                .from(this.tableName)
                .update({ read: true })
                .eq('id', id)
                .select()
                .single();
            
            if (error) throw error;
            return data as IMessage;
        } catch (error: any) {
            this.logger.error(`Failed to mark message ${id} as read:`, error);
            throw new AppError(`Database error: ${error.message}`, 500);
        }
    }

    async getUnreadCount(): Promise<number> {
        try {
            this.logger.debug('Getting unread message count');
            const { count, error } = await supabase
                .from(this.tableName)
                .select('*', { count: 'exact' })
                .eq('read', false);
            
            if (error) throw error;
            return count || 0;
        } catch (error: any) {
            this.logger.error('Failed to get unread message count:', error);
            throw new AppError(`Database error: ${error.message}`, 500);
        }
    }

    async findAllUnread(): Promise<IMessage[]> {
        try {
            this.logger.debug('Fetching all unread messages');
            const { data, error } = await supabase
                .from(this.tableName)
                .select('*')
                .eq('read', false)
                .order('createdAt', { ascending: false });
            
            if (error) throw error;
            return data as IMessage[];
        } catch (error: any) {
            this.logger.error('Failed to fetch unread messages:', error);
            throw new AppError(`Database error: ${error.message}`, 500);
        }
    }
}