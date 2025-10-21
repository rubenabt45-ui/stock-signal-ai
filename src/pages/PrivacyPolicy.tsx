import React from 'react';
import { useTranslation } from 'react-i18next';
import { Shield, Lock, FileText, Mail } from 'lucide-react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import tradeiqLogo from '@/assets/tradeiq-logo.png';

const PrivacyPolicy = () => {
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
              <Shield className="h-12 w-12 text-tradeiq-blue" />
              <h1 className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-white via-tradeiq-blue to-white bg-clip-text text-transparent">
                {t('footer.privacy')}
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
          {/* Information We Collect */}
          <Card className="bg-gray-800/50 border-gray-700 hover:border-tradeiq-blue/50 transition-all duration-300">
            <CardHeader>
              <div className="flex items-center mb-2">
                <FileText className="h-6 w-6 text-tradeiq-blue mr-3" />
                <CardTitle className="text-white text-2xl">Information We Collect</CardTitle>
              </div>
            </CardHeader>
            <CardContent>
              <CardDescription className="text-gray-300 text-base leading-relaxed">
                We collect information you provide directly to us, such as when you create an account, 
                use our services, or contact us for support. This includes:
              </CardDescription>
              <ul className="mt-4 space-y-2 text-gray-300">
                <li className="flex items-start">
                  <span className="text-tradeiq-blue mr-2">•</span>
                  <span>Account information (email, username, password)</span>
                </li>
                <li className="flex items-start">
                  <span className="text-tradeiq-blue mr-2">•</span>
                  <span>Trading preferences and settings</span>
                </li>
                <li className="flex items-start">
                  <span className="text-tradeiq-blue mr-2">•</span>
                  <span>Communication history with our support team</span>
                </li>
              </ul>
            </CardContent>
          </Card>

          {/* How We Use Your Information */}
          <Card className="bg-gray-800/50 border-gray-700 hover:border-tradeiq-blue/50 transition-all duration-300">
            <CardHeader>
              <div className="flex items-center mb-2">
                <Shield className="h-6 w-6 text-tradeiq-blue mr-3" />
                <CardTitle className="text-white text-2xl">How We Use Your Information</CardTitle>
              </div>
            </CardHeader>
            <CardContent>
              <CardDescription className="text-gray-300 text-base leading-relaxed">
                We use the information we collect to provide, maintain, and improve our services, 
                process transactions, and communicate with you. Specifically, we use your data to:
              </CardDescription>
              <ul className="mt-4 space-y-2 text-gray-300">
                <li className="flex items-start">
                  <span className="text-tradeiq-blue mr-2">•</span>
                  <span>Deliver personalized AI trading insights</span>
                </li>
                <li className="flex items-start">
                  <span className="text-tradeiq-blue mr-2">•</span>
                  <span>Process and manage your subscription</span>
                </li>
                <li className="flex items-start">
                  <span className="text-tradeiq-blue mr-2">•</span>
                  <span>Improve our platform and develop new features</span>
                </li>
                <li className="flex items-start">
                  <span className="text-tradeiq-blue mr-2">•</span>
                  <span>Send important updates and notifications</span>
                </li>
              </ul>
            </CardContent>
          </Card>

          {/* Data Security */}
          <Card className="bg-gray-800/50 border-gray-700 hover:border-tradeiq-blue/50 transition-all duration-300">
            <CardHeader>
              <div className="flex items-center mb-2">
                <Lock className="h-6 w-6 text-tradeiq-blue mr-3" />
                <CardTitle className="text-white text-2xl">Data Security</CardTitle>
              </div>
            </CardHeader>
            <CardContent>
              <CardDescription className="text-gray-300 text-base leading-relaxed">
                We implement appropriate technical and organizational measures to protect your 
                personal information against unauthorized access, alteration, disclosure, or destruction. 
                Our security practices include:
              </CardDescription>
              <ul className="mt-4 space-y-2 text-gray-300">
                <li className="flex items-start">
                  <span className="text-tradeiq-blue mr-2">•</span>
                  <span>End-to-end encryption for sensitive data</span>
                </li>
                <li className="flex items-start">
                  <span className="text-tradeiq-blue mr-2">•</span>
                  <span>Regular security audits and updates</span>
                </li>
                <li className="flex items-start">
                  <span className="text-tradeiq-blue mr-2">•</span>
                  <span>Secure payment processing through Stripe</span>
                </li>
                <li className="flex items-start">
                  <span className="text-tradeiq-blue mr-2">•</span>
                  <span>Limited access to personal data by authorized personnel only</span>
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
                If you have any questions about this Privacy Policy or how we handle your data, 
                please don't hesitate to contact us at{' '}
                <a 
                  href="mailto:privacy@tradeiqpro.com" 
                  className="text-tradeiq-blue hover:text-tradeiq-blue/80 transition-colors underline"
                >
                  privacy@tradeiqpro.com
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

export default PrivacyPolicy;