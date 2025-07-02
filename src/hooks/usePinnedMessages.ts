
import { useState, useEffect } from 'react';
import { ChatMessage } from './useConversationHistory';

interface PinnedMessage extends ChatMessage {
  pinnedAt: Date;
}

const PINNED_STORAGE_KEY = 'strategyai_pinned_messages';

export const usePinnedMessages = () => {
  const [pinnedMessages, setPinnedMessages] = useState<PinnedMessage[]>([]);

  // Load pinned messages from localStorage on mount
  useEffect(() => {
    try {
      const saved = localStorage.getItem(PINNED_STORAGE_KEY);
      if (saved) {
        const parsed = JSON.parse(saved);
        const messagesWithDates = parsed.map((msg: any) => ({
          ...msg,
          timestamp: new Date(msg.timestamp),
          pinnedAt: new Date(msg.pinnedAt)
        }));
        setPinnedMessages(messagesWithDates);
      }
    } catch (error) {
      console.error('Error loading pinned messages:', error);
    }
  }, []);

  // Save pinned messages to localStorage whenever they change
  useEffect(() => {
    try {
      localStorage.setItem(PINNED_STORAGE_KEY, JSON.stringify(pinnedMessages));
    } catch (error) {
      console.error('Error saving pinned messages:', error);
    }
  }, [pinnedMessages]);

  const pinMessage = (message: ChatMessage) => {
    const pinnedMessage: PinnedMessage = {
      ...message,
      pinnedAt: new Date()
    };
    setPinnedMessages(prev => [pinnedMessage, ...prev]);
  };

  const unpinMessage = (messageId: string) => {
    setPinnedMessages(prev => prev.filter(msg => msg.id !== messageId));
  };

  const isMessagePinned = (messageId: string) => {
    return pinnedMessages.some(msg => msg.id === messageId);
  };

  const clearPinnedMessages = () => {
    setPinnedMessages([]);
  };

  return {
    pinnedMessages,
    pinMessage,
    unpinMessage,
    isMessagePinned,
    clearPinnedMessages
  };
};
