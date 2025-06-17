
import { useState, useRef, useEffect } from "react";
import { Send, Bot, User, TrendingUp, AlertCircle, Clock, BookOpen, HelpCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { useMultipleMarketData } from "@/hooks/useMarketData";
import { analyzeMessageContext, MessageContext } from "@/services/symbolDetectionService";
import { generateDualModeResponse, DualModeAIResponse } from "@/services/dualModeAIService";

interface Message {
  id: string;
  content: string;
  isUser: boolean;
  timestamp: Date;
  context?: MessageContext;
  aiResponse?: DualModeAIResponse;
  marketData?: Record<string, any>;
}

const TradingChat = () => {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: "1",
      content: "Hello! I'm your **TradeIQ Assistant** 🤖\n\nI can help you with:\n📊 **Trading & Investing**: Strategies, technical analysis, market insights\n📱 **TradeIQ Features**: Chart AI, alerts, favorites, and app navigation\n\nWhat would you like to explore today?",
      isUser: false,
      timestamp: new Date(),
    }
  ]);
  const [inputValue, setInputValue] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [detectedSymbols, setDetectedSymbols] = useState<string[]>([]);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Get market data for detected symbols
  const marketData = useMultipleMarketData(detectedSymbols);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  // Analyze input for symbols as user types
  useEffect(() => {
    if (inputValue.trim()) {
      const context = analyzeMessageContext(inputValue);
      const symbols = context.symbols.map(s => s.symbol);
      setDetectedSymbols(symbols);
    } else {
      setDetectedSymbols([]);
    }
  }, [inputValue]);

  const handleSendMessage = async () => {
    if (!inputValue.trim() || isLoading) return;

    // Analyze message context
    const context = analyzeMessageContext(inputValue);
    const relevantMarketData = context.symbols.reduce((acc, symbol) => {
      if (marketData[symbol.symbol]) {
        acc[symbol.symbol] = marketData[symbol.symbol];
      }
      return acc;
    }, {} as Record<string, any>);

    const userMessage: Message = {
      id: Date.now().toString(),
      content: inputValue,
      isUser: true,
      timestamp: new Date(),
      context,
      marketData: relevantMarketData
    };

    setMessages(prev => [...prev, userMessage]);
    setInputValue("");
    setIsLoading(true);

    try {
      // Generate dual-mode AI response
      const aiResponse = await generateDualModeResponse({
        userMessage: inputValue,
        context,
        marketData: relevantMarketData,
        conversationHistory: messages.slice(-5).map(m => ({
          role: m.isUser ? 'user' : 'assistant',
          content: m.content
        }))
      });

      const aiMessage: Message = {
        id: (Date.now() + 1).toString(),
        content: aiResponse.content,
        isUser: false,
        timestamp: new Date(),
        aiResponse,
        context,
        marketData: relevantMarketData
      };

      setMessages(prev => [...prev, aiMessage]);
    } catch (error) {
      console.error('Error generating AI response:', error);
      
      const errorMessage: Message = {
        id: (Date.now() + 1).toString(),
        content: "I apologize, but I encountered an error processing your request. Please try again or ask about a different topic.",
        isUser: false,
        timestamp: new Date(),
      };
      
      setMessages(prev => [...prev, errorMessage]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleQuickSuggestion = (suggestion: string) => {
    setInputValue(suggestion);
  };

  const handleFollowUp = (suggestion: string) => {
    setInputValue(suggestion);
  };

  const quickSuggestions = [
    "What is Chart AI?",
    "Best crypto strategies",
    "How do I set alerts?",
    "TSLA technical analysis"
  ];

  return (
    <div className="min-h-screen bg-tradeiq-navy flex flex-col">
      {/* Header */}
      <header className="border-b border-gray-800/50 bg-black/20 backdrop-blur-sm sticky top-0 z-50">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <Bot className="h-8 w-8 text-tradeiq-blue" />
              <div>
                <h1 className="text-2xl font-bold text-white tracking-tight">TradeIQ Assistant</h1>
                <p className="text-sm text-gray-400 font-medium">Trading Knowledge + App Guidance</p>
              </div>
            </div>
            
            {/* Mode indicator and market data */}
            <div className="flex items-center space-x-4">
              {detectedSymbols.length > 0 && (
                <div className="flex items-center space-x-2">
                  <TrendingUp className="h-4 w-4 text-green-500" />
                  <span className="text-sm text-gray-300">
                    Tracking: {detectedSymbols.slice(0, 3).join(", ")}
                    {detectedSymbols.length > 3 && ` +${detectedSymbols.length - 3} more`}
                  </span>
                </div>
              )}
              
              <div className="flex items-center space-x-2 text-xs text-gray-400">
                <BookOpen className="h-3 w-3" />
                <span>Trading</span>
                <span>•</span>
                <HelpCircle className="h-3 w-3" />
                <span>Product Help</span>
              </div>
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
              <div className={`flex max-w-[85%] ${message.isUser ? 'flex-row-reverse' : 'flex-row'} items-start space-x-3`}>
                <div className={`flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center ${
                  message.isUser ? 'bg-tradeiq-blue ml-3' : 'bg-gray-700 mr-3'
                }`}>
                  {message.isUser ? (
                    <User className="h-4 w-4 text-white" />
                  ) : (
                    <Bot className="h-4 w-4 text-tradeiq-blue" />
                  )}
                </div>
                
                <div className="space-y-2">
                  <Card className={`p-4 ${
                    message.isUser 
                      ? 'bg-tradeiq-blue text-white' 
                      : 'tradeiq-card text-gray-100'
                  }`}>
                    <p className="text-sm leading-relaxed whitespace-pre-wrap">
                      {message.content}
                    </p>
                    
                    {/* Mode indicator for AI responses */}
                    {!message.isUser && message.aiResponse && (
                      <div className="mt-3 flex flex-wrap gap-2">
                        <Badge 
                          variant={message.aiResponse.mode === 'trading' ? 'default' : 'secondary'} 
                          className="text-xs"
                        >
                          {message.aiResponse.mode === 'trading' ? '📊 Trading' : 
                           message.aiResponse.mode === 'product' ? '📱 Product' : '🔄 Mixed'}
                        </Badge>
                        {message.aiResponse.riskDisclaimer && (
                          <Badge variant="outline" className="text-xs text-yellow-400 border-yellow-400">
                            ⚠️ Investment Risk
                          </Badge>
                        )}
                      </div>
                    )}
                    
                    {/* Context indicators for user messages */}
                    {message.isUser && message.context && (
                      <div className="mt-3 flex flex-wrap gap-2">
                        {message.context.symbols.map((symbol, idx) => (
                          <Badge key={idx} variant="secondary" className="text-xs">
                            {symbol.symbol} ({symbol.type})
                          </Badge>
                        ))}
                        {message.context.technicalRequests.map((req, idx) => (
                          <Badge key={idx} variant="outline" className="text-xs">
                            {req.type.replace('_', ' ')}
                          </Badge>
                        ))}
                        {message.context.timeframes.map((tf, idx) => (
                          <Badge key={idx} variant="outline" className="text-xs flex items-center gap-1">
                            <Clock className="h-3 w-3" />
                            {tf.timeframe}
                          </Badge>
                        ))}
                      </div>
                    )}
                    
                    {/* Market data display */}
                    {message.marketData && Object.keys(message.marketData).length > 0 && (
                      <div className="mt-3 p-3 bg-black/20 rounded-lg">
                        <p className="text-xs text-gray-300 mb-2">Market Data Used:</p>
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                          {Object.entries(message.marketData).map(([symbol, data]: [string, any]) => (
                            <div key={symbol} className="flex justify-between items-center text-xs">
                              <span className="font-medium">{symbol}:</span>
                              <span className={`${data.change >= 0 ? 'text-green-400' : 'text-red-400'}`}>
                                ${data.price?.toFixed(2)} ({data.change >= 0 ? '+' : ''}{data.change?.toFixed(2)})
                              </span>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}
                    
                    {/* Risk disclaimer */}
                    {!message.isUser && message.aiResponse?.riskDisclaimer && (
                      <div className="mt-3 p-2 bg-yellow-900/20 border border-yellow-700/30 rounded text-xs text-yellow-300">
                        ⚠️ <strong>Disclaimer:</strong> This is educational content, not financial advice. Always do your own research and consider your risk tolerance.
                      </div>
                    )}
                    
                    <span className="text-xs opacity-70 mt-2 block">
                      {message.timestamp.toLocaleTimeString()}
                    </span>
                  </Card>
                  
                  {/* AI response confidence and follow-ups */}
                  {!message.isUser && message.aiResponse && (
                    <div className="space-y-2">
                      {message.aiResponse.confidence && (
                        <div className="flex items-center space-x-2 text-xs text-gray-400">
                          <AlertCircle className="h-3 w-3" />
                          <span>Confidence: {(message.aiResponse.confidence * 100).toFixed(0)}%</span>
                          <span>• Mode: {message.aiResponse.mode}</span>
                          {message.aiResponse.relatedFeatures && message.aiResponse.relatedFeatures.length > 0 && (
                            <span>• Features: {message.aiResponse.relatedFeatures.join(", ")}</span>
                          )}
                        </div>
                      )}
                      
                      {message.aiResponse.suggestedFollowUps && message.aiResponse.suggestedFollowUps.length > 0 && (
                        <div className="flex flex-wrap gap-2">
                          {message.aiResponse.suggestedFollowUps.map((suggestion, idx) => (
                            <Button
                              key={idx}
                              variant="outline"
                              size="sm"
                              onClick={() => handleFollowUp(suggestion)}
                              className="text-xs h-7 border-gray-600 hover:bg-gray-700 text-gray-300 hover:text-white"
                            >
                              {suggestion}
                            </Button>
                          ))}
                        </div>
                      )}
                    </div>
                  )}
                </div>
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
                  <div className="flex items-center space-x-2">
                    <div className="flex space-x-1">
                      <div className="w-2 h-2 bg-tradeiq-blue rounded-full animate-bounce"></div>
                      <div className="w-2 h-2 bg-tradeiq-blue rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
                      <div className="w-2 h-2 bg-tradeiq-blue rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                    </div>
                    <span className="text-sm text-gray-400">Analyzing your request...</span>
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
        {/* Symbol detection preview */}
        {detectedSymbols.length > 0 && (
          <div className="px-4 pt-2">
            <div className="max-w-4xl mx-auto">
              <div className="flex items-center space-x-2 text-xs text-gray-400">
                <TrendingUp className="h-3 w-3" />
                <span>Detected symbols: </span>
                <div className="flex flex-wrap gap-1">
                  {detectedSymbols.map(symbol => (
                    <Badge key={symbol} variant="outline" className="text-xs h-5">
                      {symbol}
                      {marketData[symbol] && !marketData[symbol].isLoading && !marketData[symbol].error && (
                        <span className={`ml-1 ${marketData[symbol].change >= 0 ? 'text-green-400' : 'text-red-400'}`}>
                          ${marketData[symbol].price.toFixed(2)}
                        </span>
                      )}
                    </Badge>
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}
        
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
                  className="border-gray-700 hover:bg-gray-800 hover:border-tradeiq-blue text-gray-300 hover:text-white text-xs px-3 py-2 transition-all duration-200"
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
                placeholder="Ask about trading strategies, technical analysis, or TradeIQ features (Chart AI, alerts, etc.)..."
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
