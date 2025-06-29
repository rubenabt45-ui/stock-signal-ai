
import { ExternalLink } from "lucide-react";
import { Button } from "@/components/ui/button";

interface SourceButtonProps {
  url: string;
  className?: string;
}

export const SourceButton = ({ url, className = "" }: SourceButtonProps) => {
  const handleViewSource = () => {
    // Check if URL is valid and accessible
    if (url && isValidUrl(url)) {
      window.open(url, '_blank', 'noopener,noreferrer');
    } else {
      console.warn('Invalid or missing article URL:', url);
    }
  };

  const isValidUrl = (urlString: string): boolean => {
    try {
      const urlObj = new URL(urlString);
      return urlObj.protocol === 'http:' || urlObj.protocol === 'https:';
    } catch {
      return false;
    }
  };

  const hasValidUrl = url && isValidUrl(url);

  return (
    <Button
      data-testid="source-button"
      onClick={handleViewSource}
      className={`tradeiq-button-primary ${className}`}
      variant={hasValidUrl ? "default" : "outline"}
      disabled={!hasValidUrl}
    >
      <ExternalLink className="h-4 w-4 mr-2" />
      {hasValidUrl ? 'Read Full Article' : 'Source Unavailable'}
    </Button>
  );
};
