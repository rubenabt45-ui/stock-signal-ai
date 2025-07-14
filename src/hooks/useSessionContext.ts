
import { useState, useRef } from 'react';

export interface SessionContext {
  activeSymbol?: string;
  lastTopic?: string;
  conversationHistory: Array<{ role: 'user' | 'assistant'; content: string; timestamp: number }>;
}

export const useSessionContext = () => {
  const [context, setContext] = useState<SessionContext>({
    conversationHistory: []
  });
  const lastActivityRef = useRef<number>(Date.now());
  
  const updateContext = (userMessage: string, assistantResponse: string, detectedSymbol?: string) => {
    const now = Date.now();
    const timeSinceLastActivity = now - lastActivityRef.current;
    
    // Reset context if more than 5 minutes have passed
    if (timeSinceLastActivity > 5 * 60 * 1000) {
      setContext({
        activeSymbol: detectedSymbol,
        lastTopic: undefined,
        conversationHistory: [
          { role: 'user', content: userMessage, timestamp: now },
          { role: 'assistant', content: assistantResponse, timestamp: now }
        ]
      });
    } else {
      setContext(prev => ({
        activeSymbol: detectedSymbol || prev.activeSymbol,
        lastTopic: extractTopic(userMessage),
        conversationHistory: [
          ...prev.conversationHistory.slice(-8), // Keep last 8 messages
          { role: 'user', content: userMessage, timestamp: now },
          { role: 'assistant', content: assistantResponse, timestamp: now }
        ]
      }));
    }
    
    lastActivityRef.current = now;
  };
  
  const extractTopic = (message: string): string | undefined => {
    const lowerMessage = message.toLowerCase();
    if (lowerMessage.includes('rsi')) return 'RSI';
    if (lowerMessage.includes('macd')) return 'MACD';
    if (lowerMessage.includes('support') || lowerMessage.includes('resistance')) return 'Support/Resistance';
    // Future Feature: Chart AI
    // if (lowerMessage.includes('chart ai')) return 'Chart AI';
    if (lowerMessage.includes('alert')) return 'Alerts';
    return undefined;
  };
  
  const resetContext = () => {
    setContext({
      conversationHistory: []
    });
  };
  
  return {
    context,
    updateContext,
    resetContext
  };
};
