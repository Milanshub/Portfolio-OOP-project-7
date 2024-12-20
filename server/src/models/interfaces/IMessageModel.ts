import { IMessage } from '../../types/entities';
import { IRepository } from './IRepository';

export interface IMessageModel extends IRepository<
    IMessage,
    Omit<IMessage, 'id' | 'created_at' | 'read'>,
    Partial<IMessage>
> {
    markAsRead(id: string): Promise<IMessage | null>;
    getUnreadCount(): Promise<number>;
    findAllUnread(): Promise<IMessage[]>;
}