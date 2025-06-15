
import { Clock, ChevronRight } from "lucide-react";
import { Card, CardHeader } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { NewsArticle } from "@/services/newsService";

interface NewsCardProps {
  article: NewsArticle;
  onClick: (article: NewsArticle) => void;
}

export const NewsCard = ({ article, onClick }: NewsCardProps) => {
  const formatTimeAgo = (timestamp: number) => {
    const now = Date.now();
    const diff = now - timestamp;
    const minutes = Math.floor(diff / (1000 * 60));
    const hours = Math.floor(minutes / 60);
    const days = Math.floor(hours / 24);
    
    if (days > 0) return `${days}d ago`;
    if (hours > 0) return `${hours}h ago`;
    if (minutes > 0) return `${minutes}m ago`;
    return "Just now";
  };

  return (
    <Card 
      data-testid="news-card"
      className="tradeiq-card hover:border-tradeiq-blue/50 transition-all duration-200 cursor-pointer hover-scale"
      onClick={() => onClick(article)}
    >
      <CardHeader className="pb-4">
        <div className="flex items-start justify-between">
          <div className="flex-1 min-w-0">
            <h3 className="text-white text-lg leading-tight mb-3 pr-4 font-semibold">
              {article.headline}
            </h3>
            <div className="flex items-center space-x-4 text-sm text-gray-400 mb-2">
              <span className="font-medium">{article.source}</span>
              <div className="flex items-center space-x-1">
                <Clock className="h-3 w-3" />
                <span>{formatTimeAgo(article.datetime)}</span>
              </div>
            </div>
            <div className="flex items-center space-x-2">
              {article.relatedSymbols?.map(symbol => (
                <Badge key={symbol} variant="outline" className="text-xs text-tradeiq-blue border-tradeiq-blue/30">
                  {symbol}
                </Badge>
              ))}
              {article.category && (
                <Badge variant="outline" className="text-xs text-gray-400 border-gray-600/50">
                  {article.category}
                </Badge>
              )}
            </div>
          </div>
          <ChevronRight className="h-5 w-5 text-gray-400 flex-shrink-0" />
        </div>
      </CardHeader>
    </Card>
  );
};
