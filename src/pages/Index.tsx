import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  TrendingUp, 
  Brain, 
  BarChart3, 
  MessageCircle, 
  BookOpen,
  ChevronRight,
  Activity,
  Clock,
  Star,
  Zap,
  Target
} from 'lucide-react';
import { useAuth } from '@/contexts/auth/auth.provider';
import { useSubscription } from '@/hooks/useSubscription';
import { PageWrapper } from '@/components/PageWrapper';
import { StockSearch } from '@/components/StockSearch';
import { AnalysisDashboard } from '@/components/AnalysisDashboard';
import { LazyMarketOverview } from '@/components/LazyTradingViewChart';

const Index = () => {
  const { user } = useAuth();
  const { isPro } = useSubscription();
  const [activeTab, setActiveTab] = useState("dashboard");
  const [selectedStock, setSelectedStock] = useState<string | null>(null);

  useEffect(() => {
    document.title = "TradeIQ - Dashboard";
  }, []);

  const handleStockSelect = (symbol: string) => {
    setSelectedStock(symbol);
    setActiveTab("analysis");
  };

  const handleBackToSearch = () => {
    setSelectedStock(null);
    setActiveTab("dashboard");
  };

  return (
    <PageWrapper pageName="Dashboard">
      <div className="min-h-screen bg-tradeiq-navy p-6">
        <div className="max-w-7xl mx-auto space-y-8">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-white mb-2">
                Welcome back{user?.email ? `, ${user.email.split('@')[0]}` : ''}
              </h1>
              <p className="text-gray-400">
                Explore market insights and AI-driven analysis.
              </p>
            </div>
            <div className="flex items-center space-x-2">
              <Badge variant={isPro ? "default" : "secondary"} className="px-3 py-1">
                {isPro ? (
                  <>
                    <Star className="h-3 w-3 mr-1" />
                    Pro Plan
                  </>
                ) : (
                  'Free Plan'
                )}
              </Badge>
            </div>
          </div>

          <Tabs value={activeTab} onValueChange={setActiveTab}>
            <TabsList className="bg-tradeiq-card/50 rounded-xl p-1 w-full">
              <TabsTrigger value="dashboard" className="data-[state=active]:bg-tradeiq-blue data-[state=active]:text-white rounded-lg">Dashboard</TabsTrigger>
              <TabsTrigger value="analysis" className="data-[state=active]:bg-tradeiq-blue data-[state=active]:text-white rounded-lg" disabled={!selectedStock}>
                Analysis
                {selectedStock && ` - ${selectedStock}`}
              </TabsTrigger>
            </TabsList>
            <TabsContent value="dashboard" className="space-y-4">
              <Card className="tradeiq-card">
                <CardHeader>
                  <CardTitle className="text-white">Stock Search</CardTitle>
                  <CardDescription className="text-gray-400">Find stock insights</CardDescription>
                </CardHeader>
                <CardContent>
                  <StockSearch onStockSelect={handleStockSelect} />
                </CardContent>
              </Card>

              <Card className="tradeiq-card">
                <CardHeader>
                  <CardTitle className="text-white">Market Overview</CardTitle>
                  <CardDescription className="text-gray-400">Key market trends</CardDescription>
                </CardHeader>
                <CardContent>
                  <LazyMarketOverview symbols={['AAPL', 'GOOGL', 'MSFT']} theme="dark" height={400} />
                </CardContent>
              </Card>
            </TabsContent>
            <TabsContent value="analysis" className="space-y-4">
              {selectedStock ? (
                <AnalysisDashboard stockSymbol={selectedStock} onBackToSearch={handleBackToSearch} />
              ) : (
                <Card className="tradeiq-card">
                  <CardContent>
                    <p className="text-white">No stock selected for analysis.</p>
                  </CardContent>
                </Card>
              )}
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </PageWrapper>
  );
};

export default Index;
