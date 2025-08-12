import React, { Suspense, lazy } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { LanguageSelector } from '@/components/LanguageSelector';
import { MobileMenu } from '@/components/MobileMenu';
import { ErrorFallback } from '@/components/ErrorFallback';

import { useTranslationWithFallback } from '@/hooks/useTranslationWithFallback';
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

// Lazy load heavy components that aren't needed immediately
const LazyLearnPreview = lazy(() => import('./LearnPreview'));

const LandingContent = () => {
  const navigate = useNavigate();
  const { t, ready } = useTranslationWithFallback();

  // If translations aren't ready yet, show loading state
  if (!ready) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-black text-white flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-white mx-auto mb-4"></div>
          <p className="text-gray-300">Loading...</p>
        </div>
      </div>
    );
  }

  // 🚨 BULLETPROOF NAVIGATION HANDLERS
  const handleLogin = () => {
    console.log('🚨 Login button clicked - IMMEDIATE ACTION');
    console.log('Current pathname:', window.location.pathname);
    console.log('Navigate function available:', typeof navigate);
    
    try {
      console.log('🚀 Attempting navigate to /login');
      navigate('/login');
      console.log('✅ Navigate called successfully');
      
      // Double-check navigation after small delay
      setTimeout(() => {
        if (window.location.pathname !== '/login') {
          console.log('⚠️ Navigation failed, using fallback');
          window.location.href = '/login';
        }
      }, 100);
      
    } catch (err) {
      console.error('❌ Navigate failed immediately, using fallback:', err);
      window.location.href = '/login';
    }
  };

  const handleSignUp = () => {
    console.log('🚨 Sign Up button clicked');
    try {
      navigate('/signup');
      setTimeout(() => {
        if (window.location.pathname !== '/signup') {
          window.location.href = '/signup';
        }
      }, 100);
    } catch (err) {
      console.error('❌ Navigate to signup failed:', err);
      window.location.href = '/signup';
    }
  };

  // Other navigation handlers
  const handleLearnPreviewClick = () => {
    try {
      navigate('/learn-preview');
    } catch (err) {
      window.location.href = '/learn-preview';
    }
  };

  const handlePricingClick = () => {
    try {
      navigate('/pricing');
    } catch (err) {
      window.location.href = '/pricing';
    }
  };

  const handleAppClick = () => {
    try {
      navigate('/app');
    } catch (err) {
      window.location.href = '/app';
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-black text-white">
      {/* Navigation */}
      <nav className="border-b border-gray-800/50 bg-black/20 backdrop-blur-sm sticky top-0 z-50 relative">
        <div className="container mx-auto px-4 py-3 sm:py-4 flex items-center justify-between relative z-10">
          <div className="flex items-center space-x-2">
            <TrendingUp className="h-6 w-6 sm:h-8 sm:w-8 text-tradeiq-blue" />
            <span className="text-lg sm:text-xl font-bold">TradeIQ</span>
            <Badge variant="secondary" className="text-xs hidden sm:block">BETA</Badge>
          </div>
          
          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-6">
            <Link to="/" className="text-gray-300 hover:text-white transition-all duration-300 hover:scale-105 focus:outline-none focus:ring-2 focus:ring-white/20 rounded px-2 py-1">{t('landing.navbar.home')}</Link>
            <Link to="/learn-preview" className="text-gray-300 hover:text-white transition-all duration-300 hover:scale-105 focus:outline-none focus:ring-2 focus:ring-white/20 rounded px-2 py-1">{t('landing.navbar.learnPreview')}</Link>
            <Link to="/pricing" className="text-gray-300 hover:text-white transition-all duration-300 hover:scale-105 focus:outline-none focus:ring-2 focus:ring-white/20 rounded px-2 py-1">{t('landing.navbar.pricing')}</Link>
            <div className="flex items-center space-x-2">
              {/* Language Selector */}
              <LanguageSelector variant="landing" />
              
              {/* Desktop Login Button */}
              <Link to="/login" className="relative z-10">
                <Button 
                  variant="ghost" 
                  size="sm" 
                  className="text-gray-300 hover:text-white hover:bg-white/10 transition-all duration-300 focus:ring-2 focus:ring-white/20 hover:scale-105 cursor-pointer relative z-10 min-h-[44px]"
                  onClick={(e) => {
                    e.preventDefault();
                    e.stopPropagation();
                    handleLogin();
                  }}
                  style={{ pointerEvents: 'auto' }}
                >
                  {t('landing.navbar.login')}
                </Button>
              </Link>
              
              {/* Desktop Sign Up Button */}
              <Link to="/signup" className="relative z-10">
                <Button 
                  variant="outline" 
                  size="sm" 
                  className="border-gray-600 hover:border-white hover:bg-white/10 transition-all duration-300 focus:ring-2 focus:ring-white/20 hover:scale-105 cursor-pointer relative z-10 min-h-[44px]"
                  onClick={(e) => {
                    e.preventDefault();
                    e.stopPropagation();
                    handleSignUp();
                  }}
                  style={{ pointerEvents: 'auto' }}
                >
                  {t('landing.navbar.signUp')}
                </Button>
              </Link>
            </div>
          </div>

          {/* Mobile Navigation */}
          <div className="md:hidden flex items-center space-x-2">
            <MobileMenu
              onLogin={handleLogin}
              onSignUp={handleSignUp}
              onLearnPreview={handleLearnPreviewClick}
              onPricing={handlePricingClick}
            />
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="container mx-auto px-4 py-12 sm:py-16 lg:py-20 text-center">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-7xl font-bold mb-4 sm:mb-6 bg-gradient-to-r from-white via-tradeiq-blue to-white bg-clip-text text-transparent leading-tight">
            {t('landing.hero.title')}
          </h1>
          <p className="text-lg sm:text-xl md:text-2xl text-gray-300 mb-6 sm:mb-8 leading-relaxed px-2">
            {t('landing.hero.subtitle')}
          </p>
          <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 justify-center items-center mb-8 sm:mb-12 px-4">
            <Button 
              size="lg" 
              className="w-full sm:w-auto px-6 sm:px-8 py-4 sm:py-6 text-base sm:text-lg hover:scale-105 transform transition-all duration-300 shadow-lg hover:shadow-xl min-h-[48px] sm:min-h-[56px]"
              onClick={handleSignUp}
            >
              {t('landing.hero.joinBeta')}
              <ChevronRight className="ml-2 h-4 w-4 sm:h-5 sm:w-5" />
            </Button>
            <Button 
              variant="outline" 
              size="lg" 
              className="w-full sm:w-auto px-6 sm:px-8 py-4 sm:py-6 text-base sm:text-lg hover:bg-white/10 hover:border-white/30 transition-all duration-300 min-h-[48px] sm:min-h-[56px] border-gray-600"
              onClick={handleSignUp}
            >
              {t('landing.hero.watchDemo')}
            </Button>
          </div>
          
          {/* Stats */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 sm:gap-8 mt-12 sm:mt-16 px-4">
            <div className="text-center">
              <div className="text-2xl sm:text-3xl font-bold text-tradeiq-blue mb-2">95%</div>
              <div className="text-sm sm:text-base text-gray-400">{t('landing.hero.stats.accuracy')}</div>
            </div>
            <div className="text-center">
              <div className="text-2xl sm:text-3xl font-bold text-tradeiq-blue mb-2">&lt; 1s</div>
              <div className="text-sm sm:text-base text-gray-400">{t('landing.hero.stats.speed')}</div>
            </div>
            <div className="text-center">
              <div className="text-2xl sm:text-3xl font-bold text-tradeiq-blue mb-2">24/7</div>
              <div className="text-sm sm:text-base text-gray-400">{t('landing.hero.stats.monitoring')}</div>
            </div>
          </div>
        </div>
      </section>

      {/* What is TradeIQ */}
      <section className="py-12 sm:py-16 lg:py-20 bg-gray-900/50">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto text-center">
            <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold mb-4 sm:mb-6">{t('landing.about.title')}</h2>
            <p className="text-lg sm:text-xl text-gray-300 leading-relaxed px-2">
              {t('landing.about.description')}
            </p>
          </div>
        </div>
      </section>

      {/* Core Features */}
      <section className="py-12 sm:py-16 lg:py-20">
        <div className="container mx-auto px-4">
          <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-center mb-8 sm:mb-12 lg:mb-16">{t('landing.features.title')}</h2>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6 lg:gap-8">
            <Card className="bg-gray-800/50 border-gray-700 hover:border-tradeiq-blue/50 transition-all duration-300 hover:transform hover:scale-105 h-full">
              <CardHeader className="text-center">
                <div className="mx-auto mb-3 sm:mb-4 p-2 sm:p-3 bg-tradeiq-blue/20 rounded-full w-fit">
                  <BarChart3 className="h-6 w-6 sm:h-8 sm:w-8 text-tradeiq-blue" />
                </div>
                <CardTitle className="text-white text-base sm:text-lg">{t('landing.features.patternDetection.title')}</CardTitle>
              </CardHeader>
              <CardContent>
                <CardDescription className="text-gray-300 text-center text-sm sm:text-base">
                  {t('landing.features.patternDetection.description')}
                </CardDescription>
              </CardContent>
            </Card>

            <Card className="bg-gray-800/50 border-gray-700 hover:border-tradeiq-blue/50 transition-all duration-300 hover:transform hover:scale-105 h-full">
              <CardHeader className="text-center">
                <div className="mx-auto mb-3 sm:mb-4 p-2 sm:p-3 bg-tradeiq-blue/20 rounded-full w-fit">
                  <TrendingUp className="h-6 w-6 sm:h-8 sm:w-8 text-tradeiq-blue" />
                </div>
                <CardTitle className="text-white text-base sm:text-lg">{t('landing.features.trendAnalysis.title')}</CardTitle>
              </CardHeader>
              <CardContent>
                <CardDescription className="text-gray-300 text-center text-sm sm:text-base">
                  {t('landing.features.trendAnalysis.description')}
                </CardDescription>
              </CardContent>
            </Card>

            <Card className="bg-gray-800/50 border-gray-700 hover:border-tradeiq-blue/50 transition-all duration-300 hover:transform hover:scale-105 h-full">
              <CardHeader className="text-center">
                <div className="mx-auto mb-3 sm:mb-4 p-2 sm:p-3 bg-tradeiq-blue/20 rounded-full w-fit">
                  <Zap className="h-6 w-6 sm:h-8 sm:w-8 text-tradeiq-blue" />
                </div>
                <CardTitle className="text-white text-base sm:text-lg">{t('landing.features.volatilityHeatmaps.title')}</CardTitle>
              </CardHeader>
              <CardContent>
                <CardDescription className="text-gray-300 text-center text-sm sm:text-base">
                  {t('landing.features.volatilityHeatmaps.description')}
                </CardDescription>
              </CardContent>
            </Card>

            <Card className="bg-gray-800/50 border-gray-700 hover:border-tradeiq-blue/50 transition-all duration-300 hover:transform hover:scale-105 h-full">
              <CardHeader className="text-center">
                <div className="mx-auto mb-3 sm:mb-4 p-2 sm:p-3 bg-tradeiq-blue/20 rounded-full w-fit">
                  <MessageCircle className="h-6 w-6 sm:h-8 sm:w-8 text-tradeiq-blue" />
                </div>
                <CardTitle className="text-white text-base sm:text-lg">{t('landing.features.aiInsights.title')}</CardTitle>
              </CardHeader>
              <CardContent>
                <CardDescription className="text-gray-300 text-center text-sm sm:text-base">
                  {t('landing.features.aiInsights.description')}
                </CardDescription>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Benefits */}
      <section className="py-12 sm:py-16 lg:py-20 bg-gray-900/50">
        <div className="container mx-auto px-4">
          <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-center mb-8 sm:mb-12 lg:mb-16">{t('landing.benefits.title')}</h2>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 sm:gap-8">
            <div className="text-center">
              <div className="mx-auto mb-4 sm:mb-6 p-3 sm:p-4 bg-green-500/20 rounded-full w-fit">
                <Brain className="h-8 w-8 sm:h-10 sm:w-10 text-green-400" />
              </div>
              <h3 className="text-lg sm:text-xl font-semibold mb-2 sm:mb-3 text-white">{t('landing.benefits.reducedSubjectivity.title')}</h3>
              <p className="text-gray-300 text-sm sm:text-base">
                {t('landing.benefits.reducedSubjectivity.description')}
              </p>
            </div>

            <div className="text-center">
              <div className="mx-auto mb-4 sm:mb-6 p-3 sm:p-4 bg-blue-500/20 rounded-full w-fit">
                <Clock className="h-8 w-8 sm:h-10 sm:w-10 text-blue-400" />
              </div>
              <h3 className="text-lg sm:text-xl font-semibold mb-2 sm:mb-3 text-white">{t('landing.benefits.fasterDecisions.title')}</h3>
              <p className="text-gray-300 text-sm sm:text-base">
                {t('landing.benefits.fasterDecisions.description')}
              </p>
            </div>

            <div className="text-center">
              <div className="mx-auto mb-4 sm:mb-6 p-3 sm:p-4 bg-purple-500/20 rounded-full w-fit">
                <Star className="h-8 w-8 sm:h-10 sm:w-10 text-purple-400" />
              </div>
              <h3 className="text-lg sm:text-xl font-semibold mb-2 sm:mb-3 text-white">{t('landing.benefits.practicalEducation.title')}</h3>
              <p className="text-gray-300 text-sm sm:text-base">
                {t('landing.benefits.practicalEducation.description')}
              </p>
            </div>

            <div className="text-center">
              <div className="mx-auto mb-4 sm:mb-6 p-3 sm:p-4 bg-orange-500/20 rounded-full w-fit">
                <Target className="h-8 w-8 sm:h-10 sm:w-10 text-orange-400" />
              </div>
              <h3 className="text-lg sm:text-xl font-semibold mb-2 sm:mb-3 text-white">{t('landing.benefits.higherPrecision.title')}</h3>
              <p className="text-gray-300 text-sm sm:text-base">
                {t('landing.benefits.higherPrecision.description')}
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Learn Section Teaser */}
      <section className="py-12 sm:py-16 lg:py-20">
        <div className="container mx-auto px-4">
          <div className="text-center mb-8 sm:mb-12 lg:mb-16">
            <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold mb-4 sm:mb-6">{t('landing.learningSection.title')}</h2>
            <p className="text-lg sm:text-xl text-gray-300 px-2">
              {t('landing.learningSection.description')}
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 sm:gap-6 lg:gap-8 mb-8 sm:mb-12">
            <Card className="bg-gray-800/50 border-gray-700 hover:border-tradeiq-blue/50 transition-all duration-300 h-full">
              <CardHeader>
                <CardTitle className="text-white flex items-center text-base sm:text-lg">
                  <Brain className="h-4 w-4 sm:h-5 sm:w-5 text-tradeiq-blue mr-2" />
                  {t('landing.learningSection.fundamentals.title')}
                </CardTitle>
              </CardHeader>
              <CardContent>
                <CardDescription className="text-gray-300 text-sm sm:text-base">
                  {t('landing.learningSection.fundamentals.description')}
                </CardDescription>
              </CardContent>
            </Card>

            <Card className="bg-gray-800/50 border-gray-700 hover:border-tradeiq-blue/50 transition-all duration-300 h-full">
              <CardHeader>
                <CardTitle className="text-white flex items-center text-base sm:text-lg">
                  <BarChart3 className="h-4 w-4 sm:h-5 sm:w-5 text-tradeiq-blue mr-2" />
                  {t('landing.learningSection.patterns.title')}
                </CardTitle>
              </CardHeader>
              <CardContent>
                <CardDescription className="text-gray-300 text-sm sm:text-base">
                  {t('landing.learningSection.patterns.description')}
                </CardDescription>
              </CardContent>
            </Card>

            <Card className="bg-gray-800/50 border-gray-700 hover:border-tradeiq-blue/50 transition-all duration-300 h-full">
              <CardHeader>
                <CardTitle className="text-white flex items-center text-base sm:text-lg">
                  <Shield className="h-4 w-4 sm:h-5 sm:w-5 text-tradeiq-blue mr-2" />
                  {t('landing.learningSection.riskManagement.title')}
                </CardTitle>
              </CardHeader>
              <CardContent>
                <CardDescription className="text-gray-300 text-sm sm:text-base">
                  {t('landing.learningSection.riskManagement.description')}
                </CardDescription>
              </CardContent>
            </Card>
          </div>

          <div className="text-center px-4">
            <Button 
              size="lg" 
              className="w-full sm:w-auto px-6 sm:px-8 py-4 sm:py-6 text-base sm:text-lg hover:scale-105 transform transition-all duration-300 min-h-[48px] sm:min-h-[56px]"
              onClick={handleLearnPreviewClick}
            >
              Explore Learn Section
              <ChevronRight className="ml-2 h-4 w-4 sm:h-5 sm:w-5" />
            </Button>
          </div>
        </div>
      </section>

      {/* Early Access Form */}
      <section className="py-12 sm:py-16 lg:py-20 bg-gray-900/50">
        <div className="container mx-auto px-4">
          <div className="max-w-2xl mx-auto text-center">
            <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold mb-4 sm:mb-6">Join the Beta</h2>
            <p className="text-lg sm:text-xl text-gray-300 mb-6 sm:mb-8 px-2">
              Be among the first to experience the future of trading analysis
            </p>
            
            <Card className="bg-gray-800/50 border-gray-700">
              <CardContent className="p-4 sm:p-6 lg:p-8">
                <div className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3 sm:gap-4">
                     <Input 
                      placeholder="Your Name" 
                      className="bg-gray-700/50 border-gray-600 text-white placeholder:text-gray-400 h-12 sm:h-14 text-base"
                    />
                    <Input 
                      type="email" 
                      placeholder="Your Email" 
                      className="bg-gray-700/50 border-gray-600 text-white placeholder:text-gray-400 h-12 sm:h-14 text-base"
                    />
                  </div>
                  <Button 
                    size="lg" 
                    className="w-full py-4 sm:py-6 text-base sm:text-lg hover:scale-105 transform transition-all duration-300 min-h-[48px] sm:min-h-[56px]"
                    onClick={handleSignUp}
                   >
                    Request Early Access
                  </Button>
                  <p className="text-xs sm:text-sm text-gray-400">
                    No spam. Unsubscribe at any time.
                  </p>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-gray-800/50 bg-black/20 backdrop-blur-sm py-8 sm:py-12">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 sm:gap-8">
            <div className="sm:col-span-2 lg:col-span-1">
              <div className="flex items-center space-x-2 mb-3 sm:mb-4">
                <TrendingUp className="h-5 w-5 sm:h-6 sm:w-6 text-tradeiq-blue" />
                <span className="text-base sm:text-lg font-bold">TradeIQ</span>
              </div>
              <p className="text-gray-400 text-sm">
                AI-powered trading analysis platform for the modern trader.
              </p>
            </div>
            
            <div>
              <h4 className="font-semibold mb-3 sm:mb-4 text-white">Platform</h4>
              <div className="space-y-2">
                <button 
                  onClick={handleAppClick}
                  className="block text-gray-400 hover:text-white text-sm transition-colors text-left min-h-[44px] flex items-center"
                >
                  Trading Dashboard
                </button>
                <button 
                  onClick={handleLearnPreviewClick}
                  className="block text-gray-400 hover:text-white text-sm transition-colors text-left min-h-[44px] flex items-center"
                >
                  Learn Preview
                </button>
                <button 
                  onClick={handlePricingClick}
                  className="block text-gray-400 hover:text-white text-sm transition-colors text-left min-h-[44px] flex items-center"
                >
                  Pricing
                </button>
              </div>
            </div>
            
            <div>
              <h4 className="font-semibold mb-3 sm:mb-4 text-white">Company</h4>
              <div className="space-y-2">
                <a href="#" className="block text-gray-400 hover:text-white text-sm transition-colors min-h-[44px] flex items-center">
                  About
                </a>
                <a href="#" className="block text-gray-400 hover:text-white text-sm transition-colors min-h-[44px] flex items-center">
                  Blog
                </a>
                <a href="#" className="block text-gray-400 hover:text-white text-sm transition-colors min-h-[44px] flex items-center">
                  Careers
                </a>
              </div>
            </div>
            
            <div>
              <h4 className="font-semibold mb-3 sm:mb-4 text-white">Legal</h4>
              <div className="space-y-2">
                <a href="#" className="block text-gray-400 hover:text-white text-sm transition-colors min-h-[44px] flex items-center">
                  Privacy Policy
                </a>
                <a href="#" className="block text-gray-400 hover:text-white text-sm transition-colors min-h-[44px] flex items-center">
                  Terms of Service
                </a>
                <a href="#" className="block text-gray-400 hover:text-white text-sm transition-colors min-h-[44px] flex items-center">
                  Cookie Policy
                </a>
              </div>
            </div>
          </div>
          
          <div className="border-t border-gray-800 mt-6 sm:mt-8 pt-6 sm:pt-8 text-center">
            <p className="text-xs sm:text-sm text-gray-400 px-2">
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
            <p className="text-xs sm:text-sm text-gray-500 mt-2">
              © 2024 TradeIQ. All rights reserved.
            </p>
          </div>
        </div>
      </footer>
      
    </div>
  );
};

// Wrapper component with error boundary
const Landing = () => {
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-black text-white flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-white mx-auto mb-4"></div>
          <p className="text-gray-300">Loading...</p>
        </div>
      </div>
    }>
      <LandingContent />
    </Suspense>
  );
};

export default Landing;
