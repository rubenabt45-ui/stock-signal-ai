import { Book, PlayCircle, FileText, TrendingUp, Shield, Brain } from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';

const pdfResources = [
  {
    id: 1,
    title: "Pre-Trade Checklist",
    description: "Avoid emotional decisions and improve your trade execution with this step-by-step checklist.",
    pdfUrl: "/assets/docs/TradeIQ - Pre-Trade Checklist.pdf",
    icon: FileText
  },
  {
    id: 2,
    title: "Top 5 Trading Mistakes",
    description: "Discover the most common pitfalls traders face and how to avoid them to become more consistent.",
    pdfUrl: "/assets/docs/TradeIQ – 5 Trading Mistakes.pdf",
    icon: Shield
  },
  {
    id: 3,
    title: "Visual Dictionary",
    description: "Master essential trading terms with this visual guide to key concepts like support, resistance, RRR, and more.",
    pdfUrl: "/assets/docs/TradeIQ - Visual Dictionary.pdf",
    icon: Book
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
                <div className="text-2xl font-bold text-tradeiq-blue">3</div>
                <div className="text-gray-400">PDF Guides</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-tradeiq-blue">100%</div>
                <div className="text-gray-400">Free</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-tradeiq-blue">∞</div>
                <div className="text-gray-400">Knowledge</div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* PDF Resources */}
        <section>
          <h3 className="text-xl font-bold text-white mb-6">Trading Resources</h3>
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {pdfResources.map((resource) => {
              const IconComponent = resource.icon;
              return (
                <Card key={resource.id} className="tradeiq-card hover:border-tradeiq-blue/50 transition-colors">
                  <CardHeader>
                    <div className="flex items-center space-x-3">
                      <div className="p-2 bg-tradeiq-blue/20 rounded-lg">
                        <IconComponent className="h-6 w-6 text-tradeiq-blue" />
                      </div>
                      <div>
                        <CardTitle className="text-white text-lg">{resource.title}</CardTitle>
                      </div>
                    </div>
                    <CardDescription className="text-gray-400 mt-2">
                      {resource.description}
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <Button 
                      className="tradeiq-button-primary w-full"
                      onClick={() => window.open(resource.pdfUrl, '_blank')}
                    >
                      <FileText className="h-4 w-4 mr-2" />
                      Read PDF
                    </Button>
                  </CardContent>
                </Card>
              );
            })}
          </div>
          <div className="mt-6 text-center">
            <p className="text-gray-400 text-sm">More resources coming soon. Stay tuned!</p>
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
