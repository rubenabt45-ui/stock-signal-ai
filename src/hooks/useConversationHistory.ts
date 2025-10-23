
import { useState, useEffect } from 'react';

export interface ChatMessage {
  id: string;
  type: 'user' | 'assistant';
  content: string;
  image?: string;
  timestamp: Date;
  isStreaming?: boolean;
}

const STORAGE_KEY = 'strategyai_chat_history';

export const useConversationHistory = () => {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  // Load messages from localStorage on mount
  useEffect(() => {
    try {
      const savedHistory = localStorage.getItem(STORAGE_KEY);
      if (savedHistory) {
        const parsedHistory = JSON.parse(savedHistory);
        // Convert timestamp strings back to Date objects
        const messagesWithDates = parsedHistory.map((msg: any) => ({
          ...msg,
          timestamp: new Date(msg.timestamp)
        }));
        setMessages(messagesWithDates);
        console.log('📚 Loaded conversation history:', messagesWithDates.length, 'messages');
      } else {
        // Set welcome message if no history exists
        const welcomeMessage: ChatMessage = {
          id: '1',
          type: 'assistant',
          content: 'Welcome to StrategyAI – Your Trading Assistant powered by AI.\n\nYou can:\n- Ask questions about trading strategies, indicators (like RSI or MACD), and risk management.\n- Upload multiple chart screenshots for comprehensive analysis.\n- Pin important responses for quick reference.\n- Access your chat history anytime.\n\nTry asking:\n- What is RSI divergence?\n- How should I manage risk on a swing trade?\n- Upload charts and ask: "Analyze these charts and give me a full market overview"',
          timestamp: new Date()
        };
        setMessages([welcomeMessage]);
      }
    } catch (error) {
      console.error('❌ Error loading conversation history:', error);
      // Fallback to welcome message on error
      const welcomeMessage: ChatMessage = {
        id: '1',
        type: 'assistant',
        content: 'Welcome to StrategyAI – Your Trading Assistant powered by AI.\n\nYou can:\n- Ask questions about trading strategies, indicators (like RSI or MACD), and risk management.\n- Upload multiple chart screenshots for comprehensive analysis.\n- Pin important responses for quick reference.\n- Access your chat history anytime.\n\nTry asking:\n- What is RSI divergence?\n- How should I manage risk on a swing trade?\n- Upload charts and ask: "Analyze these charts and give me a full market overview"',
        timestamp: new Date()
      };
      setMessages([welcomeMessage]);
    } finally {
      setIsLoading(false);
    }
  }, []);

  // Save messages to localStorage whenever messages change
  useEffect(() => {
    if (!isLoading && messages.length > 0) {
      try {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(messages));
        console.log('💾 Saved conversation history:', messages.length, 'messages');
      } catch (error) {
        console.error('❌ Error saving conversation history:', error);
      }
    }
  }, [messages, isLoading]);

  const addMessage = (message: ChatMessage) => {
    setMessages(prev => [...prev, message]);
  };

  const addMessages = (newMessages: ChatMessage[]) => {
    setMessages(prev => [...prev, ...newMessages]);
  };

  const clearHistory = () => {
    try {
      localStorage.removeItem(STORAGE_KEY);
      const welcomeMessage: ChatMessage = {
        id: '1',
        type: 'assistant',
        content: 'Welcome to StrategyAI – Your Trading Assistant powered by AI.\n\nYou can:\n- Ask questions about trading strategies, indicators (like RSI or MACD), and risk management.\n- Upload multiple chart screenshots for comprehensive analysis.\n- Pin important responses for quick reference.\n- Access your chat history anytime.\n\nTry asking:\n- What is RSI divergence?\n- How should I manage risk on a swing trade?\n- Upload charts and ask: "Analyze these charts and give me a full market overview"',
        timestamp: new Date()
      };
      setMessages([welcomeMessage]);
      console.log('🗑️ Cleared conversation history');
    } catch (error) {
      console.error('❌ Error clearing conversation history:', error);
    }
  };

  return {
    messages,
    setMessages,
    addMessage,
    addMessages,
    clearHistory,
    isLoading
  };
};
