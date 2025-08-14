
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
import { useAuth } from "@/contexts/auth/auth.provider";

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
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-white">
      {/* Header */}
      <header className="bg-white/80 backdrop-blur-xl border-b border-slate-200 sticky top-0 z-50 shadow-sm">
        <MotionWrapper animation="slide" className="container mx-auto px-6 py-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <div className="p-3 bg-primary rounded-2xl shadow-lg">
                <CandlestickChart className="h-8 w-8 text-white" />
              </div>
              <div>
                <h1 className="text-3xl font-bold text-slate-900 tracking-tight font-display">TradeIQ</h1>
                <p className="text-slate-600 font-medium">Professional Chart Analysis</p>
              </div>
            </div>
            <div className="flex items-center space-x-4">
              <Link to="/favorites">
                <Button variant="outline" className="gap-2">
                  <Heart className="h-4 w-4" />
                  <span className="hidden sm:inline">Favorites</span>
                </Button>
              </Link>
              {!user ? (
                <>
                  <Link to="/login">
                    <Button variant="outline" className="gap-2">
                      <span>Login</span>
                    </Button>
                  </Link>
                  <Link to="/signup">
                    <Button className="gap-2 bg-primary text-white hover:bg-primary/90">
                      <span>Sign Up</span>
                    </Button>
                  </Link>
                </>
              ) : (
                <Link to="/settings">
                  <Button variant="outline" className="gap-2">
                    <User className="h-4 w-4" />
                    <span className="hidden sm:inline">Account</span>
                  </Button>
                </Link>
              )}
              <div className="flex items-center space-x-3 bg-primary/10 px-4 py-2 rounded-xl">
                <Sparkles className="h-5 w-5 text-primary" />
                <span className="text-slate-700 font-medium hidden sm:block">AI-Powered</span>
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
              <h2 className="premium-title mb-4">
                Advanced Trading Intelligence
              </h2>
              <p className="premium-description text-lg">
                Harness the power of AI-driven market analysis for smarter trading decisions
              </p>
            </div>
          </StaggerItem>

          {/* Asset Selection */}
          <StaggerItem className="mb-8">
            <div className="premium-section">
              <div className="premium-header">
                <h3 className="text-xl font-bold text-slate-900 font-display">Select Asset</h3>
                <p className="text-slate-600">Choose a financial instrument to analyze</p>
              </div>
              <AssetSelection 
                selectedAsset={selectedAsset} 
                onAssetSelect={setSelectedAsset} 
              />
            </div>
          </StaggerItem>

          {/* Live Chart */}
          <StaggerItem className="mb-8">
            <div className="premium-section">
              <div className="premium-header">
                <div className="flex items-center space-x-3">
                  <TrendingUp className="h-6 w-6 text-primary" />
                  <h3 className="text-xl font-bold text-slate-900 font-display">Live Chart Analysis</h3>
                </div>
                <p className="text-slate-600">Real-time price movements and technical indicators</p>
              </div>
              <div className="bg-white rounded-2xl p-2 shadow-lg border border-slate-200">
                <LiveChart 
                  asset={selectedAsset} 
                  key={selectedAsset}
                />
              </div>
            </div>
          </StaggerItem>

          {/* Market Overview Section */}
          <StaggerItem className="mb-8">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-3">
                  <BarChart3 className="h-6 w-6 text-primary" />
                  <span>Market Overview</span>
                </CardTitle>
                <p className="text-slate-600">Related instruments and market correlations</p>
              </CardHeader>
              <CardContent>
                <div className="bg-slate-50 rounded-xl p-4">
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
