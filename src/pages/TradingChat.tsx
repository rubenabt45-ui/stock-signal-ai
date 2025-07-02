import { useState, useRef, useEffect } from "react";
import { Send, Camera, X, Settings, AlertCircle, Key, RefreshCw, Trash2, Pin, Clock, Brain } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { ScrollArea } from "@/components/ui/scroll-area";
import { useTranslation } from 'react-i18next';
import { TradingAIService } from '@/services/tradingAIService';
import { useToast } from "@/hooks/use-toast";
import { useConversationHistory, ChatMessage } from "@/hooks/useConversationHistory";
import { usePinnedMessages } from "@/hooks/usePinnedMessages";
import { useSessionHistory } from "@/hooks/useSessionHistory";
import PinnedMessagesModal from '@/components/PinnedMessagesModal';
import SessionHistoryDrawer from '@/components/SessionHistoryDrawer';
import CollapsibleMessage from '@/components/CollapsibleMessage';

interface UploadedImage {
  id: string;
  data: string;
  file: File;
}

const TradingChat = () => {
  const { t } = useTranslation();
  const { toast } = useToast();
  const { messages, addMessage, clearHistory, isLoading: isLoadingHistory, setMessages } = useConversationHistory();
  const { pinnedMessages, pinMessage, unpinMessage, isMessagePinned, clearPinnedMessages } = usePinnedMessages();
  const { sessions, saveCurrentSession, loadSession, deleteSession, clearHistory: clearSessionHistory } = useSessionHistory();
  
  const [inputMessage, setInputMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isRetrying, setIsRetrying] = useState(false);
  const [uploadedImages, setUploadedImages] = useState<UploadedImage[]>([]);
  const [processingImageIndex, setProcessingImageIndex] = useState<number | null>(null);
  const [showApiKeyPrompt, setShowApiKeyPrompt] = useState(false);
  const [tempApiKey, setTempApiKey] = useState('');
  const [lastMessageTime, setLastMessageTime] = useState<number>(0);
  const [isApiKeyValid, setIsApiKeyValid] = useState<boolean>(false);
  const [isValidatingKey, setIsValidatingKey] = useState<boolean>(false);
  const [currentModelInfo, setCurrentModelInfo] = useState<{ model: string; isPrimary: boolean }>({ model: '', isPrimary: true });
  const [showPinnedModal, setShowPinnedModal] = useState(false);
  const [showSessionDrawer, setShowSessionDrawer] = useState(false);
  const [isGeneratingAnalysis, setIsGeneratingAnalysis] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const scrollAreaRef = useRef<HTMLDivElement>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  const RATE_LIMIT_DELAY = 3000; // 3 seconds between messages
  const RETRY_DELAY = 5000; // 5 seconds before retry

  // Auto-scroll to bottom after each message
  useEffect(() => {
    if (scrollAreaRef.current) {
      const scrollContainer = scrollAreaRef.current.querySelector('[data-radix-scroll-area-viewport]');
      if (scrollContainer) {
        scrollContainer.scrollTop = scrollContainer.scrollHeight;
      }
    }
  }, [messages, isLoading]);

  // Auto-resize textarea with max 4 lines
  useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto';
      const maxHeight = 24 * 4; // ~4 lines max
      textareaRef.current.style.height = Math.min(textareaRef.current.scrollHeight, maxHeight) + 'px';
    }
  }, [inputMessage]);

  // Save session when messages change
  useEffect(() => {
    if (messages.length > 1) {
      saveCurrentSession(messages);
    }
  }, [messages, saveCurrentSession]);

  // Enhanced API key validation on mount - only prompt if key is missing or invalid
  useEffect(() => {
    const validateApiKey = async () => {
      console.log('🔍 Starting API key validation on mount...');
      
      const existingApiKey = localStorage.getItem('openai_api_key');
      if (!existingApiKey) {
        console.log('🔑 No API key found in localStorage - prompting user');
        setIsApiKeyValid(false);
        setShowApiKeyPrompt(true);
        return;
      }

      console.log('🔍 Found existing API key, validating silently...');
      setIsValidatingKey(true);
      
      try {
        const validation = await TradingAIService.validateApiKey();
        
        if (validation.isValid) {
          console.log('✅ Existing API key validation successful');
          setIsApiKeyValid(true);
          
          const modelInfo = TradingAIService.getCurrentModelInfo();
          setCurrentModelInfo(modelInfo);
          console.log('🤖 Current model info:', modelInfo);
          
          if (!modelInfo.isPrimary) {
            toast({
              title: "Using Fallback Model",
              description: `Currently using: ${modelInfo.model}. This may be due to quota limits on your primary model.`,
            });
          }
        } else {
          console.log('❌ Existing API key validation failed:', validation.error);
          
          localStorage.removeItem('openai_api_key');
          
          setIsApiKeyValid(false);
          setShowApiKeyPrompt(true);
          
          let title = "API Key Invalid";
          let description = "Your saved API key is no longer valid. Please enter a new one.";
          
          if (validation.error?.includes('billing')) {
            title = "Billing Issue";
            description = "Your OpenAI account billing is not enabled or you've reached your quota. Please check your OpenAI account.";
          } else if (validation.error?.includes('unauthorized')) {
            title = "Unauthorized Key";
            description = "Your API key is unauthorized. Please enter a valid API key.";
          }
          
          toast({
            title,
            description,
            variant: "destructive"
          });
        }
      } catch (error) {
        console.error('💥 Error during API key validation:', error);
        
        setIsApiKeyValid(true);
        
        const modelInfo = TradingAIService.getCurrentModelInfo();
        setCurrentModelInfo(modelInfo);
        
        toast({
          title: "Validation Failed",
          description: "Could not validate your API key due to network issues. Proceeding with saved key.",
        });
      } finally {
        setIsValidatingKey(false);
        console.log('🏁 API key validation complete');
      }
    };

    validateApiKey();
  }, [toast]);

  const handleApiKeySubmit = async () => {
    if (tempApiKey.trim()) {
      console.log('💾 Saving new API key and validating...');
      TradingAIService.setApiKey(tempApiKey.trim());
      setIsValidatingKey(true);
      
      try {
        const validation = await TradingAIService.validateApiKey();
        
        if (validation.isValid) {
          setIsApiKeyValid(true);
          setShowApiKeyPrompt(false);
          setTempApiKey('');
          
          const modelInfo = TradingAIService.getCurrentModelInfo();
          setCurrentModelInfo(modelInfo);
          
          toast({
            title: "API Key Saved",
            description: `Your OpenAI API key has been validated and saved successfully with ${modelInfo.model}!`,
          });
        } else {
          console.log('❌ New API key validation failed:', validation.error);
          
          localStorage.removeItem('openai_api_key');
          
          let title = "Invalid API Key";
          let description = "The API key you entered is invalid.";
          
          if (validation.error?.includes('billing') || validation.error?.includes('quota')) {
            title = "Billing Issue";
            description = "Your API key is valid but you have no active credits. Please add billing to your OpenAI account.";
          } else if (validation.error?.includes('unauthorized')) {
            title = "Unauthorized Key";
            description = "Your API key is unauthorized. Please ensure it has the correct permissions.";
          }
          
          toast({
            title,
            description,
            variant: "destructive"
          });
        }
      } catch (error) {
        console.error('💥 Error validating new API key:', error);
        toast({
          title: "Validation Error",
          description: "Could not validate your API key. Please check your internet connection and try again.",
          variant: "destructive"
        });
      } finally {
        setIsValidatingKey(false);
      }
    }
  };

  const resetToPrimaryModel = () => {
    console.log('🔄 User requested reset to primary model');
    TradingAIService.resetToPrimaryModel();
    const modelInfo = TradingAIService.getCurrentModelInfo();
    setCurrentModelInfo(modelInfo);
    
    toast({
      title: "Model Reset",
      description: `Reset to primary model: ${modelInfo.model}. Try sending a message to test it.`,
    });
  };

  const handleClearChat = () => {
    clearHistory();
    setUploadedImages([]);
    setProcessingImageIndex(null);
    toast({
      title: "Chat Cleared",
      description: "Conversation history has been cleared and reset.",
    });
  };

  const handleImageUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files;
    if (!files || files.length === 0) return;

    const newImages: UploadedImage[] = [];
    let processedCount = 0;
    const totalFiles = files.length;

    // Check total image count limit
    if (uploadedImages.length + totalFiles > 5) {
      toast({
        title: "Too Many Images",
        description: "You can upload a maximum of 5 images at once.",
        variant: "destructive"
      });
      return;
    }

    Array.from(files).forEach((file, index) => {
      // Check individual file size
      if (file.size > 5 * 1024 * 1024) {
        toast({
          title: "Image too large",
          description: `${file.name} is larger than 5MB. Please choose a smaller image.`,
          variant: "destructive"
        });
        processedCount++;
        if (processedCount === totalFiles && newImages.length > 0) {
          setUploadedImages(prev => [...prev, ...newImages]);
        }
        return;
      }

      // Check file type
      const validTypes = ['image/png', 'image/jpeg', 'image/jpg', 'image/webp'];
      if (!validTypes.includes(file.type)) {
        toast({
          title: "Invalid file type",
          description: `${file.name} is not a supported format. Please use PNG, JPG, JPEG, or WebP.`,
          variant: "destructive"
        });
        processedCount++;
        if (processedCount === totalFiles && newImages.length > 0) {
          setUploadedImages(prev => [...prev, ...newImages]);
        }
        return;
      }
      
      if (file.type.startsWith('image/')) {
        const reader = new FileReader();
        reader.onload = (e) => {
          const imageData = e.target?.result as string;
          newImages.push({
            id: `${Date.now()}-${index}`,
            data: imageData,
            file: file
          });
          
          processedCount++;
          if (processedCount === totalFiles) {
            setUploadedImages(prev => [...prev, ...newImages]);
            
            if (newImages.length > 0) {
              toast({
                title: "Images Uploaded",
                description: `${newImages.length} image${newImages.length > 1 ? 's' : ''} ready for analysis.`,
              });
            }
          }
        };
        reader.readAsDataURL(file);
      } else {
        processedCount++;
        if (processedCount === totalFiles && newImages.length > 0) {
          setUploadedImages(prev => [...prev, ...newImages]);
        }
      }
    });

    // Reset file input
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const checkRateLimit = (): boolean => {
    const now = Date.now();
    if (now - lastMessageTime < RATE_LIMIT_DELAY) {
      const remainingTime = Math.ceil((RATE_LIMIT_DELAY - (now - lastMessageTime)) / 1000);
      toast({
        title: "Please wait",
        description: `Please wait ${remainingTime} seconds before sending another message.`,
        variant: "destructive"
      });
      return false;
    }
    return true;
  };

  const sendMessageWithRetry = async (messageText: string, imageData: string | null, retryCount = 0): Promise<string> => {
    try {
      console.log(`🔄 Sending message attempt ${retryCount + 1}`);
      console.log('📝 Message text:', messageText);
      console.log('🖼️ Has image:', !!imageData);
      
      const aiResponse = await TradingAIService.getGPTResponse(messageText, imageData);
      console.log('✅ Message sent successfully on attempt', retryCount + 1);
      
      const modelInfo = TradingAIService.getCurrentModelInfo();
      setCurrentModelInfo(modelInfo);
      
      return aiResponse;
    } catch (error) {
      console.error('❌ Error on attempt', retryCount + 1, ':', error);
      
      if (retryCount === 0 && error instanceof Error && error.message.includes('429')) {
        console.log(`⏳ Standard rate limit detected, retrying in ${RETRY_DELAY / 1000} seconds...`);
        setIsRetrying(true);
        
        toast({
          title: "Rate Limit Exceeded",
          description: "Too many requests. Retrying in 5 seconds...",
          variant: "destructive"
        });
        
        await new Promise(resolve => {
          setTimeout(resolve, RETRY_DELAY);
        });
        
        setIsRetrying(false);
        return sendMessageWithRetry(messageText, imageData, retryCount + 1);
      }
      
      if (error instanceof Error && error.message.includes('429')) {
        console.log('🚫 Final rate limit error after retry');
        throw new Error('Rate Limit Exceeded. Please try again later.');
      }
      
      console.log('💥 Non-retryable error or final error:', error);
      throw error;
    }
  };

  const handleSendMessage = async () => {
    console.log('🚀 handleSendMessage called');
    
    if ((!inputMessage.trim() && uploadedImages.length === 0) || isLoading || isRetrying) {
      console.log('🛑 Message send blocked - missing content or already processing');
      return;
    }

    if (!isApiKeyValid) {
      console.log('🛑 Message send blocked - invalid API key');
      toast({
        title: "API Key Required",
        description: "Please enter a valid OpenAI API key to use StrategyAI.",
        variant: "destructive"
      });
      setShowApiKeyPrompt(true);
      return;
    }

    if (!checkRateLimit()) {
      console.log('🛑 Message send blocked - rate limit');
      return;
    }

    setLastMessageTime(Date.now());
    setIsLoading(true);

    const messageText = inputMessage || 'Please analyze these charts.';
    const imagesToProcess = [...uploadedImages];
    
    setInputMessage('');
    setUploadedImages([]);

    try {
      if (imagesToProcess.length === 0) {
        // Handle text-only message
        const userMessage: ChatMessage = {
          id: Date.now().toString(),
          type: 'user',
          content: messageText,
          timestamp: new Date()
        };
        
        addMessage(userMessage);
        
        const aiResponse = await sendMessageWithRetry(messageText, null);
        
        const assistantMsg: ChatMessage = {
          id: (Date.now() + 1).toString(),
          type: 'assistant',
          content: aiResponse,
          timestamp: new Date()
        };
        
        addMessage(assistantMsg);
      } else {
        // Process multiple images sequentially
        for (let i = 0; i < imagesToProcess.length; i++) {
          setProcessingImageIndex(i);
          const image = imagesToProcess[i];
          
          const userMessage: ChatMessage = {
            id: `${Date.now()}-${i}`,
            type: 'user',
            content: imagesToProcess.length > 1 ? `${messageText} (Image ${i + 1}/${imagesToProcess.length})` : messageText,
            image: image.data,
            timestamp: new Date()
          };
          
          addMessage(userMessage);
          
          try {
            const aiResponse = await sendMessageWithRetry(
              imagesToProcess.length > 1 ? `${messageText} (Analyzing image ${i + 1} of ${imagesToProcess.length})` : messageText,
              image.data
            );
            
            const assistantMsg: ChatMessage = {
              id: `${Date.now()}-${i}-response`,
              type: 'assistant',
              content: aiResponse,
              timestamp: new Date()
            };
            
            addMessage(assistantMsg);
            
            // Add small delay between images to respect rate limits
            if (i < imagesToProcess.length - 1) {
              await new Promise(resolve => setTimeout(resolve, 1000));
            }
          } catch (error) {
            console.error(`💥 Error processing image ${i + 1}:`, error);
            const errorMsg: ChatMessage = {
              id: `${Date.now()}-${i}-error`,
              type: 'assistant',
              content: `Error processing image ${i + 1}: ${error instanceof Error ? error.message : 'Unknown error occurred'}`,
              timestamp: new Date()
            };
            addMessage(errorMsg);
          }
        }
      }
    } catch (error) {
      console.error('💥 Final error:', error);
      const errorMsg: ChatMessage = {
        id: (Date.now() + 1).toString(),
        type: 'assistant',
        content: error instanceof Error ? error.message : 'Connection Error\n\nSorry, I couldn\'t process your request right now. Please check your internet connection and try again.',
        timestamp: new Date()
      };
      addMessage(errorMsg);
    } finally {
      console.log('🏁 Message send complete, resetting states');
      setIsLoading(false);
      setIsRetrying(false);
      setProcessingImageIndex(null);
    }
  };

  const handleGenerateFullAnalysis = async () => {
    if (uploadedImages.length === 0) {
      toast({
        title: "No Images",
        description: "Please upload some charts first to generate a full analysis.",
        variant: "destructive"
      });
      return;
    }

    setIsGeneratingAnalysis(true);
    
    try {
      const analysisPrompt = `Please provide a comprehensive analysis covering all the uploaded charts. Include:
      
1. **Overall Market Sentiment**: What do these charts collectively tell us about market conditions?
2. **Key Patterns & Trends**: Identify the most significant patterns across all charts
3. **Support & Resistance Levels**: Highlight critical levels to watch
4. **Risk Assessment**: Overall risk factors and market outlook
5. **Trading Opportunities**: Potential entry/exit strategies based on the combined analysis
6. **Correlation Analysis**: How these different instruments might be related

Provide a unified perspective that synthesizes insights from all the charts together.`;

      const userMessage: ChatMessage = {
        id: Date.now().toString(),
        type: 'user',
        content: '🧠 Generate Full Analysis of All Charts',
        timestamp: new Date()
      };
      
      addMessage(userMessage);
      
      // Create a combined analysis using the first image as representative
      const aiResponse = await sendMessageWithRetry(analysisPrompt, uploadedImages[0].data);
      
      const assistantMsg: ChatMessage = {
        id: (Date.now() + 1).toString(),
        type: 'assistant',
        content: aiResponse,
        timestamp: new Date()
      };
      
      addMessage(assistantMsg);
      
      toast({
        title: "Analysis Complete",
        description: "Full market analysis has been generated based on your uploaded charts.",
      });
    } catch (error) {
      console.error('Error generating full analysis:', error);
      toast({
        title: "Analysis Failed",
        description: "Could not generate the full analysis. Please try again.",
        variant: "destructive"
      });
    } finally {
      setIsGeneratingAnalysis(false);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  const removeUploadedImage = (imageId: string) => {
    setUploadedImages(prev => prev.filter(img => img.id !== imageId));
  };

  const removeAllImages = () => {
    setUploadedImages([]);
    toast({
      title: "Images Cleared",
      description: "All uploaded images have been removed.",
    });
  };

  const handleLoadSession = (sessionId: string) => {
    const sessionMessages = loadSession(sessionId);
    if (sessionMessages) {
      setMessages(sessionMessages);
      toast({
        title: "Session Loaded",
        description: "Previous conversation has been restored.",
      });
    }
  };

  const formatTimestamp = (timestamp: Date) => {
    return timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };

  const isInputDisabled = isLoading || isRetrying || !isApiKeyValid || isValidatingKey;

  if (isLoadingHistory) {
    return (
      <div className="min-h-screen bg-tradeiq-navy flex items-center justify-center">
        <div className="flex items-center space-x-3">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-tradeiq-blue"></div>
          <span className="text-white">Loading conversation history...</span>
        </div>
      </div>
    );
  }

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
                <div className="flex items-center space-x-2">
                  <p className="text-xs text-gray-400 font-medium">
                    {isValidatingKey && 'Validating key...'}
                    {!isApiKeyValid && !isValidatingKey && 'API key required'}
                    {isApiKeyValid && !isValidatingKey && `Ready • ${currentModelInfo.model}`}
                  </p>
                  {isApiKeyValid && !currentModelInfo.isPrimary && (
                    <Button
                      onClick={resetToPrimaryModel}
                      size="sm"
                      variant="ghost"
                      className="text-xs text-yellow-400 hover:text-yellow-300 p-1 h-auto"
                      title="Reset to primary model"
                    >
                      <RefreshCw className="h-3 w-3" />
                    </Button>
                  )}
                </div>
              </div>
            </div>
            <div className="flex items-center space-x-2">
              <Button
                onClick={() => setShowSessionDrawer(true)}
                variant="ghost"
                size="sm"
                className="text-gray-400 hover:text-white hover:bg-gray-800/60 border border-gray-700/50"
                title="Chat history"
              >
                <Clock className="h-4 w-4 mr-1" />
                <span className="hidden sm:inline">History</span>
              </Button>
              <Button
                onClick={() => setShowPinnedModal(true)}
                variant="ghost"
                size="sm"
                className="text-gray-400 hover:text-white hover:bg-gray-800/60 border border-gray-700/50"
                title="Pinned messages"
              >
                <Pin className="h-4 w-4 mr-1" />
                <span className="hidden sm:inline">Pinned</span>
                {pinnedMessages.length > 0 && (
                  <span className="ml-1 text-xs bg-tradeiq-blue text-white rounded-full px-1.5 py-0.5">
                    {pinnedMessages.length}
                  </span>
                )}
              </Button>
              <Button
                onClick={handleClearChat}
                variant="ghost"
                size="sm"
                className="text-gray-400 hover:text-red-400 hover:bg-red-500/10 border border-gray-700/50"
                title="Clear chat history"
              >
                <Trash2 className="h-4 w-4 mr-1" />
                <span className="hidden sm:inline">Clear</span>
              </Button>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setShowApiKeyPrompt(true)}
                className="text-gray-400 hover:text-white hover:bg-tradeiq-blue/20 border border-tradeiq-blue/30"
              >
                <Key className="h-4 w-4 mr-1" />
                <span className="hidden sm:inline">API Key</span>
              </Button>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setShowApiKeyPrompt(true)}
                className="text-gray-400 hover:text-white hover:bg-gray-800/60"
              >
                <Settings className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </div>
      </header>

      {/* API Key Prompt Modal */}
      {showApiKeyPrompt && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <Card className="w-full max-w-md tradeiq-card">
            <CardHeader>
              <CardTitle className="text-white flex items-center space-x-2">
                <Key className="h-5 w-5 text-tradeiq-blue" />
                <span>OpenAI API Key Required</span>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <p className="text-gray-300 text-sm">
                To use StrategyAI, please enter your OpenAI API key. You can get one from the OpenAI platform.
              </p>
              {!currentModelInfo.isPrimary && (
                <div className="p-3 bg-yellow-500/10 border border-yellow-500/20 rounded-lg">
                  <p className="text-yellow-300 text-xs">
                    Currently using fallback model: {currentModelInfo.model}. This may be due to quota limits.
                  </p>
                </div>
              )}
              <Textarea
                value={tempApiKey}
                onChange={(e) => setTempApiKey(e.target.value)}
                placeholder="sk-..."
                className="bg-black/20 border-gray-700 text-white placeholder:text-gray-500"
                disabled={isValidatingKey}
              />
              <div className="flex space-x-2">
                <Button
                  onClick={handleApiKeySubmit}
                  className="tradeiq-button-primary flex-1"
                  disabled={!tempApiKey.trim() || isValidatingKey}
                >
                  {isValidatingKey ? 'Validating...' : 'Save API Key'}
                </Button>
                <Button
                  onClick={() => {
                    setShowApiKeyPrompt(false);
                    setTempApiKey('');
                  }}
                  variant="ghost"
                  className="text-gray-400"
                  disabled={isValidatingKey}
                >
                  Cancel
                </Button>
              </div>
              <div className="pt-2">
                <p className="text-xs text-gray-500">
                  Get your API key from:{' '}
                  <a 
                    href="https://platform.openai.com/api-keys" 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="text-tradeiq-blue hover:underline"
                  >
                    OpenAI Platform
                  </a>
                </p>
              </div>
            </CardContent>
          </Card>
        </div>
      )}

      {/* Chat Area - with much more bottom padding for elevated input */}
      <div className="flex-1 flex flex-col max-w-4xl mx-auto w-full px-4 py-6 pb-64">
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
                      <div className="flex items-center justify-between mb-2">
                        <div className="flex items-center space-x-2">
                          <div className="h-6 w-6 bg-gradient-to-br from-tradeiq-blue to-tradeiq-blue-light rounded-full flex items-center justify-center">
                            <span className="text-white font-bold text-xs">S</span>
                          </div>
                          <span className="text-sm font-medium text-gray-300">StrategyAI</span>
                        </div>
                        <Button
                          onClick={() => {
                            if (isMessagePinned(message.id)) {
                              unpinMessage(message.id);
                            } else {
                              pinMessage(message);
                            }
                          }}
                          variant="ghost"
                          size="sm"
                          className={`h-6 w-6 p-0 ${
                            isMessagePinned(message.id) 
                              ? 'text-yellow-400 hover:text-yellow-300' 
                              : 'text-gray-400 hover:text-yellow-400'
                          }`}
                          title={isMessagePinned(message.id) ? 'Unpin message' : 'Pin message'}
                        >
                          <Pin className="h-3 w-3" />
                        </Button>
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
                      {message.type === 'assistant' ? (
                        <CollapsibleMessage content={message.content} />
                      ) : (
                        message.content
                      )}
                    </div>
                    
                    <p className="text-xs opacity-70 mt-2">
                      {formatTimestamp(message.timestamp)}
                    </p>
                  </div>
                </div>
              ))}
              
              {(isLoading || isRetrying) && (
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
                      <span className="text-sm">
                        {isRetrying ? 'Retrying request...' : 
                         processingImageIndex !== null ? `Analyzing image ${processingImageIndex + 1}...` :
                         `Analyzing with ${currentModelInfo.model}...`}
                      </span>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </ScrollArea>
        </Card>
      </div>

      {/* Fixed ChatGPT-Style Input Area */}
      <div className="fixed bottom-0 left-0 right-0 bg-tradeiq-navy/95 backdrop-blur-sm border-t border-gray-800/50 pb-safe">
        <div className="max-w-4xl mx-auto p-6 pb-12">
          {/* Multiple Images Preview */}
          {uploadedImages.length > 0 && (
            <div className="mb-6 p-4 bg-black/20 rounded-xl border border-gray-700">
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center space-x-2">
                  <span className="text-sm text-gray-300 font-medium">
                    {uploadedImages.length} image{uploadedImages.length > 1 ? 's' : ''} ready for analysis
                  </span>
                  {processingImageIndex !== null && (
                    <span className="text-xs text-tradeiq-blue">
                      Processing {processingImageIndex + 1}/{uploadedImages.length}
                    </span>
                  )}
                </div>
                <div className="flex items-center space-x-2">
                  {uploadedImages.length > 1 && (
                    <Button
                      onClick={handleGenerateFullAnalysis}
                      size="sm"
                      variant="ghost"
                      className="text-tradeiq-blue hover:text-tradeiq-blue-light text-xs"
                      disabled={isInputDisabled || isGeneratingAnalysis}
                    >
                      <Brain className="h-3 w-3 mr-1" />
                      {isGeneratingAnalysis ? 'Generating...' : 'Full Analysis'}
                    </Button>
                  )}
                  <Button
                    onClick={removeAllImages}
                    size="sm"
                    variant="ghost"
                    className="text-red-400 hover:text-red-300 text-xs"
                    disabled={isInputDisabled}
                  >
                    Clear All
                  </Button>
                </div>
              </div>
              
              <div className="flex space-x-3 overflow-x-auto pb-2">
                {uploadedImages.map((image, index) => (
                  <div 
                    key={image.id} 
                    className={`relative flex-shrink-0 ${processingImageIndex === index ? 'ring-2 ring-tradeiq-blue' : ''}`}
                  >
                    <img 
                      src={image.data} 
                      alt={`Chart ${index + 1}`} 
                      className="h-20 w-24 object-cover rounded-lg border border-gray-600"
                    />
                    <Button
                      onClick={() => removeUploadedImage(image.id)}
                      size="sm"
                      variant="ghost"
                      className="absolute -top-2 -right-2 h-6 w-6 p-0 bg-red-500 hover:bg-red-600 text-white rounded-full"
                      disabled={isInputDisabled}
                    >
                      <X className="h-3 w-3" />
                    </Button>
                    {processingImageIndex === index && (
                      <div className="absolute inset-0 bg-tradeiq-blue/20 rounded-lg flex items-center justify-center">
                        <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-tradeiq-blue"></div>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}
          
          {/* Input Container */}
          <div className={`relative bg-white/5 rounded-2xl border border-gray-700/50 shadow-lg backdrop-blur-sm mb-6 ${isInputDisabled ? 'opacity-50' : ''}`}>
            <div className="flex items-end p-3">
              {/* Image Upload Button */}
              <Button
                onClick={() => fileInputRef.current?.click()}
                variant="ghost"
                size="sm"
                className="text-gray-400 hover:text-gray-300 h-10 w-10 p-0 shrink-0"
                disabled={isInputDisabled}
              >
                <Camera className="h-5 w-5" />
              </Button>
              
              {/* Text Input */}
              <div className="flex-1 mx-3">
                <Textarea
                  ref={textareaRef}
                  value={inputMessage}
                  onChange={(e) => setInputMessage(e.target.value)}
                  onKeyDown={handleKeyPress}
                  placeholder={
                    !isApiKeyValid 
                      ? "Please enter your OpenAI API key to start chatting..."
                      : uploadedImages.length > 0
                        ? "Optional: Add context or press Enter..." 
                        : "Ask about trading strategies, upload charts, or get market analysis..."
                  }
                  className="min-h-[40px] max-h-24 resize-none bg-transparent border-0 text-white placeholder:text-gray-500 focus:ring-0 focus:ring-offset-0 p-2"
                  disabled={isInputDisabled}
                  rows={1}
                />
              </div>
              
              {/* Send Button */}
              <Button
                onClick={handleSendMessage}
                disabled={(!inputMessage.trim() && uploadedImages.length === 0) || isInputDisabled}
                size="sm"
                className="h-10 w-10 p-0 bg-tradeiq-blue hover:bg-tradeiq-blue-light disabled:opacity-50 shrink-0"
              >
                <Send className="h-4 w-4" />
              </Button>
            </div>
          </div>
          
          {/* Helper Text */}
          <p className="text-xs text-gray-500 text-center">
            {!isApiKeyValid 
              ? 'Enter a valid OpenAI API key to start using StrategyAI'
              : isValidatingKey
                ? 'Validating your API key...'
                : isRetrying 
                  ? 'Retrying due to rate limit...' 
                  : `Press Enter to send • Using ${currentModelInfo.model} • Upload multiple charts for AI analysis`
            }
            {!currentModelInfo.isPrimary && isApiKeyValid && (
              <span className="text-yellow-400"> • Fallback model active</span>
            )}
          </p>
        </div>
      </div>
      
      {/* Hidden File Input - Modified to accept multiple files */}
      <input
        ref={fileInputRef}
        type="file"
        accept="image/jpeg,image/png,image/webp,image/jpg"
        multiple
        onChange={handleImageUpload}
        className="hidden"
      />

      {/* Modals */}
      <PinnedMessagesModal
        isOpen={showPinnedModal}
        onClose={() => setShowPinnedModal(false)}
        pinnedMessages={pinnedMessages}
        onUnpin={unpinMessage}
        onClearAll={clearPinnedMessages}
      />

      <SessionHistoryDrawer
        isOpen={showSessionDrawer}
        onClose={() => setShowSessionDrawer(false)}
        sessions={sessions}
        onLoadSession={handleLoadSession}
        onDeleteSession={deleteSession}
        onClearHistory={clearSessionHistory}
      />
    </div>
  );
};

export default TradingChat;
