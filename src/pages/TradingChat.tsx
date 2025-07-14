import React, { useState, useRef, useEffect } from 'react';
import { Send, Paperclip, X, Bot, User, Loader2, Mic, RotateCcw, Crown } from 'lucide-react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useToast } from "@/hooks/use-toast";
import { TradingAIService } from "@/services/tradingAIService";
import { useConversationMemory } from "@/hooks/useConversationMemory";
import { useDailyMessages } from "@/hooks/useDailyMessages";
import { UpgradeModal } from "@/components/UpgradeModal";
import { Badge } from "@/components/ui/badge";
import ReactMarkdown from 'react-markdown';

interface ChatMessage {
  id: string;
  type: 'user' | 'assistant';
  content: string;
  timestamp: Date;
  images?: string[];
}

interface UploadedImage {
  id: string;
  file: File;
  preview: string;
}

const TradingChat = () => {
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: '1',
      type: 'assistant',
      content: 'Welcome to TradeIQ Pro! Ask me about trading strategies, upload charts, and get personalized insights.',
      timestamp: new Date()
    }
  ]);
  const [inputMessage, setInputMessage] = useState('');
  const [uploadedImages, setUploadedImages] = useState<UploadedImage[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [showMemoryNotification, setShowMemoryNotification] = useState(false);
  const [showUpgradeModal, setShowUpgradeModal] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const { toast } = useToast();

  // Initialize conversation memory
  const { 
    context: memoryContext, 
    addMessage: addToMemory, 
    getContextForAI, 
    resetMemory, 
    activateMemory,
    isMemoryActive,
    messageCount 
  } = useConversationMemory();

  // Initialize daily message limits
  const {
    messageCount: dailyMessageCount,
    maxMessages,
    canSendMessage,
    remainingMessages,
    incrementMessageCount,
    isPro
  } = useDailyMessages();

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  // Show memory activation notification on first message
  useEffect(() => {
    if (!isMemoryActive && messages.length > 3) {
      activateMemory();
      setShowMemoryNotification(true);
      setTimeout(() => setShowMemoryNotification(false), 4000);
    }
  }, [messages.length, isMemoryActive, activateMemory]);

  const handleSendMessage = async () => {
    if (!inputMessage.trim() && uploadedImages.length === 0) return;

    // Check daily message limit for free users
    if (!canSendMessage) {
      setShowUpgradeModal(true);
      return;
    }

    const userMessage: ChatMessage = {
      id: Date.now().toString(),
      type: 'user',
      content: inputMessage || 'Chart analysis request',
      timestamp: new Date(),
      images: uploadedImages.length > 0 ? uploadedImages.map(img => img.preview) : undefined
    };

    setMessages(prev => [...prev, userMessage]);
    
    // Add to conversation memory
    addToMemory({
      id: userMessage.id,
      type: userMessage.type,
      content: userMessage.content,
      timestamp: userMessage.timestamp,
      images: userMessage.images
    });

    const currentMessage = inputMessage;
    const currentImages = [...uploadedImages];
    
    // Clear input and images immediately after sending
    setInputMessage('');
    setUploadedImages([]);
    setIsLoading(true);

    // Increment message count for free users
    if (!isPro) {
      await incrementMessageCount();
    }

    try {
      let aiResponse: string;
      
      // Get conversation context for AI
      const conversationContext = getContextForAI();
      
      // If there are images, process each one
      if (currentImages.length > 0) {
        console.log(`🖼️ Processing ${currentImages.length} images for analysis...`);
        
        let combinedAnalysis = '';
        
        for (let i = 0; i < currentImages.length; i++) {
          const image = currentImages[i];
          console.log(`📊 Analyzing chart ${i + 1} of ${currentImages.length}...`);
          
          const chartAnalysis = await TradingAIService.analyzeChartWithAI(
            currentMessage || `Please analyze this trading chart ${i + 1} and provide a complete strategy analysis.`,
            image.preview,
            conversationContext
          );
          
          // Format each analysis with clear labeling
          combinedAnalysis += `## Chart Analysis ${i + 1}\n\n${chartAnalysis}`;
          
          // Add separator between analyses (except for the last one)
          if (i < currentImages.length - 1) {
            combinedAnalysis += '\n\n---\n\n';
          }
        }
        
        aiResponse = combinedAnalysis;
      } else {
        console.log('💬 Sending text message to GPT with conversation context...');
        aiResponse = await TradingAIService.getGPTResponse(currentMessage, undefined, conversationContext);
      }

      console.log('✅ Received AI response:', aiResponse);

      const assistantMessage: ChatMessage = {
        id: Date.now().toString() + '-ai',
        type: 'assistant',
        content: aiResponse,
        timestamp: new Date()
      };
      
      setMessages(prev => [...prev, assistantMessage]);
      
      // Add assistant response to memory
      addToMemory({
        id: assistantMessage.id,
        type: assistantMessage.type,
        content: assistantMessage.content,
        timestamp: assistantMessage.timestamp
      });
      
    } catch (error) {
      console.error('💥 Error getting AI response:', error);
      
      const errorMessage: ChatMessage = {
        id: Date.now().toString() + '-error',
        type: 'assistant',
        content: 'Sorry, I encountered an error processing your request. Please check your API key settings and try again.',
        timestamp: new Date()
      };
      
      setMessages(prev => [...prev, errorMessage]);
      
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to get AI response. Please check your settings.",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    
    if (uploadedImages.length + files.length > 3) {
      toast({
        variant: "destructive",
        title: "Too Many Images",
        description: "Maximum 3 images allowed",
      });
      return;
    }

    files.forEach(file => {
      if (file.size > 5 * 1024 * 1024) {
        toast({
          variant: "destructive",
          title: "File Too Large",
          description: "Images must be under 5MB",
        });
        return;
      }

      const reader = new FileReader();
      reader.onload = () => {
        const newImage: UploadedImage = {
          id: Date.now().toString() + Math.random(),
          file,
          preview: reader.result as string
        };
        setUploadedImages(prev => [...prev, newImage]);
      };
      reader.readAsDataURL(file);
    });

    e.target.value = '';
  };

  const removeImage = (imageId: string) => {
    setUploadedImages(prev => prev.filter(img => img.id !== imageId));
  };

  const clearChat = () => {
    if (window.confirm('Clear all chat history? This cannot be undone.')) {
      setMessages([{
        id: '1',
        type: 'assistant',
        content: 'Chat cleared. How can I help you today?',
        timestamp: new Date()
      }]);
    }
  };

  const handleResetMemory = () => {
    if (window.confirm('Reset conversation memory? This will clear all stored context but keep visible messages.')) {
      resetMemory();
      toast({
        title: "Memory Reset",
        description: "Conversation memory has been cleared.",
      });
    }
  };

  return (
    <div className="flex flex-col h-screen bg-gray-900 text-white">
      {/* Header */}
      <div className="bg-gray-800 border-b border-gray-700 px-4 py-3 flex items-center justify-between flex-shrink-0">
        <h1 className="text-xl font-semibold flex items-center gap-2">
          <Bot className="h-6 w-6 text-blue-400" />
          Strategy AI
          {isMemoryActive && (
            <span className="text-xs bg-green-600 px-2 py-1 rounded-full">
              🧠 Memory: {messageCount}
            </span>
          )}
          {!isPro && (
            <Badge variant="outline" className="text-xs border-yellow-500 text-yellow-400">
              {remainingMessages}/{maxMessages} messages left
            </Badge>
          )}
          {isPro && (
            <Badge className="text-xs bg-tradeiq-blue text-white">
              <Crown className="h-3 w-3 mr-1" />
              Pro
            </Badge>
          )}
        </h1>
        <div className="flex gap-2">
          <Button 
            variant="ghost" 
            size="sm" 
            onClick={handleResetMemory}
            className="text-gray-400 hover:text-white"
            title="Reset Memory"
          >
            <RotateCcw className="h-4 w-4" />
          </Button>
          <Button 
            variant="ghost" 
            size="sm" 
            onClick={clearChat}
            className="text-gray-400 hover:text-white"
          >
            Clear Chat
          </Button>
        </div>
      </div>

      {/* Memory Activation Notification */}
      {showMemoryNotification && (
        <div className="bg-green-600 text-white px-4 py-2 text-center text-sm animate-pulse">
          🧠 Memory activated: I'll remember everything we discuss here!
        </div>
      )}

      {/* Chat Messages - Scrollable with bottom padding for input, disclaimer and navigation */}
      <div className="flex-1 overflow-y-auto px-4 py-4 space-y-4 pb-64">
        {messages.map(message => (
          <div key={message.id} className={`flex items-start gap-3 ${
            message.type === 'user' ? 'flex-row-reverse' : ''
          }`}>
            {/* Avatar */}
            <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold flex-shrink-0 ${
              message.type === 'user' 
                ? 'bg-blue-600 text-white' 
                : 'bg-gray-700 text-gray-300'
            }`}>
              {message.type === 'user' ? <User className="h-4 w-4" /> : <Bot className="h-4 w-4" />}
            </div>

            {/* Message Bubble */}
            <div className={`max-w-[70%] rounded-lg p-3 ${
              message.type === 'user'
                ? 'bg-blue-600 text-white ml-auto'
                : 'bg-gray-800 text-gray-100'
            }`}>
              {message.images && message.images.length > 0 && (
                <div className="mb-2 flex flex-wrap gap-2">
                  {message.images.map((image, index) => (
                    <img 
                      key={index}
                      src={image} 
                      alt={`Chart ${index + 1}`} 
                      className="max-w-[150px] max-h-[100px] object-contain rounded-md cursor-pointer hover:opacity-80 transition-opacity"
                      onClick={() => window.open(image, '_blank')}
                    />
                  ))}
                </div>
              )}
              <div className="text-sm">
                {message.type === 'assistant' ? (
                  <ReactMarkdown
                    components={{
                      p: ({ children }) => <p className="mb-2 last:mb-0">{children}</p>,
                      strong: ({ children }) => <strong className="font-semibold text-white">{children}</strong>,
                      em: ({ children }) => <em className="italic">{children}</em>,
                      ul: ({ children }) => <ul className="list-disc list-inside mb-2 space-y-1">{children}</ul>,
                      ol: ({ children }) => <ol className="list-decimal list-inside mb-2 space-y-1">{children}</ol>,
                      li: ({ children }) => <li className="text-gray-200">{children}</li>,
                      h1: ({ children }) => <h1 className="text-lg font-bold mb-2 text-white">{children}</h1>,
                      h2: ({ children }) => <h2 className="text-md font-semibold mb-2 text-white">{children}</h2>,
                      h3: ({ children }) => <h3 className="text-sm font-semibold mb-1 text-white">{children}</h3>,
                      code: ({ children }) => <code className="bg-gray-700 px-1 py-0.5 rounded text-blue-300 text-xs">{children}</code>,
                      pre: ({ children }) => <pre className="bg-gray-700 p-2 rounded text-blue-300 text-xs overflow-x-auto mb-2">{children}</pre>,
                      hr: () => <hr className="border-gray-600 my-4" />
                    }}
                  >
                    {message.content}
                  </ReactMarkdown>
                ) : (
                  <div className="whitespace-pre-wrap">
                    {message.content}
                  </div>
                )}
              </div>
              <div className="text-xs opacity-70 mt-2">
                {message.timestamp.toLocaleTimeString()}
              </div>
            </div>
          </div>
        ))}

        {/* Loading Indicator */}
        {isLoading && (
          <div className="flex items-start gap-3">
            <div className="w-8 h-8 rounded-full bg-gray-700 flex items-center justify-center flex-shrink-0">
              <Bot className="h-4 w-4 text-gray-300" />
            </div>
            <div className="bg-gray-800 rounded-lg p-3 flex items-center gap-2">
              <Loader2 className="h-4 w-4 animate-spin text-blue-400" />
              <span className="text-sm text-gray-300">Analyzing...</span>
            </div>
          </div>
        )}

        <div ref={messagesEndRef} />
      </div>

      {/* Input Bar - Fixed at Bottom with high z-index */}
      <div className="fixed bottom-20 left-0 right-0 bg-gray-800 border-t-2 border-blue-500 p-4 z-[60] shadow-lg">
        {/* Image Previews */}
        {uploadedImages.length > 0 && (
          <div className="mb-3 flex gap-2 flex-wrap">
            {uploadedImages.map(image => (
              <div key={image.id} className="relative">
                <img 
                  src={image.preview} 
                  alt="Preview" 
                  className="w-16 h-16 object-cover rounded-md border border-gray-600"
                />
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => removeImage(image.id)}
                  className="absolute -top-1 -right-1 h-5 w-5 bg-red-600 hover:bg-red-700 text-white rounded-full p-0"
                >
                  <X className="h-3 w-3" />
                </Button>
              </div>
            ))}
            <div className="text-xs text-gray-400 self-end">
              {3 - uploadedImages.length} more allowed
            </div>
          </div>
        )}

        {/* Input Row */}
        <div className="flex items-center gap-2">
          <div className="flex-1">
            <Input
              type="text"
              placeholder="Ask something..."
              value={inputMessage}
              onChange={(e) => setInputMessage(e.target.value)}
              onKeyPress={(e) => {
                if (e.key === 'Enter' && !e.shiftKey) {
                  e.preventDefault();
                  handleSendMessage();
                }
              }}
              className="bg-gray-700 border-gray-600 text-white placeholder-gray-400 focus:border-blue-500"
              disabled={isLoading}
            />
          </div>

          {/* File Upload Button */}
          <input
            ref={fileInputRef}
            type="file"
            accept="image/png,image/jpeg,image/jpg"
            onChange={handleImageUpload}
            multiple
            className="hidden"
          />
          <Button
            variant="outline"
            size="icon"
            onClick={() => fileInputRef.current?.click()}
            disabled={uploadedImages.length >= 3 || isLoading}
            className="border-gray-600 hover:bg-gray-700 text-gray-300 flex-shrink-0"
          >
            <Paperclip className="h-4 w-4" />
          </Button>

          {/* Microphone Button */}
          <Button
            variant="outline"
            size="icon"
            disabled={isLoading}
            className="border-gray-600 hover:bg-gray-700 text-gray-300 flex-shrink-0"
          >
            <Mic className="h-4 w-4" />
          </Button>

          {/* Send Button */}
          <Button
            onClick={handleSendMessage}
            disabled={isLoading || (!inputMessage.trim() && uploadedImages.length === 0)}
            className="bg-blue-600 hover:bg-blue-700 text-white flex-shrink-0"
          >
            {isLoading ? (
              <Loader2 className="h-4 w-4 animate-spin" />
            ) : (
              <Send className="h-4 w-4" />
            )}
          </Button>
        </div>
      </div>

      {/* Investment Disclaimer - Fixed at very bottom */}
      <div className="fixed bottom-0 left-0 right-0 bg-gray-900 border-t border-gray-700 px-4 py-2 z-[50]">
        <p className="text-xs text-gray-400 text-center leading-relaxed">
          <strong className="text-yellow-400">Disclaimer:</strong> TradeIQ provides educational content and market analysis tools. 
          None of the information provided should be considered financial advice or a recommendation to invest. 
          Always do your own research and consult with a financial advisor before making investment decisions.
        </p>
      </div>

      {/* Upgrade Modal */}
      <UpgradeModal
        open={showUpgradeModal}
        onClose={() => setShowUpgradeModal(false)}
        feature="daily messages"
      />
    </div>
  );
};

export default TradingChat;
