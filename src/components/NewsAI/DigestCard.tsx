
import { Clock, TrendingUp, ExternalLink } from "lucide-react";
import { Card, CardHeader } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { DigestArticle } from "@/hooks/useNewsDigest";

interface DigestCardProps {
  article: DigestArticle;
  onViewAnalysis: (article: DigestArticle) => void;
}

export const DigestCard = ({ article, onViewAnalysis }: DigestCardProps) => {
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

  const getSentimentColor = (sentiment: string) => {
    switch (sentiment) {
      case "Bullish": return "text-green-400 bg-green-500/20 border-green-500/30";
      case "Bearish": return "text-red-400 bg-red-500/20 border-red-500/30";
      default: return "text-gray-400 bg-gray-500/20 border-gray-500/30";
    }
  };

  return (
    <Card className="tradeiq-card hover:border-tradeiq-blue/50 transition-all duration-200">
      <CardHeader className="pb-4">
        <div className="space-y-4">
          {/* Header with match reason */}
          <div className="flex items-center justify-between">
            <Badge 
              variant="outline" 
              className="text-xs text-tradeiq-blue border-tradeiq-blue/30 bg-tradeiq-blue/10"
            >
              Matched: {article.matchReason}
            </Badge>
            <div className="flex items-center space-x-1 text-xs text-gray-400">
              <Clock className="h-3 w-3" />
              <span>{formatTimeAgo(article.datetime)}</span>
            </div>
          </div>

          {/* Headline and source */}
          <div>
            <h3 className="text-white text-lg leading-tight mb-2 font-semibold">
              {article.headline}
            </h3>
            <div className="flex items-center space-x-3 text-sm text-gray-400 mb-3">
              <span className="font-medium">{article.source}</span>
              {article.relatedSymbols?.map(symbol => (
                <Badge key={symbol} variant="outline" className="text-xs text-gray-400 border-gray-600/50">
                  {symbol}
                </Badge>
              ))}
            </div>
          </div>

          {/* AI Sentiment */}
          <div className="flex items-center space-x-3">
            <span className="text-sm text-gray-300 font-medium">AI Sentiment:</span>
            <Badge className={`${getSentimentColor(article.aiSentiment)} font-medium px-2 py-1`}>
              <TrendingUp className="h-3 w-3 mr-1" />
              {article.aiSentiment}
            </Badge>
          </div>

          {/* Trading Implication */}
          <div className="bg-black/20 p-3 rounded-xl">
            <h4 className="text-sm font-medium text-white mb-1">Trading Implication</h4>
            <p className="text-sm text-gray-300 leading-relaxed">
              {article.tradingImplication}
            </p>
          </div>

          {/* Actions */}
          <div className="flex space-x-3 pt-2">
            <Button
              onClick={() => onViewAnalysis(article)}
              className="flex-1 bg-tradeiq-blue hover:bg-tradeiq-blue/80 text-white"
            >
              View Full Analysis
            </Button>
            <Button
              variant="outline"
              size="icon"
              className="border-gray-700 hover:bg-gray-800 text-gray-300"
              onClick={() => window.open(article.url, '_blank')}
            >
              <ExternalLink className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </CardHeader>
    </Card>
  );
};
