
import { useState } from "react";
import { StockSearch } from "@/components/StockSearch";
import { AnalysisDashboard } from "@/components/AnalysisDashboard";
import { TrendingUp, BarChart3, Brain, ChartCandlestick } from "lucide-react";

const Index = () => {
  const [selectedStock, setSelectedStock] = useState<string | null>(null);

  return (
    <div className="min-h-screen bg-tradeiq-navy">
      {/* Header */}
      <header className="border-b border-gray-800/50 bg-black/20 backdrop-blur-sm">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center space-x-3">
            <div className="flex items-center space-x-3">
              <ChartCandlestick className="h-8 w-8 text-tradeiq-blue" />
              <h1 className="text-2xl font-bold text-white tracking-tight">TradeIQ</h1>
            </div>
            <div className="hidden md:flex items-center space-x-6 ml-8">
              <div className="flex items-center space-x-2 text-gray-400">
                <TrendingUp className="h-4 w-4" />
                <span className="text-sm font-medium">Technical Analysis</span>
              </div>
              <div className="flex items-center space-x-2 text-gray-400">
                <BarChart3 className="h-4 w-4" />
                <span className="text-sm font-medium">Real-time Data</span>
              </div>
              <div className="flex items-center space-x-2 text-gray-400">
                <Brain className="h-4 w-4" />
                <span className="text-sm font-medium">AI Insights</span>
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-4 py-8">
        {!selectedStock ? (
          /* Welcome Screen */
          <div className="text-center space-y-8 animate-fade-in">
            <div className="space-y-6">
              <h2 className="text-4xl md:text-6xl font-bold text-white leading-tight">
                Smart Trading
                <span className="block text-transparent bg-clip-text bg-gradient-to-r from-tradeiq-blue to-blue-400">
                  Made Simple
                </span>
              </h2>
              <p className="text-xl text-gray-300 max-w-2xl mx-auto leading-relaxed">
                Professional-grade stock analysis powered by AI. Get instant technical insights and trading signals.
              </p>
            </div>

            <div className="max-w-md mx-auto">
              <StockSearch onStockSelect={setSelectedStock} />
            </div>

            <div className="grid md:grid-cols-3 gap-6 max-w-5xl mx-auto mt-16">
              <div className="tradeiq-card rounded-2xl p-8 text-center hover:scale-105 transition-all duration-300">
                <TrendingUp className="h-12 w-12 text-tradeiq-success mx-auto mb-4" />
                <h3 className="text-xl font-semibold text-white mb-3">Trend Analysis</h3>
                <p className="text-gray-400 text-sm leading-relaxed">
                  Advanced algorithms detect market trends and momentum with institutional-grade accuracy
                </p>
              </div>
              <div className="tradeiq-card rounded-2xl p-8 text-center hover:scale-105 transition-all duration-300">
                <BarChart3 className="h-12 w-12 text-tradeiq-blue mx-auto mb-4" />
                <h3 className="text-xl font-semibold text-white mb-3">Pattern Recognition</h3>
                <p className="text-gray-400 text-sm leading-relaxed">
                  Identify key chart patterns, support/resistance levels, and breakout opportunities
                </p>
              </div>
              <div className="tradeiq-card rounded-2xl p-8 text-center hover:scale-105 transition-all duration-300">
                <Brain className="h-12 w-12 text-purple-400 mx-auto mb-4" />
                <h3 className="text-xl font-semibold text-white mb-3">AI Recommendations</h3>
                <p className="text-gray-400 text-sm leading-relaxed">
                  Clear buy, hold, or sell signals with confidence scores and risk assessment
                </p>
              </div>
            </div>
          </div>
        ) : (
          /* Analysis Dashboard */
          <AnalysisDashboard 
            stockSymbol={selectedStock} 
            onBackToSearch={() => setSelectedStock(null)} 
          />
        )}
      </main>
    </div>
  );
};

export default Index;
