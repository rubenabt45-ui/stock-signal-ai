
import React, { useState } from 'react';
import { ChevronDown, ChevronUp } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface CollapsibleMessageProps {
  content: string;
  maxLines?: number;
}

const CollapsibleMessage: React.FC<CollapsibleMessageProps> = ({ 
  content, 
  maxLines = 10 
}) => {
  const [isExpanded, setIsExpanded] = useState(false);
  
  const lines = content.split('\n');
  const shouldCollapse = lines.length > maxLines;
  const displayContent = shouldCollapse && !isExpanded 
    ? lines.slice(0, maxLines).join('\n') 
    : content;

  const renderMessage = (text: string) => {
    return text
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
    <div>
      <div className="text-sm leading-relaxed text-gray-200">
        {renderMessage(displayContent)}
      </div>
      
      {shouldCollapse && (
        <div className="mt-3 pt-2 border-t border-gray-700/50">
          <Button
            onClick={() => setIsExpanded(!isExpanded)}
            variant="ghost"
            size="sm"
            className="text-tradeiq-blue hover:text-tradeiq-blue-light text-xs"
          >
            {isExpanded ? (
              <>
                <ChevronUp className="h-3 w-3 mr-1" />
                Show Less
              </>
            ) : (
              <>
                <ChevronDown className="h-3 w-3 mr-1" />
                Show More ({lines.length - maxLines} more lines)
              </>
            )}
          </Button>
        </div>
      )}
    </div>
  );
};

export default CollapsibleMessage;
