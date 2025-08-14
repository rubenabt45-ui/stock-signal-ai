import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  TrendingUp, 
  TrendingDown, 
  DollarSign, 
  Activity,
  Eye,
  BarChart3,
  PieChart,
  Zap,
  Clock,
  Star,
  Bell,
  Calendar,
  Users,
  Target,
  Lightbulb,
  MessageSquare,
  ChevronRight,
  BookOpen,
  Newspaper
} from 'lucide-react';
import { useAuth } from '@/contexts/auth/auth.provider';

const Dashboard = () => {
  const { user } = useAuth();
  const [currentTime, setCurrentTime] = useState(new Date());

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date());
    }, 60000); // Update every minute

    return () => clearInterval(timer);
  }, []);

  const formatDate = (date: Date): string => {
    const options: Intl.DateTimeFormatOptions = {
      weekday: 'long',
      month: 'long',
      day: 'numeric',
      year: 'numeric',
    };
    return date.toLocaleDateString(undefined, options);
  };

  const formatTime = (date: Date): string => {
    const options: Intl.DateTimeFormatOptions = {
      hour: 'numeric',
      minute: 'numeric',
      hour12: true,
    };
    return date.toLocaleTimeString(undefined, options);
  };

  return (
    <div className="min-h-screen bg-tradeiq-navy p-6">
      <div className="max-w-5xl mx-auto space-y-6">
        {/* Header Section */}
        <div className="flex items-center justify-between">
          <div className="space-y-1">
            <h1 className="text-3xl font-bold text-white tracking-tight">
              {user ? `Welcome back, ${user.email}!` : 'Welcome to TradeIQ'}
            </h1>
            <p className="text-sm text-gray-400">
              {formatDate(currentTime)} • {formatTime(currentTime)}
            </p>
          </div>
          <div className="flex items-center space-x-2">
            <Button variant="outline" size="sm" className="border-gray-700/50 text-gray-300 hover:bg-black/30 hover:border-tradeiq-blue/50 rounded-xl">
              <Bell className="h-4 w-4 mr-2" />
              Notifications
            </Button>
          </div>
        </div>

        {/* Overview Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          <Card className="tradeiq-card">
            <CardHeader>
              <CardTitle className="text-white flex items-center space-x-2">
                <TrendingUp className="h-4 w-4 text-green-500" />
                <span>Total Investments</span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-white">$5,450.20</div>
              <p className="text-gray-400">+2.5% vs last month</p>
            </CardContent>
          </Card>

          <Card className="tradeiq-card">
            <CardHeader>
              <CardTitle className="text-white flex items-center space-x-2">
                <TrendingDown className="h-4 w-4 text-red-500" />
                <span>Portfolio Value</span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-white">$12,345.67</div>
              <p className="text-gray-400">-1.3% vs last month</p>
            </CardContent>
          </Card>

          <Card className="tradeiq-card">
            <CardHeader>
              <CardTitle className="text-white flex items-center space-x-2">
                <DollarSign className="h-4 w-4 text-blue-500" />
                <span>Available Balance</span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-white">$2,500.00</div>
              <p className="text-gray-400">Ready to invest</p>
            </CardContent>
          </Card>

          <Card className="tradeiq-card">
            <CardHeader>
              <CardTitle className="text-white flex items-center space-x-2">
                <Activity className="h-4 w-4 text-yellow-500" />
                <span>Recent Activity</span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-white">3 Transactions</div>
              <p className="text-gray-400">View all activity</p>
            </CardContent>
          </Card>
        </div>

        {/* Tabs Section */}
        <Tabs defaultValue="analytics" className="space-y-4">
          <TabsList className="bg-tradeiq-card rounded-xl p-1 w-full flex justify-between">
            <TabsTrigger value="analytics" className="data-[state=active]:bg-tradeiq-blue data-[state=active]:text-white rounded-xl transition-all">
              <BarChart3 className="h-4 w-4 mr-2" />
              Analytics
            </TabsTrigger>
            <TabsTrigger value="performance" className="data-[state=active]:bg-tradeiq-blue data-[state=active]:text-white rounded-xl transition-all">
              <PieChart className="h-4 w-4 mr-2" />
              Performance
            </TabsTrigger>
            <TabsTrigger value="watchlist" className="data-[state=active]:bg-tradeiq-blue data-[state=active]:text-white rounded-xl transition-all">
              <Eye className="h-4 w-4 mr-2" />
              Watchlist
            </TabsTrigger>
          </TabsList>
          <TabsContent value="analytics" className="bg-tradeiq-card rounded-xl p-6">
            <h2 className="text-xl font-semibold text-white mb-4">Portfolio Analytics</h2>
            <p className="text-gray-400">Detailed insights into your investment portfolio.</p>
          </TabsContent>
          <TabsContent value="performance" className="bg-tradeiq-card rounded-xl p-6">
            <h2 className="text-xl font-semibold text-white mb-4">Investment Performance</h2>
            <p className="text-gray-400">Track your investment gains and losses over time.</p>
          </TabsContent>
          <TabsContent value="watchlist" className="bg-tradeiq-card rounded-xl p-6">
            <h2 className="text-xl font-semibold text-white mb-4">Your Watchlist</h2>
            <p className="text-gray-400">Keep an eye on your favorite assets.</p>
          </TabsContent>
        </Tabs>

        {/* Quick Actions */}
        <div className="space-y-3">
          <h2 className="text-2xl font-bold text-white">Quick Actions</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
            <Card className="tradeiq-card hover:bg-tradeiq-blue/10 transition-colors duration-200 cursor-pointer">
              <CardContent className="flex items-center space-x-4">
                <Zap className="h-6 w-6 text-tradeiq-blue" />
                <div className="space-y-1">
                  <h3 className="text-lg font-semibold text-white">Start Trading</h3>
                  <p className="text-gray-400 text-sm">Explore market opportunities</p>
                </div>
                <ChevronRight className="ml-auto h-5 w-5 text-gray-500" />
              </CardContent>
            </Card>

            <Card className="tradeiq-card hover:bg-tradeiq-blue/10 transition-colors duration-200 cursor-pointer">
              <CardContent className="flex items-center space-x-4">
                <Clock className="h-6 w-6 text-tradeiq-blue" />
                <div className="space-y-1">
                  <h3 className="text-lg font-semibold text-white">Set Price Alerts</h3>
                  <p className="text-gray-400 text-sm">Never miss a market move</p>
                </div>
                <ChevronRight className="ml-auto h-5 w-5 text-gray-500" />
              </CardContent>
            </Card>

            <Card className="tradeiq-card hover:bg-tradeiq-blue/10 transition-colors duration-200 cursor-pointer">
              <CardContent className="flex items-center space-x-4">
                <Star className="h-6 w-6 text-tradeiq-blue" />
                <div className="space-y-1">
                  <h3 className="text-lg font-semibold text-white">Add to Favorites</h3>
                  <p className="text-gray-400 text-sm">Track your favorite assets</p>
                </div>
                <ChevronRight className="ml-auto h-5 w-5 text-gray-500" />
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Educational Resources */}
        <div className="space-y-3">
          <h2 className="text-2xl font-bold text-white">Learn & Grow</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
            <Card className="tradeiq-card hover:bg-tradeiq-blue/10 transition-colors duration-200 cursor-pointer">
              <CardContent className="flex items-center space-x-4">
                <BookOpen className="h-6 w-6 text-tradeiq-blue" />
                <div className="space-y-1">
                  <h3 className="text-lg font-semibold text-white">Trading Courses</h3>
                  <p className="text-gray-400 text-sm">Master the art of trading</p>
                </div>
                <ChevronRight className="ml-auto h-5 w-5 text-gray-500" />
              </CardContent>
            </Card>

            <Card className="tradeiq-card hover:bg-tradeiq-blue/10 transition-colors duration-200 cursor-pointer">
              <CardContent className="flex items-center space-x-4">
                <Newspaper className="h-6 w-6 text-tradeiq-blue" />
                <div className="space-y-1">
                  <h3 className="text-lg font-semibold text-white">Market News</h3>
                  <p className="text-gray-400 text-sm">Stay updated with the latest trends</p>
                </div>
                <ChevronRight className="ml-auto h-5 w-5 text-gray-500" />
              </CardContent>
            </Card>

            <Card className="tradeiq-card hover:bg-tradeiq-blue/10 transition-colors duration-200 cursor-pointer">
              <CardContent className="flex items-center space-x-4">
                <MessageSquare className="h-6 w-6 text-tradeiq-blue" />
                <div className="space-y-1">
                  <h3 className="text-lg font-semibold text-white">Community Forum</h3>
                  <p className="text-gray-400 text-sm">Connect with fellow traders</p>
                </div>
                <ChevronRight className="ml-auto h-5 w-5 text-gray-500" />
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
