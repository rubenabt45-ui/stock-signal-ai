
import { ExternalLink } from "lucide-react";
import { Button } from "@/components/ui/button";

interface SourceButtonProps {
  url: string;
  className?: string;
}

export const SourceButton = ({ url, className = "" }: SourceButtonProps) => {
  const handleViewSource = () => {
    if (url && url.startsWith('http')) {
      window.open(url, '_blank', 'noopener,noreferrer');
    } else {
      alert('Original article not available.');
    }
  };

  return (
    <Button
      data-testid="source-button"
      onClick={handleViewSource}
      className={`tradeiq-button-primary ${className}`}
    >
      <ExternalLink className="h-4 w-4 mr-2" />
      View Source
    </Button>
  );
};
