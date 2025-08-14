
import React from "react";
import { Newspaper, Brain, Zap, TrendingUp } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { PageWrapper } from '@/components/PageWrapper';

const NewsAI = () => {
  const features = [
    {
      icon: Brain,
      title: "AI-Powered Analysis",
      description: "Advanced natural language processing to extract market insights from news"
    },
    {
      icon: Zap,
      title: "Real-Time Processing",
      description: "Instant analysis of breaking news and market-moving events"
    },
    {
      icon: TrendingUp,
      title: "Sentiment Tracking",
      description: "Track market sentiment and its impact on asset prices"
    },
    {
      icon: Newspaper,
      title: "Multi-Source Integration",
      description: "Aggregate news from trusted financial sources worldwide"
    }
  ];

  return (
    <PageWrapper pageName="NewsAI">
      <div className="min-h-screen bg-tradeiq-navy">
        {/* Header */}
        <header className="border-b border-gray-800/50 bg-black/20 backdrop-blur-sm sticky top-0 z-50">
          <div className="container mx-auto px-4 py-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <Newspaper className="h-8 w-8 text-tradeiq-blue" />
                <div>
                  <h1 className="text-2xl font-bold text-white tracking-tight">NewsAI</h1>
                  <p className="text-sm text-gray-400 font-medium">AI-Powered News Analysis</p>
                </div>
              </div>
            </div>
          </div>
        </header>

        {/* Content */}
        <main className="container mx-auto px-4 py-12 pb-24">
          <div className="max-w-4xl mx-auto">
            {/* Description */}
            <div className="text-center mb-12">
              <p className="text-gray-300 text-lg leading-relaxed max-w-3xl mx-auto">
                Transform how you consume financial news with our AI-powered analysis platform. 
                Get instant insights, sentiment analysis, and market impact assessments from breaking news and events.
              </p>
            </div>

            {/* Features Grid */}
            <div className="grid md:grid-cols-2 gap-6 mb-12">
              {features.map((feature, index) => (
                <Card key={index} className="tradeiq-card">
                  <CardContent className="p-6">
                    <div className="flex items-start space-x-4">
                      <div className="p-3 bg-tradeiq-blue/20 rounded-lg">
                        <feature.icon className="h-6 w-6 text-tradeiq-blue" />
                      </div>
                      <div>
                        <h3 className="text-white font-semibold mb-2">{feature.title}</h3>
                        <p className="text-gray-400 text-sm">{feature.description}</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>

            {/* Availability Notice */}
            <div className="text-center">
              <Card className="tradeiq-card border-tradeiq-blue/30">
                <CardContent className="p-8">
                  <div className="flex justify-center mb-4">
                    <div className="p-4 bg-tradeiq-blue/20 rounded-full">
                      <Newspaper className="h-8 w-8 text-tradeiq-blue" />
                    </div>
                  </div>
                  <h3 className="text-xl font-bold text-white mb-4">NewsAI In Development</h3>
                  <p className="text-gray-300 mb-6 max-w-2xl mx-auto">
                    We're building advanced AI-powered news analysis with real-time market insights 
                    and sentiment tracking. This feature will help you stay ahead of market-moving news.
                  </p>
                  <div className="text-sm text-gray-400">
                    Expected launch: Q3 2024
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </main>
      </div>
    </PageWrapper>
  );
};

export default NewsAI;
