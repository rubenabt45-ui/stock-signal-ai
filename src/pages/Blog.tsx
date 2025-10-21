import React from 'react';
import { useTranslation } from 'react-i18next';
import { BookOpen, Calendar, Clock } from 'lucide-react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import tradeiqLogo from '@/assets/tradeiq-logo.png';

const Blog = () => {
  const { t } = useTranslation();

  const blogPosts = [
    {
      title: "Getting Started with AI Trading",
      excerpt: "Learn the basics of using artificial intelligence to enhance your trading strategy.",
      date: "2024-01-15",
      readTime: "5 min read"
    },
    {
      title: "Market Analysis Techniques",
      excerpt: "Discover advanced techniques for analyzing market trends and patterns.",
      date: "2024-01-10",
      readTime: "7 min read"
    },
    {
      title: "Risk Management in Trading",
      excerpt: "Essential strategies for managing risk and protecting your portfolio.",
      date: "2024-01-05",
      readTime: "6 min read"
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
              <BookOpen className="h-12 w-12 text-tradeiq-blue" />
              <h1 className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-white via-tradeiq-blue to-white bg-clip-text text-transparent">
                {t('footer.blog')}
              </h1>
            </div>
            <p className="text-gray-400 text-lg">
              Latest insights and updates from the TradeIQ Pro team
            </p>
          </div>
        </div>
      </header>

      {/* Content */}
      <main className="container mx-auto px-4 py-12 pb-24 bg-gradient-to-b from-gray-900/50 via-transparent to-gray-900/30">
        <div className="max-w-4xl mx-auto space-y-6">
          {blogPosts.map((post, index) => (
            <Card 
              key={index} 
              className="bg-gray-800/50 border-gray-700 hover:border-tradeiq-blue/50 transition-all duration-300 cursor-pointer group"
            >
              <CardHeader>
                <CardTitle className="text-white text-xl group-hover:text-tradeiq-blue transition-colors">
                  {post.title}
                </CardTitle>
              </CardHeader>
              <CardContent>
                <CardDescription className="text-gray-300 text-base leading-relaxed mb-4">
                  {post.excerpt}
                </CardDescription>
                <div className="flex items-center gap-4 text-sm text-gray-400">
                  <div className="flex items-center gap-2">
                    <Calendar className="h-4 w-4 text-tradeiq-blue" />
                    <span>{post.date}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Clock className="h-4 w-4 text-tradeiq-blue" />
                    <span>{post.readTime}</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Coming Soon Message */}
        <div className="text-center mt-12 bg-gradient-to-b from-gray-900/30 via-gray-900/20 to-transparent py-8 rounded-lg max-w-4xl mx-auto">
          <p className="text-gray-300 text-lg">
            More articles coming soon! Follow us for the latest updates.
          </p>
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

export default Blog;