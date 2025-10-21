import React from 'react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { 
  TrendingUp, 
  Brain, 
  BarChart3, 
  Shield, 
  ChevronRight, 
  Lock,
  BookOpen,
  FileText,
  Video,
  Award
} from 'lucide-react';
import tradeiqLogo from '@/assets/tradeiq-logo.png';

const LearnPreview = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-black text-white">
      {/* Navigation */}
      <nav className="border-b border-gray-800/50 bg-black/20 backdrop-blur-sm sticky top-0 z-50">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <Link to="/" className="flex items-center group">
            <div className="relative">
              <div className="absolute inset-0 bg-gradient-to-r from-tradeiq-blue/30 to-purple-500/30 blur-2xl rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
              <div className="absolute inset-0 bg-tradeiq-blue/10 blur-xl rounded-full"></div>
              <img 
                src={tradeiqLogo} 
                alt="TradeIQ Logo" 
                className="h-10 sm:h-12 md:h-11 relative z-10 drop-shadow-[0_0_20px_rgba(59,130,246,0.6)] group-hover:drop-shadow-[0_0_35px_rgba(59,130,246,1)] transition-all duration-300 group-hover:scale-110 filter brightness-110" 
              />
            </div>
          </Link>
          
          <div className="md:hidden">
            <Badge variant="secondary" className="text-xs">BETA</Badge>
          </div>
          
          <div className="hidden md:flex items-center space-x-6">
            <Link to="/" className="text-gray-300 hover:text-white transition-colors">Home</Link>
            <Link to="/learn-preview" className="text-gray-300 hover:text-white transition-colors">Learn Preview</Link>
            <Link to="/pricing" className="text-gray-300 hover:text-white transition-colors">Pricing</Link>
            <Link to="/app">
              <Button variant="outline" size="sm">Platform</Button>
            </Link>
          </div>

          <div className="md:hidden">
            <Link to="/app">
              <Button variant="outline" size="sm">Platform</Button>
            </Link>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="container mx-auto px-4 py-20 text-center bg-gradient-to-b from-transparent via-transparent to-gray-900/30">
        <div className="max-w-4xl mx-auto">
          <div className="flex items-center justify-center space-x-3 mb-6">
            <BookOpen className="h-12 w-12 text-tradeiq-blue" />
            <h1 className="text-5xl md:text-6xl font-bold bg-gradient-to-r from-white via-tradeiq-blue to-white bg-clip-text text-transparent">
              Learn Trading
            </h1>
          </div>
          <p className="text-xl md:text-2xl text-gray-300 mb-8 leading-relaxed">
            Master the art of trading with comprehensive guides, strategies, and expert insights
          </p>
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center mb-12">
            <Link to="/login">
              <Button size="lg" className="px-8 py-6 text-lg">
                Access Full Learn Section
                <ChevronRight className="ml-2 h-5 w-5" />
              </Button>
            </Link>
            <Link to="/pricing">
              <Button variant="outline" size="lg" className="px-8 py-6 text-lg">
                View Pricing
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Preview Content */}
      <section className="py-20 bg-gradient-to-b from-gray-900/30 via-gray-900/50 to-gray-900/30">
        <div className="container mx-auto px-4">
          <h2 className="text-4xl font-bold text-center mb-16">What You'll Learn</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-16">
            <Card className="bg-gray-800/50 border-gray-700 hover:border-tradeiq-blue/50 transition-all duration-300">
              <CardHeader>
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center">
                    <Brain className="h-6 w-6 text-tradeiq-blue mr-2" />
                    <CardTitle className="text-white">Trading Fundamentals</CardTitle>
                  </div>
                  <Lock className="h-4 w-4 text-gray-500" />
                </div>
              </CardHeader>
              <CardContent>
                <CardDescription className="text-gray-300 mb-4">
                  Learn the core principles of technical analysis, market psychology, and risk management.
                </CardDescription>
                <div className="space-y-2">
                  <div className="flex items-center text-sm text-gray-400">
                    <FileText className="h-4 w-4 mr-2" />
                    5 Comprehensive PDFs
                  </div>
                  <div className="flex items-center text-sm text-gray-400">
                    <Video className="h-4 w-4 mr-2" />
                    Interactive Examples
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="bg-gray-800/50 border-gray-700 hover:border-tradeiq-blue/50 transition-all duration-300">
              <CardHeader>
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center">
                    <BarChart3 className="h-6 w-6 text-tradeiq-blue mr-2" />
                    <CardTitle className="text-white">Pattern Recognition</CardTitle>
                  </div>
                  <Lock className="h-4 w-4 text-gray-500" />
                </div>
              </CardHeader>
              <CardContent>
                <CardDescription className="text-gray-300 mb-4">
                  Master chart patterns and their implications for market movements and trading decisions.
                </CardDescription>
                <div className="space-y-2">
                  <div className="flex items-center text-sm text-gray-400">
                    <FileText className="h-4 w-4 mr-2" />
                    Pattern Recognition Guide
                  </div>
                  <div className="flex items-center text-sm text-gray-400">
                    <BarChart3 className="h-4 w-4 mr-2" />
                    Real Chart Examples
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="bg-gray-800/50 border-gray-700 hover:border-tradeiq-blue/50 transition-all duration-300">
              <CardHeader>
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center">
                    <Shield className="h-6 w-6 text-tradeiq-blue mr-2" />
                    <CardTitle className="text-white">Risk Management</CardTitle>
                  </div>
                  <Lock className="h-4 w-4 text-gray-500" />
                </div>
              </CardHeader>
              <CardContent>
                <CardDescription className="text-gray-300 mb-4">
                  Develop strategies to protect your capital and optimize returns with proven techniques.
                </CardDescription>
                <div className="space-y-2">
                  <div className="flex items-center text-sm text-gray-400">
                    <Shield className="h-4 w-4 mr-2" />
                    Risk Assessment Tools
                  </div>
                  <div className="flex items-center text-sm text-gray-400">
                    <Award className="h-4 w-4 mr-2" />
                    Advanced Strategies
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Sample Content Preview */}
          <div className="max-w-4xl mx-auto">
            <Card className="bg-gray-800/50 border-gray-700">
              <CardHeader className="text-center">
                <CardTitle className="text-2xl text-white mb-2">Sample: Introduction to Technical Analysis</CardTitle>
                <CardDescription className="text-gray-300">
                  Get a taste of our comprehensive educational content
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="bg-gray-700/50 p-6 rounded-lg">
                  <h4 className="text-lg font-semibold text-white mb-3">What is Technical Analysis?</h4>
                  <p className="text-gray-300 mb-4">
                    Technical analysis is the study of historical market data, primarily price and volume, 
                    to forecast future price movements. Unlike fundamental analysis, which focuses on a 
                    company's financial health and intrinsic value, technical analysis assumes that all 
                    relevant information is already reflected in the price.
                  </p>
                  <div className="flex items-center text-sm text-tradeiq-blue">
                    <Lock className="h-4 w-4 mr-2" />
                    <span>Continue reading with full access</span>
                  </div>
                </div>

                <div className="text-center">
                  <Link to="/login">
                    <Button size="lg" className="px-8 py-3">
                      Unlock Full Learn Section
                      <ChevronRight className="ml-2 h-5 w-5" />
                    </Button>
                  </Link>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-gradient-to-b from-gray-900/30 via-transparent to-transparent">
        <div className="container mx-auto px-4 text-center">
          <div className="max-w-3xl mx-auto">
            <h2 className="text-4xl font-bold mb-6">Ready to Master Trading?</h2>
            <p className="text-xl text-gray-300 mb-8">
              Join thousands of traders who have transformed their skills with our comprehensive educational resources.
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
              <Link to="/login">
                <Button size="lg" className="px-8 py-6 text-lg">
                  Get Started
                  <ChevronRight className="ml-2 h-5 w-5" />
                </Button>
              </Link>
              <div className="text-sm text-gray-400">
                Already have an account?{' '}
                <Link to="/app" className="text-tradeiq-blue hover:text-tradeiq-blue/80 transition-colors">
                  Access the platform →
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-gray-800/50 bg-black/20 backdrop-blur-sm py-8">
        <div className="container mx-auto px-4 text-center">
          <p className="text-xs text-gray-400 mb-2">
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
          <p className="text-xs text-gray-500">
            © 2024 TradeIQ. All rights reserved.
          </p>
        </div>
      </footer>
    </div>
  );
};

export default LearnPreview;