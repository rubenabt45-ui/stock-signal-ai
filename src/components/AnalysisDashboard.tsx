
import { useState, useEffect } from "react";
import { ArrowLeft, TrendingUp, TrendingDown, Minus, Brain, BarChart3 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { StockChart } from "@/components/StockChart";
import { TechnicalIndicators } from "@/components/TechnicalIndicators";
import { AIAnalysis } from "@/components/AIAnalysis";

interface AnalysisDashboardProps {
  stockSymbol: string;
  onBackToSearch: () => void;
}

// Mock stock data - in a real app, this would come from an API
const generateMockStockData = (symbol: string) => {
  const basePrice = Math.random() * 200 + 50;
  const trend = Math.random() > 0.5 ? 1 : -1;
  const change = (Math.random() * 10 - 5) * trend;
  const changePercent = (change / basePrice) * 100;

  return {
    symbol,
    price: basePrice.toFixed(2),
    change: change.toFixed(2),
    changePercent: changePercent.toFixed(2),
    volume: (Math.random() * 10000000).toFixed(0),
    marketCap: (Math.random() * 1000).toFixed(1) + "B",
    high52w: (basePrice * 1.3).toFixed(2),
    low52w: (basePrice * 0.7).toFixed(2),
  };
};

export const AnalysisDashboard = ({ stockSymbol, onBackToSearch }: AnalysisDashboardProps) => {
  const [stockData, setStockData] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Simulate API call
    setLoading(true);
    setTimeout(() => {
      setStockData(generateMockStockData(stockSymbol));
      setLoading(false);
    }, 1500);
  }, [stockSymbol]);

  if (loading) {
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

  const isPositive = parseFloat(stockData.change) > 0;
  const isNegative = parseFloat(stockData.change) < 0;

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
              <h2 className="text-4xl font-bold text-white">{stockData.symbol}</h2>
              <Badge variant="outline" className="border-tradeiq-blue/30 text-tradeiq-blue bg-tradeiq-blue/10">
                NASDAQ
              </Badge>
            </div>
            <div className="flex items-center space-x-6">
              <span className="text-5xl font-bold text-white">${stockData.price}</span>
              <div className="flex items-center space-x-3">
                {isPositive && <TrendingUp className="h-6 w-6 text-tradeiq-success" />}
                {isNegative && <TrendingDown className="h-6 w-6 text-tradeiq-danger" />}
                {!isPositive && !isNegative && <Minus className="h-6 w-6 text-gray-400" />}
                <span className={`text-xl font-bold ${
                  isPositive ? 'text-tradeiq-success' : isNegative ? 'text-tradeiq-danger' : 'text-gray-400'
                }`}>
                  {stockData.change} ({stockData.changePercent}%)
                </span>
              </div>
            </div>
          </div>
          
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-6 text-center">
            <div className="space-y-1">
              <p className="text-gray-400 text-sm font-medium">Volume</p>
              <p className="text-white font-bold text-lg">{parseInt(stockData.volume).toLocaleString()}</p>
            </div>
            <div className="space-y-1">
              <p className="text-gray-400 text-sm font-medium">Market Cap</p>
              <p className="text-white font-bold text-lg">${stockData.marketCap}</p>
            </div>
            <div className="space-y-1">
              <p className="text-gray-400 text-sm font-medium">52W High</p>
              <p className="text-white font-bold text-lg">${stockData.high52w}</p>
            </div>
            <div className="space-y-1">
              <p className="text-gray-400 text-sm font-medium">52W Low</p>
              <p className="text-white font-bold text-lg">${stockData.low52w}</p>
            </div>
          </div>
        </div>
      </Card>

      {/* Chart and Analysis Grid */}
      <div className="grid lg:grid-cols-3 gap-6">
        {/* Chart Section */}
        <div className="lg:col-span-2 space-y-6">
          <Card className="tradeiq-card p-6 rounded-2xl">
            <div className="flex items-center space-x-3 mb-6">
              <BarChart3 className="h-6 w-6 text-tradeiq-blue" />
              <h3 className="text-xl font-bold text-white">Price Chart</h3>
            </div>
            <StockChart symbol={stockSymbol} />
          </Card>

          <TechnicalIndicators symbol={stockSymbol} />
        </div>

        {/* AI Analysis Sidebar */}
        <div className="space-y-6">
          <Card className="tradeiq-card p-6 rounded-2xl">
            <div className="flex items-center space-x-3 mb-6">
              <Brain className="h-6 w-6 text-purple-400" />
              <h3 className="text-xl font-bold text-white">AI Analysis</h3>
            </div>
            <AIAnalysis symbol={stockSymbol} stockData={stockData} />
          </Card>
        </div>
      </div>
    </div>
  );
};
