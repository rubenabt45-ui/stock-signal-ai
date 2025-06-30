
import { ExternalLink } from "lucide-react";
import { Button } from "@/components/ui/button";

interface SourceButtonProps {
  url: string;
  className?: string;
}

export const SourceButton = ({ url, className = "" }: SourceButtonProps) => {
  const handleViewSource = (e: React.MouseEvent) => {
    e.stopPropagation(); // Prevent triggering parent click events
    
    if (url && isValidUrl(url)) {
      window.open(url, '_blank', 'noopener,noreferrer');
    } else {
      console.warn('Invalid or missing article URL:', url);
    }
  };

  const isValidUrl = (urlString: string): boolean => {
    if (!urlString || urlString.trim() === '') return false;
    
    try {
      const urlObj = new URL(urlString);
      return urlObj.protocol === 'http:' || urlObj.protocol === 'https:';
    } catch {
      return false;
    }
  };

  const hasValidUrl = url && isValidUrl(url);

  // Don't render the button if there's no valid URL
  if (!hasValidUrl) {
    return (
      <div className={`text-xs text-gray-500 ${className}`}>
        Link unavailable
      </div>
    );
  }

  return (
    <Button
      data-testid="source-button"
      onClick={handleViewSource}
      className={`tradeiq-button-primary ${className}`}
      variant="default"
      size="sm"
    >
      <ExternalLink className="h-4 w-4 mr-2" />
      Read Full Article
    </Button>
  );
};
