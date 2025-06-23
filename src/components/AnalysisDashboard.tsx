
import { useState, useEffect } from "react";
import { ArrowLeft, Brain, BarChart3 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { OptimizedTradingViewWidget } from "@/components/OptimizedTradingViewWidget";
import { TechnicalIndicators } from "@/components/TechnicalIndicators";
import { AIAnalysis } from "@/components/AIAnalysis";
import { MarketPrice } from "@/components/MarketPrice";
import { useMarketData } from "@/hooks/useMarketData";

interface AnalysisDashboardProps {
  stockSymbol: string;
  onBackToSearch: () => void;
}

// Mock additional stock data - in a real app, this would come from an API
const generateMockStockInfo = (symbol: string) => {
  return {
    volume: (Math.random() * 10000000).toFixed(0),
    marketCap: (Math.random() * 1000).toFixed(1) + "B",
    high52w: (Math.random() * 200 + 200).toFixed(2),
    low52w: (Math.random() * 100 + 50).toFixed(2),
  };
};

export const AnalysisDashboard = ({ stockSymbol, onBackToSearch }: AnalysisDashboardProps) => {
  const [stockInfo, setStockInfo] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  
  // Use the real-time market data hook
  const { price, change, isLoading: priceLoading, error } = useMarketData(stockSymbol);

  useEffect(() => {
    // Simulate API call for additional stock info
    setLoading(true);
    setTimeout(() => {
      setStockInfo(generateMockStockInfo(stockSymbol));
      setLoading(false);
    }, 1000);
  }, [stockSymbol]);

  if (loading || priceLoading) {
    return (
      <div className="flex items-center justify-center min-h-[500px]">
        <div className="text-center space-y-6">
          <div className="relative">
            <div className="animate-spin h-16 w-16 border-4 border-tradeiq-blue/20 border-t-tradeiq-blue rounded-full mx-auto"></div>
            <div className="absolute inset-0 flex items-center justify-center">
              <Brain className="h-6 w-6 text-tradeiq-blue" />
            </div>
          </div>
          <div className="text-white space-y-2">
            <p className="text-xl font-semibold">Analyzing {stockSymbol}</p>
            <p className="text-gray-400">Processing market data and running AI analysis...</p>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center min-h-[500px]">
        <div className="text-center space-y-4">
          <p className="text-red-400 text-lg">Error loading market data</p>
          <p className="text-gray-400">{error}</p>
          <Button onClick={() => window.location.reload()} className="tradeiq-button-primary">
            Retry
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Header */}
      <div className="flex items-center justify-between">
        <Button
          variant="outline"
          onClick={onBackToSearch}
          className="border-gray-700/50 text-gray-300 hover:bg-black/30 hover:border-tradeiq-blue/50 rounded-xl"
        >
          <ArrowLeft className="h-4 w-4 mr-2" />
          Back to Search
        </Button>
      </div>

      {/* Stock Info Header */}
      <Card className="tradeiq-card p-6 rounded-2xl">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between space-y-6 lg:space-y-0">
          <div className="space-y-4">
            <div className="flex items-center space-x-4">
              <h2 className="text-4xl font-bold text-white">{stockSymbol}</h2>
              <Badge variant="outline" className="border-tradeiq-blue/30 text-tradeiq-blue bg-tradeiq-blue/10">
                NASDAQ
              </Badge>
            </div>
            
            {/* Real-time price using MarketPrice component */}
            <MarketPrice symbol={stockSymbol} size="lg" />
          </div>
          
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-6 text-center">
            <div className="space-y-1">
              <p className="text-gray-400 text-sm font-medium">Volume</p>
              <p className="text-white font-bold text-lg">{parseInt(stockInfo.volume).toLocaleString()}</p>
            </div>
            <div className="space-y-1">
              <p className="text-gray-400 text-sm font-medium">Market Cap</p>
              <p className="text-white font-bold text-lg">${stockInfo.marketCap}</p>
            </div>
            <div className="space-y-1">
              <p className="text-gray-400 text-sm font-medium">52W High</p>
              <p className="text-white font-bold text-lg">${stockInfo.high52w}</p>
            </div>
            <div className="space-y-1">
              <p className="text-gray-400 text-sm font-medium">52W Low</p>
              <p className="text-white font-bold text-lg">${stockInfo.low52w}</p>
            </div>
          </div>
        </div>
      </Card>

      {/* Chart and Analysis Grid */}
      <div className="grid lg:grid-cols-3 gap-6">
        {/* Chart Section */}
        <div className="lg:col-span-2 space-y-6">
          <Card className="tradeiq-card p-8 rounded-2xl">
            <div className="flex items-center space-x-3 mb-8">
              <BarChart3 className="h-6 w-6 text-tradeiq-blue" />
              <h3 className="text-xl font-bold text-white">Price Chart</h3>
            </div>
            <div className="py-4">
              <OptimizedTradingViewWidget 
                symbol={stockSymbol} 
                timeframe="1D"
                className="w-full"
                height="600px"
              />
            </div>
          </Card>

          <TechnicalIndicators symbol={stockSymbol} />
        </div>

        {/* Enhanced AI Analysis Sidebar */}
        <div className="space-y-6">
          <AIAnalysis symbol={stockSymbol} stockData={{ price, change }} />
        </div>
      </div>
    </div>
  );
};
