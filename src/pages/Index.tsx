
import { useState, useCallback } from "react";
import { Link } from "react-router-dom";
import { AssetSelection } from "@/components/AssetSelection";
import { LiveChart } from "@/components/LiveChart";
import { PatternDetection } from "@/components/PatternDetection";
import { TrendAnalysis } from "@/components/TrendAnalysis";
import { VolatilityAnalysis } from "@/components/VolatilityAnalysis";
import { AISuggestions } from "@/components/AISuggestions";
import { ChartCandlestick, Brain, Star } from "lucide-react";
import { Button } from "@/components/ui/button";
import { TradingViewDataProvider } from "@/contexts/TradingViewDataContext";

export type Timeframe = "1D" | "1W" | "1M" | "3M" | "6M" | "1Y";

const Index = () => {
  const [selectedAsset, setSelectedAsset] = useState<string>("AAPL");
  const [selectedTimeframe, setSelectedTimeframe] = useState<Timeframe>("1D");
  const [remountKey, setRemountKey] = useState<number>(0);

  const handleTimeframeSelect = useCallback((timeframe: string) => {
    console.log(`🎯 [${new Date().toLocaleTimeString()}] Index: Timeframe changed to ${timeframe} for ${selectedAsset}`);
    setSelectedTimeframe(timeframe as Timeframe);
    // Force complete remount
    setRemountKey(prev => prev + 1);
  }, [selectedAsset]);

  const handleAssetSelect = useCallback((asset: string) => {
    console.log(`🎯 [${new Date().toLocaleTimeString()}] Index: Asset changed from ${selectedAsset} to ${asset} - forcing TradingView sync`);
    setSelectedAsset(asset);
    // Force complete remount on asset change
    setRemountKey(prev => prev + 1);
  }, [selectedAsset]);

  return (
    <TradingViewDataProvider>
      <div className="min-h-screen bg-tradeiq-navy">
        {/* Header */}
        <header className="border-b border-gray-800/50 bg-black/20 backdrop-blur-sm sticky top-0 z-50">
          <div className="container mx-auto px-4 py-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <ChartCandlestick className="h-8 w-8 text-tradeiq-blue" />
                <div>
                  <h1 className="text-2xl font-bold text-white tracking-tight">TradeIQ</h1>
                  <p className="text-sm text-gray-400 font-medium">Chart IA - TradingView Synchronized</p>
                </div>
              </div>
              <div className="flex items-center space-x-4">
                <Link to="/favorites">
                  <Button variant="outline" className="border-gray-700 hover:bg-gray-800 text-gray-300">
                    <Star className="h-4 w-4 mr-2" />
                    Favorites
                  </Button>
                </Link>
                <div className="flex items-center space-x-2 text-gray-400">
                  <Brain className="h-5 w-5 text-tradeiq-blue" />
                  <span className="text-sm font-medium hidden sm:block">Active: {selectedAsset}</span>
                </div>
              </div>
            </div>
          </div>
        </header>

        {/* Main Content */}
        <main className="container mx-auto px-4 py-6 space-y-6">
          {/* Asset Selection */}
          <AssetSelection 
            selectedAsset={selectedAsset} 
            onAssetSelect={handleAssetSelect} 
          />

          {/* TradingView Live Chart - Single Source of Truth */}
          <LiveChart 
            key={`chart-${selectedAsset}-${selectedTimeframe}-${remountKey}`}
            asset={selectedAsset} 
            timeframe={selectedTimeframe}
          />

          {/* Synchronized Analysis Grid - All using TradingView data */}
          <div className="grid gap-6 lg:grid-cols-2">
            <div className="space-y-6">
              <PatternDetection 
                key={`pattern-${selectedAsset}-${selectedTimeframe}-${remountKey}`}
                asset={selectedAsset} 
                timeframe={selectedTimeframe} 
              />
              <TrendAnalysis 
                key={`trend-${selectedAsset}-${selectedTimeframe}-${remountKey}`}
                asset={selectedAsset} 
                timeframe={selectedTimeframe} 
              />
              <VolatilityAnalysis 
                key={`volatility-${selectedAsset}-${selectedTimeframe}-${remountKey}`}
                asset={selectedAsset} 
                timeframe={selectedTimeframe} 
              />
            </div>
            
            <div>
              <AISuggestions 
                key={`ai-${selectedAsset}-${selectedTimeframe}-${remountKey}`}
                asset={selectedAsset} 
                timeframe={selectedTimeframe} 
              />
            </div>
          </div>
        </main>
      </div>
    </TradingViewDataProvider>
  );
};

export default Index;
