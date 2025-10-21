import React from 'react';
import { useTranslation } from 'react-i18next';
import { Info, Target, TrendingUp, Users, Award, UserCircle, Mail } from 'lucide-react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import tradeiqLogo from '@/assets/tradeiq-logo.png';

const About = () => {
  const { t } = useTranslation();

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-black text-white">
      {/* Navigation */}
      <nav className="border-b border-gray-800/50 bg-black/20 backdrop-blur-sm sticky top-0 z-50">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <Link to="/" className="flex items-center group">
            <div className="relative">
              <div className="absolute inset-0 bg-gradient-to-r from-tradeiq-blue/30 to-purple-500/30 blur-2xl rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-500 animate-pulse"></div>
              <div className="absolute inset-0 bg-tradeiq-blue/10 blur-xl rounded-full"></div>
              <img 
                src={tradeiqLogo} 
                alt="TradeIQ Logo" 
                className="h-14 sm:h-18 md:h-16 relative z-10 drop-shadow-[0_0_20px_rgba(59,130,246,0.6)] group-hover:drop-shadow-[0_0_35px_rgba(59,130,246,1)] transition-all duration-300 group-hover:scale-110 filter brightness-110" 
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

      {/* Header */}
      <header className="border-b border-gray-800/50 bg-gradient-to-b from-transparent via-gray-900/30 to-gray-900/50">
        <div className="container mx-auto px-4 py-12">
          <div className="text-center max-w-3xl mx-auto">
            <div className="flex items-center justify-center space-x-3 mb-4">
              <Info className="h-12 w-12 text-tradeiq-blue" />
              <h1 className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-white via-tradeiq-blue to-white bg-clip-text text-transparent">
                {t('footer.about')}
              </h1>
            </div>
            <p className="text-gray-400 text-lg">
              Learn more about TradeIQ Pro and our mission
            </p>
          </div>
        </div>
      </header>

      {/* Content */}
      <main className="container mx-auto px-4 py-12 pb-24 bg-gradient-to-b from-gray-900/50 via-transparent to-gray-900/30">
        <div className="max-w-4xl mx-auto space-y-8">
          {/* Our Mission */}
          <Card className="bg-gray-800/50 border-gray-700 hover:border-tradeiq-blue/50 transition-all duration-300">
            <CardHeader>
              <div className="flex items-center mb-2">
                <Target className="h-6 w-6 text-tradeiq-blue mr-3" />
                <CardTitle className="text-white text-2xl">Our Mission</CardTitle>
              </div>
            </CardHeader>
            <CardContent>
              <CardDescription className="text-gray-300 text-base leading-relaxed">
                TradeIQ Pro is dedicated to democratizing access to advanced trading insights through 
                artificial intelligence. We believe that everyone should have access to institutional-grade 
                market analysis and trading strategies, regardless of their experience level or resources.
              </CardDescription>
              <ul className="mt-4 space-y-2 text-gray-300">
                <li className="flex items-start">
                  <span className="text-tradeiq-blue mr-2">•</span>
                  <span>Making professional-grade trading tools accessible to everyone</span>
                </li>
                <li className="flex items-start">
                  <span className="text-tradeiq-blue mr-2">•</span>
                  <span>Empowering traders with AI-driven insights and analysis</span>
                </li>
                <li className="flex items-start">
                  <span className="text-tradeiq-blue mr-2">•</span>
                  <span>Building a community of informed and confident traders</span>
                </li>
              </ul>
            </CardContent>
          </Card>

          {/* What We Offer */}
          <div className="space-y-6">
            <h2 className="text-3xl font-bold text-center text-white">What We Offer</h2>
            <div className="grid md:grid-cols-3 gap-6">
              <Card className="bg-gray-800/50 border-gray-700 hover:border-tradeiq-blue/50 transition-all duration-300 text-center">
                <CardHeader>
                  <div className="flex justify-center mb-3">
                    <div className="p-3 bg-tradeiq-blue/20 rounded-full">
                      <TrendingUp className="h-8 w-8 text-tradeiq-blue" />
                    </div>
                  </div>
                  <CardTitle className="text-white text-lg">AI-Powered Analysis</CardTitle>
                </CardHeader>
                <CardContent>
                  <CardDescription className="text-gray-300">
                    Advanced algorithms analyze market trends and provide actionable insights
                  </CardDescription>
                </CardContent>
              </Card>

              <Card className="bg-gray-800/50 border-gray-700 hover:border-tradeiq-blue/50 transition-all duration-300 text-center">
                <CardHeader>
                  <div className="flex justify-center mb-3">
                    <div className="p-3 bg-tradeiq-blue/20 rounded-full">
                      <Users className="h-8 w-8 text-tradeiq-blue" />
                    </div>
                  </div>
                  <CardTitle className="text-white text-lg">Community Driven</CardTitle>
                </CardHeader>
                <CardContent>
                  <CardDescription className="text-gray-300">
                    Learn from a community of traders and share your experiences
                  </CardDescription>
                </CardContent>
              </Card>

              <Card className="bg-gray-800/50 border-gray-700 hover:border-tradeiq-blue/50 transition-all duration-300 text-center">
                <CardHeader>
                  <div className="flex justify-center mb-3">
                    <div className="p-3 bg-tradeiq-blue/20 rounded-full">
                      <Award className="h-8 w-8 text-tradeiq-blue" />
                    </div>
                  </div>
                  <CardTitle className="text-white text-lg">Proven Results</CardTitle>
                </CardHeader>
                <CardContent>
                  <CardDescription className="text-gray-300">
                    Track record of helping traders make informed decisions
                  </CardDescription>
                </CardContent>
              </Card>
            </div>
          </div>

          {/* Our Team */}
          <Card className="bg-gray-800/50 border-gray-700 hover:border-tradeiq-blue/50 transition-all duration-300">
            <CardHeader>
              <div className="flex items-center mb-2">
                <UserCircle className="h-6 w-6 text-tradeiq-blue mr-3" />
                <CardTitle className="text-white text-2xl">Our Team</CardTitle>
              </div>
            </CardHeader>
            <CardContent>
              <CardDescription className="text-gray-300 text-base leading-relaxed">
                Our team consists of experienced traders, data scientists, and software engineers 
                who are passionate about revolutionizing the trading industry through technology. Together, we combine:
              </CardDescription>
              <ul className="mt-4 space-y-2 text-gray-300">
                <li className="flex items-start">
                  <span className="text-tradeiq-blue mr-2">•</span>
                  <span>Decades of combined trading experience across multiple markets</span>
                </li>
                <li className="flex items-start">
                  <span className="text-tradeiq-blue mr-2">•</span>
                  <span>Cutting-edge expertise in artificial intelligence and machine learning</span>
                </li>
                <li className="flex items-start">
                  <span className="text-tradeiq-blue mr-2">•</span>
                  <span>World-class software engineering and user experience design</span>
                </li>
                <li className="flex items-start">
                  <span className="text-tradeiq-blue mr-2">•</span>
                  <span>A shared commitment to democratizing trading insights</span>
                </li>
              </ul>
            </CardContent>
          </Card>

          {/* Contact Us */}
          <Card className="bg-gray-800/50 border-gray-700 hover:border-tradeiq-blue/50 transition-all duration-300">
            <CardHeader>
              <div className="flex items-center mb-2">
                <Mail className="h-6 w-6 text-tradeiq-blue mr-3" />
                <CardTitle className="text-white text-2xl">Contact Us</CardTitle>
              </div>
            </CardHeader>
            <CardContent>
              <CardDescription className="text-gray-300 text-base leading-relaxed">
                Have questions or want to learn more about TradeIQ Pro? We'd love to hear from you. 
                Get in touch with us at{' '}
                <a 
                  href="mailto:contact@tradeiqpro.com" 
                  className="text-tradeiq-blue hover:text-tradeiq-blue/80 transition-colors underline"
                >
                  contact@tradeiqpro.com
                </a>
              </CardDescription>
            </CardContent>
          </Card>
        </div>
      </main>

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

export default About;