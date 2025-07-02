import { useState, useEffect, useRef } from 'react';

export interface ConversationMessage {
  id: string;
  type: 'user' | 'assistant';
  content: string;
  timestamp: Date;
  images?: string[];
}

interface ConversationContext {
  messages: ConversationMessage[];
  isMemoryActive: boolean;
}

const STORAGE_KEY = 'strategyai_conversation_memory';
const MAX_HISTORY_LENGTH = 15;

export const useConversationMemory = () => {
  const [context, setContext] = useState<ConversationContext>({
    messages: [],
    isMemoryActive: false
  });
  const isInitializedRef = useRef(false);

  // Load conversation from localStorage on mount
  useEffect(() => {
    if (!isInitializedRef.current) {
      try {
        const saved = localStorage.getItem(STORAGE_KEY);
        if (saved) {
          const parsed = JSON.parse(saved);
          const messagesWithDates = parsed.messages?.map((msg: any) => ({
            ...msg,
            timestamp: new Date(msg.timestamp)
          })) || [];
          
          setContext({
            messages: messagesWithDates,
            isMemoryActive: messagesWithDates.length > 0
          });
          console.log('🧠 Loaded conversation memory:', messagesWithDates.length, 'messages');
        }
      } catch (error) {
        console.error('❌ Error loading conversation memory:', error);
      }
      isInitializedRef.current = true;
    }
  }, []);

  // Save conversation to localStorage whenever it changes
  useEffect(() => {
    if (isInitializedRef.current && context.messages.length > 0) {
      try {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(context));
        console.log('💾 Saved conversation memory:', context.messages.length, 'messages');
      } catch (error) {
        console.error('❌ Error saving conversation memory:', error);
      }
    }
  }, [context]);

  const addMessage = (message: ConversationMessage) => {
    setContext(prev => {
      const newMessages = [...prev.messages, message];
      // Keep only the last MAX_HISTORY_LENGTH exchanges (30 messages total)
      const trimmedMessages = newMessages.slice(-MAX_HISTORY_LENGTH * 2);
      
      return {
        messages: trimmedMessages,
        isMemoryActive: true
      };
    });
  };

  const getContextForAI = (): string => {
    if (context.messages.length === 0) return '';

    const recentMessages = context.messages.slice(-10); // Last 5 exchanges
    const contextString = recentMessages.map(msg => {
      const timestamp = msg.timestamp.toLocaleTimeString();
      const hasImages = msg.images && msg.images.length > 0 ? ` [${msg.images.length} image(s) attached]` : '';
      return `[${timestamp}] ${msg.type.toUpperCase()}: ${msg.content}${hasImages}`;
    }).join('\n');

    return `\nCONVERSATION CONTEXT:\n${contextString}\n\nPlease reference this conversation history when responding to maintain consistency and context.`;
  };

  const resetMemory = () => {
    try {
      localStorage.removeItem(STORAGE_KEY);
      setContext({
        messages: [],
        isMemoryActive: false
      });
      console.log('🗑️ Reset conversation memory');
    } catch (error) {
      console.error('❌ Error resetting conversation memory:', error);
    }
  };

  const activateMemory = () => {
    setContext(prev => ({
      ...prev,
      isMemoryActive: true
    }));
  };

  return {
    context,
    addMessage,
    getContextForAI,
    resetMemory,
    activateMemory,
    isMemoryActive: context.isMemoryActive,
    messageCount: context.messages.length
  };
};
