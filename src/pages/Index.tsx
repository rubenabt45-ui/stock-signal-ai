import { useState, useCallback } from "react";
import { Link } from "react-router-dom";
import { AssetSelection } from "@/components/AssetSelection";
import { LiveChart } from "@/components/LiveChart";
import { PatternDetection } from "@/components/PatternDetection";
import { TrendAnalysis } from "@/components/TrendAnalysis";
import { VolatilityAnalysis } from "@/components/VolatilityAnalysis";
import { AISuggestions } from "@/components/AISuggestions";
import { MarketOverview } from "@/components/MarketOverview";
import { TrendingUp, Sparkles, Heart, BarChart3, ChevronRight, CandlestickChart, Star, Brain, User } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { MotionWrapper, StaggerContainer, StaggerItem } from "@/components/ui/motion-wrapper";
import { useAuth } from "@/providers/AuthProvider";
import tradeiqLogo from '@/assets/tradeiq-logo.png';
const Index = () => {
  const [selectedAsset, setSelectedAsset] = useState<string>("AAPL");
  const {
    user
  } = useAuth();

  // Get related symbols for market overview
  const getRelatedSymbols = (symbol: string) => {
    const relatedMap: Record<string, string[]> = {
      'AAPL': ['NASDAQ:AAPL', 'NASDAQ:MSFT', 'NASDAQ:GOOGL', 'NASDAQ:AMZN', 'NASDAQ:TSLA'],
      'MSFT': ['NASDAQ:MSFT', 'NASDAQ:AAPL', 'NASDAQ:GOOGL', 'NASDAQ:AMZN', 'NASDAQ:ORCL'],
      'GOOGL': ['NASDAQ:GOOGL', 'NASDAQ:MSFT', 'NASDAQ:AAPL', 'NASDAQ:META', 'NASDAQ:AMZN'],
      'TSLA': ['NASDAQ:TSLA', 'NASDAQ:RIVN', 'NASDAQ:LCID', 'NYSE:F', 'NYSE:GM'],
      'NVDA': ['NASDAQ:NVDA', 'NASDAQ:AMD', 'NASDAQ:INTC', 'NASDAQ:QCOM', 'NASDAQ:AVGO'],
      'AMZN': ['NASDAQ:AMZN', 'NASDAQ:AAPL', 'NASDAQ:MSFT', 'NASDAQ:GOOGL', 'NASDAQ:META'],
      'META': ['NASDAQ:META', 'NASDAQ:GOOGL', 'NASDAQ:SNAP', 'NYSE:TWTR', 'NASDAQ:PINS']
    };
    const baseSymbol = symbol.replace('NASDAQ:', '').replace('NYSE:', '');
    const relatedSymbols = relatedMap[baseSymbol] || [`NASDAQ:${baseSymbol}`, 'NASDAQ:AAPL', 'NASDAQ:MSFT', 'NASDAQ:GOOGL', 'NASDAQ:AMZN'];
    console.log(`🔗 Related symbols for ${symbol}:`, relatedSymbols);
    return relatedSymbols;
  };
  return <div className="min-h-screen bg-tradeiq-navy pb-20">
      {/* Header */}
      <header className="bg-black/90 backdrop-blur-xl border-b border-gray-800/50 sticky top-0 z-50 shadow-lg">
        <MotionWrapper animation="slide" className="container mx-auto px-6 py-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <BarChart3 className="h-10 w-10 text-tradeiq-blue" />
              <div>
                <h1 className="text-2xl font-bold text-white">Chart</h1>
                <p className="text-sm text-gray-400">Master Trading Skills</p>
              </div>
            </div>
            <div className="text-white font-medium">
              Free Plan
            </div>
          </div>
        </MotionWrapper>
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-6 py-8">
        <StaggerContainer>
          {/* Welcome Section */}
          <StaggerItem className="mb-8">
            <div className="text-center max-w-3xl mx-auto">
              <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
                Advanced Trading Intelligence
              </h2>
              <p className="text-gray-400 text-lg">
                Harness the power of AI-driven market analysis for smarter trading decisions
              </p>
            </div>
          </StaggerItem>

          {/* Asset Selection */}
          <StaggerItem className="mb-8">
            <div className="tradeiq-card p-6">
              <div className="mb-6">
                <h3 className="text-xl font-bold text-white mb-2">Select Asset</h3>
                <p className="text-gray-400">Choose a financial instrument to analyze</p>
              </div>
              <AssetSelection selectedAsset={selectedAsset} onAssetSelect={setSelectedAsset} />
            </div>
          </StaggerItem>

          {/* Live Chart */}
          <StaggerItem className="mb-8">
            <div className="tradeiq-card p-6">
              <div className="mb-6">
                <div className="flex items-center space-x-3 mb-2">
                  <TrendingUp className="h-6 w-6 text-tradeiq-blue" />
                  <h3 className="text-xl font-bold text-white">Live Chart Analysis</h3>
                </div>
                <p className="text-gray-400">Real-time price movements and technical indicators</p>
              </div>
              <div className="bg-gray-900/50 rounded-2xl p-2 border border-gray-800">
                <LiveChart asset={selectedAsset} key={selectedAsset} />
              </div>
            </div>
          </StaggerItem>

          {/* Market Overview Section */}
          <StaggerItem className="mb-8">
            
          </StaggerItem>

          {/* Analysis Grid */}
          <StaggerItem>
            <div className="grid gap-8 lg:grid-cols-2">
              <div className="space-y-8">
                <MotionWrapper delay={0.1}>
                  <PatternDetection asset={selectedAsset} />
                </MotionWrapper>
                <MotionWrapper delay={0.2}>
                  <TrendAnalysis asset={selectedAsset} />
                </MotionWrapper>
                <MotionWrapper delay={0.3}>
                  <VolatilityAnalysis asset={selectedAsset} />
                </MotionWrapper>
              </div>
              
              <MotionWrapper delay={0.4}>
                <AISuggestions asset={selectedAsset} />
              </MotionWrapper>
            </div>
          </StaggerItem>
        </StaggerContainer>
      </main>
    </div>;
};
export default Index;