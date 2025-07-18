import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { LanguageSelector } from '@/components/LanguageSelector';
import { useTranslation } from 'react-i18next';
import { 
  TrendingUp, 
  Brain, 
  BarChart3, 
  MessageCircle, 
  Zap, 
  Target, 
  Clock, 
  Shield,
  ChevronRight,
  Star
} from 'lucide-react';

const Landing = () => {
  const navigate = useNavigate();
  const { t } = useTranslation();

  // 🚀 COMPREHENSIVE NAVIGATION HANDLERS WITH DEBUGGING
  const handleNavigation = (path: string, logMessage: string) => {
    return (e?: React.MouseEvent) => {
      console.log(`🔥 ${logMessage} - event captured`);
      console.log(`📍 Current route: ${window.location.pathname}`);
      console.log(`🎯 Target route: ${path}`);
      
      if (e) {
        console.log("Event details:", e.type, e.target);
      }
      
      try {
        console.log(`🚀 Attempting navigation to ${path}`);
        navigate(path);
        console.log(`✅ Navigation to ${path} successful`);
      } catch (error) {
        console.error(`❌ Navigation to ${path} failed, using fallback:`, error);
        // Force navigation as fallback with slight delay to avoid race conditions
        setTimeout(() => {
          console.log(`🔄 Fallback navigation to ${path} via window.location`);
          window.location.href = path;
        }, 100);
      }
    };
  };

  // Individual navigation handlers for all CTAs
  const handleLoginClick = handleNavigation('/login', 'Login button clicked');
  const handleSignUpClick = handleNavigation('/signup', 'Sign Up button clicked');
  const handlePricingClick = handleNavigation('/pricing', 'Pricing link clicked');
  const handleLearnPreviewClick = handleNavigation('/learn-preview', 'Learn Preview link clicked');
  const handleAppClick = handleNavigation('/app', 'Platform/App link clicked');
  const handleJoinBetaClick = handleNavigation('/signup', 'Join the Beta button clicked');
  const handleDemoClick = handleNavigation('/signup', 'Demo/Request Access button clicked');

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-black text-white">
      {/* Navigation */}
      <nav className="border-b border-gray-800/50 bg-black/20 backdrop-blur-sm sticky top-0 z-50 relative">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between relative z-10">
          <div className="flex items-center space-x-2">
            <TrendingUp className="h-8 w-8 text-tradeiq-blue" />
            <span className="text-xl font-bold">TradeIQ</span>
            <Badge variant="secondary" className="text-xs">BETA</Badge>
          </div>
          
          <div className="hidden md:flex items-center space-x-6">
            <Link to="/" onClick={handleNavigation('/', 'Home link clicked')} className="text-gray-300 hover:text-white transition-all duration-300 hover:scale-105 focus:outline-none focus:ring-2 focus:ring-white/20 rounded px-2 py-1">{t('landing.navbar.home')}</Link>
            <Link to="/learn-preview" onClick={handleLearnPreviewClick} className="text-gray-300 hover:text-white transition-all duration-300 hover:scale-105 focus:outline-none focus:ring-2 focus:ring-white/20 rounded px-2 py-1">{t('landing.navbar.learnPreview')}</Link>
            <Link to="/pricing" onClick={handlePricingClick} className="text-gray-300 hover:text-white transition-all duration-300 hover:scale-105 focus:outline-none focus:ring-2 focus:ring-white/20 rounded px-2 py-1">{t('landing.navbar.pricing')}</Link>
            <div className="flex items-center space-x-2">
              {/* Language Selector */}
              <LanguageSelector variant="landing" />
              
              {/* 🚨 BULLETPROOF LOGIN BUTTON - DESKTOP */}
              <Link to="/login" className="inline-block">
                <Button 
                  variant="ghost" 
                  size="sm" 
                  className="text-gray-300 hover:text-white hover:bg-white/10 transition-all duration-300 focus:ring-2 focus:ring-white/20 hover:scale-105 cursor-pointer"
                  onClick={(e) => {
                    console.log('🚨 DESKTOP LOGIN BUTTON CLICKED!');
                    console.log('Event captured:', e.type, e.target);
                    console.log('Current URL:', window.location.href);
                    
                    // Double-ensure navigation
                    try {
                      console.log('🚀 Attempting navigate to /login');
                      e.preventDefault(); // Prevent Link default to control navigation
                      navigate('/login');
                      console.log('✅ Navigate successful');
                    } catch (error) {
                      console.error('❌ Navigate failed, using window.location:', error);
                      window.location.href = '/login';
                    }
                  }}
                  onMouseDown={(e) => {
                    console.log('🖱️ Login button mouse down detected');
                  }}
                  onMouseUp={(e) => {
                    console.log('🖱️ Login button mouse up detected');
                  }}
                >
                  {t('landing.navbar.login')}
                </Button>
              </Link>
              
              {/* Sign Up Button */}
              <Link to="/signup" className="inline-block">
                <Button 
                  variant="outline" 
                  size="sm" 
                  className="border-gray-600 hover:border-white hover:bg-white/10 transition-all duration-300 focus:ring-2 focus:ring-white/20 hover:scale-105 cursor-pointer"
                  onClick={(e) => {
                    console.log('🚨 DESKTOP SIGNUP BUTTON CLICKED!');
                    try {
                      e.preventDefault();
                      navigate('/signup');
                      console.log('✅ Signup navigate successful');
                    } catch (error) {
                      console.error('❌ Signup navigate failed:', error);
                      window.location.href = '/signup';
                    }
                  }}
                >
                  {t('landing.navbar.signUp')}
                </Button>
              </Link>
            </div>
          </div>

          <div className="md:hidden flex items-center space-x-2">
            {/* Language Selector */}
            <LanguageSelector variant="landing" />
            
            {/* 🚨 BULLETPROOF LOGIN BUTTON - MOBILE */}
            <Link to="/login" className="inline-block">
              <Button 
                variant="ghost" 
                size="sm" 
                className="text-gray-300 hover:text-white hover:bg-white/10 transition-all duration-300 focus:ring-2 focus:ring-white/20 hover:scale-105 cursor-pointer"
                onClick={(e) => {
                  console.log('🚨 MOBILE LOGIN BUTTON CLICKED!');
                  console.log('Event captured:', e.type, e.target);
                  console.log('Current URL:', window.location.href);
                  
                  // Double-ensure navigation
                  try {
                    console.log('🚀 Attempting navigate to /login (mobile)');
                    e.preventDefault(); // Prevent Link default to control navigation
                    navigate('/login');
                    console.log('✅ Mobile navigate successful');
                  } catch (error) {
                    console.error('❌ Mobile navigate failed, using window.location:', error);
                    window.location.href = '/login';
                  }
                }}
                onTouchStart={(e) => {
                  console.log('📱 Mobile login touch start detected');
                }}
                onTouchEnd={(e) => {
                  console.log('📱 Mobile login touch end detected');
                }}
              >
                {t('landing.navbar.login')}
              </Button>
            </Link>
            
            {/* Mobile Sign Up Button */}
            <Link to="/signup" className="inline-block">
              <Button 
                variant="outline" 
                size="sm" 
                className="border-gray-600 hover:border-white hover:bg-white/10 transition-all duration-300 focus:ring-2 focus:ring-white/20 hover:scale-105 cursor-pointer"
                onClick={(e) => {
                  console.log('🚨 MOBILE SIGNUP BUTTON CLICKED!');
                  try {
                    e.preventDefault();
                    navigate('/signup');
                    console.log('✅ Mobile signup navigate successful');
                  } catch (error) {
                    console.error('❌ Mobile signup navigate failed:', error);
                    window.location.href = '/signup';
                  }
                }}
              >
                {t('landing.navbar.signUp')}
              </Button>
            </Link>
          </div>
        </div>
      </nav>
      <section className="container mx-auto px-4 py-20 text-center">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-5xl md:text-7xl font-bold mb-6 bg-gradient-to-r from-white via-tradeiq-blue to-white bg-clip-text text-transparent">
            {t('landing.hero.title')}
          </h1>
          <p className="text-xl md:text-2xl text-gray-300 mb-8 leading-relaxed">
            {t('landing.hero.subtitle')}
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center mb-12">
            <Button 
              size="lg" 
              className="px-8 py-6 text-lg hover:scale-105 transform transition-all duration-300 shadow-lg hover:shadow-xl"
              onClick={handleJoinBetaClick}
            >
              {t('landing.hero.joinBeta')}
              <ChevronRight className="ml-2 h-5 w-5" />
            </Button>
            <Button 
              variant="outline" 
              size="lg" 
              className="px-8 py-6 text-lg hover:bg-white/10 hover:border-white/30 transition-all duration-300"
              onClick={handleDemoClick}
            >
              {t('landing.hero.watchDemo')}
            </Button>
          </div>
          
          {/* Stats */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-8 mt-16">
            <div className="text-center">
              <div className="text-3xl font-bold text-tradeiq-blue mb-2">95%</div>
              <div className="text-gray-400">{t('landing.hero.stats.accuracy')}</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-tradeiq-blue mb-2">&lt; 1s</div>
              <div className="text-gray-400">{t('landing.hero.stats.speed')}</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-tradeiq-blue mb-2">24/7</div>
              <div className="text-gray-400">{t('landing.hero.stats.monitoring')}</div>
            </div>
          </div>
        </div>
      </section>

      {/* What is TradeIQ */}
      <section className="py-20 bg-gray-900/50">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto text-center">
            <h2 className="text-4xl font-bold mb-6">{t('landing.about.title')}</h2>
            <p className="text-xl text-gray-300 leading-relaxed">
              {t('landing.about.description')}
            </p>
          </div>
        </div>
      </section>

      {/* Core Features */}
      <section className="py-20">
        <div className="container mx-auto px-4">
          <h2 className="text-4xl font-bold text-center mb-16">{t('landing.features.title')}</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            <Card className="bg-gray-800/50 border-gray-700 hover:border-tradeiq-blue/50 transition-all duration-300 hover:transform hover:scale-105">
              <CardHeader className="text-center">
                <div className="mx-auto mb-4 p-3 bg-tradeiq-blue/20 rounded-full w-fit">
                  <BarChart3 className="h-8 w-8 text-tradeiq-blue" />
                </div>
                <CardTitle className="text-white">{t('landing.features.patternDetection.title')}</CardTitle>
              </CardHeader>
              <CardContent>
                <CardDescription className="text-gray-300 text-center">
                  {t('landing.features.patternDetection.description')}
                </CardDescription>
              </CardContent>
            </Card>

            <Card className="bg-gray-800/50 border-gray-700 hover:border-tradeiq-blue/50 transition-all duration-300 hover:transform hover:scale-105">
              <CardHeader className="text-center">
                <div className="mx-auto mb-4 p-3 bg-tradeiq-blue/20 rounded-full w-fit">
                  <TrendingUp className="h-8 w-8 text-tradeiq-blue" />
                </div>
                <CardTitle className="text-white">{t('landing.features.trendAnalysis.title')}</CardTitle>
              </CardHeader>
              <CardContent>
                <CardDescription className="text-gray-300 text-center">
                  {t('landing.features.trendAnalysis.description')}
                </CardDescription>
              </CardContent>
            </Card>

            <Card className="bg-gray-800/50 border-gray-700 hover:border-tradeiq-blue/50 transition-all duration-300 hover:transform hover:scale-105">
              <CardHeader className="text-center">
                <div className="mx-auto mb-4 p-3 bg-tradeiq-blue/20 rounded-full w-fit">
                  <Zap className="h-8 w-8 text-tradeiq-blue" />
                </div>
                <CardTitle className="text-white">{t('landing.features.volatilityHeatmaps.title')}</CardTitle>
              </CardHeader>
              <CardContent>
                <CardDescription className="text-gray-300 text-center">
                  {t('landing.features.volatilityHeatmaps.description')}
                </CardDescription>
              </CardContent>
            </Card>

            <Card className="bg-gray-800/50 border-gray-700 hover:border-tradeiq-blue/50 transition-all duration-300 hover:transform hover:scale-105">
              <CardHeader className="text-center">
                <div className="mx-auto mb-4 p-3 bg-tradeiq-blue/20 rounded-full w-fit">
                  <MessageCircle className="h-8 w-8 text-tradeiq-blue" />
                </div>
                <CardTitle className="text-white">{t('landing.features.aiInsights.title')}</CardTitle>
              </CardHeader>
              <CardContent>
                <CardDescription className="text-gray-300 text-center">
                  {t('landing.features.aiInsights.description')}
                </CardDescription>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Benefits */}
      <section className="py-20 bg-gray-900/50">
        <div className="container mx-auto px-4">
          <h2 className="text-4xl font-bold text-center mb-16">Benefits for Traders</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            <div className="text-center">
              <div className="mx-auto mb-6 p-4 bg-green-500/20 rounded-full w-fit">
                <Brain className="h-10 w-10 text-green-400" />
              </div>
              <h3 className="text-xl font-semibold mb-3 text-white">Reduced Subjectivity</h3>
              <p className="text-gray-300">
                Eliminate emotional bias with data-driven analysis and objective insights
              </p>
            </div>

            <div className="text-center">
              <div className="mx-auto mb-6 p-4 bg-blue-500/20 rounded-full w-fit">
                <Clock className="h-10 w-10 text-blue-400" />
              </div>
              <h3 className="text-xl font-semibold mb-3 text-white">Faster Decisions</h3>
              <p className="text-gray-300">
                Make informed trading decisions in seconds, not hours
              </p>
            </div>

            <div className="text-center">
              <div className="mx-auto mb-6 p-4 bg-purple-500/20 rounded-full w-fit">
                <Star className="h-10 w-10 text-purple-400" />
              </div>
              <h3 className="text-xl font-semibold mb-3 text-white">Practical Education</h3>
              <p className="text-gray-300">
                Learn trading concepts through interactive AI-powered guidance
              </p>
            </div>

            <div className="text-center">
              <div className="mx-auto mb-6 p-4 bg-orange-500/20 rounded-full w-fit">
                <Target className="h-10 w-10 text-orange-400" />
              </div>
              <h3 className="text-xl font-semibold mb-3 text-white">Higher Precision</h3>
              <p className="text-gray-300">
                Achieve superior accuracy with machine learning algorithms
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Learn Section Teaser */}
      <section className="py-20">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold mb-6">Master Trading with Expert Guidance</h2>
            <p className="text-xl text-gray-300">
              Access comprehensive trading guides, strategies, and educational resources designed to enhance your market analysis skills.
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-12">
            <Card className="bg-gray-800/50 border-gray-700 hover:border-tradeiq-blue/50 transition-all duration-300">
              <CardHeader>
                <CardTitle className="text-white flex items-center">
                  <Brain className="h-5 w-5 text-tradeiq-blue mr-2" />
                  Trading Fundamentals
                </CardTitle>
              </CardHeader>
              <CardContent>
                <CardDescription className="text-gray-300">
                  Learn the core principles of technical analysis and market psychology.
                </CardDescription>
              </CardContent>
            </Card>

            <Card className="bg-gray-800/50 border-gray-700 hover:border-tradeiq-blue/50 transition-all duration-300">
              <CardHeader>
                <CardTitle className="text-white flex items-center">
                  <BarChart3 className="h-5 w-5 text-tradeiq-blue mr-2" />
                  Pattern Recognition
                </CardTitle>
              </CardHeader>
              <CardContent>
                <CardDescription className="text-gray-300">
                  Master chart patterns and their implications for market movements.
                </CardDescription>
              </CardContent>
            </Card>

            <Card className="bg-gray-800/50 border-gray-700 hover:border-tradeiq-blue/50 transition-all duration-300">
              <CardHeader>
                <CardTitle className="text-white flex items-center">
                  <Shield className="h-5 w-5 text-tradeiq-blue mr-2" />
                  Risk Management
                </CardTitle>
              </CardHeader>
              <CardContent>
                <CardDescription className="text-gray-300">
                  Develop strategies to protect your capital and optimize returns.
                </CardDescription>
              </CardContent>
            </Card>
          </div>

          <div className="text-center">
            <Button 
              size="lg" 
              className="px-8 py-6 text-lg hover:scale-105 transform transition-all duration-300"
              onClick={handleLearnPreviewClick}
            >
              Explore Learn Section
              <ChevronRight className="ml-2 h-5 w-5" />
            </Button>
          </div>
        </div>
      </section>

      {/* Demo Preview */}
      <section className="py-20 bg-gray-900/50">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold mb-6">See TradeIQ in Action</h2>
            <p className="text-xl text-gray-300">
              Experience the power of AI-driven trading analysis
            </p>
          </div>
          
          <div className="max-w-6xl mx-auto">
            <div className="bg-gray-800/50 border border-gray-700 rounded-2xl p-8 text-center">
              <div className="aspect-video bg-gradient-to-r from-gray-700 to-gray-600 rounded-xl flex items-center justify-center mb-6">
                <div className="text-center">
                  <BarChart3 className="h-20 w-20 text-tradeiq-blue mx-auto mb-4" />
                  <p className="text-xl text-gray-300">Interactive Demo Coming Soon</p>
                  <p className="text-gray-400">Real-time platform preview</p>
                </div>
              </div>
              <Button 
                size="lg" 
                className="px-8 py-6 text-lg hover:scale-105 transform transition-all duration-300"
                onClick={handleDemoClick}
              >
                Request Demo Access
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Early Access Form */}
      <section className="py-20 bg-gray-900/50">
        <div className="container mx-auto px-4">
          <div className="max-w-2xl mx-auto text-center">
            <h2 className="text-4xl font-bold mb-6">Join the Beta</h2>
            <p className="text-xl text-gray-300 mb-8">
              Be among the first to experience the future of trading analysis
            </p>
            
            <Card className="bg-gray-800/50 border-gray-700">
              <CardContent className="p-8">
                <div className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <Input 
                      placeholder="Your Name" 
                      className="bg-gray-700/50 border-gray-600 text-white placeholder:text-gray-400"
                    />
                    <Input 
                      type="email" 
                      placeholder="Your Email" 
                      className="bg-gray-700/50 border-gray-600 text-white placeholder:text-gray-400"
                    />
                  </div>
                  <Button 
                    size="lg" 
                    className="w-full py-6 text-lg hover:scale-105 transform transition-all duration-300"
                    onClick={handleSignUpClick}
                  >
                    Request Early Access
                  </Button>
                  <p className="text-xs text-gray-400">
                    No spam. Unsubscribe at any time.
                  </p>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-gray-800/50 bg-black/20 backdrop-blur-sm py-12">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div>
              <div className="flex items-center space-x-2 mb-4">
                <TrendingUp className="h-6 w-6 text-tradeiq-blue" />
                <span className="text-lg font-bold">TradeIQ</span>
              </div>
              <p className="text-gray-400 text-sm">
                AI-powered trading analysis platform for the modern trader.
              </p>
            </div>
            
            <div>
              <h4 className="font-semibold mb-4 text-white">Platform</h4>
              <div className="space-y-2">
                <button 
                  onClick={handleAppClick}
                  className="block text-gray-400 hover:text-white text-sm transition-colors text-left"
                >
                  Trading Dashboard
                </button>
                <button 
                  onClick={handleLearnPreviewClick}
                  className="block text-gray-400 hover:text-white text-sm transition-colors text-left"
                >
                  Learn Preview
                </button>
                <button 
                  onClick={handlePricingClick}
                  className="block text-gray-400 hover:text-white text-sm transition-colors text-left"
                >
                  Pricing
                </button>
              </div>
            </div>
            
            <div>
              <h4 className="font-semibold mb-4 text-white">Company</h4>
              <div className="space-y-2">
                <a href="#" className="block text-gray-400 hover:text-white text-sm transition-colors">
                  About
                </a>
                <a href="#" className="block text-gray-400 hover:text-white text-sm transition-colors">
                  Blog
                </a>
                <a href="#" className="block text-gray-400 hover:text-white text-sm transition-colors">
                  Careers
                </a>
              </div>
            </div>
            
            <div>
              <h4 className="font-semibold mb-4 text-white">Legal</h4>
              <div className="space-y-2">
                <a href="#" className="block text-gray-400 hover:text-white text-sm transition-colors">
                  Privacy Policy
                </a>
                <a href="#" className="block text-gray-400 hover:text-white text-sm transition-colors">
                  Terms of Service
                </a>
                <a href="#" className="block text-gray-400 hover:text-white text-sm transition-colors">
                  Cookie Policy
                </a>
              </div>
            </div>
          </div>
          
          <div className="border-t border-gray-800 mt-8 pt-8 text-center">
            <p className="text-xs text-gray-400">
              TradeIQ Pro is the premium version of TradeIQ. For more resources, visit{' '}
              <a 
                href="https://www.tradeiqpro.com" 
                target="_blank" 
                rel="noopener noreferrer"
                className="text-tradeiq-blue hover:underline"
              >
                www.tradeiqpro.com
              </a>
            </p>
            <p className="text-xs text-gray-500 mt-2">
              © 2024 TradeIQ. All rights reserved.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Landing;