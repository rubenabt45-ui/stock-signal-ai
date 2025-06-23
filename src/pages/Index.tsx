
import { useState, useCallback, useEffect } from "react";
import { Link } from "react-router-dom";
import { AssetSelection } from "@/components/AssetSelection";
import { LiveChart } from "@/components/LiveChart";
import { LazyAnalysisComponents } from "@/components/LazyAnalysisComponents";
import { ChartCandlestick, Brain, Star } from "lucide-react";
import { Button } from "@/components/ui/button";
import { TradingViewDataProvider } from "@/contexts/TradingViewDataContext";

export type Timeframe = "1D" | "1W" | "1M" | "3M" | "6M" | "1Y";

const Index = () => {
  const [selectedAsset, setSelectedAsset] = useState<string>("AAPL");
  const [selectedTimeframe, setSelectedTimeframe] = useState<Timeframe>("1D");
  const [chartLoaded, setChartLoaded] = useState(false);

  const handleTimeframeSelect = useCallback((timeframe: string) => {
    console.log(`🎯 [${new Date().toLocaleTimeString()}] Index: Timeframe changed to ${timeframe} for ${selectedAsset}`);
    setSelectedTimeframe(timeframe as Timeframe);
    setChartLoaded(false); // Reset chart loading state
  }, [selectedAsset]);

  const handleAssetSelect = useCallback((asset: string) => {
    console.log(`🎯 [${new Date().toLocaleTimeString()}] Index: Asset changed from ${selectedAsset} to ${asset}`);
    setSelectedAsset(asset);
    setChartLoaded(false); // Reset chart loading state
  }, [selectedAsset]);

  // Lazy load analysis components after chart initialization
  useEffect(() => {
    if (selectedAsset) {
      const timer = setTimeout(() => {
        setChartLoaded(true);
        console.log(`✅ Chart loaded, enabling analysis components for ${selectedAsset}`);
      }, 2000); // Allow chart to start loading before analysis components
      
      return () => clearTimeout(timer);
    }
  }, [selectedAsset, selectedTimeframe]);

  // Use requestIdleCallback for non-essential operations
  useEffect(() => {
    if (typeof window !== 'undefined' && 'requestIdleCallback' in window) {
      window.requestIdleCallback(() => {
        console.log(`💡 App optimized for ${selectedAsset} - all components ready`);
      });
    }
  }, [selectedAsset, selectedTimeframe, chartLoaded]);

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
                  <p className="text-sm text-gray-400 font-medium">TradingView Synchronized Analytics</p>
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

          {/* Live Chart - Priority Load with unique key for remounting */}
          <LiveChart 
            key={`${selectedAsset}-${selectedTimeframe}`}
            asset={selectedAsset} 
            timeframe={selectedTimeframe}
          />

          {/* Analysis Components - Lazy Loaded */}
          {chartLoaded && (
            <LazyAnalysisComponents 
              asset={selectedAsset} 
              timeframe={selectedTimeframe} 
            />
          )}
          
          {!chartLoaded && (
            <div className="grid gap-6 lg:grid-cols-2">
              <div className="space-y-6">
                {[1, 2, 3].map((i) => (
                  <div key={i} className="tradeiq-card p-6 rounded-2xl animate-pulse">
                    <div className="flex items-center space-x-3 mb-6">
                      <div className="h-6 w-6 bg-gray-700 rounded"></div>
                      <div className="h-6 w-32 bg-gray-700 rounded"></div>
                    </div>
                    <div className="space-y-4">
                      <div className="h-16 bg-gray-700/30 rounded-xl"></div>
                      <div className="h-16 bg-gray-700/30 rounded-xl"></div>
                    </div>
                  </div>
                ))}
              </div>
              <div className="tradeiq-card p-6 rounded-2xl animate-pulse">
                <div className="flex items-center space-x-3 mb-6">
                  <div className="h-6 w-6 bg-gray-700 rounded"></div>
                  <div className="h-6 w-40 bg-gray-700 rounded"></div>
                </div>
                <div className="space-y-4">
                  <div className="h-32 bg-gray-700/30 rounded-xl"></div>
                  <div className="h-24 bg-gray-700/30 rounded-xl"></div>
                </div>
              </div>
            </div>
          )}
        </main>
      </div>
    </TradingViewDataProvider>
  );
};

export default Index;
