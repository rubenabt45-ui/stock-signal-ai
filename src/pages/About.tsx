import React from 'react';
import { useTranslation } from 'react-i18next';
import { ArrowLeft, TrendingUp, Users, Award } from 'lucide-react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';

const About = () => {
  const { t } = useTranslation();

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-8 max-w-4xl">
        <div className="mb-6">
          <Link to="/">
            <Button variant="ghost" className="mb-4">
              <ArrowLeft className="mr-2 h-4 w-4" />
              {t('common.goBack')}
            </Button>
          </Link>
          <h1 className="text-3xl font-bold text-foreground mb-2">
            {t('footer.about')}
          </h1>
          <p className="text-muted-foreground">
            Learn more about TradeIQ Pro and our mission
          </p>
        </div>

        <div className="space-y-8">
          <section>
            <h2 className="text-2xl font-semibold text-foreground mb-4">Our Mission</h2>
            <p className="text-muted-foreground leading-relaxed">
              TradeIQ Pro is dedicated to democratizing access to advanced trading insights through 
              artificial intelligence. We believe that everyone should have access to institutional-grade 
              market analysis and trading strategies.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-foreground mb-4">What We Offer</h2>
            <div className="grid md:grid-cols-3 gap-6">
              <div className="text-center p-6 border border-border rounded-lg">
                <TrendingUp className="mx-auto h-12 w-12 text-primary mb-4" />
                <h3 className="font-semibold text-foreground mb-2">AI-Powered Analysis</h3>
                <p className="text-sm text-muted-foreground">
                  Advanced algorithms analyze market trends and provide actionable insights
                </p>
              </div>
              <div className="text-center p-6 border border-border rounded-lg">
                <Users className="mx-auto h-12 w-12 text-primary mb-4" />
                <h3 className="font-semibold text-foreground mb-2">Community Driven</h3>
                <p className="text-sm text-muted-foreground">
                  Learn from a community of traders and share your experiences
                </p>
              </div>
              <div className="text-center p-6 border border-border rounded-lg">
                <Award className="mx-auto h-12 w-12 text-primary mb-4" />
                <h3 className="font-semibold text-foreground mb-2">Proven Results</h3>
                <p className="text-sm text-muted-foreground">
                  Track record of helping traders make informed decisions
                </p>
              </div>
            </div>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-foreground mb-4">Our Team</h2>
            <p className="text-muted-foreground leading-relaxed">
              Our team consists of experienced traders, data scientists, and software engineers 
              who are passionate about revolutionizing the trading industry through technology.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-foreground mb-4">Contact Us</h2>
            <p className="text-muted-foreground leading-relaxed">
              Have questions or want to learn more? Get in touch with us at contact@tradeiqpro.com
            </p>
          </section>
        </div>
      </div>
    </div>
  );
};

export default About;