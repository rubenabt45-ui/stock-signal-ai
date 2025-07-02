
import React, { useState, useEffect, useRef } from 'react';
import { useLocation } from 'react-router-dom';
import { Send, Paperclip, Pin, RefreshCw, Loader2, AlertCircle, X } from 'lucide-react';
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { useConversationHistory, ChatMessage } from '@/hooks/useConversationHistory';
import { usePinnedMessages } from '@/hooks/usePinnedMessages';
import { useSessionHistory } from '@/hooks/useSessionHistory';
import { useSessionContext } from '@/hooks/useSessionContext';
import { useAuth } from '@/contexts/AuthContext';
import { useToast } from "@/hooks/use-toast";
import CollapsibleMessage from '@/components/CollapsibleMessage';

interface UploadedImage {
  id: string;
  file: File;
  preview: string;
}

const TradingChat = () => {
  const location = useLocation();
  const [inputMessage, setInputMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isRetrying, setIsRetrying] = useState(false);
  const [uploadedImages, setUploadedImages] = useState<UploadedImage[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [processingImages, setProcessingImages] = useState<string[]>([]);
  const chatContainerRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  
  const { user } = useAuth();
  const { toast } = useToast();
  const { messages, addMessage, addMessages, clearHistory, isLoading: historyLoading } = useConversationHistory();
  const { pinnedMessages, pinMessage, unpinMessage, isMessagePinned } = usePinnedMessages();
  const { saveCurrentSession } = useSessionHistory();
  const { context, updateContext, resetContext } = useSessionContext();

  // Auto-scroll to bottom
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  // Focus input after response
  const focusInput = () => {
    setTimeout(() => {
      if (inputRef.current) {
        inputRef.current.focus();
      }
    }, 100);
  };

  const handleSendMessage = async () => {
    if (!inputMessage.trim() && uploadedImages.length === 0) return;

    const userMessage: ChatMessage = {
      id: Date.now().toString(),
      type: 'user',
      content: inputMessage,
      timestamp: new Date(),
      image: uploadedImages.length > 0 ? uploadedImages[0].preview : undefined
    };

    addMessage(userMessage);
    setInputMessage('');
    setIsLoading(true);
    setError(null);

    // If multiple images, set them as processing
    if (uploadedImages.length > 0) {
      setProcessingImages(uploadedImages.map(img => img.id));
    }

    try {
      // Simulate AI response delay
      await new Promise(resolve => setTimeout(resolve, 1000));

      if (uploadedImages.length > 1) {
        // Handle multiple images - create separate responses for each
        for (let i = 0; i < uploadedImages.length; i++) {
          const image = uploadedImages[i];
          const aiResponse = `**Chart Analysis ${i + 1}/${uploadedImages.length}**\n\nAnalyzing uploaded chart screenshot ${i + 1}...\n\n**Technical Analysis:**\n• Support level identified at current price action\n• RSI showing potential reversal signals\n• Volume analysis suggests increasing interest\n\n**Trade Setup Suggestion:**\n• Entry: Consider position around current levels\n• Stop Loss: Below recent support\n• Take Profit 1: Next resistance level\n• Take Profit 2: Extended target based on trend\n\n*Note: This is a simulated analysis for demonstration purposes.*`;
          
          const aiMessage: ChatMessage = {
            id: Date.now().toString() + '-ai-' + i,
            type: 'assistant',
            content: aiResponse,
            timestamp: new Date(),
            image: image.preview
          };

          addMessage(aiMessage);
          // Remove from processing
          setProcessingImages(prev => prev.filter(id => id !== image.id));
          
          // Small delay between multiple responses
          if (i < uploadedImages.length - 1) {
            await new Promise(resolve => setTimeout(resolve, 500));
          }
        }
      } else {
        // Single image or text-only response
        let aiResponse = `This is a simulated AI response to: "${inputMessage}".`;
        
        if (uploadedImages.length === 1) {
          aiResponse = `**Chart Analysis**\n\nI've analyzed your chart screenshot. Here's my assessment:\n\n**Technical Analysis:**\n• Current trend analysis shows mixed signals\n• Key support and resistance levels identified\n• Volume profile suggests moderate interest\n\n**Trade Setup Suggestion:**\n• Entry: Wait for confirmation above resistance\n• Stop Loss: Below recent swing low\n• Take Profit 1: Next resistance zone\n• Take Profit 2: Extended target if momentum continues\n\n**Risk Management:**\n• Position size: 1-2% of portfolio\n• Risk-reward ratio: 1:2 minimum\n\n*Note: This is a simulated analysis for demonstration purposes.*`;
        }

        const aiMessage: ChatMessage = {
          id: Date.now().toString() + '-ai',
          type: 'assistant',
          content: aiResponse,
          timestamp: new Date()
        };

        addMessage(aiMessage);
      }

      updateContext(userMessage.content, "Analysis completed");
    } catch (err: any) {
      console.error("Failed to send message:", err);
      setError(err.message || "Failed to send message. Please try again.");
    } finally {
      setUploadedImages([]);
      setProcessingImages([]);
      setIsLoading(false);
      scrollToBottom();
      focusInput();
    }
  };

  const handleRetryMessage = async (message: ChatMessage) => {
    setIsRetrying(true);
    setError(null);

    try {
      await new Promise(resolve => setTimeout(resolve, 500));

      const aiResponse = `This is a simulated AI response to your previous message: "${message.content}".`;
      const aiMessage: ChatMessage = {
        id: Date.now().toString() + '-ai',
        type: 'assistant',
        content: aiResponse,
        timestamp: new Date()
      };

      addMessage(aiMessage);
    } catch (err: any) {
      console.error("Failed to send message:", err);
      setError(err.message || "Failed to send message. Please try again.");
    } finally {
      setIsRetrying(false);
      scrollToBottom();
    }
  };

  const handlePinMessage = (message: ChatMessage) => {
    if (isMessagePinned(message.id)) {
      unpinMessage(message.id);
    } else {
      pinMessage(message);
      toast({
        title: "Message Pinned",
        description: "This message has been pinned for quick access.",
      });
    }
  };

  const handleClearHistory = () => {
    if (messages.length > 1 && window.confirm("Are you sure you want to clear the chat history? This action cannot be undone.")) {
      clearHistory();
      resetContext();
      toast({
        title: "Chat Cleared",
        description: "Your conversation history has been cleared.",
      });
    }
  };

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFiles = Array.from(e.target.files || []);
    
    if (selectedFiles.length === 0) return;

    // Check if adding these files would exceed the limit
    if (uploadedImages.length + selectedFiles.length > 3) {
      toast({
        variant: "destructive",
        title: "Too Many Images",
        description: "You can upload up to 3 images at once.",
      });
      return;
    }

    const validFiles = selectedFiles.filter(file => {
      if (file.size > 5 * 1024 * 1024) {
        toast({
          variant: "destructive",
          title: "File Too Large",
          description: `${file.name} is larger than 5MB. Please choose a smaller image.`,
        });
        return false;
      }
      return true;
    });

    validFiles.forEach(file => {
      const reader = new FileReader();
      reader.onloadend = () => {
        const newImage: UploadedImage = {
          id: Date.now().toString() + Math.random().toString(36).substr(2, 9),
          file,
          preview: reader.result as string
        };
        setUploadedImages(prev => [...prev, newImage]);
      };
      reader.readAsDataURL(file);
    });

    // Clear the input
    e.target.value = '';
  };

  const handleRemoveImage = (imageId: string) => {
    setUploadedImages(prev => prev.filter(img => img.id !== imageId));
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  // Auto-scroll on new messages
  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  // Focus input on mount
  useEffect(() => {
    focusInput();
  }, []);

  // Session management
  useEffect(() => {
    const handleBeforeUnload = () => {
      saveCurrentSession(messages);
    };

    window.addEventListener('beforeunload', handleBeforeUnload);

    return () => {
      saveCurrentSession(messages);
      window.removeEventListener('beforeunload', handleBeforeUnload);
    };
  }, [messages, saveCurrentSession]);

  // Handle incoming prompts from Economic Events
  useEffect(() => {
    if (location.state?.prompt) {
      setInputMessage(location.state.prompt);
      // Clear the location state to prevent re-triggering
      window.history.replaceState({}, document.title);
    }
  }, [location.state]);

  return (
    <div className="flex flex-col h-screen bg-tradeiq-navy">
      {/* Header */}
      <div className="bg-black/20 border-b border-gray-800/50 px-4 py-3 flex items-center justify-between">
        <h1 className="text-xl font-semibold text-white">Strategy AI</h1>
        <Button 
          variant="ghost" 
          size="sm" 
          onClick={handleClearHistory} 
          className="text-gray-400 hover:text-gray-300"
        >
          Clear Chat
        </Button>
      </div>

      {/* Pinned Messages */}
      {pinnedMessages.length > 0 && (
        <div className="bg-black/20 border-b border-gray-800/50 px-4 py-3">
          <h2 className="text-sm font-semibold text-gray-400 mb-2">Pinned Messages</h2>
          <div className="space-y-2">
            {pinnedMessages.map(msg => (
              <div key={msg.id} className="bg-gray-900/50 rounded-lg p-3 text-sm text-gray-200">
                <div className="flex items-center justify-between mb-1">
                  <span className="font-medium">{msg.type === 'user' ? 'You' : 'Strategy AI'}</span>
                  <Button 
                    variant="ghost" 
                    size="icon" 
                    onClick={() => handlePinMessage(msg)} 
                    className="h-6 w-6 hover:text-tradeiq-blue"
                  >
                    <Pin className="h-4 w-4" />
                  </Button>
                </div>
                <CollapsibleMessage content={msg.content} maxLines={3} />
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Chat Messages */}
      <div className="flex-1 overflow-y-auto px-4 py-4 pb-20">
        {historyLoading ? (
          <div className="flex items-center justify-center py-8">
            <Loader2 className="h-6 w-6 animate-spin text-gray-400 mr-2" />
            <span className="text-gray-400">Loading chat history...</span>
          </div>
        ) : messages.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-8 text-center">
            <AlertCircle className="h-8 w-8 text-gray-400 mb-2" />
            <p className="text-gray-400">No messages yet. Start chatting!</p>
          </div>
        ) : (
          <div className="space-y-4">
            {messages.map(msg => (
              <div key={msg.id} className={`flex ${msg.type === 'user' ? 'justify-end' : 'justify-start'}`}>
                <div className={`flex items-start space-x-2 max-w-[85%] ${msg.type === 'user' ? 'flex-row-reverse space-x-reverse' : ''}`}>
                  {msg.type === 'assistant' && (
                    <Avatar className="h-8 w-8 mt-1">
                      <AvatarImage src="https://github.com/shadcn.png" alt="AI Avatar" />
                      <AvatarFallback>AI</AvatarFallback>
                    </Avatar>
                  )}
                  
                  <div className={`rounded-lg p-3 ${
                    msg.type === 'user' 
                      ? 'bg-tradeiq-blue text-white' 
                      : 'bg-gray-800/50 text-gray-200'
                  }`}>
                    {msg.image && (
                      <img 
                        src={msg.image} 
                        alt="Chart" 
                        className="max-w-xs max-h-48 rounded-md mb-2 object-contain" 
                      />
                    )}
                    
                    <CollapsibleMessage content={msg.content} />
                    
                    <div className="flex items-center justify-between mt-2 pt-2 border-t border-gray-600/30">
                      <span className="text-xs text-gray-400">
                        {msg.timestamp.toLocaleTimeString()}
                      </span>
                      <div className="flex space-x-1">
                        {msg.type === 'user' && (
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => handleRetryMessage(msg)}
                            disabled={isRetrying}
                            className="h-6 w-6 hover:text-tradeiq-blue"
                          >
                            {isRetrying ? (
                              <Loader2 className="h-3 w-3 animate-spin" />
                            ) : (
                              <RefreshCw className="h-3 w-3" />
                            )}
                          </Button>
                        )}
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => handlePinMessage(msg)}
                          className={`h-6 w-6 hover:text-tradeiq-blue ${
                            isMessagePinned(msg.id) ? 'text-tradeiq-blue' : ''
                          }`}
                        >
                          <Pin className="h-3 w-3" />
                        </Button>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            ))}

            {/* Processing indicators for multiple images */}
            {processingImages.map(imageId => {
              const image = uploadedImages.find(img => img.id === imageId);
              if (!image) return null;
              
              return (
                <div key={imageId} className="flex justify-start">
                  <div className="flex items-start space-x-2 max-w-[85%]">
                    <Avatar className="h-8 w-8 mt-1">
                      <AvatarImage src="https://github.com/shadcn.png" alt="AI Avatar" />
                      <AvatarFallback>AI</AvatarFallback>
                    </Avatar>
                    
                    <div className="bg-gray-800/50 text-gray-200 rounded-lg p-3">
                      <img 
                        src={image.preview} 
                        alt="Processing chart" 
                        className="max-w-xs max-h-48 rounded-md mb-2 object-contain" 
                      />
                      <div className="flex items-center text-sm text-gray-400">
                        <Loader2 className="h-4 w-4 animate-spin mr-2" />
                        <span>Analyzing chart...</span>
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}

            <div ref={messagesEndRef} />
          </div>
        )}
      </div>

      {/* Fixed Input Bar */}
      <div className="fixed bottom-0 left-0 right-0 bg-tradeiq-navy border-t border-gray-800/50">
        {/* Image Previews */}
        {uploadedImages.length > 0 && (
          <div className="px-4 py-3 border-b border-gray-700/50">
            <div className="flex flex-wrap gap-2">
              {uploadedImages.map((image) => (
                <div key={image.id} className="relative">
                  <img 
                    src={image.preview} 
                    alt="Preview" 
                    className="h-16 w-16 sm:h-20 sm:w-20 rounded-md object-cover border border-gray-600" 
                  />
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => handleRemoveImage(image.id)}
                    className="absolute -top-1 -right-1 h-5 w-5 bg-red-500 hover:bg-red-600 text-white rounded-full p-0"
                  >
                    <X className="h-3 w-3" />
                  </Button>
                </div>
              ))}
              {uploadedImages.length < 3 && (
                <div className="text-xs text-gray-400 self-end pb-1">
                  {3 - uploadedImages.length} more image{3 - uploadedImages.length !== 1 ? 's' : ''} allowed
                </div>
              )}
            </div>
          </div>
        )}
        
        {/* Input Section */}
        <div className="flex items-center space-x-2 p-4">
          <div className="flex-1 relative">
            <Input
              ref={inputRef}
              type="text"
              placeholder="Type your message..."
              value={inputMessage}
              onChange={(e) => setInputMessage(e.target.value)}
              onKeyPress={handleKeyPress}
              className="w-full bg-gray-800/50 border-gray-700 text-white placeholder-gray-400 pr-12 focus:ring-tradeiq-blue focus:border-tradeiq-blue"
              disabled={isLoading}
            />
          </div>
          
          {/* File Upload Button */}
          <input
            ref={fileInputRef}
            type="file"
            accept="image/*"
            onChange={handleImageUpload}
            multiple
            className="hidden"
          />
          <Button
            variant="outline"
            size="icon"
            onClick={() => fileInputRef.current?.click()}
            disabled={uploadedImages.length >= 3 || isLoading}
            className="border-gray-700 hover:bg-gray-800"
          >
            <Paperclip className="h-4 w-4" />
          </Button>
          
          {/* Send Button */}
          <Button
            onClick={handleSendMessage}
            disabled={isLoading || (!inputMessage.trim() && uploadedImages.length === 0)}
            className="bg-tradeiq-blue hover:bg-tradeiq-blue/90"
          >
            {isLoading ? (
              <Loader2 className="h-4 w-4 animate-spin" />
            ) : (
              <Send className="h-4 w-4" />
            )}
          </Button>
        </div>

        {/* Error Display */}
        {error && (
          <div className="px-4 pb-2">
            <div className="flex items-center text-sm text-red-400 bg-red-900/20 rounded-md p-2">
              <AlertCircle className="h-4 w-4 mr-2 flex-shrink-0" />
              <span>{error}</span>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default TradingChat;
