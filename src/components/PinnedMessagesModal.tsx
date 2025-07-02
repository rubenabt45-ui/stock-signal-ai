
import React from 'react';
import { X, Pin, Trash2 } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ScrollArea } from '@/components/ui/scroll-area';
import { ChatMessage } from '@/hooks/useConversationHistory';

interface PinnedMessage extends ChatMessage {
  pinnedAt: Date;
}

interface PinnedMessagesModalProps {
  isOpen: boolean;
  onClose: () => void;
  pinnedMessages: PinnedMessage[];
  onUnpin: (messageId: string) => void;
  onClearAll: () => void;
}

const PinnedMessagesModal: React.FC<PinnedMessagesModalProps> = ({
  isOpen,
  onClose,
  pinnedMessages,
  onUnpin,
  onClearAll
}) => {
  if (!isOpen) return null;

  const renderMessage = (content: string) => {
    return content
      .split('\n')
      .map((line, index) => {
        if (line.startsWith('# ')) {
          return <h1 key={index} className="text-lg font-bold mb-2">{line.slice(2)}</h1>;
        }
        if (line.startsWith('## ')) {
          return <h2 key={index} className="text-base font-semibold mb-2">{line.slice(3)}</h2>;
        }
        if (line.startsWith('**') && line.endsWith('**')) {
          return <p key={index} className="font-semibold mb-1">{line.slice(2, -2)}</p>;
        }
        if (line.startsWith('• ') || line.startsWith('- ')) {
          return <p key={index} className="mb-1 ml-2">{line}</p>;
        }
        if (line.trim() === '') {
          return <br key={index} />;
        }
        return <p key={index} className="mb-1">{line}</p>;
      });
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <Card className="w-full max-w-4xl max-h-[90vh] tradeiq-card">
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className="text-white flex items-center space-x-2">
              <Pin className="h-5 w-5 text-tradeiq-blue" />
              <span>Pinned Messages ({pinnedMessages.length})</span>
            </CardTitle>
            <div className="flex items-center space-x-2">
              {pinnedMessages.length > 0 && (
                <Button
                  onClick={onClearAll}
                  variant="ghost"
                  size="sm"
                  className="text-red-400 hover:text-red-300"
                >
                  <Trash2 className="h-4 w-4 mr-1" />
                  Clear All
                </Button>
              )}
              <Button
                onClick={onClose}
                variant="ghost"
                size="sm"
                className="text-gray-400 hover:text-white"
              >
                <X className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </CardHeader>
        <CardContent className="p-0">
          <ScrollArea className="h-[60vh] p-6">
            {pinnedMessages.length === 0 ? (
              <div className="text-center text-gray-400 py-12">
                <Pin className="h-12 w-12 mx-auto mb-4 opacity-50" />
                <p>No pinned messages yet</p>
                <p className="text-sm mt-2">Pin important AI responses to save them here</p>
              </div>
            ) : (
              <div className="space-y-6">
                {pinnedMessages.map((message) => (
                  <div key={message.id} className="border border-gray-700 rounded-lg p-4">
                    <div className="flex items-start justify-between mb-3">
                      <div className="flex items-center space-x-2">
                        <div className="h-6 w-6 bg-gradient-to-br from-tradeiq-blue to-tradeiq-blue-light rounded-full flex items-center justify-center">
                          <span className="text-white font-bold text-xs">S</span>
                        </div>
                        <span className="text-sm font-medium text-gray-300">StrategyAI</span>
                      </div>
                      <Button
                        onClick={() => onUnpin(message.id)}
                        variant="ghost"
                        size="sm"
                        className="text-gray-400 hover:text-red-400 h-8 w-8 p-0"
                      >
                        <X className="h-4 w-4" />
                      </Button>
                    </div>
                    
                    {message.image && (
                      <div className="mb-3">
                        <img 
                          src={message.image} 
                          alt="Chart screenshot" 
                          className="max-w-full h-auto rounded-lg border border-gray-700"
                          style={{ maxWidth: '200px' }}
                        />
                      </div>
                    )}
                    
                    <div className="text-sm leading-relaxed text-gray-200 mb-3">
                      {renderMessage(message.content)}
                    </div>
                    
                    <div className="flex items-center justify-between text-xs text-gray-500">
                      <span>Pinned on {message.pinnedAt.toLocaleDateString()}</span>
                      <span>{message.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </ScrollArea>
        </CardContent>
      </Card>
    </div>
  );
};

export default PinnedMessagesModal;
