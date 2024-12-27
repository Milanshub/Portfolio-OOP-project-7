import { api } from '@/lib/api/client';
import { Message, ContactForm } from '@/types';

class MessageService {
  private static instance: MessageService;

  private constructor() {}

  public static getInstance(): MessageService {
    if (!MessageService.instance) {
      MessageService.instance = new MessageService();
    }
    return MessageService.instance;
  }

  async getAllMessages(): Promise<Message[]> {
    const response = await api.get<Message[]>('/messages');
    return response;
  }

  async getUnreadMessages(): Promise<Message[]> {
    const response = await api.get<Message[]>('/messages/unread');
    return response;
  }

  async getUnreadCount(): Promise<number> {
    const response = await api.get<{ count: number }>('/messages/unread/count');
    return response.count;
  }

  async sendMessage(data: ContactForm): Promise<Message> {
    const response = await api.post<Message>('/messages', data);
    return response;
  }

  async markAsRead(id: string): Promise<Message> {
    const response = await api.put<Message>(`/messages/${id}/read`);
    return response;
  }

  async deleteMessage(id: string): Promise<void> {
    await api.delete(`/messages/${id}`);
  }
}

export const messageService = MessageService.getInstance(); 