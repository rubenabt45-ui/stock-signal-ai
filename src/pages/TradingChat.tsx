
import { useState } from "react";
import { Send, MessageSquare, Brain, Lightbulb } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import { useTranslation } from 'react-i18next';

interface Message {
  id: string;
  type: 'user' | 'assistant';
  content: string;
  timestamp: Date;
}

const TradingChat = () => {
  const { t } = useTranslation();
  const [messages, setMessages] = useState<Message[]>([
    {
      id: '1',
      type: 'assistant',
      content: 'Hello! I\'m your AI trading assistant. I can help you with market analysis, trading strategies, platform questions, and more. What would you like to know?',
      timestamp: new Date()
    }
  ]);
  const [inputMessage, setInputMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const suggestions = [
    "What's the best strategy for day trading?",
    "How do I analyze market trends?",
    "Explain support and resistance levels",
    "What are the key indicators to watch?",
    "How does the platform work?",
    "Can you help me with risk management?"
  ];

  const handleSendMessage = async () => {
    if (!inputMessage.trim() || isLoading) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      type: 'user',
      content: inputMessage,
      timestamp: new Date()
    };

    setMessages(prev => [...prev, userMessage]);
    setInputMessage('');
    setIsLoading(true);

    // Simulate AI response
    setTimeout(() => {
      const aiResponse: Message = {
        id: (Date.now() + 1).toString(),
        type: 'assistant',
        content: generateAIResponse(inputMessage),
        timestamp: new Date()
      };
      setMessages(prev => [...prev, aiResponse]);
      setIsLoading(false);
    }, 1000 + Math.random() * 2000);
  };

  const generateAIResponse = (question: string): string => {
    const lowerQuestion = question.toLowerCase();
    
    if (lowerQuestion.includes('strategy') || lowerQuestion.includes('trading')) {
      return "For successful trading, focus on these key principles: 1) Always have a clear plan with entry and exit points, 2) Use proper risk management - never risk more than 2% of your capital per trade, 3) Study technical analysis patterns like support/resistance levels, 4) Keep emotions in check and stick to your strategy, 5) Start with paper trading to practice. Remember, consistency beats trying to hit home runs every time.";
    }
    
    if (lowerQuestion.includes('analysis') || lowerQuestion.includes('trend')) {
      return "Market analysis involves both technical and fundamental approaches. For technical analysis, focus on chart patterns, moving averages, RSI, MACD, and volume indicators. Look for trends by identifying higher highs and higher lows (uptrend) or lower highs and lower lows (downtrend). Support and resistance levels are crucial - these are price points where the asset has historically bounced. Always use multiple timeframes for confirmation.";
    }
    
    if (lowerQuestion.includes('platform') || lowerQuestion.includes('how') || lowerQuestion.includes('help')) {
      return "TradeIQ offers several powerful features: The ChartIA section provides real-time charts with AI analysis, you can save favorites for quick access to your preferred assets, the NewsAI section keeps you updated with market news, and you can set up alerts in Settings. Navigate using the bottom menu, and don't forget to check out the different timeframes (1D, 1W, 1M, etc.) for comprehensive analysis.";
    }
    
    if (lowerQuestion.includes('risk') || lowerQuestion.includes('management')) {
      return "Risk management is the foundation of successful trading. Key rules: 1) Never risk more than 1-2% of your total capital on a single trade, 2) Set stop-losses before entering any position, 3) Diversify across different assets and sectors, 4) Use position sizing based on the distance to your stop-loss, 5) Keep a trading journal to learn from both wins and losses. Remember: protecting your capital is more important than making profits.";
    }
    
    if (lowerQuestion.includes('indicator') || lowerQuestion.includes('rsi') || lowerQuestion.includes('macd')) {
      return "Popular technical indicators include: RSI (Relative Strength Index) - shows overbought/oversold conditions (above 70 = overbought, below 30 = oversold), MACD - reveals trend changes and momentum, Moving Averages - smooth out price action to show trend direction, Bollinger Bands - show volatility and potential reversal points, Volume - confirms price movements. Use indicators as confirmation tools, not standalone signals.";
    }
    
    return "That's a great question! While I can provide general trading education and platform guidance, remember that all trading involves risk and you should never invest more than you can afford to lose. For specific investment advice, consider consulting with a licensed financial advisor. Is there a particular aspect of trading or our platform you'd like to learn more about?";
  };

  const handleSuggestionClick = (suggestion: string) => {
    setInputMessage(suggestion);
  };

  return (
    <div className="min-h-screen bg-tradeiq-navy">
      {/* Header */}
      <header className="border-b border-gray-800/50 bg-black/20 backdrop-blur-sm sticky top-0 z-50">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center space-x-3">
            <MessageSquare className="h-8 w-8 text-tradeiq-blue" />
            <div>
              <h1 className="text-2xl font-bold text-white tracking-tight">{t('navigation.tradingChat')}</h1>
              <p className="text-sm text-gray-400 font-medium">AI-Powered Trading Assistant</p>
            </div>
          </div>
        </div>
      </header>

      {/* Content */}
      <main className="container mx-auto px-4 py-6 pb-24 max-w-4xl">
        <Card className="tradeiq-card h-[calc(100vh-200px)] flex flex-col">
          <CardHeader>
            <div className="flex items-center space-x-3">
              <Brain className="h-5 w-5 text-tradeiq-blue" />
              <CardTitle className="text-white">Trading Assistant</CardTitle>
            </div>
          </CardHeader>
          
          <CardContent className="flex-1 flex flex-col space-y-4">
            {/* Messages */}
            <ScrollArea className="flex-1 pr-4">
              <div className="space-y-4">
                {messages.map((message) => (
                  <div
                    key={message.id}
                    className={`flex ${message.type === 'user' ? 'justify-end' : 'justify-start'}`}
                  >
                    <div
                      className={`max-w-[80%] rounded-2xl px-4 py-3 ${
                        message.type === 'user'
                          ? 'bg-tradeiq-blue text-white'
                          : 'bg-black/30 text-gray-200 border border-gray-700/50'
                      }`}
                    >
                      <p className="text-sm leading-relaxed">{message.content}</p>
                      <p className="text-xs opacity-70 mt-2">
                        {message.timestamp.toLocaleTimeString()}
                      </p>
                    </div>
                  </div>
                ))}
                
                {isLoading && (
                  <div className="flex justify-start">
                    <div className="bg-black/30 text-gray-200 border border-gray-700/50 rounded-2xl px-4 py-3">
                      <div className="flex items-center space-x-2">
                        <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-tradeiq-blue"></div>
                        <span className="text-sm">AI is thinking...</span>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </ScrollArea>

            {/* Suggestions */}
            {messages.length === 1 && (
              <div className="space-y-3">
                <div className="flex items-center space-x-2">
                  <Lightbulb className="h-4 w-4 text-yellow-500" />
                  <span className="text-sm text-gray-400">Try asking:</span>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                  {suggestions.map((suggestion, index) => (
                    <button
                      key={index}
                      onClick={() => handleSuggestionClick(suggestion)}
                      className="text-left text-sm p-3 rounded-lg bg-black/20 border border-gray-700/50 hover:bg-black/40 hover:border-tradeiq-blue/50 transition-colors text-gray-300"
                    >
                      {suggestion}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Input */}
            <div className="flex space-x-2">
              <Input
                value={inputMessage}
                onChange={(e) => setInputMessage(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
                placeholder="Ask about trading strategies, market analysis, or platform features..."
                className="flex-1 bg-black/20 border-gray-700 text-white placeholder:text-gray-500"
                disabled={isLoading}
              />
              <Button
                onClick={handleSendMessage}
                disabled={!inputMessage.trim() || isLoading}
                className="tradeiq-button-primary"
              >
                <Send className="h-4 w-4" />
              </Button>
            </div>
          </CardContent>
        </Card>
      </main>
    </div>
  );
};

export default TradingChat;
