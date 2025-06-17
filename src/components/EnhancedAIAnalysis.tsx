
import { useState, useEffect } from 'react';
import { Brain, TrendingUp, TrendingDown, Minus } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { useMarketData } from '@/hooks/useMarketData';
import { calculateTechnicalIndicators, generateTechnicalAnalysis } from '@/services/technicalAnalysisService';

interface EnhancedAIAnalysisProps {
  symbol: string;
  stockData?: {
    price: number;
    change: number;
  };
}

export const EnhancedAIAnalysis = ({ symbol, stockData }: EnhancedAIAnalysisProps) => {
  const { price, change, isLoading, error } = useMarketData(symbol);
  const [analysis, setAnalysis] = useState<any>(null);
  const [analysisLoading, setAnalysisLoading] = useState(true);

  useEffect(() => {
    const generateAnalysis = async () => {
      if (!symbol) return;
      
      setAnalysisLoading(true);
      
      try {
        // Use either provided stockData or fetched market data
        const currentPrice = stockData?.price || price || 0;
        const currentChange = stockData?.change || change || 0;
        
        if (currentPrice === 0) {
          setAnalysisLoading(false);
          return;
        }
        
        // Generate mock historical data for technical analysis
        // In production, this would come from a real data source
        const priceHistory = generateMockPriceHistory(currentPrice, 30);
        const volumeHistory = generateMockVolumeHistory(30);
        
        // Calculate technical indicators
        const indicators = calculateTechnicalIndicators(currentPrice, priceHistory, volumeHistory);
        
        // Generate professional analysis
        const technicalAnalysis = generateTechnicalAnalysis(symbol, currentPrice, currentChange, indicators);
        
        setAnalysis({
          ...technicalAnalysis,
          indicators,
          timestamp: Date.now()
        });
        
      } catch (err) {
        console.error('Analysis generation error:', err);
        setAnalysis({
          summary: `Unable to generate analysis for ${symbol} at this time.`,
          technicalOverview: 'Technical data temporarily unavailable.',
          tradingInsight: 'Please try again in a few moments.',
          confidence: 0.1
        });
      } finally {
        setAnalysisLoading(false);
      }
    };

    generateAnalysis();
  }, [symbol, price, change, stockData]);

  // Generate realistic mock data for demonstration
  const generateMockPriceHistory = (currentPrice: number, days: number): number[] => {
    const history = [];
    let price = currentPrice * 0.95; // Start slightly lower
    
    for (let i = 0; i < days; i++) {
      const volatility = (Math.random() - 0.5) * 0.04; // ±2% daily volatility
      price *= (1 + volatility);
      history.push(price);
    }
    
    return history;
  };

  const generateMockVolumeHistory = (days: number): number[] => {
    const baseVolume = 1000000;
    return Array.from({ length: days }, () => 
      baseVolume * (0.5 + Math.random() * 1.5) // 50% to 200% of base volume
    );
  };

  const getTrendIcon = (trend: string) => {
    switch (trend) {
      case 'bullish':
        return <TrendingUp className="h-4 w-4 text-green-500" />;
      case 'bearish':
        return <TrendingDown className="h-4 w-4 text-red-500" />;
      default:
        return <Minus className="h-4 w-4 text-gray-500" />;
    }
  };

  const getConfidenceColor = (confidence: number) => {
    if (confidence >= 0.8) return 'bg-green-500/10 text-green-400 border-green-500/20';
    if (confidence >= 0.6) return 'bg-blue-500/10 text-blue-400 border-blue-500/20';
    if (confidence >= 0.4) return 'bg-yellow-500/10 text-yellow-400 border-yellow-500/20';
    return 'bg-red-500/10 text-red-400 border-red-500/20';
  };

  if (isLoading || analysisLoading) {
    return (
      <Card className="tradeiq-card">
        <CardContent className="p-6">
          <div className="flex items-center space-x-3 mb-4">
            <Brain className="h-5 w-5 text-purple-400" />
            <h3 className="text-lg font-semibold text-white">AI Technical Analysis</h3>
          </div>
          <div className="space-y-4">
            <div className="animate-pulse space-y-3">
              <div className="h-4 bg-gray-700 rounded w-3/4"></div>
              <div className="h-4 bg-gray-700 rounded w-full"></div>
              <div className="h-4 bg-gray-700 rounded w-2/3"></div>
            </div>
          </div>
        </CardContent>
      </Card>
    );
  }

  if (error || !analysis) {
    return (
      <Card className="tradeiq-card">
        <CardContent className="p-6">
          <div className="flex items-center space-x-3 mb-4">
            <Brain className="h-5 w-5 text-purple-400" />
            <h3 className="text-lg font-semibold text-white">AI Technical Analysis</h3>
          </div>
          <p className="text-gray-400">
            Technical analysis unavailable for {symbol}. Please try again later.
          </p>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="tradeiq-card">
      <CardContent className="p-6">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center space-x-3">
            <Brain className="h-5 w-5 text-purple-400" />
            <h3 className="text-lg font-semibold text-white">AI Technical Analysis</h3>
          </div>
          <div className="flex items-center space-x-2">
            {analysis.indicators && getTrendIcon(analysis.indicators.trend)}
            <Badge className={`text-xs ${getConfidenceColor(analysis.confidence)}`}>
              {Math.round(analysis.confidence * 100)}% confidence
            </Badge>
          </div>
        </div>

        <div className="space-y-6">
          {/* Asset Summary */}
          <div>
            <h4 className="text-sm font-medium text-gray-300 mb-2">Market Summary</h4>
            <p className="text-white leading-relaxed">{analysis.summary}</p>
          </div>

          {/* Technical Overview */}
          <div>
            <h4 className="text-sm font-medium text-gray-300 mb-2">Technical Overview</h4>
            <p className="text-white leading-relaxed">{analysis.technicalOverview}</p>
          </div>

          {/* Trading Insight */}
          <div>
            <h4 className="text-sm font-medium text-gray-300 mb-2">Trading Insight</h4>
            <p className="text-white leading-relaxed">{analysis.tradingInsight}</p>
          </div>

          {/* Technical Indicators Summary */}
          {analysis.indicators && (
            <div className="grid grid-cols-2 gap-4 pt-4 border-t border-gray-700/50">
              <div className="text-center">
                <p className="text-xs text-gray-400 mb-1">RSI</p>
                <p className="text-lg font-semibold text-white">{analysis.indicators.rsi.toFixed(0)}</p>
              </div>
              <div className="text-center">
                <p className="text-xs text-gray-400 mb-1">Trend</p>
                <div className="flex items-center justify-center space-x-1">
                  {getTrendIcon(analysis.indicators.trend)}
                  <span className="text-sm font-medium text-white capitalize">
                    {analysis.indicators.trend}
                  </span>
                </div>
              </div>
            </div>
          )}

          {/* Disclaimer */}
          <div className="pt-4 border-t border-gray-700/50">
            <p className="text-xs text-gray-500">
              This analysis is for educational purposes only and should not be considered financial advice. 
              Always conduct your own research before making investment decisions.
            </p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};
