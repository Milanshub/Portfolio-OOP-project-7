import { useState, useEffect } from 'react';
import { messageService } from '@/services/messageService';
import { Message, ContactForm } from '@/types';

export function useMessages() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchMessages();
  }, []);

  const fetchMessages = async () => {
    try {
      setLoading(true);
      const [allMessages, count] = await Promise.all([
        messageService.getAllMessages(),
        messageService.getUnreadCount()
      ]);
      setMessages(allMessages);
      setUnreadCount(count);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const getUnreadMessages = async () => {
    try {
      setLoading(true);
      const unreadMessages = await messageService.getUnreadMessages();
      return unreadMessages;
    } catch (err: any) {
      setError(err.message);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const sendMessage = async (messageData: ContactForm) => {
    try {
      setLoading(true);
      const newMessage = await messageService.sendMessage(messageData);
      setMessages(prev => [...prev, newMessage]);
      setUnreadCount(prev => prev + 1);
      return newMessage;
    } catch (err: any) {
      setError(err.message);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const markAsRead = async (id: string) => {
    try {
      setLoading(true);
      const updatedMessage = await messageService.markAsRead(id);
      setMessages(prev => prev.map(m => m.id === id ? updatedMessage : m));
      setUnreadCount(prev => Math.max(0, prev - 1));
      return updatedMessage;
    } catch (err: any) {
      setError(err.message);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const deleteMessage = async (id: string) => {
    try {
      setLoading(true);
      await messageService.deleteMessage(id);
      const deletedMessage = messages.find(m => m.id === id);
      setMessages(prev => prev.filter(m => m.id !== id));
      if (deletedMessage && !deletedMessage.read) {
        setUnreadCount(prev => Math.max(0, prev - 1));
      }
    } catch (err: any) {
      setError(err.message);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  return {
    messages,
    unreadCount,
    loading,
    error,
    getUnreadMessages,
    sendMessage,
    markAsRead,
    deleteMessage,
    refreshMessages: fetchMessages,
  };
} 