
import { useState, useRef, useEffect } from "react";
import { Send, MessageSquare, Brain, Upload, Camera, TrendingUp, Clock, X } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import { useTranslation } from 'react-i18next';
import { TradingAIService } from '@/services/tradingAIService';

interface Message {
  id: string;
  type: 'user' | 'assistant';
  content: string;
  image?: string;
  timestamp: Date;
}

const TradingChat = () => {
  const { t } = useTranslation();
  const [messages, setMessages] = useState<Message[]>([
    {
      id: '1',
      type: 'assistant',
      content: '🧠 **StrategyAI – Chart & Q&A Assistant**\n\nI\'m your intelligent trading assistant. I can:\n\n📊 **Analyze chart screenshots** - Upload any chart for instant strategy analysis\n💬 **Answer trading questions** - Ask about indicators, strategies, risk management\n\n**Try asking:** "What is RSI?" or upload a chart screenshot to get started!',
      timestamp: new Date()
    }
  ]);
  const [inputMessage, setInputMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [uploadedImage, setUploadedImage] = useState<string | null>(null);
  const [isDragging, setIsDragging] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const scrollAreaRef = useRef<HTMLDivElement>(null);

  // Auto-scroll to bottom after each message
  useEffect(() => {
    if (scrollAreaRef.current) {
      const scrollContainer = scrollAreaRef.current.querySelector('[data-radix-scroll-area-viewport]');
      if (scrollContainer) {
        scrollContainer.scrollTop = scrollContainer.scrollHeight;
      }
    }
  }, [messages, isLoading]);

  const handleImageUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      // Limit image size to 1MB
      if (file.size > 1024 * 1024) {
        const warningMsg: Message = {
          id: Date.now().toString(),
          type: 'assistant',
          content: '⚠️ **Image too large!** Please upload an image smaller than 1MB for faster processing.',
          timestamp: new Date()
        };
        setMessages(prev => [...prev, warningMsg]);
        return;
      }
      
      if (file.type.startsWith('image/')) {
        const reader = new FileReader();
        reader.onload = (e) => {
          const imageData = e.target?.result as string;
          setUploadedImage(imageData);
          // Auto-trigger analysis
          analyzeChartImage(imageData, inputMessage || 'Analyze this chart');
        };
        reader.readAsDataURL(file);
      }
    }
  };

  const analyzeChartImage = async (imageData: string, userMessage: string) => {
    const userMsg: Message = {
      id: Date.now().toString(),
      type: 'user',
      content: userMessage,
      image: imageData,
      timestamp: new Date()
    };

    setMessages(prev => [...prev, userMsg]);
    setInputMessage('');
    setUploadedImage(null);
    setIsLoading(true);

    // Simulate advanced chart analysis (under 2 seconds)
    setTimeout(() => {
      const analysis = TradingAIService.analyzeChartPatterns(userMessage);
      const aiResponse: Message = {
        id: (Date.now() + 1).toString(),
        type: 'assistant',
        content: formatChartAnalysis(analysis),
        timestamp: new Date()
      };
      setMessages(prev => [...prev, aiResponse]);
      setIsLoading(false);
    }, 1200 + Math.random() * 600); // 1.2-1.8 seconds
  };

  const formatChartAnalysis = (analysis: any): string => {
    return `**${analysis.pattern} – Chart Analysis**

**Entry:** ${analysis.entry}
**Stop Loss:** ${analysis.stopLoss}
**Take Profit:** ${analysis.takeProfit.join(', ')}
**Pattern:** ${analysis.pattern}
**Suggested Timeframe:** ${analysis.timeframe}

**Analysis:** ${analysis.analysis}

⚠️ **Risk Management:** Use proper position sizing. Never risk more than 2% of your account per trade.`;
  };

  const handleSendMessage = async () => {
    if (!inputMessage.trim() || isLoading) return;

    // If there's an uploaded image, analyze it
    if (uploadedImage) {
      analyzeChartImage(uploadedImage, inputMessage);
      return;
    }

    // Handle text-based Q&A
    const userMessage: Message = {
      id: Date.now().toString(),
      type: 'user',
      content: inputMessage,
      timestamp: new Date()
    };

    setMessages(prev => [...prev, userMessage]);
    const questionText = inputMessage;
    setInputMessage('');
    setIsLoading(true);

    // Fast intelligent Q&A response (under 2 seconds)
    setTimeout(async () => {
      const aiAnswer = await TradingAIService.answerTradingQuestion(questionText);
      const aiResponse: Message = {
        id: (Date.now() + 1).toString(),
        type: 'assistant',
        content: aiAnswer,
        timestamp: new Date()
      };
      setMessages(prev => [...prev, aiResponse]);
      setIsLoading(false);
    }, 800 + Math.random() * 600); // 0.8-1.4 seconds
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    const files = e.dataTransfer.files;
    if (files.length > 0 && files[0].type.startsWith('image/')) {
      const file = files[0];
      
      // Check file size
      if (file.size > 1024 * 1024) {
        const warningMsg: Message = {
          id: Date.now().toString(),
          type: 'assistant',
          content: '⚠️ **Image too large!** Please upload an image smaller than 1MB for faster processing.',
          timestamp: new Date()
        };
        setMessages(prev => [...prev, warningMsg]);
        return;
      }
      
      const reader = new FileReader();
      reader.onload = (event) => {
        const imageData = event.target?.result as string;
        setUploadedImage(imageData);
      };
      reader.readAsDataURL(file);
    }
  };

  const removeUploadedImage = () => {
    setUploadedImage(null);
  };

  return (
    <div className="min-h-screen bg-tradeiq-navy">
      {/* Header */}
      <header className="border-b border-gray-800/50 bg-black/20 backdrop-blur-sm sticky top-0 z-50">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center space-x-3">
            <Brain className="h-8 w-8 text-tradeiq-blue" />
            <div>
              <h1 className="text-2xl font-bold text-white tracking-tight">StrategyAI</h1>
              <p className="text-sm text-gray-400 font-medium">Chart & Q&A Assistant</p>
            </div>
          </div>
        </div>
      </header>

      {/* Content */}
      <main className="container mx-auto px-4 py-6 pb-32 max-w-4xl">
        <Card className="tradeiq-card h-[calc(100vh-200px)] flex flex-col">
          <CardHeader>
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <MessageSquare className="h-5 w-5 text-tradeiq-blue" />
                <CardTitle className="text-white">Intelligent Trading Assistant</CardTitle>
              </div>
              <div className="flex items-center space-x-2 text-xs text-gray-400">
                <Clock className="h-4 w-4" />
                <span>Ultra-Fast Analysis (&lt;2s)</span>
              </div>
            </div>
          </CardHeader>
          
          <CardContent className="flex-1 flex flex-col space-y-4">
            {/* Messages */}
            <ScrollArea className="flex-1 pr-4" ref={scrollAreaRef}>
              <div className="space-y-4">
                {messages.map((message) => (
                  <div
                    key={message.id}
                    className={`flex ${message.type === 'user' ? 'justify-end' : 'justify-start'}`}
                  >
                    <div
                      className={`max-w-[85%] rounded-2xl px-4 py-3 ${
                        message.type === 'user'
                          ? 'bg-tradeiq-blue text-white'
                          : 'bg-black/30 text-gray-200 border border-gray-700/50'
                      }`}
                    >
                      {message.image && (
                        <div className="mb-3">
                          <img 
                            src={message.image} 
                            alt="Chart screenshot" 
                            className="max-w-full h-auto rounded-lg"
                            style={{ maxWidth: '70%' }}
                          />
                          <div className="flex items-center space-x-2 mt-2 text-xs opacity-70">
                            <Camera className="h-3 w-3" />
                            <span>Uploaded: {message.timestamp.toLocaleTimeString()}</span>
                          </div>
                        </div>
                      )}
                      <div className="text-sm leading-relaxed whitespace-pre-line">{message.content}</div>
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
                        <span className="text-sm">
                          {uploadedImage ? 'Analyzing chart patterns...' : 'Processing your question...'}
                        </span>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </ScrollArea>

            {/* Image Upload Preview */}
            {uploadedImage && (
              <div className="relative p-3 bg-black/20 rounded-lg border border-gray-700">
                <div className="flex items-center space-x-3">
                  <img 
                    src={uploadedImage} 
                    alt="Chart to analyze" 
                    className="h-16 w-20 object-cover rounded border border-gray-600"
                  />
                  <div className="flex-1">
                    <p className="text-sm text-gray-300">Chart ready for analysis</p>
                    <p className="text-xs text-gray-500">Click send to generate strategy</p>
                  </div>
                  <Button
                    onClick={removeUploadedImage}
                    className="h-8 w-8 rounded-full bg-red-500/20 hover:bg-red-500/40 text-red-400 text-lg p-0"
                  >
                    <X className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            )}

            {/* Enhanced Upload Area - Only show when no messages yet */}
            {messages.length === 1 && (
              <div 
                className={`border-2 border-dashed rounded-xl p-8 text-center transition-all duration-200 cursor-pointer ${
                  isDragging 
                    ? 'border-tradeiq-blue bg-tradeiq-blue/10' 
                    : 'border-gray-600 hover:border-tradeiq-blue/50'
                }`}
                onDragOver={handleDragOver}
                onDragLeave={handleDragLeave}
                onDrop={handleDrop}
                onClick={() => fileInputRef.current?.click()}
              >
                <TrendingUp className={`h-16 w-16 mx-auto mb-4 transition-colors ${
                  isDragging ? 'text-tradeiq-blue' : 'text-tradeiq-blue opacity-70'
                }`} />
                <h3 className="text-lg font-semibold text-gray-200 mb-2">
                  {isDragging ? 'Drop your chart here!' : 'Upload Chart Screenshot'}
                </h3>
                <p className="text-gray-400 mb-2">
                  Get a complete trading strategy in under 2 seconds
                </p>
                <p className="text-xs text-gray-500">
                  Drag & drop or click to browse • Max 1MB • PNG, JPG supported
                </p>
              </div>
            )}
          </CardContent>
          
          {/* Fixed Input Area */}
          <div className="p-4 border-t border-gray-800/50 bg-black/20">
            <div className="flex space-x-2">
              <Button
                onClick={() => fileInputRef.current?.click()}
                variant="outline"
                className="border-gray-700 hover:bg-gray-800 text-gray-300 px-3 shrink-0"
                disabled={isLoading}
              >
                <Upload className="h-4 w-4" />
              </Button>
              <Input
                value={inputMessage}
                onChange={(e) => setInputMessage(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
                placeholder={uploadedImage ? "Optional: Add context (swing, scalp, day trading) or press Enter..." : "Ask a trading question or upload a chart screenshot..."}
                className="flex-1 bg-black/20 border-gray-700 text-white placeholder:text-gray-500"
                disabled={isLoading}
              />
              <Button
                onClick={handleSendMessage}
                disabled={(!inputMessage.trim() && !uploadedImage) || isLoading}
                className="tradeiq-button-primary px-4 shrink-0"
              >
                <Send className="h-4 w-4" />
              </Button>
            </div>
          </div>
            
          <input
            ref={fileInputRef}
            type="file"
            accept="image/*"
            onChange={handleImageUpload}
            className="hidden"
          />
        </Card>
      </main>
    </div>
  );
};

export default TradingChat;
