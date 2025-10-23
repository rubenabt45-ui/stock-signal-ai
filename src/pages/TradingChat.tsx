import React, { useState, useRef, useEffect, useCallback } from 'react';
import { Send, Bot, User, Loader2, Brain, Lock, Crown, Clock, AlertTriangle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { useAuth } from '@/providers/AuthProvider';
import { useSubscription } from '@/hooks/useSubscription';
import { useDailyMessages } from '@/hooks/useDailyMessages';
import { useConversationHistory } from '@/hooks/useConversationHistory';
import { UpgradeModal } from '@/components/UpgradeModal';
import { analyzeMarketQuery } from '@/services/aiService';
import { logger } from '@/utils/logger';
import { useNavigate } from 'react-router-dom';
import { MotionWrapper, StaggerContainer, StaggerItem } from '@/components/ui/motion-wrapper';

interface Message {
  id: string;
  content: string;
  type: 'user' | 'assistant';
  timestamp: Date;
  isStreaming?: boolean;
}
const TradingChat: React.FC = () => {
  const {
    user
  } = useAuth();
  const navigate = useNavigate();
  const {
    isPro
  } = useSubscription();
  const {
    analysisCount,
    maxAnalysisPerDay,
    canUseAnalysis,
    remainingAnalysis,
    recordAnalysisUsage,
    loading: usageLoading
  } = useDailyMessages();
  
  // Use conversation history hook for persistent messages
  const {
    messages,
    addMessage,
    setMessages,
    isLoading: historyLoading
  } = useConversationHistory();
  
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [showUpgradeModal, setShowUpgradeModal] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({
      behavior: 'smooth'
    });
  };
  useEffect(() => {
    scrollToBottom();
  }, [messages]);
  useEffect(() => {
    if (!user) {
      navigate('/login');
    }
  }, [user, navigate]);
  const handleSendMessage = useCallback(async () => {
    if (!input.trim() || isLoading || usageLoading) return;

    // Check if user can send analysis for free users
    if (!isPro && !canUseAnalysis) {
      setShowUpgradeModal(true);
      return;
    }
    const userMessage: Message = {
      id: Date.now().toString(),
      content: input.trim(),
      type: 'user',
      timestamp: new Date()
    };
    
    // Add user message using the hook
    addMessage(userMessage);
    setInput('');
    setIsLoading(true);

    // Record usage for free users
    if (!isPro) {
      const recorded = await recordAnalysisUsage();
      if (!recorded) {
        logger.error('[TRADING_CHAT] Failed to record analysis usage');
      }
    }
    try {
      const aiMessage: Message = {
        id: (Date.now() + 1).toString(),
        content: '',
        type: 'assistant',
        timestamp: new Date(),
        isStreaming: true
      };
      
      // Add AI message placeholder
      addMessage(aiMessage);
      
      const response = await analyzeMarketQuery(userMessage.content);

      // Simulate streaming effect
      const words = response.split(' ');
      let currentContent = '';
      for (let i = 0; i < words.length; i++) {
        currentContent += (i > 0 ? ' ' : '') + words[i];
        setMessages(prev => prev.map(msg => msg.id === aiMessage.id ? {
          ...msg,
          content: currentContent
        } : msg));

        // Small delay for streaming effect
        await new Promise(resolve => setTimeout(resolve, 50));
      }

      // Mark streaming as complete
      setMessages(prev => prev.map(msg => msg.id === aiMessage.id ? {
        ...msg,
        isStreaming: false
      } : msg));
    } catch (error) {
      logger.error('[TRADING_CHAT] Error getting AI response:', error);
      const errorMessage: Message = {
        id: (Date.now() + 1).toString(),
        content: 'Sorry, I encountered an error processing your request. Please try again.',
        type: 'assistant',
        timestamp: new Date()
      };
      addMessage(errorMessage);
    } finally {
      setIsLoading(false);
    }
  }, [input, isLoading, usageLoading, isPro, canUseAnalysis, recordAnalysisUsage, addMessage, setMessages]);
  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };
  if (!user) {
    return <div className="min-h-screen bg-gray-900 flex items-center justify-center">
        <div className="text-white">Please log in to access StrategyAI</div>
      </div>;
  }
  return <div className="min-h-screen bg-tradeiq-navy flex flex-col">
      {/* Header */}
      <header className="bg-black/90 backdrop-blur-xl border-b border-gray-800/50 sticky top-0 z-50 shadow-lg">
        <MotionWrapper animation="slide" className="container mx-auto px-6 py-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <Brain className="h-10 w-10 text-tradeiq-blue" />
              <div>
                <h1 className="text-2xl font-bold text-white">Chat</h1>
                <p className="text-sm text-gray-400">Your AI Trading Assistant</p>
              </div>
            </div>
            <div className="flex items-center space-x-4">
              <div className="text-white font-medium">
                {isPro ? 'Pro Plan' : 'Free Plan'}
              </div>
            </div>
          </div>
        </MotionWrapper>
      </header>

      {/* Usage Info for Free Users */}
      {!isPro && <MotionWrapper animation="fade" delay={0.1} className="container mx-auto px-6 pt-4">
          {remainingAnalysis <= 1 && remainingAnalysis > 0 ? <Alert className="border-yellow-500/30 bg-yellow-900/10">
              <AlertTriangle className="h-4 w-4 text-yellow-400" />
              <AlertDescription className="text-yellow-300">
                You have {remainingAnalysis} analysis remaining today. Upgrade to Pro for unlimited access.
              </AlertDescription>
            </Alert> : <div className="flex items-center justify-center space-x-2 text-gray-400 text-sm">
              <Clock className="h-4 w-4" />
              <span>{remainingAnalysis} of {maxAnalysisPerDay} analyses remaining today</span>
            </div>}
        </MotionWrapper>}

      {/* Messages */}
      <div className="flex-1 overflow-y-auto pb-32 md:pb-24">
        <div className="max-w-4xl mx-auto p-4 space-y-4">
          {messages.length === 0 && <MotionWrapper animation="scale" delay={0.2}>
              <Card className="tradeiq-card">
                <CardContent className="p-6 text-center">
                  <Brain className="h-12 w-12 text-tradeiq-blue mx-auto mb-4" />
                  <h3 className="text-white text-lg font-semibold mb-2">
                    Welcome to StrategyAI!
                  </h3>
                  <p className="text-gray-400 mb-4">
                    Ask me anything about trading, market analysis, or specific stocks.
                  </p>
                  {!isPro && <div className="bg-gray-900/50 rounded-lg p-3 border border-gray-800">
                      <p className="text-tradeiq-blue text-sm font-medium">
                        ✨ Free Plan: {maxAnalysisPerDay} analyses per day
                      </p>
                      <p className="text-gray-400 text-xs mt-1">
                        Upgrade to Pro for unlimited analyses and advanced features
                      </p>
                    </div>}
                </CardContent>
              </Card>
            </MotionWrapper>}

          {messages.map(message => <div key={message.id} className={`flex ${message.type === 'user' ? 'justify-end' : 'justify-start'}`}>
              <div className={`max-w-[80%] rounded-lg p-4 ${message.type === 'user' ? 'bg-tradeiq-blue text-white' : 'tradeiq-card'}`}>
                <div className="flex items-start space-x-2">
                  {message.type === 'assistant' && <Bot className="h-5 w-5 text-tradeiq-blue mt-0.5 flex-shrink-0" />}
                  {message.type === 'user' && <User className="h-5 w-5 text-white mt-0.5 flex-shrink-0" />}
                  <div className="flex-1">
                    <p className="whitespace-pre-wrap">{message.content}</p>
                    {message.isStreaming && <Loader2 className="h-4 w-4 animate-spin text-tradeiq-blue mt-2" />}
                  </div>
                </div>
                <div className="text-xs opacity-70 mt-2">
                  {message.timestamp.toLocaleTimeString()}
                </div>
              </div>
            </div>)}
          <div ref={messagesEndRef} />
        </div>
      </div>

      {/* Input Area - Fixed at bottom */}
      <div className="fixed bottom-20 left-0 right-0 p-4 bg-black/90 backdrop-blur-xl border-t border-gray-800/50 z-40 py-[25px]">
        <div className="max-w-4xl mx-auto">
            {!isPro && !canUseAnalysis ? <Card className="bg-orange-900/20 border-orange-500/30">
                <CardContent className="p-4 text-center">
                  <Lock className="h-8 w-8 text-orange-400 mx-auto mb-2" />
                  <h3 className="text-white font-semibold mb-2">Daily Limit Reached</h3>
                  <p className="text-gray-300 text-sm mb-4">
                    You've used all {maxAnalysisPerDay} daily analyses. Upgrade to Pro for unlimited access or wait until tomorrow.
                  </p>
                  <Button onClick={() => setShowUpgradeModal(true)} className="bg-tradeiq-blue hover:bg-tradeiq-blue/90 text-white">
                    <Crown className="h-4 w-4 mr-2" />
                    Upgrade to Pro
                  </Button>
                </CardContent>
              </Card> : <div className="flex space-x-2">
                <Input value={input} onChange={e => setInput(e.target.value)} onKeyPress={handleKeyPress} placeholder={isPro ? "Ask about any stock, crypto, or trading strategy..." : `Ask me anything (${remainingAnalysis} analyses left today)...`} className="flex-1 bg-gray-700 border-gray-600 text-white placeholder-gray-400" disabled={isLoading} />
                <Button onClick={handleSendMessage} disabled={isLoading || !input.trim()} className="bg-tradeiq-blue hover:bg-tradeiq-blue/90 text-white">
                  {isLoading ? <Loader2 className="h-4 w-4 animate-spin" /> : <Send className="h-4 w-4" />}
                </Button>
              </div>}
        </div>
      </div>

      <UpgradeModal open={showUpgradeModal} onClose={() => setShowUpgradeModal(false)} feature="StrategyAI analysis" />
    </div>;
};
export default TradingChat;