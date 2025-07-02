
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
  const { user } = useAuth();
  const { toast } = useToast();
  const { messages, addMessage, addMessages, clearHistory, isLoading: historyLoading } = useConversationHistory();
  const { pinnedMessages, pinMessage, unpinMessage, isMessagePinned } = usePinnedMessages();
  const { saveCurrentSession } = useSessionHistory();
  const { context, updateContext, resetContext } = useSessionContext();

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
      // Focus input after processing
      setTimeout(() => {
        if (inputRef.current) {
          inputRef.current.focus();
        }
      }, 100);
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
    // Show confirmation before clearing
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

  const scrollToBottom = () => {
    setTimeout(() => {
      chatContainerRef.current?.scrollIntoView({ behavior: 'smooth', block: 'end' });
    }, 100);
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  useEffect(() => {
    if (inputRef.current) {
      inputRef.current.focus();
    }
  }, []);

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
      {/* Chat Header */}
      <header className="border-b border-gray-800/50 bg-black/20 backdrop-blur-sm sticky top-0 z-50">
        <div className="container mx-auto px-4 py-3">
          <div className="flex items-center justify-between">
            <h1 className="text-xl font-semibold text-white">Strategy AI</h1>
            <div className="flex items-center space-x-2">
              <Button variant="ghost" size="sm" onClick={handleClearHistory} className="text-gray-400 hover:text-gray-300">
                Clear Chat
              </Button>
            </div>
          </div>
        </div>
      </header>

      {/* Pinned Messages */}
      {pinnedMessages.length > 0 && (
        <div className="bg-black/20 border-b border-gray-800/50">
          <div className="container mx-auto px-4 py-3">
            <h2 className="text-sm font-semibold text-gray-400 mb-2">Pinned Messages</h2>
            <div className="space-y-2">
              {pinnedMessages.map(msg => (
                <div key={msg.id} className="bg-gray-900/50 rounded-lg p-3 text-sm text-gray-200">
                  <div className="flex items-center justify-between">
                    <span className="font-medium">{msg.type === 'user' ? 'You' : 'Strategy AI'}</span>
                    <Button variant="ghost" size="icon" onClick={() => handlePinMessage(msg)} className="hover:text-tradeiq-blue">
                      <Pin className="h-4 w-4" />
                    </Button>
                  </div>
                  <CollapsibleMessage content={msg.content} maxLines={5} />
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Chat Messages */}
      <div className="flex-grow overflow-y-auto">
        <div className="container mx-auto px-4 py-6">
          {historyLoading ? (
            <div className="text-center text-gray-400 py-6">
              <Loader2 className="h-6 w-6 animate-spin mx-auto mb-2" />
              Loading chat history...
            </div>
          ) : messages.length === 0 ? (
            <div className="text-center text-gray-400 py-6">
              <AlertCircle className="h-6 w-6 mx-auto mb-2" />
              No messages in conversation. Start chatting!
            </div>
          ) : (
            <div className="space-y-4">
              {messages.map(msg => (
                <div key={msg.id} className={`flex ${msg.type === 'user' ? 'justify-end' : 'justify-start'}`}>
                  <div className="flex flex-col items-start max-w-3/4">
                    {msg.type === 'assistant' && (
                      <div className="flex items-center space-x-2 mb-1">
                        <Avatar className="h-6 w-6">
                          <AvatarImage src="https://github.com/shadcn.png" alt="AI Avatar" />
                          <AvatarFallback>AI</AvatarFallback>
                        </Avatar>
                        <span className="text-sm font-medium text-gray-400">Strategy AI</span>
                      </div>
                    )}
                    <div className="bg-gray-900/50 rounded-lg p-3 text-sm text-gray-200 w-fit">
                      {msg.image && (
                        <img src={msg.image} alt="Uploaded chart" className="max-h-48 max-w-full rounded-md mb-2" />
                      )}
                      <CollapsibleMessage content={msg.content} />
                      <div className="flex items-center justify-between mt-2">
                        <span className="text-xs text-gray-500">{msg.timestamp.toLocaleTimeString()}</span>
                        <div>
                          {msg.type === 'user' && (
                            <Button
                              variant="ghost"
                              size="icon"
                              onClick={() => handleRetryMessage(msg)}
                              disabled={isRetrying}
                              className="hover:text-tradeiq-blue"
                            >
                              {isRetrying ? <Loader2 className="h-4 w-4 animate-spin" /> : <RefreshCw className="h-4 w-4" />}
                            </Button>
                          )}
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => handlePinMessage(msg)}
                            className="hover:text-tradeiq-blue"
                          >
                            <Pin className={`h-4 w-4 ${isMessagePinned(msg.id) ? 'text-tradeiq-blue' : ''}`} />
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
                    <div className="flex flex-col items-start max-w-3/4">
                      <div className="flex items-center space-x-2 mb-1">
                        <Avatar className="h-6 w-6">
                          <AvatarImage src="https://github.com/shadcn.png" alt="AI Avatar" />
                          <AvatarFallback>AI</AvatarFallback>
                        </Avatar>
                        <span className="text-sm font-medium text-gray-400">Strategy AI</span>
                      </div>
                      <div className="bg-gray-900/50 rounded-lg p-3 text-sm text-gray-200 w-fit">
                        <img src={image.preview} alt="Processing chart" className="max-h-48 max-w-full rounded-md mb-2" />
                        <div className="flex items-center space-x-2 text-gray-400">
                          <Loader2 className="h-4 w-4 animate-spin" />
                          <span>Analyzing chart...</span>
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })}

              <div ref={chatContainerRef} />
            </div>
          )}
        </div>
      </div>

      {/* Chat Input */}
      <div className="border-t border-gray-800/50 bg-black/20 backdrop-blur-sm">
        {/* Image previews */}
        {uploadedImages.length > 0 && (
          <div className="container mx-auto px-4 py-3 border-b border-gray-700/50">
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
        
        <div className="container mx-auto px-4 py-4 flex items-center">
          <Input
            type="text"
            placeholder="Type your message..."
            value={inputMessage}
            onChange={e => setInputMessage(e.target.value)}
            onKeyDown={e => { if (e.key === 'Enter') handleSendMessage(); }}
            ref={inputRef}
            className="flex-grow rounded-full bg-gray-900/50 border-gray-800 text-white placeholder-gray-500 focus-visible:ring-0 focus-visible:ring-offset-0"
          />
          <label htmlFor="image-upload" className="ml-3">
            <input
              type="file"
              id="image-upload"
              accept="image/*"
              onChange={handleImageUpload}
              multiple
              className="hidden"
            />
            <Button 
              variant="ghost" 
              size="icon" 
              className="text-gray-400 hover:text-gray-300"
              disabled={uploadedImages.length >= 3}
            >
              <Paperclip className={`h-5 w-5 ${uploadedImages.length >= 3 ? 'opacity-50' : ''}`} />
            </Button>
          </label>
          <Button
            onClick={handleSendMessage}
            disabled={isLoading}
            className="ml-3 rounded-full"
          >
            {isLoading ? <Loader2 className="h-4 w-4 animate-spin mr-2" /> : <Send className="h-4 w-4 mr-2" />}
            Send
          </Button>
        </div>
        {error && (
          <div className="container mx-auto px-4 py-2 text-sm text-red-400">
            <AlertCircle className="inline-block h-4 w-4 mr-1 align-middle" />
            {error}
          </div>
        )}
      </div>
    </div>
  );
};

export default TradingChat;
