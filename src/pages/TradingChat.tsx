
import { useState, useRef, useEffect } from "react";
import { Send, Bot, User } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Card } from "@/components/ui/card";

interface Message {
  id: string;
  content: string;
  isUser: boolean;
  timestamp: Date;
}

const TradingChat = () => {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: "1",
      content: "Hello! I'm TradeBot, your AI trading assistant. I can help you analyze markets, understand technical indicators, and provide insights on trading strategies. What would you like to know?",
      isUser: false,
      timestamp: new Date(),
    }
  ]);
  const [inputValue, setInputValue] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSendMessage = async () => {
    if (!inputValue.trim() || isLoading) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      content: inputValue,
      isUser: true,
      timestamp: new Date(),
    };

    setMessages(prev => [...prev, userMessage]);
    setInputValue("");
    setIsLoading(true);

    // Simulate AI response (replace with actual AI API call)
    setTimeout(() => {
      const aiResponse: Message = {
        id: (Date.now() + 1).toString(),
        content: getAIResponse(inputValue),
        isUser: false,
        timestamp: new Date(),
      };
      setMessages(prev => [...prev, aiResponse]);
      setIsLoading(false);
    }, 1500);
  };

  const getAIResponse = (query: string): string => {
    // Simplified AI responses for demo purposes
    const lowerQuery = query.toLowerCase();
    
    if (lowerQuery.includes('tsla') || lowerQuery.includes('tesla')) {
      return "Based on current technical analysis, TSLA is showing consolidation around the $200-220 range. Key support levels are at $195 and $185. The RSI indicates oversold conditions, which could present a buying opportunity for swing traders. However, watch for volume confirmation before entry.";
    }
    
    if (lowerQuery.includes('btc') || lowerQuery.includes('bitcoin')) {
      return "Bitcoin is currently testing the $42,000 resistance level. The 50-day moving average is acting as support around $40,500. Volume has been decreasing, suggesting a potential breakout is imminent. Watch for a break above $43,500 for bullish continuation.";
    }
    
    if (lowerQuery.includes('macd')) {
      return "MACD (Moving Average Convergence Divergence) is a momentum indicator that shows the relationship between two moving averages. When MACD crosses above the signal line, it's often considered bullish. When it crosses below, it's bearish. The histogram shows the distance between MACD and signal lines.";
    }
    
    if (lowerQuery.includes('rsi')) {
      return "RSI (Relative Strength Index) measures momentum on a 0-100 scale. Values above 70 suggest overbought conditions (potential sell signal), while values below 30 suggest oversold conditions (potential buy signal). It's best used in conjunction with other indicators.";
    }
    
    return "I understand you're asking about trading analysis. Could you be more specific about which asset, timeframe, or technical indicator you'd like me to analyze? I can help with stocks, crypto, forex, and technical analysis.";
  };

  const quickSuggestions = [
    "Analyze BTC trend",
    "TSLA support levels",
    "Explain MACD",
    "SPY outlook"
  ];

  const handleQuickSuggestion = (suggestion: string) => {
    setInputValue(suggestion);
  };

  return (
    <div className="min-h-screen bg-tradeiq-navy flex flex-col">
      {/* Header */}
      <header className="border-b border-gray-800/50 bg-black/20 backdrop-blur-sm sticky top-0 z-50">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center space-x-3">
            <Bot className="h-8 w-8 text-tradeiq-blue" />
            <div>
              <h1 className="text-2xl font-bold text-white tracking-tight">TradingChat</h1>
              <p className="text-sm text-gray-400 font-medium">AI Trading Assistant</p>
            </div>
          </div>
        </div>
      </header>

      {/* Messages Container */}
      <div className="flex-1 overflow-y-auto px-4 py-6 pb-48">
        <div className="max-w-4xl mx-auto space-y-4">
          {messages.map((message) => (
            <div
              key={message.id}
              className={`flex ${message.isUser ? 'justify-end' : 'justify-start'}`}
            >
              <div className={`flex max-w-[80%] ${message.isUser ? 'flex-row-reverse' : 'flex-row'} items-start space-x-3`}>
                <div className={`flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center ${
                  message.isUser ? 'bg-tradeiq-blue ml-3' : 'bg-gray-700 mr-3'
                }`}>
                  {message.isUser ? (
                    <User className="h-4 w-4 text-white" />
                  ) : (
                    <Bot className="h-4 w-4 text-tradeiq-blue" />
                  )}
                </div>
                <Card className={`p-4 ${
                  message.isUser 
                    ? 'bg-tradeiq-blue text-white' 
                    : 'tradeiq-card text-gray-100'
                }`}>
                  <p className="text-sm leading-relaxed whitespace-pre-wrap">
                    {message.content}
                  </p>
                  <span className="text-xs opacity-70 mt-2 block">
                    {message.timestamp.toLocaleTimeString()}
                  </span>
                </Card>
              </div>
            </div>
          ))}
          
          {isLoading && (
            <div className="flex justify-start">
              <div className="flex items-start space-x-3">
                <div className="flex-shrink-0 w-8 h-8 rounded-full bg-gray-700 flex items-center justify-center mr-3">
                  <Bot className="h-4 w-4 text-tradeiq-blue" />
                </div>
                <Card className="tradeiq-card text-gray-100 p-4">
                  <div className="flex space-x-2">
                    <div className="w-2 h-2 bg-tradeiq-blue rounded-full animate-bounce"></div>
                    <div className="w-2 h-2 bg-tradeiq-blue rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
                    <div className="w-2 h-2 bg-tradeiq-blue rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                  </div>
                </Card>
              </div>
            </div>
          )}
          
          <div ref={messagesEndRef} />
        </div>
      </div>

      {/* Input Area with Quick Suggestions */}
      <div className="fixed bottom-16 left-0 right-0 bg-tradeiq-navy border-t border-gray-800/50">
        {/* Quick Suggestions */}
        <div className="px-4 pt-3 pb-2">
          <div className="max-w-4xl mx-auto">
            <div className="flex flex-wrap gap-2 justify-center sm:justify-start">
              {quickSuggestions.map((suggestion) => (
                <Button
                  key={suggestion}
                  variant="outline"
                  size="sm"
                  onClick={() => handleQuickSuggestion(suggestion)}
                  className="border-gray-700 hover:bg-gray-800 hover:border-tradeiq-blue text-gray-300 hover:text-white text-xs px-3 py-2 transition-all duration-200 animate-fade-in"
                >
                  {suggestion}
                </Button>
              ))}
            </div>
          </div>
        </div>
        
        {/* Input Field */}
        <div className="px-4 pb-4">
          <div className="max-w-4xl mx-auto">
            <div className="flex space-x-3">
              <Textarea
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
                placeholder="Ask about trading strategies, technical analysis, market insights..."
                className="flex-1 min-h-[44px] max-h-32 resize-none bg-gray-800/50 border-gray-700 text-white placeholder-gray-400 focus:border-tradeiq-blue transition-colors"
                onKeyDown={(e) => {
                  if (e.key === 'Enter' && !e.shiftKey) {
                    e.preventDefault();
                    handleSendMessage();
                  }
                }}
              />
              <Button
                onClick={handleSendMessage}
                disabled={!inputValue.trim() || isLoading}
                className="tradeiq-button-primary px-6"
              >
                <Send className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TradingChat;
