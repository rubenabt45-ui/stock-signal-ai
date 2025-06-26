
import { useState, useRef } from "react";
import { Send, MessageSquare, Brain, Upload, Camera, TrendingUp, Clock } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import { useTranslation } from 'react-i18next';

interface Message {
  id: string;
  type: 'user' | 'assistant';
  content: string;
  image?: string;
  timestamp: Date;
}

interface TradingStrategy {
  entryLow: string;
  entryHigh: string;
  stopLoss: string;
  takeProfit: string[];
  timeframe: string;
  analysis: string;
}

const TradingChat = () => {
  const { t } = useTranslation();
  const [messages, setMessages] = useState<Message[]>([
    {
      id: '1',
      type: 'assistant',
      content: '👋 Welcome to TradingChat. Upload a screenshot of your chart and I\'ll give you a personalized trading strategy in seconds.\n\nSimply drag & drop your chart image or click the upload button to get started!',
      timestamp: new Date()
    }
  ]);
  const [inputMessage, setInputMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [uploadedImage, setUploadedImage] = useState<string | null>(null);
  const [isDragging, setIsDragging] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleImageUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file && file.type.startsWith('image/')) {
      const reader = new FileReader();
      reader.onload = (e) => {
        const imageData = e.target?.result as string;
        setUploadedImage(imageData);
        analyzeChartImage(imageData, inputMessage || 'Analyze this chart');
      };
      reader.readAsDataURL(file);
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

    // Simulate AI analysis with realistic timing (under 2 seconds)
    setTimeout(() => {
      const strategy = generateAdvancedTradingStrategy(userMessage);
      const aiResponse: Message = {
        id: (Date.now() + 1).toString(),
        type: 'assistant',
        content: formatStrategyResponse(strategy),
        timestamp: new Date()
      };
      setMessages(prev => [...prev, aiResponse]);
      setIsLoading(false);
    }, 1500 + Math.random() * 500); // 1.5-2 seconds for ultra-fast response
  };

  const generateAdvancedTradingStrategy = (context: string): TradingStrategy => {
    const isSwing = context.toLowerCase().includes('swing');
    const isScalping = context.toLowerCase().includes('scalp');
    const isDay = context.toLowerCase().includes('day');
    
    // Generate realistic strategies based on different market scenarios
    const strategies = [
      {
        entryLow: '$2,845.20',
        entryHigh: '$2,860.50',
        stopLoss: '$2,810.00',
        takeProfit: ['$2,920.00', '$2,985.00'],
        timeframe: isScalping ? '5M - 15M' : isSwing ? '4H - 1D' : '1H - 4H',
        analysis: 'Bullish breakout above key resistance with strong volume confirmation. RSI showing bullish divergence and MACD crossover signal.'
      },
      {
        entryLow: '$156.80',
        entryHigh: '$158.20',
        stopLoss: '$154.50',
        takeProfit: ['$162.40', '$166.80'],
        timeframe: isScalping ? '15M - 30M' : isSwing ? 'Daily - Weekly' : '4H - Daily',
        analysis: 'Double bottom pattern completion with bounce off 200 EMA. Strong support holding at previous structural low.'
      },
      {
        entryLow: '$0.6720',
        entryHigh: '$0.6750',
        stopLoss: '$0.6680',
        takeProfit: ['$0.6820', '$0.6890'],
        timeframe: isScalping ? '5M - 15M' : isSwing ? '4H - 1D' : '1H - 4H',
        analysis: 'Ascending triangle breakout with volume spike. 0.618 Fibonacci retracement level acting as support.'
      },
      {
        entryLow: '$42,850',
        entryHigh: '$43,200',
        stopLoss: '$42,100',
        takeProfit: ['$44,500', '$45,800'],
        timeframe: isScalping ? '15M - 1H' : isSwing ? 'Daily - Weekly' : '4H - Daily',
        analysis: 'Falling wedge pattern breakout with bullish divergence on RSI. Strong momentum building above key support zone.'
      }
    ];

    return strategies[Math.floor(Math.random() * strategies.length)];
  };

  const formatStrategyResponse = (strategy: TradingStrategy): string => {
    return `📊 **Trading Strategy Analysis**

💘 **Entry Zone:** ${strategy.entryLow} - ${strategy.entryHigh}
🛡️ **Stop Loss:** ${strategy.stopLoss}
💰 **Take Profit Targets:**
• TP1: ${strategy.takeProfit[0]}
• TP2: ${strategy.takeProfit[1]}
⏱ **Suggested Timeframe:** ${strategy.timeframe}

💡 **Analysis:** ${strategy.analysis}

⚠️ **Risk Management:** Use proper position sizing. Never risk more than 2% of your account per trade.`;
  };

  const handleSendMessage = async () => {
    if (!inputMessage.trim() || isLoading) return;

    if (uploadedImage) {
      analyzeChartImage(uploadedImage, inputMessage);
      return;
    }

    // Enhanced fallback responses
    const userMessage: Message = {
      id: Date.now().toString(),
      type: 'user',
      content: inputMessage,
      timestamp: new Date()
    };

    setMessages(prev => [...prev, userMessage]);
    setInputMessage('');
    setIsLoading(true);

    setTimeout(() => {
      const aiResponse: Message = {
        id: (Date.now() + 1).toString(),
        type: 'assistant',
        content: generateEnhancedFallbackResponse(inputMessage),
        timestamp: new Date()
      };
      setMessages(prev => [...prev, aiResponse]);
      setIsLoading(false);
    }, 800 + Math.random() * 400);
  };

  const generateEnhancedFallbackResponse = (question: string): string => {
    const lowerQuestion = question.toLowerCase();
    
    if (lowerQuestion.includes('chart') || lowerQuestion.includes('screenshot') || lowerQuestion.includes('image')) {
      return "📷 Please upload a screenshot of your chart for detailed analysis. I'll generate a full trading plan with entry zones, stop losses, and take profit targets in seconds!";
    }
    
    if (lowerQuestion.includes('strategy') || lowerQuestion.includes('trading') || lowerQuestion.includes('buy') || lowerQuestion.includes('sell')) {
      return "🎯 For best results, upload a screenshot of your chart. I'll generate a complete trading strategy with:\n\n• Precise entry zones\n• Stop loss levels\n• Multiple take profit targets\n• Timeframe recommendations\n• Technical analysis explanation\n\nThis gives you actionable trading insights based on your specific chart!";
    }
    
    if (lowerQuestion.includes('help') || lowerQuestion.includes('how')) {
      return "🚀 I'm TradeIQ's flagship image-based trading assistant! Here's how to get the best results:\n\n1. Upload a clear screenshot of your trading chart\n2. Optionally mention your trading style (Swing, Scalping, Day Trading)\n3. Get a complete trading strategy in under 2 seconds\n\nTry it now - drag & drop your chart image or click the upload button!";
    }
    
    return "💡 I specialize in analyzing chart screenshots to provide instant trading strategies. Upload a chart image and I'll give you a complete trading plan with entry zones, stop losses, and take profit targets!";
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
      const reader = new FileReader();
      reader.onload = (event) => {
        const imageData = event.target?.result as string;
        setUploadedImage(imageData);
      };
      reader.readAsDataURL(files[0]);
    }
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
              <p className="text-sm text-gray-400 font-medium">Flagship Image-Based Strategy Generator</p>
            </div>
          </div>
        </div>
      </header>

      {/* Content */}
      <main className="container mx-auto px-4 py-6 pb-24 max-w-4xl">
        <Card className="tradeiq-card h-[calc(100vh-200px)] flex flex-col">
          <CardHeader>
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <Brain className="h-5 w-5 text-tradeiq-blue" />
                <CardTitle className="text-white">AI Chart Strategy Analyzer</CardTitle>
              </div>
              <div className="flex items-center space-x-2 text-xs text-gray-400">
                <Clock className="h-4 w-4" />
                <span>Ultra-Fast Analysis (&lt;2s)</span>
              </div>
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
                      {message.image && (
                        <div className="mb-3">
                          <img 
                            src={message.image} 
                            alt="Chart screenshot" 
                            className="max-w-full h-auto rounded-lg"
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
                        <span className="text-sm">Analyzing chart patterns and generating strategy...</span>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </ScrollArea>

            {/* Image Upload Preview */}
            {uploadedImage && (
              <div className="relative p-2 bg-black/20 rounded-lg border border-gray-700">
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
                    onClick={() => setUploadedImage(null)}
                    className="h-8 w-8 rounded-full bg-red-500/20 hover:bg-red-500/40 text-red-400 text-xs p-0"
                  >
                    ×
                  </Button>
                </div>
              </div>
            )}

            {/* Enhanced Upload Area */}
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
                  Drag & drop or click to browse • PNG, JPG supported
                </p>
              </div>
            )}

            {/* Input Area */}
            <div className="flex space-x-2">
              <Button
                onClick={() => fileInputRef.current?.click()}
                variant="outline"
                className="border-gray-700 hover:bg-gray-800 text-gray-300 px-3"
                disabled={isLoading}
              >
                <Upload className="h-4 w-4" />
              </Button>
              <Input
                value={inputMessage}
                onChange={(e) => setInputMessage(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
                placeholder={uploadedImage ? "Add trading style (Swing, Scalping, Day) or press Enter to analyze..." : "Upload chart screenshot for instant strategy analysis..."}
                className="flex-1 bg-black/20 border-gray-700 text-white placeholder:text-gray-500"
                disabled={isLoading}
              />
              <Button
                onClick={handleSendMessage}
                disabled={(!inputMessage.trim() && !uploadedImage) || isLoading}
                className="tradeiq-button-primary px-4"
              >
                <Send className="h-4 w-4" />
              </Button>
            </div>
            
            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              onChange={handleImageUpload}
              className="hidden"
            />
          </CardContent>
        </Card>
      </main>
    </div>
  );
};

export default TradingChat;
