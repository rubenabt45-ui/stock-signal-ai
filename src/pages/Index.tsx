
import { useState, useCallback } from "react";
import { Link } from "react-router-dom";
import { AssetSelection } from "@/components/AssetSelection";
import { TimeframeSelector } from "@/components/TimeframeSelector";
import { LiveChart } from "@/components/LiveChart";
import { PatternDetection } from "@/components/PatternDetection";
import { TrendAnalysis } from "@/components/TrendAnalysis";
import { VolatilityAnalysis } from "@/components/VolatilityAnalysis";
import { AISuggestions } from "@/components/AISuggestions";
import { MarketPrice } from "@/components/MarketPrice";
import { ChartCandlestick, Brain, Star } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";

export type Timeframe = "1D" | "1W" | "1M" | "3M" | "6M" | "1Y";

const Index = () => {
  const [selectedAsset, setSelectedAsset] = useState<string>("AAPL");
  const [selectedTimeframe, setSelectedTimeframe] = useState<Timeframe>("1D");

  const handleTimeframeSelect = useCallback((timeframe: string) => {
    console.log(`🎯 Index: Timeframe changed to ${timeframe} for asset ${selectedAsset}`);
    // Cast string to Timeframe type and update state immediately
    setSelectedTimeframe(timeframe as Timeframe);
  }, [selectedAsset]);

  return (
    <div className="min-h-screen bg-tradeiq-navy">
      {/* Header */}
      <header className="border-b border-gray-800/50 bg-black/20 backdrop-blur-sm sticky top-0 z-50">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <ChartCandlestick className="h-8 w-8 text-tradeiq-blue" />
              <div>
                <h1 className="text-2xl font-bold text-white tracking-tight">TradeIQ</h1>
                <p className="text-sm text-gray-400 font-medium">Chart IA</p>
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
                <span className="text-sm font-medium hidden sm:block">AI Analysis</span>
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
          onAssetSelect={setSelectedAsset} 
        />

        {/* Live Price Card for Selected Asset */}
        <Card className="tradeiq-card">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-xl font-semibold text-white mb-2">
                  {selectedAsset} Live Price
                </h2>
                <MarketPrice 
                  symbol={selectedAsset} 
                  size="lg"
                />
              </div>
              <div className="text-right">
                <div className="flex items-center space-x-2 text-sm text-gray-400 mb-2">
                  <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                  <span>Live Updates</span>
                </div>
                <p className="text-xs text-gray-500">
                  Refreshes every 60 seconds
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Timeframe Selector */}
        <TimeframeSelector 
          selectedTimeframe={selectedTimeframe} 
          onTimeframeSelect={handleTimeframeSelect} 
        />

        {/* Live Chart with key prop to force re-render on timeframe change */}
        <LiveChart 
          asset={selectedAsset} 
          timeframe={selectedTimeframe}
          key={`${selectedAsset}-${selectedTimeframe}`}
        />

        {/* Analysis Grid */}
        <div className="grid gap-6 lg:grid-cols-2">
          <div className="space-y-6">
            <PatternDetection 
              asset={selectedAsset} 
              timeframe={selectedTimeframe} 
            />
            <TrendAnalysis 
              asset={selectedAsset} 
              timeframe={selectedTimeframe} 
            />
            <VolatilityAnalysis 
              asset={selectedAsset} 
              timeframe={selectedTimeframe} 
            />
          </div>
          
          <div>
            <AISuggestions 
              asset={selectedAsset} 
              timeframe={selectedTimeframe} 
            />
          </div>
        </div>
      </main>
    </div>
  );
};

export default Index;
