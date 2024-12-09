import { IMessage } from '../types/entities';
import { IMessageModel } from './interfaces/IMessageModel';
import { supabase } from '../config/supabase';

export class Message implements IMessageModel {
    async findAll(): Promise<IMessage[]> {
        const { data, error } = await supabase
            .from('messages')
            .select('*')
            .order('createdAt', { ascending: false });
        
        if (error) throw error;
        return data as IMessage[];
    }

    async findById(id: string): Promise<IMessage | null> {
        const { data, error } = await supabase
            .from('messages')
            .select('*')
            .eq('id', id)
            .single();
        
        if (error) throw error;
        return data as IMessage;
    }

    async create(message: Omit<IMessage, 'id' | 'createdAt' | 'read'>): Promise<IMessage> {
        const { data, error } = await supabase
            .from('messages')
            .insert({
                ...message,
                createdAt: new Date(),
                read: false
            })
            .select()
            .single();
        
        if (error) throw error;
        return data as IMessage;
    }

    async update(id: string, message: Partial<IMessage>): Promise<IMessage | null> {
        const { data, error } = await supabase
            .from('messages')
            .update(message)
            .eq('id', id)
            .select()
            .single();
        
        if (error) throw error;
        return data as IMessage;
    }

    async delete(id: string): Promise<boolean> {
        const { error } = await supabase
            .from('messages')
            .delete()
            .eq('id', id);
        
        if (error) throw error;
        return true;
    }

    // Message-specific methods
    async markAsRead(id: string): Promise<IMessage | null> {
        const { data, error } = await supabase
            .from('messages')
            .update({ read: true })
            .eq('id', id)
            .select()
            .single();
        
        if (error) throw error;
        return data as IMessage;
    }

    async getUnreadCount(): Promise<number> {
        const { count, error } = await supabase
            .from('messages')
            .select('*', { count: 'exact' })
            .eq('read', false);
        
        if (error) throw error;
        return count || 0;
    }

    async findAllUnread(): Promise<IMessage[]> {
        const { data, error } = await supabase
            .from('messages')
            .select('*')
            .eq('read', false)
            .order('createdAt', { ascending: false });
        
        if (error) throw error;
        return data as IMessage[];
    }
}