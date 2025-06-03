
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
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-center space-y-4">
          <div className="animate-spin h-12 w-12 border-4 border-emerald-400 border-t-transparent rounded-full mx-auto"></div>
          <div className="text-white">
            <p className="text-lg font-semibold">Analyzing {stockSymbol}</p>
            <p className="text-slate-400">Fetching data and running AI analysis...</p>
          </div>
        </div>
      </div>
    );
  }

  const isPositive = parseFloat(stockData.change) > 0;
  const isNegative = parseFloat(stockData.change) < 0;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <Button
          variant="outline"
          onClick={onBackToSearch}
          className="border-slate-600 text-slate-300 hover:bg-slate-700"
        >
          <ArrowLeft className="h-4 w-4 mr-2" />
          Back to Search
        </Button>
      </div>

      {/* Stock Info Header */}
      <Card className="bg-slate-800/50 border-slate-700 p-6">
        <div className="flex flex-col md:flex-row md:items-center justify-between space-y-4 md:space-y-0">
          <div className="space-y-2">
            <div className="flex items-center space-x-3">
              <h2 className="text-3xl font-bold text-white">{stockData.symbol}</h2>
              <Badge variant="outline" className="border-slate-600 text-slate-300">
                NASDAQ
              </Badge>
            </div>
            <div className="flex items-center space-x-4">
              <span className="text-4xl font-bold text-white">${stockData.price}</span>
              <div className="flex items-center space-x-2">
                {isPositive && <TrendingUp className="h-5 w-5 text-emerald-400" />}
                {isNegative && <TrendingDown className="h-5 w-5 text-red-400" />}
                {!isPositive && !isNegative && <Minus className="h-5 w-5 text-slate-400" />}
                <span className={`text-lg font-semibold ${
                  isPositive ? 'text-emerald-400' : isNegative ? 'text-red-400' : 'text-slate-400'
                }`}>
                  {stockData.change} ({stockData.changePercent}%)
                </span>
              </div>
            </div>
          </div>
          
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-center">
            <div>
              <p className="text-slate-400 text-sm">Volume</p>
              <p className="text-white font-semibold">{parseInt(stockData.volume).toLocaleString()}</p>
            </div>
            <div>
              <p className="text-slate-400 text-sm">Market Cap</p>
              <p className="text-white font-semibold">${stockData.marketCap}</p>
            </div>
            <div>
              <p className="text-slate-400 text-sm">52W High</p>
              <p className="text-white font-semibold">${stockData.high52w}</p>
            </div>
            <div>
              <p className="text-slate-400 text-sm">52W Low</p>
              <p className="text-white font-semibold">${stockData.low52w}</p>
            </div>
          </div>
        </div>
      </Card>

      {/* Chart and Analysis Grid */}
      <div className="grid lg:grid-cols-3 gap-6">
        {/* Chart Section */}
        <div className="lg:col-span-2 space-y-6">
          <Card className="bg-slate-800/50 border-slate-700 p-6">
            <div className="flex items-center space-x-2 mb-4">
              <BarChart3 className="h-5 w-5 text-blue-400" />
              <h3 className="text-lg font-semibold text-white">Price Chart</h3>
            </div>
            <StockChart symbol={stockSymbol} />
          </Card>

          <TechnicalIndicators symbol={stockSymbol} />
        </div>

        {/* AI Analysis Sidebar */}
        <div className="space-y-6">
          <Card className="bg-slate-800/50 border-slate-700 p-6">
            <div className="flex items-center space-x-2 mb-4">
              <Brain className="h-5 w-5 text-purple-400" />
              <h3 className="text-lg font-semibold text-white">AI Analysis</h3>
            </div>
            <AIAnalysis symbol={stockSymbol} stockData={stockData} />
          </Card>
        </div>
      </div>
    </div>
  );
};
