import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { LanguageSelector } from '@/components/LanguageSelector';
import { useTranslation } from 'react-i18next';
import { 
  TrendingUp, 
  Brain, 
  Calendar, 
  BarChart3, 
  MessageCircle, 
  BookOpen,
  ChevronRight,
  Activity,
  Clock,
  Star
} from 'lucide-react';
import { Link } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { useSubscription } from '@/hooks/useSubscription';

const Dashboard = () => {
  const { user } = useAuth();
  const { isPro } = useSubscription();
  const { t } = useTranslation();

  const quickActions = [
    {
      title: t('dashboard.strategyAI.title'),
      description: t('dashboard.strategyAI.description'),
      icon: Brain,
      link: "/app/strategy-ai",
      color: "text-blue-400",
      bgColor: "bg-blue-500/20"
    },
    {
      title: t('dashboard.learn.title'),
      description: t('dashboard.learn.description'),
      icon: BookOpen,
      link: "/app/learn",
      color: "text-green-400",
      bgColor: "bg-green-500/20"
    },
    {
      title: t('dashboard.events.title'),
      description: t('dashboard.events.description'),
      icon: Calendar,
      link: "/app/events",
      color: "text-purple-400",
      bgColor: "bg-purple-500/20",
      badge: t('learn.comingSoon')
    },
    {
      title: t('dashboard.marketUpdates.title'),
      description: t('dashboard.marketUpdates.description'),
      icon: BarChart3,
      link: "/app/market-updates",
      color: "text-orange-400",
      bgColor: "bg-orange-500/20",
      badge: "Future"
    }
  ];

  const recentActivity = [
    {
      title: "StrategyAI Session",
      description: "Analyzed AAPL chart patterns",
      time: "2 hours ago",
      icon: MessageCircle
    },
    {
      title: "Learn Module Completed",
      description: "Risk Management Fundamentals",
      time: "1 day ago",
      icon: BookOpen
    },
    {
      title: "Market Alert",
      description: "SPY reached support level",
      time: "3 days ago",
      icon: TrendingUp
    }
  ];

  return (
    <div className="min-h-screen bg-tradeiq-navy p-6">
      <div className="max-w-7xl mx-auto space-y-8">
        {/* Welcome Section */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-white mb-2">
              {t('dashboard.welcomeBack')}{user?.email ? `, ${user.email.split('@')[0]}` : ''}
            </h1>
            <p className="text-gray-400">
              {t('dashboard.subtitle')}
            </p>
          </div>
          <div className="flex items-center space-x-2">
            <LanguageSelector variant="app" />
            <Badge variant={isPro ? "default" : "secondary"} className="px-3 py-1">
              {isPro ? (
                <>
                  <Star className="h-3 w-3 mr-1" />
                  {t('dashboard.plan.pro')}
                </>
              ) : (
                t('dashboard.plan.free')
              )}
            </Badge>
          </div>
        </div>

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
          <h2 className="text-2xl font-bold text-white mb-6">{t('dashboard.quickActions')}</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {quickActions.map((action, index) => (
              <Card key={index} className="tradeiq-card hover:border-tradeiq-blue/50 transition-all duration-300 hover:transform hover:scale-105">
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <div className={`p-2 ${action.bgColor} rounded-lg`}>
                      <action.icon className={`h-6 w-6 ${action.color}`} />
                    </div>
                    {action.badge && (
                      <Badge variant="outline" className="text-xs">
                        {action.badge}
                      </Badge>
                    )}
                  </div>
                  <CardTitle className="text-white text-lg">{action.title}</CardTitle>
                </CardHeader>
                <CardContent>
                  <CardDescription className="text-gray-300 mb-4">
                    {action.description}
                  </CardDescription>
                  <Link to={action.link}>
                    <Button 
                      variant="outline" 
                      size="sm" 
                      className="w-full"
                      disabled={action.badge === t('learn.comingSoon') || action.badge === "Future"}
                    >
                      {action.badge === t('learn.comingSoon') || action.badge === "Future" ? action.badge : t('pricing.getStarted')}
                      {!action.badge && <ChevronRight className="ml-2 h-4 w-4" />}
                    </Button>
                  </Link>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>

        {/* Recent Activity & Pro Features */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Recent Activity */}
          <Card className="tradeiq-card">
            <CardHeader>
              <CardTitle className="text-white flex items-center">
                <Activity className="h-5 w-5 mr-2" />
                {t('dashboard.recentActivity')}
              </CardTitle>
              <CardDescription className="text-gray-400">
                Your latest trading activities and updates
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {recentActivity.map((activity, index) => (
                  <div key={index} className="flex items-start space-x-3 p-3 bg-gray-800/30 rounded-lg">
                    <div className="p-1 bg-tradeiq-blue/20 rounded">
                      <activity.icon className="h-4 w-4 text-tradeiq-blue" />
                    </div>
                    <div className="flex-1">
                      <p className="text-white text-sm font-medium">{activity.title}</p>
                      <p className="text-gray-400 text-xs">{activity.description}</p>
                      <p className="text-gray-500 text-xs mt-1">{activity.time}</p>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Pro Features / Upgrade */}
          <Card className="tradeiq-card">
            <CardHeader>
              <CardTitle className="text-white flex items-center">
                <Star className="h-5 w-5 mr-2" />
                {isPro ? 'Pro Features' : 'Upgrade to Pro'}
              </CardTitle>
              <CardDescription className="text-gray-400">
                {isPro ? 'You have access to all premium features' : 'Unlock advanced trading tools and unlimited access'}
              </CardDescription>
            </CardHeader>
            <CardContent>
              {isPro ? (
                <div className="space-y-3">
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
                    Early access to new features
                  </div>
                </div>
              ) : (
                <div className="space-y-4">
                  <div className="space-y-2">
                    <div className="flex items-center text-gray-300 text-sm">
                      <div className="w-2 h-2 bg-gray-500 rounded-full mr-2"></div>
                      Unlimited StrategyAI messages
                    </div>
                    <div className="flex items-center text-gray-300 text-sm">
                      <div className="w-2 h-2 bg-gray-500 rounded-full mr-2"></div>
                      Complete chat history
                    </div>
                    <div className="flex items-center text-gray-300 text-sm">
                      <div className="w-2 h-2 bg-gray-500 rounded-full mr-2"></div>
                      Priority support
                    </div>
                  </div>
                  <Link to="/pricing">
                    <Button className="w-full bg-tradeiq-blue hover:bg-tradeiq-blue/90">
                      Upgrade to Pro
                      <ChevronRight className="ml-2 h-4 w-4" />
                    </Button>
                  </Link>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;