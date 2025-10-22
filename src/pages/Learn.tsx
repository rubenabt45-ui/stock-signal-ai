import { Book, PlayCircle, FileText, TrendingUp, Shield, Brain, Crown, Lock } from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useTranslationWithFallback } from '@/hooks/useTranslationWithFallback';
import { PageWrapper } from '@/components/PageWrapper';
import { useNavigate } from 'react-router-dom';
import { useSubscription } from '@/hooks/useSubscription';
import { MotionWrapper, StaggerContainer, StaggerItem } from "@/components/ui/motion-wrapper";

// Free educational resources - always available
const freeResources = [{
  id: 1,
  title: "Cracking The Code",
  description: "Read OHLC candles to quickly spot momentum and reversals, time entries/exits, and manage risk with context.",
  pdfUrl: "https://drive.google.com/file/d/1MwpjU5I5JWF-q6ZfFiB4J2UdwutV3YKD/view?usp=drive_link",
  icon: FileText,
  category: "Free"
}, {
  id: 2,
  title: "The Truth About Fixed Income",
  description: "Bonds made simple: yields, duration, credit risk, and a quick checklist to build smarter fixed-income positions.",
  pdfUrl: "https://drive.google.com/file/d/1pq6HbxjebVUmEivUpZLM1MXk1XLncynW/view?usp=drive_link",
  icon: Book,
  category: "Free"
}, {
  id: 3,
  title: "Return, Risk & Diversification",
  description: "In minutes, learn how to estimate expected return, read core risk metrics, and build diversified portfolios that survive volatility.",
  pdfUrl: "https://drive.google.com/file/d/1vRQqtBzMx45ranZv7eR6Iu-PU_Gm5_1I/view?usp=drive_link",
  icon: Shield,
  category: "Free"
}, {
  id: 4,
  title: "Market Analysis Guide",
  description: "Learn how to analyze market trends, identify opportunities, and make informed trading decisions.",
  pdfUrl: "https://drive.google.com/file/d/1MwpjU5I5JWF-q6ZfFiB4J2UdwutV3YKD/view?usp=drive_link",
  icon: TrendingUp,
  category: "Free"
}];

// Educational articles for free users
const educationalArticles = [{
  title: "5 Trading Mistakes",
  description: "Learn the five costly errors—chasing price, over-leveraging, moving stops, revenge trades, and skipping risk rules—and how to avoid them.",
  icon: TrendingUp,
  content: "Technical analysis is the study of price action and volume patterns to predict future market movements...",
  category: "Free"
}, {
  title: "Pre-Trade Checklist",
  description: "What Every Smart Trader Should Ask Before Clicking \"Buy\"",
  icon: PlayCircle,
  content: "Candlestick charts show four key price points: open, high, low, and close for each time period...",
  category: "Free"
}, {
  title: "Key Trading Terms",
  description: "Learn the trading basics in 60s: support, resistance, stop-loss, take-profit, risk-reward, breakout, trend, and liquidity. Save this post and check it before you trade.",
  icon: Shield,
  content: "Risk management is the foundation of successful trading. Learn about position sizing, stop losses...",
  category: "Free"
}, {
  title: "Introduction To Investment Management",
  description: "Master your emotions and develop a winning trader mindset",
  icon: Brain,
  content: "Trading psychology is crucial for success. Learn to control fear, greed, and maintain discipline...",
  category: "Free"
}];

// Pro-only resources
const proResources = [{
  id: 4,
  title: "What Is Your Investment Worth?",
  description: "Buy, sell, or hold? I'll show you a simple, step-by-step way to evaluate your investment so you can act with confidence.",
  icon: TrendingUp,
  category: "Pro",
  isPro: true
}, {
  id: 5,
  title: "Demystifying Quant Investing",
  description: "How data, rules, and algorithms turn market signals into repeatable decisions—without guessing the future.",
  icon: Brain,
  category: "Pro",
  isPro: true
}, {
  id: 6,
  title: "Top Prompts For Chat",
  description: "Best prompt examples to unlock the full potential of the Chat",
  pdfUrl: "https://drive.google.com/uc?export=download&id=1FLs2YI_6U1-aY9e80PCe1nPMw_tn4nL8",
  icon: Brain,
  category: "Pro",
  isPro: true
}, {
  id: 7,
  title: "Algorithmic Trading Fundamentals",
  description: "Learn the basics of automated trading systems and strategy development",
  icon: PlayCircle,
  category: "Pro",
  isPro: true
}];
const Learn = () => {
  const {
    t
  } = useTranslationWithFallback();
  const navigate = useNavigate();
  const {
    isPro
  } = useSubscription();
  const handleGoToTradingChat = () => {
    navigate('/app/strategy-ai');
  };
  const handleUpgrade = () => {
    navigate('/pricing');
  };
  return <PageWrapper pageName="Learn">
      <div className="min-h-screen bg-tradeiq-navy">
        {/* Header */}
        <header className="border-b border-gray-800/50 bg-black/20 backdrop-blur-sm sticky top-0 z-50">
          <MotionWrapper animation="slide" className="container mx-auto px-4 py-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <Book className="h-8 w-8 text-tradeiq-blue" />
                <div>
                  <h1 className="text-2xl font-bold text-white tracking-tight">{t('navigation.learn')}</h1>
                  <p className="text-sm text-gray-400 font-medium">Master Trading Skills</p>
                </div>
              </div>
              <div className="flex items-center space-x-2">
                <Badge variant={isPro ? "default" : "secondary"} className="px-3 py-1">
                  {isPro ? <>
                      <Crown className="h-3 w-3 mr-1 text-yellow-500" />
                      Pro Plan
                    </> : "Free Plan"}
                </Badge>
              </div>
            </div>
          </MotionWrapper>
        </header>

        {/* Content */}
        <main className="container mx-auto px-4 py-6 pb-24">
          <StaggerContainer>
            {/* Hero Section */}
            <StaggerItem>
              <Card className="tradeiq-card bg-gradient-to-r from-tradeiq-blue/20 to-purple-600/20 border-tradeiq-blue/30 mb-8">
            <CardContent className="p-8 text-center">
              <h2 className="text-3xl font-bold text-white mb-4">
                Level Up Your Trading Skills
              </h2>
              <p className="text-gray-300 text-lg mb-6">
                {isPro ? "Access complete trading education and advanced resources." : "Start with essential trading fundamentals. Upgrade for advanced strategies."}
              </p>
              <div className="flex justify-center space-x-6 text-sm">
                <div className="text-center">
                  <div className="text-2xl font-bold text-tradeiq-blue">{isPro ? "6+" : "3"}</div>
                  <div className="text-gray-400">PDF Guides</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-tradeiq-blue">{isPro ? "Unlimited" : "Limited"}</div>
                  <div className="text-gray-400">Access</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-tradeiq-blue">∞</div>
                  <div className="text-gray-400">Knowledge</div>
                </div>
              </div>
              </CardContent>
            </Card>
          </StaggerItem>

          {/* Free Educational Articles */}
          <StaggerItem>
            <section className="mb-8">
              <h3 className="text-xl font-bold text-white mb-6">Essential Trading Education</h3>
            <div className="grid gap-6 md:grid-cols-2">
              {educationalArticles.map((article, index) => {
              const IconComponent = article.icon;
              return <Card key={index} className="tradeiq-card hover:border-tradeiq-blue/50 transition-colors flex flex-col h-full">
                    <CardHeader className="flex-grow">
                      <div className="flex items-center space-x-3">
                        <div className="p-2 bg-tradeiq-blue/20 rounded-lg">
                          <IconComponent className="h-6 w-6 text-tradeiq-blue" />
                        </div>
                        <div>
                          <CardTitle className="text-white text-lg">{article.title}</CardTitle>
                          <Badge variant="outline" className="text-xs mt-1 text-green-400 border-green-400">
                            Free
                          </Badge>
                        </div>
                      </div>
                      <CardDescription className="text-gray-400 mt-2">
                        {article.description}
                      </CardDescription>
                    </CardHeader>
                    <CardContent className="mt-auto">
                      <Button className="tradeiq-button-primary w-full" onClick={() => {/* Could open a modal with article content */}}>
                        <Book className="h-4 w-4 mr-2" />
                        Read Article
                      </Button>
                    </CardContent>
                  </Card>;
              })}
              </div>
            </section>
          </StaggerItem>

          {/* Free PDF Resources */}
          <StaggerItem>
            <section className="mb-8">
              <h3 className="text-xl font-bold text-white mb-6">Free Trading Resources</h3>
            <div className="grid gap-6 md:grid-cols-2">
              {freeResources.map(resource => {
              const IconComponent = resource.icon;
              return <Card key={resource.id} className="tradeiq-card hover:border-tradeiq-blue/50 transition-colors flex flex-col h-full">
                    <CardHeader className="flex-grow">
                      <div className="flex items-center space-x-3">
                        <div className="p-2 bg-tradeiq-blue/20 rounded-lg">
                          <IconComponent className="h-6 w-6 text-tradeiq-blue" />
                        </div>
                        <div>
                          <CardTitle className="text-white text-lg">{resource.title}</CardTitle>
                          <Badge variant="outline" className="text-xs mt-1 text-green-400 border-green-400">
                            Free
                          </Badge>
                        </div>
                      </div>
                      <CardDescription className="text-gray-400 mt-2">
                        {resource.description}
                      </CardDescription>
                    </CardHeader>
                    <CardContent className="mt-auto">
                      <Button className="tradeiq-button-primary w-full" onClick={() => window.open(resource.pdfUrl, '_blank')}>
                        <PlayCircle className="h-4 w-4 mr-2" />
                        Watch Video
                      </Button>
                    </CardContent>
                  </Card>;
              })}
              </div>
            </section>
          </StaggerItem>

          {/* Pro Resources */}
          <StaggerItem>
            <section className="mb-8">
              <div className="flex items-center justify-between mb-6">
              <div className="flex items-center space-x-3">
                <Crown className="h-6 w-6 text-yellow-500" />
                <h3 className="text-xl font-bold text-white">Advanced Pro Resources</h3>
              </div>
              {!isPro && <Button onClick={handleUpgrade} className="bg-yellow-500 hover:bg-yellow-600 text-black">
                  Unlock Pro
                </Button>}
            </div>
            <div className="grid gap-6 md:grid-cols-2">
              {proResources.map((resource, index) => {
              const IconComponent = resource.icon;
              const isLocked = !isPro;
              return <Card key={index} className={`tradeiq-card transition-colors flex flex-col h-full ${isLocked ? 'opacity-75 border-yellow-500/20' : 'hover:border-yellow-500/50 border-yellow-500/20'}`}>
                    <CardHeader className="flex-grow">
                      <div className="flex items-center space-x-3">
                        <div className={`p-2 ${isLocked ? 'bg-gray-700' : 'bg-yellow-500/20'} rounded-lg relative`}>
                          <IconComponent className={`h-6 w-6 ${isLocked ? 'text-gray-400' : 'text-yellow-500'}`} />
                          {isLocked && <Lock className="h-3 w-3 text-gray-400 absolute -top-1 -right-1 bg-gray-800 rounded-full p-0.5" />}
                        </div>
                        <div>
                          <CardTitle className={`text-lg ${isLocked ? 'text-gray-300' : 'text-white'}`}>
                            {resource.title}
                          </CardTitle>
                          <Badge variant="outline" className="text-xs mt-1 text-yellow-400 border-yellow-500/30">
                            Pro Only
                          </Badge>
                        </div>
                      </div>
                      <CardDescription className="text-gray-400 mt-2">
                        {resource.description}
                      </CardDescription>
                    </CardHeader>
                    <CardContent className="mt-auto">
                      {isLocked ? <Button className="w-full bg-yellow-500 hover:bg-yellow-600 text-black" onClick={handleUpgrade}>
                          <Crown className="h-4 w-4 mr-2" />
                          Upgrade to Access
                        </Button> : <Button className="w-full bg-yellow-500 hover:bg-yellow-600 text-black" onClick={() => resource.pdfUrl && window.open(resource.pdfUrl, '_blank')}>
                          <FileText className="h-4 w-4 mr-2" />
                          {resource.pdfUrl ? 'Download PDF' : 'Read Guide'}
                        </Button>}
                    </CardContent>
                  </Card>;
              })}
              </div>
            </section>
          </StaggerItem>

          {/* Upgrade Call to Action for Free Users */}
          {!isPro && <StaggerItem>
              <Card className="tradeiq-card border-yellow-500/20 bg-gradient-to-r from-yellow-500/10 to-orange-500/10 mb-8">
              <CardContent className="p-6 text-center">
                <Crown className="h-12 w-12 text-yellow-500 mx-auto mb-4" />
                <h3 className="text-xl font-bold text-white mb-2">Ready for Advanced Training?</h3>
                <p className="text-gray-400 mb-4">
                  Unlock advanced strategies, exclusive resources, and unlimited StrategyAI analysis.
                </p>
                <div className="flex flex-col sm:flex-row gap-3 justify-center">
                  <Button className="bg-yellow-500 hover:bg-yellow-600 text-black" onClick={handleUpgrade}>
                    <Crown className="h-4 w-4 mr-2" />
                    See Pro Plans
                  </Button>
                  
                  </div>
                </CardContent>
              </Card>
            </StaggerItem>}

          {/* Call to Action for Pro Users */}
          {isPro && <StaggerItem>
              <Card className="tradeiq-card border-green-500/20 bg-green-500/5 mb-8">
              <CardContent className="p-6 text-center">
                <h3 className="text-lg font-bold text-white mb-2">Ready to Start Trading?</h3>
                <p className="text-gray-400 mb-4">
                  Apply what you've learned with our AI-powered trading tools and real-time market analysis.
                </p>
                <Button className="tradeiq-button-primary" onClick={handleGoToTradingChat}>
                  Go to StrategyAI
                  </Button>
                </CardContent>
              </Card>
            </StaggerItem>}

          {/* Investment Disclaimer */}
          <StaggerItem>
            <Card className="tradeiq-card border-yellow-500/20 bg-yellow-500/5">
            <CardContent className="p-4">
              <p className="text-xs text-gray-400 text-center leading-relaxed">
                <strong className="text-yellow-400">Disclaimer:</strong> TradeIQ provides educational content and market analysis tools. 
                None of the information provided should be considered financial advice or a recommendation to invest. 
                Always do your own research and consult with a financial advisor before making investment decisions.
                </p>
              </CardContent>
            </Card>
          </StaggerItem>
        </StaggerContainer>
        </main>
      </div>
    </PageWrapper>;
};
export default Learn;