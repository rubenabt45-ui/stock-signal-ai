import React, { useState, useEffect, useRef } from 'react';
import { useLocation } from 'react-router-dom';
import { Send, Paperclip, Pin, RefreshCw, Loader2, AlertCircle } from 'lucide-react';
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

const TradingChat = () => {
  const location = useLocation();
  const [inputMessage, setInputMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isRetrying, setIsRetrying] = useState(false);
  const [file, setFile] = useState<File | null>(null);
  const [preview, setPreview] = useState<string>('');
  const [error, setError] = useState<string | null>(null);
  const chatContainerRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const { user } = useAuth();
  const { toast } = useToast();
  const { messages, addMessage, addMessages, clearHistory, isLoading: historyLoading } = useConversationHistory();
  const { pinnedMessages, pinMessage, unpinMessage, isMessagePinned } = usePinnedMessages();
  const { saveCurrentSession } = useSessionHistory();
  const { context, updateContext, resetContext } = useSessionContext();

  const handleSendMessage = async () => {
    if (!inputMessage.trim() && !file) return;

    const userMessage: ChatMessage = {
      id: Date.now().toString(),
      type: 'user',
      content: inputMessage,
      timestamp: new Date(),
      image: file ? preview : undefined
    };

    addMessage(userMessage);
    setInputMessage('');
    setFile(null);
    setPreview('');
    setIsLoading(true);
    setError(null);

    try {
      // Simulate AI response delay
      await new Promise(resolve => setTimeout(resolve, 500));

      const aiResponse = `This is a simulated AI response to: "${inputMessage}".${file ? ' Also processing the uploaded image.' : ''}`;
      const aiMessage: ChatMessage = {
        id: Date.now().toString() + '-ai',
        type: 'assistant',
        content: aiResponse,
        timestamp: new Date()
      };

      addMessage(aiMessage);
      updateContext(userMessage.content, aiMessage.content);
    } catch (err: any) {
      console.error("Failed to send message:", err);
      setError(err.message || "Failed to send message. Please try again.");
    } finally {
      setIsLoading(false);
      scrollToBottom();
    }
  };

  const handleRetryMessage = async (message: ChatMessage) => {
    setIsRetrying(true);
    setError(null);

    try {
      // Simulate AI response delay
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
    clearHistory();
    resetContext();
    toast({
      title: "Chat Cleared",
      description: "Your conversation history has been cleared.",
    });
  };

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0];

    if (selectedFile) {
      if (selectedFile.size > 5 * 1024 * 1024) {
        toast({
          variant: "destructive",
          title: "File Too Large",
          description: "Please upload an image smaller than 5MB.",
        });
        return;
      }

      setFile(selectedFile);
      const reader = new FileReader();
      reader.onloadend = () => {
        setPreview(reader.result as string);
      };
      reader.readAsDataURL(selectedFile);
    }
  };

  const handleRemoveImage = () => {
    setFile(null);
    setPreview('');
  };

  const scrollToBottom = () => {
    chatContainerRef.current?.scrollIntoView({ behavior: 'smooth', block: 'end' });
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
    window.addEventListener('beforeunload', () => {
      saveCurrentSession(messages);
    });

    return () => {
      saveCurrentSession(messages);
      window.removeEventListener('beforeunload', () => {
        saveCurrentSession(messages);
      });
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
                        <img src={msg.image} alt="Uploaded" className="max-h-48 max-w-full rounded-md mb-2" />
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
              <div ref={chatContainerRef} />
            </div>
          )}
        </div>
      </div>

      {/* Chat Input */}
      <div className="border-t border-gray-800/50 bg-black/20 backdrop-blur-sm">
        <div className="container mx-auto px-4 py-4 flex items-center">
          {file && (
            <div className="mr-4 relative">
              <img src={preview} alt="Preview" className="h-20 w-20 rounded-md object-cover" />
              <Button
                variant="ghost"
                size="icon"
                onClick={handleRemoveImage}
                className="absolute top-0 right-0 bg-black/50 hover:bg-black/75 text-white"
              >
                <X className="h-4 w-4" />
              </Button>
            </div>
          )}
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
              className="hidden"
            />
            <Button variant="ghost" size="icon" className="text-gray-400 hover:text-gray-300">
              <Paperclip className="h-5 w-5" />
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
