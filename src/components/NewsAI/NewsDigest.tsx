
import { useState } from "react";
import { Calendar, Clock, TrendingUp, AlertCircle } from "lucide-react";
import { Card, CardHeader } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useNewsDigest, DigestArticle } from "@/hooks/useNewsDigest";
import { DigestCard } from "./DigestCard";

interface NewsDigestProps {
  onArticleSelect: (article: DigestArticle) => void;
}

export const NewsDigest = ({ onArticleSelect }: NewsDigestProps) => {
  const [digestMode, setDigestMode] = useState<'daily' | 'weekly'>('daily');
  const { digestArticles, groupedArticles, loading, hasSettings } = useNewsDigest(digestMode);

  if (loading) {
    return (
      <div className="space-y-4">
        {[...Array(3)].map((_, i) => (
          <Card key={i} className="tradeiq-card animate-pulse">
            <CardHeader className="pb-4">
              <div className="h-4 bg-gray-700 rounded w-3/4 mb-2"></div>
              <div className="h-3 bg-gray-800 rounded w-1/2 mb-2"></div>
              <div className="h-16 bg-gray-800 rounded"></div>
            </CardHeader>
          </Card>
        ))}
      </div>
    );
  }

  if (!hasSettings) {
    return (
      <Card className="tradeiq-card">
        <CardHeader className="text-center py-8">
          <AlertCircle className="h-12 w-12 mx-auto mb-4 text-gray-500" />
          <h3 className="text-lg font-semibold text-white mb-2">No Alert Preferences Set</h3>
          <p className="text-gray-400 mb-4">
            Set up your news alert preferences in Settings to receive personalized digests.
          </p>
          <Button 
            variant="outline" 
            className="border-gray-700 hover:bg-gray-800 text-gray-300"
            onClick={() => window.location.href = '/settings'}
          >
            Configure Alerts
          </Button>
        </CardHeader>
      </Card>
    );
  }

  if (digestArticles.length === 0) {
    return (
      <Card className="tradeiq-card">
        <CardHeader className="text-center py-8">
          <Calendar className="h-12 w-12 mx-auto mb-4 text-gray-500" />
          <h3 className="text-lg font-semibold text-white mb-2">No News Matches Your Alerts</h3>
          <p className="text-gray-400">
            No articles found matching your alert preferences for the selected time period.
          </p>
        </CardHeader>
      </Card>
    );
  }

  const renderDailyDigest = () => (
    <div className="space-y-4">
      {digestArticles.map((article) => (
        <DigestCard
          key={article.id}
          article={article}
          onViewAnalysis={onArticleSelect}
        />
      ))}
    </div>
  );

  const renderWeeklyDigest = () => (
    <div className="space-y-6">
      {Object.entries(groupedArticles).map(([category, articles]) => (
        <div key={category} className="space-y-4">
          <div className="flex items-center space-x-3">
            <h3 className="text-lg font-semibold text-white capitalize">
              {category === 'market' ? 'Market News' : category}
            </h3>
            <Badge variant="outline" className="text-xs text-gray-400 border-gray-600/50">
              {articles.length} article{articles.length !== 1 ? 's' : ''}
            </Badge>
          </div>
          <div className="space-y-4">
            {articles.map((article) => (
              <DigestCard
                key={article.id}
                article={article}
                onViewAnalysis={onArticleSelect}
              />
            ))}
          </div>
        </div>
      ))}
    </div>
  );

  return (
    <div className="space-y-6">
      {/* Digest Controls */}
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-3">
          <div className="flex items-center space-x-2">
            {digestMode === 'daily' ? (
              <Clock className="h-5 w-5 text-tradeiq-blue" />
            ) : (
              <Calendar className="h-5 w-5 text-tradeiq-blue" />
            )}
            <h2 className="text-xl font-semibold text-white">
              {digestMode === 'daily' ? 'Daily' : 'Weekly'} Digest
            </h2>
          </div>
          <Badge variant="outline" className="text-xs text-gray-400 border-gray-600/50">
            {digestArticles.length} alerts
          </Badge>
        </div>

        <Select value={digestMode} onValueChange={(value: 'daily' | 'weekly') => setDigestMode(value)}>
          <SelectTrigger className="w-48 bg-black/20 border-gray-700 text-white">
            <SelectValue />
          </SelectTrigger>
          <SelectContent className="bg-tradeiq-navy border-gray-700">
            <SelectItem value="daily" className="text-white hover:bg-gray-800">
              <div className="flex items-center space-x-2">
                <Clock className="h-4 w-4" />
                <span>Daily Summary</span>
              </div>
            </SelectItem>
            <SelectItem value="weekly" className="text-white hover:bg-gray-800">
              <div className="flex items-center space-x-2">
                <Calendar className="h-4 w-4" />
                <span>Weekly Summary</span>
              </div>
            </SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Digest Content */}
      {digestMode === 'daily' ? renderDailyDigest() : renderWeeklyDigest()}
    </div>
  );
};
