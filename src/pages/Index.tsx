
import { useState } from "react";
import { StockSearch } from "@/components/StockSearch";
import { AnalysisDashboard } from "@/components/AnalysisDashboard";
import { TrendingUp, BarChart3, Brain } from "lucide-react";

const Index = () => {
  const [selectedStock, setSelectedStock] = useState<string | null>(null);

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900">
      {/* Header */}
      <header className="border-b border-slate-700 bg-slate-900/50 backdrop-blur-sm">
        <div className="container mx-auto px-6 py-4">
          <div className="flex items-center space-x-3">
            <div className="flex items-center space-x-2">
              <Brain className="h-8 w-8 text-emerald-400" />
              <h1 className="text-2xl font-bold text-white">StockAI Analyzer</h1>
            </div>
            <div className="hidden md:flex items-center space-x-4 ml-8">
              <div className="flex items-center space-x-1 text-slate-300">
                <TrendingUp className="h-4 w-4" />
                <span className="text-sm">Technical Analysis</span>
              </div>
              <div className="flex items-center space-x-1 text-slate-300">
                <BarChart3 className="h-4 w-4" />
                <span className="text-sm">AI Insights</span>
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-6 py-8">
        {!selectedStock ? (
          /* Welcome Screen */
          <div className="text-center space-y-8">
            <div className="space-y-4">
              <h2 className="text-4xl md:text-6xl font-bold text-white">
                AI-Powered
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 to-blue-400">
                  {" "}Stock Analysis
                </span>
              </h2>
              <p className="text-xl text-slate-300 max-w-2xl mx-auto">
                Get instant technical analysis and trading recommendations powered by advanced AI algorithms
              </p>
            </div>

            <div className="max-w-md mx-auto">
              <StockSearch onStockSelect={setSelectedStock} />
            </div>

            <div className="grid md:grid-cols-3 gap-6 max-w-4xl mx-auto mt-16">
              <div className="bg-slate-800/50 backdrop-blur-sm border border-slate-700 rounded-xl p-6 text-center">
                <TrendingUp className="h-12 w-12 text-emerald-400 mx-auto mb-4" />
                <h3 className="text-lg font-semibold text-white mb-2">Trend Analysis</h3>
                <p className="text-slate-300 text-sm">
                  Identify market trends and momentum indicators with precision
                </p>
              </div>
              <div className="bg-slate-800/50 backdrop-blur-sm border border-slate-700 rounded-xl p-6 text-center">
                <BarChart3 className="h-12 w-12 text-blue-400 mx-auto mb-4" />
                <h3 className="text-lg font-semibold text-white mb-2">Pattern Detection</h3>
                <p className="text-slate-300 text-sm">
                  Spot key chart patterns and support/resistance levels
                </p>
              </div>
              <div className="bg-slate-800/50 backdrop-blur-sm border border-slate-700 rounded-xl p-6 text-center">
                <Brain className="h-12 w-12 text-purple-400 mx-auto mb-4" />
                <h3 className="text-lg font-semibold text-white mb-2">AI Recommendations</h3>
                <p className="text-slate-300 text-sm">
                  Get clear buy, hold, or sell signals with confidence scores
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
