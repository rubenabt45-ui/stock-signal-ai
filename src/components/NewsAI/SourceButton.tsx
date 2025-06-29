
import { ExternalLink } from "lucide-react";
import { Button } from "@/components/ui/button";

interface SourceButtonProps {
  url: string;
  className?: string;
}

export const SourceButton = ({ url, className = "" }: SourceButtonProps) => {
  const handleViewSource = () => {
    // Check if URL is valid and not a placeholder
    if (url && url.startsWith('http') && !url.includes('example.com')) {
      window.open(url, '_blank', 'noopener,noreferrer');
    } else {
      // For demo/mock articles, show a message
      alert('This is a demo article. In production, this would open the original news source.');
    }
  };

  const isValidUrl = url && url.startsWith('http') && !url.includes('example.com');

  return (
    <Button
      data-testid="source-button"
      onClick={handleViewSource}
      className={`tradeiq-button-primary ${className}`}
      variant={isValidUrl ? "default" : "outline"}
    >
      <ExternalLink className="h-4 w-4 mr-2" />
      {isValidUrl ? 'Read Full Article' : 'View Source (Demo)'}
    </Button>
  );
};
