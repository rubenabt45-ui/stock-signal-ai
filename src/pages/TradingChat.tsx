
import { useState, useRef, useEffect } from "react";
import { Send, Camera, X, Settings, AlertCircle } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { ScrollArea } from "@/components/ui/scroll-area";
import { useTranslation } from 'react-i18next';
import { TradingAIService } from '@/services/tradingAIService';
import { useToast } from "@/hooks/use-toast";

interface Message {
  id: string;
  type: 'user' | 'assistant';
  content: string;
  image?: string;
  timestamp: Date;
}

const TradingChat = () => {
  const { t } = useTranslation();
  const { toast } = useToast();
  const [messages, setMessages] = useState<Message[]>([
    {
      id: '1',
      type: 'assistant',
      content: '🧠 **StrategyAI – Powered by GPT-4o**\n\nI\'m your intelligent trading assistant, powered by real AI. I can:\n\n📊 **Analyze chart screenshots** - Upload any chart for detailed strategy analysis\n💬 **Answer trading questions** - Ask about indicators, strategies, risk management\n📈 **Generate trade setups** - Get complete entry/exit strategies\n\n**Try asking:** "What is RSI divergence?" or "How do I manage risk?" or upload a chart screenshot!',
      timestamp: new Date()
    }
  ]);
  const [inputMessage, setInputMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [uploadedImage, setUploadedImage] = useState<string | null>(null);
  const [showApiKeyPrompt, setShowApiKeyPrompt] = useState(false);
  const [tempApiKey, setTempApiKey] = useState('');
  const fileInputRef = useRef<HTMLInputElement>(null);
  const scrollAreaRef = useRef<HTMLDivElement>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  // Auto-scroll to bottom after each message
  useEffect(() => {
    if (scrollAreaRef.current) {
      const scrollContainer = scrollAreaRef.current.querySelector('[data-radix-scroll-area-viewport]');
      if (scrollContainer) {
        scrollContainer.scrollTop = scrollContainer.scrollHeight;
      }
    }
  }, [messages, isLoading]);

  // Auto-resize textarea
  useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto';
      textareaRef.current.style.height = Math.min(textareaRef.current.scrollHeight, 120) + 'px';
    }
  }, [inputMessage]);

  // Check for API key on mount
  useEffect(() => {
    const apiKey = localStorage.getItem('openai_api_key');
    if (!apiKey) {
      setShowApiKeyPrompt(true);
    }
  }, []);

  const handleApiKeySubmit = () => {
    if (tempApiKey.trim()) {
      TradingAIService.setApiKey(tempApiKey.trim());
      setShowApiKeyPrompt(false);
      setTempApiKey('');
      toast({
        title: "API Key Saved",
        description: "Your OpenAI API key has been saved successfully!",
      });
    }
  };

  const handleImageUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      // Limit image size to 5MB for vision API
      if (file.size > 5 * 1024 * 1024) {
        toast({
          title: "Image too large",
          description: "Please upload an image smaller than 5MB.",
          variant: "destructive"
        });
        return;
      }
      
      if (file.type.startsWith('image/')) {
        const reader = new FileReader();
        reader.onload = (e) => {
          const imageData = e.target?.result as string;
          setUploadedImage(imageData);
        };
        reader.readAsDataURL(file);
      }
    }
  };

  const handleSendMessage = async () => {
    if ((!inputMessage.trim() && !uploadedImage) || isLoading) return;

    // Check API key
    const apiKey = localStorage.getItem('openai_api_key');
    if (!apiKey) {
      setShowApiKeyPrompt(true);
      return;
    }

    const userMessage: Message = {
      id: Date.now().toString(),
      type: 'user',
      content: inputMessage || 'Please analyze this chart.',
      image: uploadedImage || undefined,
      timestamp: new Date()
    };

    setMessages(prev => [...prev, userMessage]);
    const messageText = inputMessage;
    const imageData = uploadedImage;
    
    setInputMessage('');
    setUploadedImage(null);
    setIsLoading(true);

    try {
      const aiResponse = await TradingAIService.getGPTResponse(messageText, imageData);
      
      const assistantMsg: Message = {
        id: (Date.now() + 1).toString(),
        type: 'assistant',
        content: aiResponse,
        timestamp: new Date()
      };
      
      setMessages(prev => [...prev, assistantMsg]);
      
    } catch (error) {
      console.error('Error getting AI response:', error);
      const errorMsg: Message = {
        id: (Date.now() + 1).toString(),
        type: 'assistant',
        content: '❌ **Connection Error**\n\nSorry, I couldn\'t process your request right now. Please check your internet connection and try again.',
        timestamp: new Date()
      };
      setMessages(prev => [...prev, errorMsg]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  const removeUploadedImage = () => {
    setUploadedImage(null);
  };

  // Render markdown-like content
  const renderMessage = (content: string) => {
    // Simple markdown rendering for better formatting
    return content
      .split('\n')
      .map((line, index) => {
        if (line.startsWith('# ')) {
          return <h1 key={index} className="text-xl font-bold mb-2">{line.slice(2)}</h1>;
        }
        if (line.startsWith('## ')) {
          return <h2 key={index} className="text-lg font-semibold mb-2">{line.slice(3)}</h2>;
        }
        if (line.startsWith('**') && line.endsWith('**')) {
          return <p key={index} className="font-semibold mb-1">{line.slice(2, -2)}</p>;
        }
        if (line.trim() === '') {
          return <br key={index} />;
        }
        return <p key={index} className="mb-1">{line}</p>;
      });
  };

  return (
    <div className="min-h-screen bg-tradeiq-navy flex flex-col">
      {/* Header */}
      <header className="border-b border-gray-800/50 bg-black/20 backdrop-blur-sm sticky top-0 z-50">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="h-8 w-8 bg-gradient-to-br from-tradeiq-blue to-tradeiq-blue-light rounded-lg flex items-center justify-center">
                <span className="text-white font-bold text-sm">S</span>
              </div>
              <div>
                <h1 className="text-xl font-bold text-white tracking-tight">StrategyAI</h1>
                <p className="text-xs text-gray-400 font-medium">Powered by GPT-4o</p>
              </div>
            </div>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setShowApiKeyPrompt(true)}
              className="text-gray-400 hover:text-white"
            >
              <Settings className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </header>

      {/* API Key Prompt Modal */}
      {showApiKeyPrompt && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <Card className="w-full max-w-md tradeiq-card">
            <CardHeader>
              <CardTitle className="text-white flex items-center space-x-2">
                <AlertCircle className="h-5 w-5 text-tradeiq-blue" />
                <span>OpenAI API Key Required</span>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <p className="text-gray-300 text-sm">
                To use StrategyAI, please enter your OpenAI API key:
              </p>
              <Textarea
                value={tempApiKey}
                onChange={(e) => setTempApiKey(e.target.value)}
                placeholder="sk-..."
                className="bg-black/20 border-gray-700 text-white"
              />
              <div className="flex space-x-2">
                <Button
                  onClick={handleApiKeySubmit}
                  className="tradeiq-button-primary flex-1"
                  disabled={!tempApiKey.trim()}
                >
                  Save API Key
                </Button>
                <Button
                  onClick={() => setShowApiKeyPrompt(false)}
                  variant="ghost"
                  className="text-gray-400"
                >
                  Cancel
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      )}

      {/* Chat Area */}
      <div className="flex-1 flex flex-col max-w-4xl mx-auto w-full px-4 py-6">
        <Card className="flex-1 flex flex-col tradeiq-card">
          {/* Messages */}
          <ScrollArea className="flex-1 p-6" ref={scrollAreaRef}>
            <div className="space-y-6">
              {messages.map((message) => (
                <div
                  key={message.id}
                  className={`flex ${message.type === 'user' ? 'justify-end' : 'justify-start'}`}
                >
                  <div
                    className={`max-w-[85%] ${
                      message.type === 'user'
                        ? 'bg-tradeiq-blue rounded-2xl px-4 py-3 text-white'
                        : 'space-y-2'
                    }`}
                  >
                    {message.type === 'assistant' && (
                      <div className="flex items-center space-x-2 mb-2">
                        <div className="h-6 w-6 bg-gradient-to-br from-tradeiq-blue to-tradeiq-blue-light rounded-full flex items-center justify-center">
                          <span className="text-white font-bold text-xs">S</span>
                        </div>
                        <span className="text-sm font-medium text-gray-300">StrategyAI</span>
                      </div>
                    )}
                    
                    {message.image && (
                      <div className="mb-3">
                        <img 
                          src={message.image} 
                          alt="Chart screenshot" 
                          className="max-w-full h-auto rounded-lg border border-gray-700"
                          style={{ maxWidth: '300px' }}
                        />
                      </div>
                    )}
                    
                    <div className={`text-sm leading-relaxed ${
                      message.type === 'user' ? 'text-white' : 'text-gray-200'
                    }`}>
                      {message.type === 'assistant' ? renderMessage(message.content) : message.content}
                    </div>
                    
                    <p className="text-xs opacity-70 mt-2">
                      {message.timestamp.toLocaleTimeString()}
                    </p>
                  </div>
                </div>
              ))}
              
              {isLoading && (
                <div className="flex justify-start">
                  <div className="space-y-2">
                    <div className="flex items-center space-x-2 mb-2">
                      <div className="h-6 w-6 bg-gradient-to-br from-tradeiq-blue to-tradeiq-blue-light rounded-full flex items-center justify-center">
                        <span className="text-white font-bold text-xs">S</span>
                      </div>
                      <span className="text-sm font-medium text-gray-300">StrategyAI</span>
                    </div>
                    <div className="flex items-center space-x-2 text-gray-400">
                      <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-tradeiq-blue"></div>
                      <span className="text-sm">Analyzing with GPT-4o...</span>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </ScrollArea>
        </Card>
      </div>

      {/* Fixed Input Area */}
      <div className="border-t border-gray-800/50 bg-black/20 backdrop-blur-sm">
        <div className="max-w-4xl mx-auto p-4">
          {/* Image Preview */}
          {uploadedImage && (
            <div className="mb-3 p-3 bg-black/20 rounded-lg border border-gray-700">
              <div className="flex items-center space-x-3">
                <img 
                  src={uploadedImage} 
                  alt="Chart to analyze" 
                  className="h-12 w-16 object-cover rounded border border-gray-600"
                />
                <div className="flex-1">
                  <p className="text-sm text-gray-300">Chart ready for analysis</p>
                </div>
                <Button
                  onClick={removeUploadedImage}
                  size="sm"
                  variant="ghost"
                  className="text-red-400 hover:text-red-300"
                >
                  <X className="h-4 w-4" />
                </Button>
              </div>
            </div>
          )}
          
          {/* Input Bar */}
          <div className="flex items-end space-x-2">
            <Button
              onClick={() => fileInputRef.current?.click()}
              variant="ghost"
              size="sm"
              className="text-gray-400 hover:text-gray-300 px-2"
              disabled={isLoading}
            >
              <Camera className="h-5 w-5" />
            </Button>
            
            <div className="flex-1 relative">
              <Textarea
                ref={textareaRef}
                value={inputMessage}
                onChange={(e) => setInputMessage(e.target.value)}
                onKeyPress={handleKeyPress}
                placeholder={uploadedImage ? "Optional: Add context or press Enter for analysis..." : "Ask about trading strategies, upload charts, or get market analysis..."}
                className="min-h-[44px] max-h-[120px] resize-none bg-black/20 border-gray-700 text-white placeholder:text-gray-500 rounded-xl pr-12"
                disabled={isLoading}
                rows={1}
              />
              <Button
                onClick={handleSendMessage}
                disabled={(!inputMessage.trim() && !uploadedImage) || isLoading}
                size="sm"
                className="absolute right-2 bottom-2 h-8 w-8 p-0 tradeiq-button-primary"
              >
                <Send className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </div>
      </div>
      
      <input
        ref={fileInputRef}
        type="file"
        accept="image/*"
        onChange={handleImageUpload}
        className="hidden"
      />
    </div>
  );
};

export default TradingChat;
