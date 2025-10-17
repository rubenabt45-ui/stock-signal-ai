
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
  const { user } = useAuth();

  // Get related symbols for market overview
  const getRelatedSymbols = (symbol: string) => {
    const relatedMap: Record<string, string[]> = {
      'AAPL': ['NASDAQ:AAPL', 'NASDAQ:MSFT', 'NASDAQ:GOOGL', 'NASDAQ:AMZN', 'NASDAQ:TSLA'],
      'MSFT': ['NASDAQ:MSFT', 'NASDAQ:AAPL', 'NASDAQ:GOOGL', 'NASDAQ:AMZN', 'NASDAQ:ORCL'],
      'GOOGL': ['NASDAQ:GOOGL', 'NASDAQ:MSFT', 'NASDAQ:AAPL', 'NASDAQ:META', 'NASDAQ:AMZN'],
      'TSLA': ['NASDAQ:TSLA', 'NASDAQ:RIVN', 'NASDAQ:LCID', 'NYSE:F', 'NYSE:GM'],
      'NVDA': ['NASDAQ:NVDA', 'NASDAQ:AMD', 'NASDAQ:INTC', 'NASDAQ:QCOM', 'NASDAQ:AVGO'],
      'AMZN': ['NASDAQ:AMZN', 'NASDAQ:AAPL', 'NASDAQ:MSFT', 'NASDAQ:GOOGL', 'NASDAQ:META'],
      'META': ['NASDAQ:META', 'NASDAQ:GOOGL', 'NASDAQ:SNAP', 'NYSE:TWTR', 'NASDAQ:PINS'],
    };

    const baseSymbol = symbol.replace('NASDAQ:', '').replace('NYSE:', '');
    const relatedSymbols = relatedMap[baseSymbol] || [`NASDAQ:${baseSymbol}`, 'NASDAQ:AAPL', 'NASDAQ:MSFT', 'NASDAQ:GOOGL', 'NASDAQ:AMZN'];
    
    console.log(`🔗 Related symbols for ${symbol}:`, relatedSymbols);
    return relatedSymbols;
  };

  return (
    <div className="min-h-screen bg-tradeiq-navy pb-20">
      {/* Header */}
      <header className="bg-black/90 backdrop-blur-xl border-b border-gray-800/50 sticky top-0 z-50 shadow-lg">
        <MotionWrapper animation="slide" className="container mx-auto px-6 py-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <img src={tradeiqLogo} alt="TradeIQ Logo" className="h-12" />
              <div>
                <p className="text-gray-400 font-medium">Professional Chart Analysis</p>
              </div>
            </div>
            <div className="flex items-center space-x-4">
              <Link to="/favorites">
                <Button variant="outline" className="gap-2 border-gray-700 text-gray-300 hover:text-white hover:bg-gray-800">
                  <Heart className="h-4 w-4" />
                  <span className="hidden sm:inline">Favorites</span>
                </Button>
              </Link>
              {!user ? (
                <>
                  <Link to="/login">
                    <Button variant="outline" className="gap-2 border-gray-700 text-gray-300 hover:text-white hover:bg-gray-800">
                      <span>Login</span>
                    </Button>
                  </Link>
                  <Link to="/signup">
                    <Button className="gap-2 bg-tradeiq-blue text-white hover:bg-tradeiq-blue/90">
                      <span>Sign Up</span>
                    </Button>
                  </Link>
                </>
              ) : (
                <Link to="/settings">
                  <Button variant="outline" className="gap-2 border-gray-700 text-gray-300 hover:text-white hover:bg-gray-800">
                    <User className="h-4 w-4" />
                    <span className="hidden sm:inline">Account</span>
                  </Button>
                </Link>
              )}
              <div className="flex items-center space-x-3 bg-tradeiq-blue/20 px-4 py-2 rounded-xl border border-tradeiq-blue/30">
                <Sparkles className="h-5 w-5 text-tradeiq-blue" />
                <span className="text-white font-medium hidden sm:block">AI-Powered</span>
              </div>
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
              <AssetSelection 
                selectedAsset={selectedAsset} 
                onAssetSelect={setSelectedAsset} 
              />
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
                <LiveChart 
                  asset={selectedAsset} 
                  key={selectedAsset}
                />
              </div>
            </div>
          </StaggerItem>

          {/* Market Overview Section */}
          <StaggerItem className="mb-8">
            <Card className="tradeiq-card">
              <CardHeader>
                <CardTitle className="flex items-center space-x-3 text-white">
                  <BarChart3 className="h-6 w-6 text-tradeiq-blue" />
                  <span>Market Overview</span>
                </CardTitle>
                <p className="text-gray-400">Related instruments and market correlations</p>
              </CardHeader>
              <CardContent>
                <div className="bg-gray-900/50 rounded-xl p-4 border border-gray-800">
                  <MarketOverview 
                    symbols={getRelatedSymbols(selectedAsset)}
                    height={450}
                    className="w-full"
                    key={`market-overview-${selectedAsset}`}
                  />
                </div>
              </CardContent>
            </Card>
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
    </div>
  );
};

export default Index;
