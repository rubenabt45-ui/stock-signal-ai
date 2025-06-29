import { Book, PlayCircle, FileText, TrendingUp, Shield, Brain } from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';

const lessons = [
  {
    id: 1,
    title: "Trading Basics",
    description: "Learn the fundamentals of trading, market terminology, and basic concepts.",
    duration: "15 min",
    level: "Beginner",
    icon: Book,
    topics: ["Market Orders", "Limit Orders", "Bid/Ask Spread", "Market Hours"]
  },
  {
    id: 2,
    title: "Technical Analysis",
    description: "Master chart patterns, indicators, and technical analysis techniques.",
    duration: "25 min",
    level: "Intermediate",
    icon: TrendingUp,
    topics: ["Chart Patterns", "Moving Averages", "RSI", "MACD", "Support/Resistance"]
  },
  {
    id: 3,
    title: "Risk Management",
    description: "Essential strategies to protect your capital and manage trading risks.",
    duration: "20 min",
    level: "Beginner",
    icon: Shield,
    topics: ["Position Sizing", "Stop Losses", "Risk/Reward Ratio", "Portfolio Diversification"]
  },
  {
    id: 4,
    title: "AI Trading Tools",
    description: "Learn how to use AI-powered analysis and automated trading features.",
    duration: "18 min",
    level: "Advanced",
    icon: Brain,
    topics: ["AI Signals", "Pattern Recognition", "Sentiment Analysis", "Automated Alerts"]
  }
];

const resources = [
  {
    title: "Trading Glossary",
    description: "Complete dictionary of trading terms and definitions",
    icon: FileText,
    type: "Reference"
  },
  {
    title: "Market Analysis Videos",
    description: "Weekly market analysis and trading strategy videos",
    icon: PlayCircle,
    type: "Video"
  },
  {
    title: "Trading Psychology Guide",
    description: "Master the mental aspects of successful trading",
    icon: Brain,
    type: "Guide"
  }
];

const Learn = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();

  const getLevelColor = (level: string) => {
    switch (level) {
      case 'Beginner': return 'bg-green-500/10 text-green-400 border-green-500/20';
      case 'Intermediate': return 'bg-yellow-500/10 text-yellow-400 border-yellow-500/20';
      case 'Advanced': return 'bg-red-500/10 text-red-400 border-red-500/20';
      default: return 'bg-gray-500/10 text-gray-400 border-gray-500/20';
    }
  };

  const handleGoToTradingChat = () => {
    navigate('/trading-chat');
  };

  return (
    <div className="min-h-screen bg-tradeiq-navy">
      {/* Header */}
      <header className="border-b border-gray-800/50 bg-black/20 backdrop-blur-sm sticky top-0 z-50">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center space-x-3">
            <Book className="h-8 w-8 text-tradeiq-blue" />
            <div>
              <h1 className="text-2xl font-bold text-white tracking-tight">{t('navigation.learn')}</h1>
              <p className="text-sm text-gray-400 font-medium">Master Trading Skills</p>
            </div>
          </div>
        </div>
      </header>

      {/* Content */}
      <main className="container mx-auto px-4 py-6 pb-24 space-y-8">
        {/* Hero Section */}
        <Card className="tradeiq-card bg-gradient-to-r from-tradeiq-blue/20 to-purple-600/20 border-tradeiq-blue/30">
          <CardContent className="p-8 text-center">
            <h2 className="text-3xl font-bold text-white mb-4">
              Level Up Your Trading Skills
            </h2>
            <p className="text-gray-300 text-lg mb-6">
              From basics to advanced strategies, learn everything you need to become a successful trader.
            </p>
            <div className="flex justify-center space-x-6 text-sm">
              <div className="text-center">
                <div className="text-2xl font-bold text-tradeiq-blue">4</div>
                <div className="text-gray-400">Courses</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-tradeiq-blue">78</div>
                <div className="text-gray-400">Minutes</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-tradeiq-blue">∞</div>
                <div className="text-gray-400">Progress</div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Lessons */}
        <section>
          <h3 className="text-xl font-bold text-white mb-6">Trading Courses</h3>
          <div className="grid gap-6 md:grid-cols-2">
            {lessons.map((lesson) => {
              const IconComponent = lesson.icon;
              return (
                <Card key={lesson.id} className="tradeiq-card hover:border-tradeiq-blue/50 transition-colors">
                  <CardHeader>
                    <div className="flex items-start justify-between">
                      <div className="flex items-center space-x-3">
                        <div className="p-2 bg-tradeiq-blue/20 rounded-lg">
                          <IconComponent className="h-6 w-6 text-tradeiq-blue" />
                        </div>
                        <div>
                          <CardTitle className="text-white">{lesson.title}</CardTitle>
                          <div className="flex items-center space-x-2 mt-1">
                            <Badge variant="outline" className={getLevelColor(lesson.level)}>
                              {lesson.level}
                            </Badge>
                            <span className="text-xs text-gray-500">{lesson.duration}</span>
                          </div>
                        </div>
                      </div>
                    </div>
                    <CardDescription className="text-gray-400 mt-2">
                      {lesson.description}
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      <div>
                        <p className="text-sm font-medium text-gray-300 mb-2">What you'll learn:</p>
                        <div className="flex flex-wrap gap-2">
                          {lesson.topics.map((topic, index) => (
                            <Badge
                              key={index}
                              variant="secondary"
                              className="bg-black/30 text-gray-400 text-xs"
                            >
                              {topic}
                            </Badge>
                          ))}
                        </div>
                      </div>
                      <Button className="tradeiq-button-primary w-full">
                        <PlayCircle className="h-4 w-4 mr-2" />
                        Start Course
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </section>

        {/* Resources */}
        <section>
          <h3 className="text-xl font-bold text-white mb-6">Additional Resources</h3>
          <div className="grid gap-4 md:grid-cols-3">
            {resources.map((resource, index) => {
              const IconComponent = resource.icon;
              return (
                <Card key={index} className="tradeiq-card hover:border-tradeiq-blue/50 transition-colors">
                  <CardContent className="p-6">
                    <div className="flex items-start space-x-3">
                      <div className="p-2 bg-tradeiq-blue/20 rounded-lg">
                        <IconComponent className="h-5 w-5 text-tradeiq-blue" />
                      </div>
                      <div className="flex-1">
                        <h4 className="font-semibold text-white mb-1">{resource.title}</h4>
                        <p className="text-sm text-gray-400 mb-3">{resource.description}</p>
                        <Badge variant="outline" className="text-xs border-gray-600 text-gray-400">
                          {resource.type}
                        </Badge>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </section>

        {/* Call to Action */}
        <Card className="tradeiq-card border-green-500/20 bg-green-500/5">
          <CardContent className="p-6 text-center">
            <h3 className="text-lg font-bold text-white mb-2">Ready to Start Trading?</h3>
            <p className="text-gray-400 mb-4">
              Apply what you've learned with our AI-powered trading tools and real-time market analysis.
            </p>
            <Button className="tradeiq-button-primary" onClick={handleGoToTradingChat}>
              Go to Trading Chat
            </Button>
          </CardContent>
        </Card>
      </main>
    </div>
  );
};

export default Learn;
