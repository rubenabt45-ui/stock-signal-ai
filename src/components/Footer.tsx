
import React from 'react';
import { Link } from 'react-router-dom';
import { useTranslationWithFallback } from '../hooks/useTranslationWithFallback';
import { ErrorBoundary } from './ErrorBoundary';

const FooterContent = () => {
  const { t } = useTranslationWithFallback();

  const handleLinkClick = (linkName: string, path: string) => {
    console.log(`🔗 [FOOTER_NAVIGATION] ${linkName} clicked, navigating to: ${path}`);
  };

  const footerLinks = [
    {
      category: t('footer.platform'),
      links: [
        { 
          name: t('footer.dashboard'), 
          path: '/app', 
          ariaLabel: 'Navigate to Trading Dashboard' 
        },
        { 
          name: t('footer.learnPreview'), 
          path: '/learn-preview', 
          ariaLabel: 'Navigate to Learn Preview' 
        },
        { 
          name: t('footer.pricing'), 
          path: '/pricing', 
          ariaLabel: 'Navigate to Pricing' 
        },
      ]
    },
    {
      category: t('footer.legal'),
      links: [
        { 
          name: t('footer.privacy'), 
          path: '/privacy-policy', 
          ariaLabel: 'Navigate to Privacy Policy' 
        },
        { 
          name: t('footer.terms'), 
          path: '/terms-of-service', 
          ariaLabel: 'Navigate to Terms of Service' 
        },
        { 
          name: t('footer.cookies'), 
          path: '/cookie-policy', 
          ariaLabel: 'Navigate to Cookie Policy' 
        },
      ]
    },
    {
      category: t('footer.company'),
      links: [
        { 
          name: t('footer.about'), 
          path: '/about', 
          ariaLabel: 'Navigate to About page' 
        },
        { 
          name: t('footer.blog'), 
          path: '/blog', 
          ariaLabel: 'Navigate to Blog' 
        },
        { 
          name: t('footer.careers'), 
          path: '/careers', 
          ariaLabel: 'Navigate to Careers' 
        },
      ]
    }
  ];
  
  return (
    <footer className="border-t border-border bg-background/50 backdrop-blur-sm py-8 px-4">
      <div className="container mx-auto">
        {/* Navigation Links */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-8">
          {footerLinks.map((section, index) => (
            <div key={index} className="space-y-4">
              <h3 className="text-sm font-semibold text-foreground uppercase tracking-wider">
                {section.category}
              </h3>
              <ul className="space-y-2">
                {section.links.map((link, linkIndex) => (
                  <li key={linkIndex}>
                    <Link
                      to={link.path}
                      aria-label={link.ariaLabel}
                      onClick={() => handleLinkClick(link.name, link.path)}
                      className="text-sm text-muted-foreground hover:text-foreground transition-colors duration-200 hover:underline focus:outline-none focus:ring-2 focus:ring-primary focus:ring-opacity-50 rounded px-1 py-0.5"
                    >
                      {link.name}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        {/* Bottom Section */}
        <div className="border-t border-border pt-6 text-center">
          <p className="text-xs text-muted-foreground">
            {t('footer.description')}{' '}
            <a 
              href="https://www.tradeiqpro.com" 
              target="_blank" 
              rel="noopener noreferrer"
              aria-label="Visit TradeIQ Pro website"
              className="text-primary hover:text-primary/80 hover:underline transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-primary focus:ring-opacity-50 rounded px-1 py-0.5"
            >
              www.tradeiqpro.com
            </a>
          </p>
          <p className="text-xs text-muted-foreground mt-2">
            © 2024 TradeIQ Pro. {t('footer.rights')}
          </p>
        </div>
      </div>
    </footer>
  );
};

const Footer = () => {
  return (
    <ErrorBoundary
      componentName="Footer"
      fallback={
        <footer className="border-t border-border bg-background/50 backdrop-blur-sm py-8 px-4">
          <div className="container mx-auto text-center">
            <p className="text-sm text-muted-foreground">
              © 2024 TradeIQ Pro. All rights reserved.
            </p>
          </div>
        </footer>
      }
    >
      <FooterContent />
    </ErrorBoundary>
  );
};

export default Footer;
