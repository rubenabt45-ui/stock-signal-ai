import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
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

  const handleLoginClick = (e: React.MouseEvent) => {
    console.log("Login button clicked");
    e.preventDefault();
    try {
      navigate('/login');
      console.log("Navigating to /login");
    } catch (error) {
      console.error("Navigation failed, using fallback:", error);
      window.location.href = '/login';
    }
  };

  const handleSignUpClick = (e: React.MouseEvent) => {
    console.log("Sign Up button clicked");
    e.preventDefault();
    try {
      navigate('/signup');
      console.log("Navigating to /signup");
    } catch (error) {
      console.error("Navigation failed, using fallback:", error);
      window.location.href = '/signup';
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-black text-white">
      {/* Navigation */}
      <nav className="border-b border-gray-800/50 bg-black/20 backdrop-blur-sm sticky top-0 z-50">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <TrendingUp className="h-8 w-8 text-tradeiq-blue" />
            <span className="text-xl font-bold">TradeIQ</span>
            <Badge variant="secondary" className="text-xs">BETA</Badge>
          </div>
          
          <div className="hidden md:flex items-center space-x-6">
            <Link to="/" className="text-gray-300 hover:text-white transition-all duration-300 hover:scale-105 focus:outline-none focus:ring-2 focus:ring-white/20 rounded px-2 py-1">Home</Link>
            <Link to="/learn-preview" className="text-gray-300 hover:text-white transition-all duration-300 hover:scale-105 focus:outline-none focus:ring-2 focus:ring-white/20 rounded px-2 py-1">Learn Preview</Link>
            <Link to="/pricing" className="text-gray-300 hover:text-white transition-all duration-300 hover:scale-105 focus:outline-none focus:ring-2 focus:ring-white/20 rounded px-2 py-1">Pricing</Link>
            <div className="flex items-center space-x-2">
              <Button 
                variant="ghost" 
                size="sm" 
                className="text-gray-300 hover:text-white hover:bg-white/10 transition-all duration-300 focus:ring-2 focus:ring-white/20 hover:scale-105"
                onClick={handleLoginClick}
              >
                Login
              </Button>
              <Button 
                variant="outline" 
                size="sm" 
                className="border-gray-600 hover:border-white hover:bg-white/10 transition-all duration-300 focus:ring-2 focus:ring-white/20 hover:scale-105"
                onClick={handleSignUpClick}
              >
                Sign Up
              </Button>
            </div>
          </div>

          <div className="md:hidden flex items-center space-x-2">
            <Button 
              variant="ghost" 
              size="sm" 
              className="text-gray-300 hover:text-white hover:bg-white/10 transition-all duration-300 focus:ring-2 focus:ring-white/20 hover:scale-105"
              onClick={handleLoginClick}
            >
              Login
            </Button>
            <Button 
              variant="outline" 
              size="sm" 
              className="border-gray-600 hover:border-white hover:bg-white/10 transition-all duration-300 focus:ring-2 focus:ring-white/20 hover:scale-105"
              onClick={handleSignUpClick}
            >
              Sign Up
            </Button>
          </div>
        </div>
      </nav>
      <section className="container mx-auto px-4 py-20 text-center">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-5xl md:text-7xl font-bold mb-6 bg-gradient-to-r from-white via-tradeiq-blue to-white bg-clip-text text-transparent">
            Empower Your Trading with Real-Time AI
          </h1>
          <p className="text-xl md:text-2xl text-gray-300 mb-8 leading-relaxed">
            Identify patterns, trends, and opportunities with algorithmic precision
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center mb-12">
            <Link to="/signup">
              <Button size="lg" className="px-8 py-6 text-lg hover:scale-105 transform transition-all duration-300 shadow-lg hover:shadow-xl">
                Join the Beta
                <ChevronRight className="ml-2 h-5 w-5" />
              </Button>
            </Link>
            <Link to="/signup">
              <Button variant="outline" size="lg" className="px-8 py-6 text-lg hover:bg-white/10 hover:border-white/30 transition-all duration-300">
                Watch Demo
              </Button>
            </Link>
          </div>
          
          {/* Stats */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-8 mt-16">
            <div className="text-center">
              <div className="text-3xl font-bold text-tradeiq-blue mb-2">95%</div>
              <div className="text-gray-400">Pattern Accuracy</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-tradeiq-blue mb-2">&lt; 1s</div>
              <div className="text-gray-400">Analysis Speed</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-tradeiq-blue mb-2">24/7</div>
              <div className="text-gray-400">Market Monitoring</div>
            </div>
          </div>
        </div>
      </section>

      {/* What is TradeIQ */}
      <section className="py-20 bg-gray-900/50">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto text-center">
            <h2 className="text-4xl font-bold mb-6">What is TradeIQ?</h2>
            <p className="text-xl text-gray-300 leading-relaxed">
              TradeIQ is an AI-powered technical analysis platform that detects patterns, 
              analyzes trends, and highlights high-volatility zones in real-time. Our advanced 
              machine learning algorithms provide traders with the insights they need to make 
              informed decisions faster than ever before.
            </p>
          </div>
        </div>
      </section>

      {/* Core Features */}
      <section className="py-20">
        <div className="container mx-auto px-4">
          <h2 className="text-4xl font-bold text-center mb-16">Core Features</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            <Card className="bg-gray-800/50 border-gray-700 hover:border-tradeiq-blue/50 transition-all duration-300 hover:transform hover:scale-105">
              <CardHeader className="text-center">
                <div className="mx-auto mb-4 p-3 bg-tradeiq-blue/20 rounded-full w-fit">
                  <BarChart3 className="h-8 w-8 text-tradeiq-blue" />
                </div>
                <CardTitle className="text-white">Pattern Detection</CardTitle>
              </CardHeader>
              <CardContent>
                <CardDescription className="text-gray-300 text-center">
                  Automated chart pattern recognition with machine learning precision
                </CardDescription>
              </CardContent>
            </Card>

            <Card className="bg-gray-800/50 border-gray-700 hover:border-tradeiq-blue/50 transition-all duration-300 hover:transform hover:scale-105">
              <CardHeader className="text-center">
                <div className="mx-auto mb-4 p-3 bg-tradeiq-blue/20 rounded-full w-fit">
                  <TrendingUp className="h-8 w-8 text-tradeiq-blue" />
                </div>
                <CardTitle className="text-white">Trend Analysis</CardTitle>
              </CardHeader>
              <CardContent>
                <CardDescription className="text-gray-300 text-center">
                  Real-time trend identification and momentum analysis
                </CardDescription>
              </CardContent>
            </Card>

            <Card className="bg-gray-800/50 border-gray-700 hover:border-tradeiq-blue/50 transition-all duration-300 hover:transform hover:scale-105">
              <CardHeader className="text-center">
                <div className="mx-auto mb-4 p-3 bg-tradeiq-blue/20 rounded-full w-fit">
                  <Zap className="h-8 w-8 text-tradeiq-blue" />
                </div>
                <CardTitle className="text-white">Volatility Heatmaps</CardTitle>
              </CardHeader>
              <CardContent>
                <CardDescription className="text-gray-300 text-center">
                  Visual volatility zones and risk assessment tools
                </CardDescription>
              </CardContent>
            </Card>

            <Card className="bg-gray-800/50 border-gray-700 hover:border-tradeiq-blue/50 transition-all duration-300 hover:transform hover:scale-105">
              <CardHeader className="text-center">
                <div className="mx-auto mb-4 p-3 bg-tradeiq-blue/20 rounded-full w-fit">
                  <MessageCircle className="h-8 w-8 text-tradeiq-blue" />
                </div>
                <CardTitle className="text-white">TradingChat AI</CardTitle>
              </CardHeader>
              <CardContent>
                <CardDescription className="text-gray-300 text-center">
                  Conversational AI assistant for trading insights and education
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
            <Link to="/learn-preview">
              <Button size="lg" className="px-8 py-6 text-lg hover:scale-105 transform transition-all duration-300">
                Explore Learn Section
                <ChevronRight className="ml-2 h-5 w-5" />
              </Button>
            </Link>
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
              <Link to="/signup">
                <Button size="lg" className="px-8 py-6 text-lg hover:scale-105 transform transition-all duration-300">
                  Request Demo Access
                </Button>
              </Link>
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
                  <Link to="/signup">
                    <Button size="lg" className="w-full py-6 text-lg hover:scale-105 transform transition-all duration-300">
                      Request Early Access
                    </Button>
                  </Link>
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
                <Link to="/app" className="block text-gray-400 hover:text-white text-sm transition-colors">
                  Trading Dashboard
                </Link>
                <Link to="/learn-preview" className="block text-gray-400 hover:text-white text-sm transition-colors">
                  Learn Preview
                </Link>
                <Link to="/pricing" className="block text-gray-400 hover:text-white text-sm transition-colors">
                  Pricing
                </Link>
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