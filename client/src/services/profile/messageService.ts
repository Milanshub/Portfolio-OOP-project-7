import { api, handleApiError } from '@/lib/api';
import { Message, ContactForm } from '@/types';

export const messageService = {
  async getAllMessages(): Promise<Message[]> {
    try {
      const response = await api.get<Message[]>('/messages');
      return response;
    } catch (error) {
      throw new Error(handleApiError(error));
    }
  },

  async getUnreadMessages(): Promise<Message[]> {
    try {
      const response = await api.get<Message[]>('/messages/unread');
      return response;
    } catch (error) {
      throw new Error(handleApiError(error));
    }
  },

  async getUnreadCount(): Promise<number> {
    try {
      const response = await api.get<{ count: number }>('/messages/unread/count');
      return response.count;
    } catch (error) {
      throw new Error(handleApiError(error));
    }
  },

  async sendMessage(messageData: ContactForm): Promise<Message> {
    try {
      const response = await api.post<Message>('/messages', messageData);
      return response;
    } catch (error) {
      throw new Error(handleApiError(error));
    }
  },

  async markAsRead(id: string): Promise<Message> {
    try {
      const response = await api.put<Message>(`/messages/${id}/read`);
      return response;
    } catch (error) {
      throw new Error(handleApiError(error));
    }
  },

  async deleteMessage(id: string): Promise<void> {
    try {
      await api.delete(`/messages/${id}`);
    } catch (error) {
      throw new Error(handleApiError(error));
    }
  }
}; 