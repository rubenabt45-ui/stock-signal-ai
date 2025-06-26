
import { useState, useRef } from "react";
import { Send, MessageSquare, Brain, Upload, Camera, TrendingUp } from "lucide-react";
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
  entry: string;
  stopLoss: string;
  takeProfit: string[];
  timeframe: string;
  explanation: string;
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

    // Simulate AI analysis
    setTimeout(() => {
      const strategy = generateTradingStrategy(userMessage);
      const aiResponse: Message = {
        id: (Date.now() + 1).toString(),
        type: 'assistant',
        content: formatStrategyResponse(strategy),
        timestamp: new Date()
      };
      setMessages(prev => [...prev, aiResponse]);
      setIsLoading(false);
    }, 2000 + Math.random() * 2000);
  };

  const generateTradingStrategy = (context: string): TradingStrategy => {
    const isSwing = context.toLowerCase().includes('swing');
    const isScalping = context.toLowerCase().includes('scalp');
    
    // Generate realistic strategy based on context
    const strategies = [
      {
        entry: '$156.50 - $157.20',
        stopLoss: '$154.80',
        takeProfit: ['$159.40', '$162.10'],
        timeframe: isScalping ? '5m - 15m' : isSwing ? '4H - Daily' : '1H - 4H',
        explanation: 'Bullish breakout above resistance with strong volume. RSI showing bullish divergence around 45 level.'
      },
      {
        entry: '$2,845 - $2,860',
        stopLoss: '$2,810',
        takeProfit: ['$2,920', '$2,980'],
        timeframe: isScalping ? '15m - 1H' : isSwing ? 'Daily - Weekly' : '4H - Daily',
        explanation: 'EMA bounce with confluence at 0.618 Fibonacci level. MACD showing bullish crossover.'
      },
      {
        entry: '$0.6720 - $0.6750',
        stopLoss: '$0.6680',
        takeProfit: ['$0.6820', '$0.6890'],
        timeframe: isScalping ? '5m - 30m' : isSwing ? '4H - Daily' : '1H - 4H',
        explanation: 'Double bottom pattern completion with volume confirmation. Support held at previous low.'
      }
    ];

    return strategies[Math.floor(Math.random() * strategies.length)];
  };

  const formatStrategyResponse = (strategy: TradingStrategy): string => {
    return `📊 **Trading Strategy Analysis**

🎯 **Entry Zone:** ${strategy.entry}
🛡️ **Stop Loss:** ${strategy.stopLoss}
💰 **Take Profit Targets:**
   • TP1: ${strategy.takeProfit[0]}
   • TP2: ${strategy.takeProfit[1]}
⏰ **Suggested Timeframe:** ${strategy.timeframe}

💡 **Analysis:** ${strategy.explanation}

⚠️ **Risk Management:** Always use proper position sizing and never risk more than 2% of your account per trade.`;
  };

  const handleSendMessage = async () => {
    if (!inputMessage.trim() || isLoading) return;

    if (uploadedImage) {
      analyzeChartImage(uploadedImage, inputMessage);
      return;
    }

    // Fallback to regular chat for non-image queries
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
        content: generateFallbackResponse(inputMessage),
        timestamp: new Date()
      };
      setMessages(prev => [...prev, aiResponse]);
      setIsLoading(false);
    }, 1000 + Math.random() * 1500);
  };

  const generateFallbackResponse = (question: string): string => {
    const lowerQuestion = question.toLowerCase();
    
    if (lowerQuestion.includes('chart') || lowerQuestion.includes('screenshot')) {
      return "📷 For the best trading strategy analysis, please upload a screenshot of your chart. I can analyze price action, support/resistance levels, and technical patterns to give you specific entry and exit points!";
    }
    
    if (lowerQuestion.includes('strategy') || lowerQuestion.includes('trading')) {
      return "🎯 I specialize in analyzing chart screenshots to provide personalized trading strategies. Upload your chart image and I'll give you:\n\n• Entry zones\n• Stop loss levels\n• Take profit targets\n• Timeframe recommendations\n• Technical analysis explanation\n\nThis gives you much more accurate and actionable trading advice!";
    }
    
    return "I'm designed to analyze chart screenshots and provide trading strategies. While I can answer general questions, my main strength is visual chart analysis. Try uploading a chart screenshot for the best results! 📊";
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
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
              <p className="text-sm text-gray-400 font-medium">Chart Analysis & Strategy Generator</p>
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
                <CardTitle className="text-white">Chart Strategy Analyzer</CardTitle>
              </div>
              <div className="flex items-center space-x-2 text-xs text-gray-400">
                <Camera className="h-4 w-4" />
                <span>Image Analysis Ready</span>
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
                        <img 
                          src={message.image} 
                          alt="Chart screenshot" 
                          className="max-w-full h-auto rounded-lg mb-3"
                        />
                      )}
                      <p className="text-sm leading-relaxed whitespace-pre-line">{message.content}</p>
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
                        <span className="text-sm">Analyzing chart patterns...</span>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </ScrollArea>

            {/* Image Upload Area */}
            {uploadedImage && (
              <div className="relative">
                <img 
                  src={uploadedImage} 
                  alt="Uploaded chart" 
                  className="max-h-32 rounded-lg border border-gray-700"
                />
                <Button
                  onClick={() => setUploadedImage(null)}
                  className="absolute -top-2 -right-2 h-6 w-6 rounded-full bg-red-500 hover:bg-red-600 text-white text-xs p-0"
                >
                  ×
                </Button>
              </div>
            )}

            {/* Upload Suggestions */}
            {messages.length === 1 && (
              <div 
                className="border-2 border-dashed border-gray-600 rounded-xl p-6 text-center hover:border-tradeiq-blue/50 transition-colors cursor-pointer"
                onDragOver={handleDragOver}
                onDrop={handleDrop}
                onClick={() => fileInputRef.current?.click()}
              >
                <TrendingUp className="h-12 w-12 mx-auto mb-3 text-tradeiq-blue opacity-70" />
                <p className="text-gray-300 mb-2">Drop your chart screenshot here</p>
                <p className="text-xs text-gray-500">or click to browse files</p>
                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/*"
                  onChange={handleImageUpload}
                  className="hidden"
                />
              </div>
            )}

            {/* Input */}
            <div className="flex space-x-2">
              <Button
                onClick={() => fileInputRef.current?.click()}
                variant="outline"
                className="border-gray-700 hover:bg-gray-800 text-gray-300"
                disabled={isLoading}
              >
                <Upload className="h-4 w-4" />
              </Button>
              <Input
                value={inputMessage}
                onChange={(e) => setInputMessage(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
                placeholder={uploadedImage ? "Add trading style (Swing, Scalping) or ask questions..." : "Upload chart screenshot for strategy analysis or ask questions..."}
                className="flex-1 bg-black/20 border-gray-700 text-white placeholder:text-gray-500"
                disabled={isLoading}
              />
              <Button
                onClick={handleSendMessage}
                disabled={(!inputMessage.trim() && !uploadedImage) || isLoading}
                className="tradeiq-button-primary"
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
