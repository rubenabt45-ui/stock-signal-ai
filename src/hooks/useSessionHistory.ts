
import { useState, useEffect } from 'react';
import { ChatMessage } from './useConversationHistory';

interface ChatSession {
  id: string;
  title: string;
  messages: ChatMessage[];
  createdAt: Date;
  lastActivity: Date;
}

const SESSION_STORAGE_KEY = 'strategyai_chat_sessions';

export const useSessionHistory = () => {
  const [sessions, setSessions] = useState<ChatSession[]>([]);
  const [currentSessionId, setCurrentSessionId] = useState<string | null>(null);

  // Load sessions from localStorage on mount
  useEffect(() => {
    try {
      const saved = localStorage.getItem(SESSION_STORAGE_KEY);
      if (saved) {
        const parsed = JSON.parse(saved);
        const sessionsWithDates = parsed.map((session: any) => ({
          ...session,
          createdAt: new Date(session.createdAt),
          lastActivity: new Date(session.lastActivity),
          messages: session.messages.map((msg: any) => ({
            ...msg,
            timestamp: new Date(msg.timestamp)
          }))
        }));
        setSessions(sessionsWithDates);
      }
    } catch (error) {
      console.error('Error loading session history:', error);
    }
  }, []);

  // Save sessions to localStorage whenever they change
  useEffect(() => {
    try {
      localStorage.setItem(SESSION_STORAGE_KEY, JSON.stringify(sessions));
    } catch (error) {
      console.error('Error saving session history:', error);
    }
  }, [sessions]);

  const saveCurrentSession = (messages: ChatMessage[]) => {
    if (messages.length <= 1) return; // Don't save sessions with only welcome message

    const sessionId = currentSessionId || Date.now().toString();
    const title = generateSessionTitle(messages);
    
    const session: ChatSession = {
      id: sessionId,
      title,
      messages,
      createdAt: new Date(),
      lastActivity: new Date()
    };

    setSessions(prev => {
      const existing = prev.find(s => s.id === sessionId);
      if (existing) {
        return prev.map(s => s.id === sessionId ? session : s);
      }
      return [session, ...prev.slice(0, 19)]; // Keep only last 20 sessions
    });

    setCurrentSessionId(sessionId);
  };

  const loadSession = (sessionId: string): ChatMessage[] | null => {
    const session = sessions.find(s => s.id === sessionId);
    return session ? session.messages : null;
  };

  const deleteSession = (sessionId: string) => {
    setSessions(prev => prev.filter(s => s.id !== sessionId));
  };

  const clearHistory = () => {
    setSessions([]);
    setCurrentSessionId(null);
  };

  const generateSessionTitle = (messages: ChatMessage[]): string => {
    const userMessages = messages.filter(msg => msg.type === 'user');
    if (userMessages.length === 0) return 'New Chat';
    
    const firstMessage = userMessages[0].content;
    const title = firstMessage.length > 50 
      ? firstMessage.substring(0, 50) + '...' 
      : firstMessage;
    
    return title || 'New Chat';
  };

  return {
    sessions,
    saveCurrentSession,
    loadSession,
    deleteSession,
    clearHistory,
    currentSessionId,
    setCurrentSessionId
  };
};
