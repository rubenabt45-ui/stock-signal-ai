import React from 'react';
import { useTranslation } from 'react-i18next';
import { Briefcase, MapPin, Clock, Rocket, Users, TrendingUp, Heart, Mail } from 'lucide-react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import tradeiqLogo from '@/assets/tradeiq-logo.png';

const Careers = () => {
  const { t } = useTranslation();

  const openings = [
    {
      title: "Senior Frontend Developer",
      location: "Remote",
      type: "Full-time",
      description: "Join our team to build cutting-edge trading interfaces using React and TypeScript."
    },
    {
      title: "AI/ML Engineer",
      location: "Remote",
      type: "Full-time", 
      description: "Help develop and improve our AI-powered trading analysis algorithms."
    },
    {
      title: "Product Designer",
      location: "Remote",
      type: "Full-time",
      description: "Design intuitive user experiences for our trading platform and mobile apps."
    }
  ];

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

      {/* Header */}
      <header className="border-b border-gray-800/50 bg-gradient-to-b from-transparent via-gray-900/30 to-gray-900/50">
        <div className="container mx-auto px-4 py-12">
          <div className="text-center max-w-3xl mx-auto">
            <div className="flex items-center justify-center space-x-3 mb-4">
              <Briefcase className="h-12 w-12 text-tradeiq-blue" />
              <h1 className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-white via-tradeiq-blue to-white bg-clip-text text-transparent">
                {t('footer.careers')}
              </h1>
            </div>
            <p className="text-gray-400 text-lg">
              Join our team and help shape the future of AI-powered trading
            </p>
          </div>
        </div>
      </header>

      {/* Content */}
      <main className="container mx-auto px-4 py-12 pb-24 bg-gradient-to-b from-gray-900/50 via-transparent to-gray-900/30">
        <div className="max-w-4xl mx-auto space-y-8">
          {/* Why Work With Us */}
          <div className="space-y-6">
            <h2 className="text-3xl font-bold text-center text-white">Why Work With Us?</h2>
            <div className="grid md:grid-cols-2 gap-6">
              <Card className="bg-gray-800/50 border-gray-700 hover:border-tradeiq-blue/50 transition-all duration-300">
                <CardHeader>
                  <div className="flex items-center mb-2">
                    <Rocket className="h-6 w-6 text-tradeiq-blue mr-3" />
                    <CardTitle className="text-white text-lg">Innovation First</CardTitle>
                  </div>
                </CardHeader>
                <CardContent>
                  <CardDescription className="text-gray-300">
                    Work on cutting-edge AI technology that's revolutionizing financial markets.
                  </CardDescription>
                </CardContent>
              </Card>

              <Card className="bg-gray-800/50 border-gray-700 hover:border-tradeiq-blue/50 transition-all duration-300">
                <CardHeader>
                  <div className="flex items-center mb-2">
                    <MapPin className="h-6 w-6 text-tradeiq-blue mr-3" />
                    <CardTitle className="text-white text-lg">Remote Flexibility</CardTitle>
                  </div>
                </CardHeader>
                <CardContent>
                  <CardDescription className="text-gray-300">
                    Work from anywhere with flexible hours and a results-focused culture.
                  </CardDescription>
                </CardContent>
              </Card>

              <Card className="bg-gray-800/50 border-gray-700 hover:border-tradeiq-blue/50 transition-all duration-300">
                <CardHeader>
                  <div className="flex items-center mb-2">
                    <TrendingUp className="h-6 w-6 text-tradeiq-blue mr-3" />
                    <CardTitle className="text-white text-lg">Growth Opportunities</CardTitle>
                  </div>
                </CardHeader>
                <CardContent>
                  <CardDescription className="text-gray-300">
                    Continuous learning and development with opportunities to advance your career.
                  </CardDescription>
                </CardContent>
              </Card>

              <Card className="bg-gray-800/50 border-gray-700 hover:border-tradeiq-blue/50 transition-all duration-300">
                <CardHeader>
                  <div className="flex items-center mb-2">
                    <Heart className="h-6 w-6 text-tradeiq-blue mr-3" />
                    <CardTitle className="text-white text-lg">Competitive Benefits</CardTitle>
                  </div>
                </CardHeader>
                <CardContent>
                  <CardDescription className="text-gray-300">
                    Comprehensive health coverage, equity participation, and performance bonuses.
                  </CardDescription>
                </CardContent>
              </Card>
            </div>
          </div>

          {/* Open Positions */}
          <div className="space-y-6">
            <h2 className="text-3xl font-bold text-center text-white">Open Positions</h2>
            <div className="space-y-6">
              {openings.map((job, index) => (
                <Card 
                  key={index} 
                  className="bg-gray-800/50 border-gray-700 hover:border-tradeiq-blue/50 transition-all duration-300"
                >
                  <CardHeader>
                    <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                      <CardTitle className="text-white text-xl">
                        {job.title}
                      </CardTitle>
                      <div className="flex gap-4 text-sm text-gray-400">
                        <div className="flex items-center gap-2">
                          <MapPin className="h-4 w-4 text-tradeiq-blue" />
                          <span>{job.location}</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <Clock className="h-4 w-4 text-tradeiq-blue" />
                          <span>{job.type}</span>
                        </div>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <CardDescription className="text-gray-300 text-base mb-4">
                      {job.description}
                    </CardDescription>
                    <Button 
                      className="bg-tradeiq-blue hover:bg-tradeiq-blue/90 text-white"
                    >
                      Apply Now
                    </Button>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>

          {/* Don't See a Fit */}
          <Card className="bg-gray-800/50 border-gray-700 hover:border-tradeiq-blue/50 transition-all duration-300 text-center">
            <CardHeader>
              <div className="flex items-center justify-center mb-2">
                <Mail className="h-6 w-6 text-tradeiq-blue mr-3" />
                <CardTitle className="text-white text-2xl">Don't see a perfect fit?</CardTitle>
              </div>
            </CardHeader>
            <CardContent>
              <CardDescription className="text-gray-300 text-base mb-4">
                We're always looking for talented individuals. Send us your resume at{' '}
                <a 
                  href="mailto:careers@tradeiqpro.com" 
                  className="text-tradeiq-blue hover:text-tradeiq-blue/80 transition-colors underline"
                >
                  careers@tradeiqpro.com
                </a>
              </CardDescription>
              <Button 
                variant="outline"
                className="border-gray-600 hover:bg-gray-800"
              >
                Send Resume
              </Button>
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

export default Careers;