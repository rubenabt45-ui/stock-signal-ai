import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { LanguageSelector } from '@/components/LanguageSelector';
import { useTranslationWithFallback } from '@/hooks/useTranslationWithFallback';
import { PageWrapper } from '@/components/PageWrapper';
import { TrendingUp, Brain, Calendar, BarChart3, MessageCircle, BookOpen, ChevronRight, Activity, Clock, Star, Crown, Lock, Gift, Zap, Target } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useAuth } from '@/providers/AuthProvider';
import { useSubscription } from '@/hooks/useSubscription';
const Dashboard = () => {
  const {
    user
  } = useAuth();
  const {
    isPro
  } = useSubscription();
  const {
    t
  } = useTranslationWithFallback();

  // Different quick actions for free vs pro users
  const freeUserActions = [{
    title: "Trading Chat",
    description: "Experience AI-powered trading analysis in real time using sample market data.",
    icon: Brain,
    link: "/app/strategy-ai",
    color: "text-blue-400",
    bgColor: "bg-blue-500/20",
    badge: "Demo"
  }, {
    title: "Learn Center",
    description: "Access essential trading guides and educational resources",
    icon: BookOpen,
    link: "/app/learn",
    color: "text-green-400",
    bgColor: "bg-green-500/20",
    badge: "Free"
  }, {
    title: "ChartAI",
    description: "Advanced charting with AI-powered technical analysis",
    icon: BarChart3,
    link: "/app/chartia",
    color: "text-purple-400",
    bgColor: "bg-purple-500/20",
    badge: "Demo"
  }, {
    title: "NewsAI",
    description: "Unlock unlimited AI analysis and advanced features",
    icon: Crown,
    link: "/app/market-updates",
    color: "text-yellow-400",
    bgColor: "bg-yellow-500/20",
    badge: "Upgrade"
  }];
  const proUserActions = [{
    title: t('dashboard.strategyAI.title'),
    description: t('dashboard.strategyAI.description'),
    icon: Brain,
    link: "/app/strategy-ai",
    color: "text-blue-400",
    bgColor: "bg-blue-500/20"
  }, {
    title: t('dashboard.learn.title'),
    description: t('dashboard.learn.description'),
    icon: BookOpen,
    link: "/app/learn",
    color: "text-green-400",
    bgColor: "bg-green-500/20"
  }, {
    title: t('dashboard.events.title'),
    description: t('dashboard.events.description'),
    icon: Calendar,
    link: "/app/events",
    color: "text-purple-400",
    bgColor: "bg-purple-500/20",
    badge: t('learn.comingSoon')
  }, {
    title: t('dashboard.marketUpdates.title'),
    description: t('dashboard.marketUpdates.description'),
    icon: BarChart3,
    link: "/app/market-updates",
    color: "text-orange-400",
    bgColor: "bg-orange-500/20",
    badge: "Future"
  }];
  const quickActions = isPro ? proUserActions : freeUserActions;

  // Educational tips for free users
  const educationalTips = [{
    title: "Start with Risk Management",
    description: "Never risk more than 1-2% of your account on a single trade",
    icon: Target,
    color: "text-green-400"
  }, {
    title: "Learn Chart Patterns",
    description: "Master support, resistance, and trend lines before advanced patterns",
    icon: TrendingUp,
    color: "text-blue-400"
  }, {
    title: "Practice with Demo Accounts",
    description: "Build confidence with paper trading before using real money",
    icon: Zap,
    color: "text-purple-400"
  }];
  const recentActivity = isPro ? [{
    title: "StrategyAI Analysis",
    description: "Analyzed AAPL chart patterns",
    time: "2 hours ago",
    icon: MessageCircle
  }, {
    title: "Pro Guide Downloaded",
    description: "Advanced Options Strategies",
    time: "1 day ago",
    icon: BookOpen
  }, {
    title: "Market Alert",
    description: "SPY reached support level",
    time: "3 days ago",
    icon: TrendingUp
  }] : [{
    title: "Demo Analysis Viewed",
    description: "Explored StrategyAI sample analysis",
    time: "1 hour ago",
    icon: Brain
  }, {
    title: "Guide Downloaded",
    description: "Pre-Trade Checklist PDF",
    time: "2 days ago",
    icon: BookOpen
  }, {
    title: "Account Created",
    description: "Welcome to TradeIQ!",
    time: "3 days ago",
    icon: Gift
  }];
  return <PageWrapper pageName="Dashboard">
      <div className="min-h-screen bg-tradeiq-navy p-6">
        <div className="max-w-7xl mx-auto space-y-8">
          {/* Welcome Section */}
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-white mb-2">
                {t('dashboard.welcomeBack')}{user?.email ? `, ${user.email.split('@')[0]}` : ''}
              </h1>
              <p className="text-gray-400">
                {isPro ? "Access all premium features and unlimited AI analysis" : "Start your trading journey with free educational resources"}
              </p>
            </div>
            <div className="flex items-center space-x-2">
              <LanguageSelector variant="app" />
              <Badge variant={isPro ? "default" : "secondary"} className="px-3 py-1">
                {isPro ? <>
                    <Crown className="h-3 w-3 mr-1 text-yellow-500" />
                    Pro Plan
                  </> : "Free Plan"}
              </Badge>
            </div>
          </div>

          {/* Plan Status Card for Free Users */}
          {!isPro && <Card className="tradeiq-card border-yellow-500/30 bg-gradient-to-r from-yellow-500/10 to-orange-500/10">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-4">
                    <div className="p-3 bg-yellow-500/20 rounded-lg">
                      <Gift className="h-8 w-8 text-yellow-500" />
                    </div>
                    <div>
                      <h3 className="text-xl font-bold text-white">You're on the Free Plan</h3>
                      <p className="text-gray-300">
                        Enjoy basic features and educational resources. Upgrade for unlimited access!
                      </p>
                    </div>
                  </div>
                  <Link to="/pricing">
                    <Button className="bg-yellow-500 hover:bg-yellow-600 text-black font-semibold">
                      <Crown className="h-4 w-4 mr-2" />
                      Upgrade Now
                    </Button>
                  </Link>
                </div>
              </CardContent>
            </Card>}

          {/* Quick Stats */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <Card className="tradeiq-card">
              <CardContent className="p-6">
                <div className="flex items-center">
                  <div className="p-2 bg-blue-500/20 rounded-lg">
                    <Activity className="h-6 w-6 text-blue-400" />
                  </div>
                  <div className="ml-4">
                    <p className="text-2xl font-bold text-white">24/7</p>
                    <p className="text-gray-400 text-sm">{t('dashboard.marketMonitoring')}</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="tradeiq-card">
              <CardContent className="p-6">
                <div className="flex items-center">
                  <div className="p-2 bg-green-500/20 rounded-lg">
                    <TrendingUp className="h-6 w-6 text-green-400" />
                  </div>
                  <div className="ml-4">
                    <p className="text-2xl font-bold text-white">95%</p>
                    <p className="text-gray-400 text-sm">{t('dashboard.patternAccuracy')}</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="tradeiq-card">
              <CardContent className="p-6">
                <div className="flex items-center">
                  <div className="p-2 bg-purple-500/20 rounded-lg">
                    <Clock className="h-6 w-6 text-purple-400" />
                  </div>
                  <div className="ml-4">
                    <p className="text-2xl font-bold text-white">&lt; 1s</p>
                    <p className="text-gray-400 text-sm">{t('dashboard.analysisSpeed')}</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Quick Actions */}
          <div>
            <h2 className="text-2xl font-bold text-white mb-6">
              {isPro ? t('dashboard.quickActions') : 'Get Started'}
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {quickActions.map((action, index) => <Card key={index} className="tradeiq-card hover:border-tradeiq-blue/50 transition-all duration-300">
                  <CardHeader className="space-y-6">
                    <div className={`w-12 h-12 ${action.bgColor} rounded-lg flex items-center justify-center`}>
                      <action.icon className={`h-6 w-6 ${action.color}`} />
                    </div>
                    <div className="space-y-2">
                      <CardTitle className="text-white text-xl font-semibold">{action.title}</CardTitle>
                      <CardDescription className="text-gray-400 text-sm">
                        {action.description}
                      </CardDescription>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <Link to={action.link}>
                      <Button variant="outline" size="lg" className="w-full text-base" disabled={action.badge === t('learn.comingSoon') || action.badge === "Future"}>
                        Get Started
                        <ChevronRight className="ml-2 h-5 w-5" />
                      </Button>
                    </Link>
                  </CardContent>
                </Card>)}
            </div>
          </div>

          {/* Content Grid - Different for Free vs Pro Users */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Recent Activity */}
            <Card className="tradeiq-card">
              <CardHeader>
                <CardTitle className="text-white flex items-center">
                  <Activity className="h-5 w-5 mr-2" />
                  {t('dashboard.recentActivity')}
                </CardTitle>
                <CardDescription className="text-gray-400">
                  Your latest activities and updates
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {recentActivity.map((activity, index) => <div key={index} className="flex items-start space-x-3 p-3 bg-gray-800/30 rounded-lg">
                      <div className="p-1 bg-tradeiq-blue/20 rounded">
                        <activity.icon className="h-4 w-4 text-tradeiq-blue" />
                      </div>
                      <div className="flex-1">
                        <p className="text-white text-sm font-medium">{activity.title}</p>
                        <p className="text-gray-400 text-xs">{activity.description}</p>
                        <p className="text-gray-500 text-xs mt-1">{activity.time}</p>
                      </div>
                    </div>)}
                </div>
              </CardContent>
            </Card>

            {/* Pro Features / Educational Tips */}
            <Card className="tradeiq-card">
              <CardHeader>
                <CardTitle className="text-white flex items-center">
                  {isPro ? <>
                      <Star className="h-5 w-5 mr-2" />
                      Pro Features Active
                    </> : <>
                      <BookOpen className="h-5 w-5 mr-2" />
                      Trading Tips
                    </>}
                </CardTitle>
                <CardDescription className="text-gray-400">
                  {isPro ? 'You have access to all premium features' : 'Essential tips to get started with trading'}
                </CardDescription>
              </CardHeader>
              <CardContent>
                {isPro ? <div className="space-y-3">
                    <div className="flex items-center text-green-400 text-sm">
                      <div className="w-2 h-2 bg-green-400 rounded-full mr-2"></div>
                      Unlimited StrategyAI messages
                    </div>
                    <div className="flex items-center text-green-400 text-sm">
                      <div className="w-2 h-2 bg-green-400 rounded-full mr-2"></div>
                      Complete chat history
                    </div>
                    <div className="flex items-center text-green-400 text-sm">
                      <div className="w-2 h-2 bg-green-400 rounded-full mr-2"></div>
                      Priority support
                    </div>
                    <div className="flex items-center text-green-400 text-sm">
                      <div className="w-2 h-2 bg-green-400 rounded-full mr-2"></div>
                      Advanced learning resources
                    </div>
                  </div> : <div className="space-y-4">
                    {educationalTips.map((tip, index) => <div key={index} className="flex items-start space-x-3">
                        <div className="p-1 bg-gray-700 rounded">
                          <tip.icon className={`h-4 w-4 ${tip.color}`} />
                        </div>
                        <div>
                          <p className="text-white text-sm font-medium">{tip.title}</p>
                          <p className="text-gray-400 text-xs">{tip.description}</p>
                        </div>
                      </div>)}
                    <Link to="/pricing">
                      <Button className="w-full bg-tradeiq-blue hover:bg-tradeiq-blue/90 mt-4">
                        Unlock Pro Features
                        <ChevronRight className="ml-2 h-4 w-4" />
                      </Button>
                    </Link>
                  </div>}
              </CardContent>
            </Card>
          </div>

          {/* Free User Upgrade Reminder */}
          {!isPro && <Card className="tradeiq-card border-blue-500/30 bg-gradient-to-r from-blue-500/10 to-purple-500/10">
              <CardContent className="p-6 text-center">
                <Crown className="h-12 w-12 text-blue-500 mx-auto mb-4" />
                <h3 className="text-xl font-bold text-white mb-2">Ready to Level Up?</h3>
                <p className="text-gray-400 mb-6">
                  Get unlimited StrategyAI analysis, advanced learning resources, and priority support.
                </p>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
                  <div className="text-center">
                    <div className="text-lg font-bold text-blue-400">∞</div>
                    <div className="text-xs text-gray-500">AI Analysis</div>
                  </div>
                  <div className="text-center">
                    <div className="text-lg font-bold text-green-400">24/7</div>
                    <div className="text-xs text-gray-500">Support</div>
                  </div>
                  <div className="text-center">
                    <div className="text-lg font-bold text-purple-400">6+</div>
                    <div className="text-xs text-gray-500">Pro Guides</div>
                  </div>
                  <div className="text-center">
                    <div className="text-lg font-bold text-yellow-400">$19</div>
                    <div className="text-xs text-gray-500">Per Month</div>
                  </div>
                </div>
                <Link to="/pricing">
                  <Button className="bg-blue-500 hover:bg-blue-600 text-white font-semibold px-8">
                    See All Pro Features
                    <ChevronRight className="ml-2 h-4 w-4" />
                  </Button>
                </Link>
              </CardContent>
            </Card>}
        </div>
      </div>
    </PageWrapper>;
};
export default Dashboard;