import React from 'react';
import { useTranslation } from 'react-i18next';
import { ArrowLeft } from 'lucide-react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';

const CookiePolicy = () => {
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
            {t('footer.cookies')}
          </h1>
          <p className="text-muted-foreground">
            Last updated: January 2024
          </p>
        </div>

        <div className="prose prose-slate dark:prose-invert max-w-none">
          <div className="space-y-6 text-foreground">
            <section>
              <h2 className="text-xl font-semibold mb-3">What Are Cookies</h2>
              <p className="text-muted-foreground leading-relaxed">
                Cookies are small pieces of data stored on your device when you visit our website. 
                They help us provide you with a better experience and understand how you use our services.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-semibold mb-3">How We Use Cookies</h2>
              <p className="text-muted-foreground leading-relaxed">
                We use cookies to remember your preferences, analyze site traffic, personalize content, 
                and improve our services.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-semibold mb-3">Types of Cookies We Use</h2>
              <ul className="list-disc pl-6 text-muted-foreground space-y-2">
                <li>Essential cookies for site functionality</li>
                <li>Analytics cookies to understand usage patterns</li>
                <li>Preference cookies to remember your settings</li>
                <li>Marketing cookies for personalized advertising</li>
              </ul>
            </section>

            <section>
              <h2 className="text-xl font-semibold mb-3">Managing Cookies</h2>
              <p className="text-muted-foreground leading-relaxed">
                You can control and manage cookies through your browser settings. However, 
                disabling cookies may affect the functionality of our services.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-semibold mb-3">Contact Us</h2>
              <p className="text-muted-foreground leading-relaxed">
                If you have any questions about our Cookie Policy, please contact us at 
                privacy@tradeiqpro.com
              </p>
            </section>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CookiePolicy;