import React from 'react';
import { useTranslation } from 'react-i18next';
import { FileText, Scale, AlertTriangle, Mail } from 'lucide-react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import tradeiqLogo from '@/assets/tradeiq-logo.png';

const TermsOfService = () => {
  const { t } = useTranslation();

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
              <Scale className="h-12 w-12 text-tradeiq-blue" />
              <h1 className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-white via-tradeiq-blue to-white bg-clip-text text-transparent">
                {t('footer.terms')}
              </h1>
            </div>
            <p className="text-gray-400 text-lg">
              Last updated: January 2024
            </p>
          </div>
        </div>
      </header>

      {/* Content */}
      <main className="container mx-auto px-4 py-12 pb-24 bg-gradient-to-b from-gray-900/50 via-transparent to-gray-900/30">
        <div className="max-w-4xl mx-auto space-y-8">
          {/* Acceptance of Terms */}
          <Card className="bg-gray-800/50 border-gray-700 hover:border-tradeiq-blue/50 transition-all duration-300">
            <CardHeader>
              <div className="flex items-center mb-2">
                <FileText className="h-6 w-6 text-tradeiq-blue mr-3" />
                <CardTitle className="text-white text-2xl">Acceptance of Terms</CardTitle>
              </div>
            </CardHeader>
            <CardContent>
              <CardDescription className="text-gray-300 text-base leading-relaxed">
                By accessing and using TradeIQ Pro, you accept and agree to be bound by the terms 
                and provision of this agreement. These terms apply to all visitors, users, and others who 
                access or use the service. Key points include:
              </CardDescription>
              <ul className="mt-4 space-y-2 text-gray-300">
                <li className="flex items-start">
                  <span className="text-tradeiq-blue mr-2">•</span>
                  <span>You must be at least 18 years old to use our services</span>
                </li>
                <li className="flex items-start">
                  <span className="text-tradeiq-blue mr-2">•</span>
                  <span>You agree to provide accurate and complete information</span>
                </li>
                <li className="flex items-start">
                  <span className="text-tradeiq-blue mr-2">•</span>
                  <span>You are responsible for maintaining account security</span>
                </li>
              </ul>
            </CardContent>
          </Card>

          {/* Use License */}
          <Card className="bg-gray-800/50 border-gray-700 hover:border-tradeiq-blue/50 transition-all duration-300">
            <CardHeader>
              <div className="flex items-center mb-2">
                <Scale className="h-6 w-6 text-tradeiq-blue mr-3" />
                <CardTitle className="text-white text-2xl">Use License</CardTitle>
              </div>
            </CardHeader>
            <CardContent>
              <CardDescription className="text-gray-300 text-base leading-relaxed">
                Permission is granted to temporarily download one copy of TradeIQ Pro per device 
                for personal, non-commercial transitory viewing only. This license includes:
              </CardDescription>
              <ul className="mt-4 space-y-2 text-gray-300">
                <li className="flex items-start">
                  <span className="text-tradeiq-blue mr-2">•</span>
                  <span>Access to all features included in your subscription plan</span>
                </li>
                <li className="flex items-start">
                  <span className="text-tradeiq-blue mr-2">•</span>
                  <span>Personal, non-commercial use only</span>
                </li>
                <li className="flex items-start">
                  <span className="text-tradeiq-blue mr-2">•</span>
                  <span>No redistribution or modification of our content</span>
                </li>
                <li className="flex items-start">
                  <span className="text-tradeiq-blue mr-2">•</span>
                  <span>License terminates upon violation of these restrictions</span>
                </li>
              </ul>
            </CardContent>
          </Card>

          {/* Disclaimer */}
          <Card className="bg-gray-800/50 border-gray-700 hover:border-tradeiq-blue/50 transition-all duration-300">
            <CardHeader>
              <div className="flex items-center mb-2">
                <AlertTriangle className="h-6 w-6 text-tradeiq-blue mr-3" />
                <CardTitle className="text-white text-2xl">Disclaimer</CardTitle>
              </div>
            </CardHeader>
            <CardContent>
              <CardDescription className="text-gray-300 text-base leading-relaxed">
                The materials on TradeIQ Pro are provided on an 'as is' basis. TradeIQ Pro makes 
                no warranties, expressed or implied, and hereby disclaims all other warranties. Important disclaimers:
              </CardDescription>
              <ul className="mt-4 space-y-2 text-gray-300">
                <li className="flex items-start">
                  <span className="text-tradeiq-blue mr-2">•</span>
                  <span>Trading involves significant risk of loss</span>
                </li>
                <li className="flex items-start">
                  <span className="text-tradeiq-blue mr-2">•</span>
                  <span>AI predictions are not guarantees of future performance</span>
                </li>
                <li className="flex items-start">
                  <span className="text-tradeiq-blue mr-2">•</span>
                  <span>Educational content is for informational purposes only</span>
                </li>
                <li className="flex items-start">
                  <span className="text-tradeiq-blue mr-2">•</span>
                  <span>We are not liable for trading decisions made using our platform</span>
                </li>
              </ul>
            </CardContent>
          </Card>

          {/* Contact Information */}
          <Card className="bg-gray-800/50 border-gray-700 hover:border-tradeiq-blue/50 transition-all duration-300">
            <CardHeader>
              <div className="flex items-center mb-2">
                <Mail className="h-6 w-6 text-tradeiq-blue mr-3" />
                <CardTitle className="text-white text-2xl">Contact Information</CardTitle>
              </div>
            </CardHeader>
            <CardContent>
              <CardDescription className="text-gray-300 text-base leading-relaxed">
                If you have any questions about these Terms of Service or need clarification on any points, 
                please don't hesitate to contact us at{' '}
                <a 
                  href="mailto:legal@tradeiqpro.com" 
                  className="text-tradeiq-blue hover:text-tradeiq-blue/80 transition-colors underline"
                >
                  legal@tradeiqpro.com
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

export default TermsOfService;