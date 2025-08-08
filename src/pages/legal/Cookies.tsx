
import React from 'react';
import { useTranslationWithFallback } from '@/hooks/useTranslationWithFallback';
import { ArrowLeft } from 'lucide-react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';

const Cookies = () => {
  const { t } = useTranslationWithFallback();

  React.useEffect(() => {
    document.title = t('legal.cookies.metaTitle');
    const metaDescription = document.querySelector('meta[name="description"]');
    if (metaDescription) {
      metaDescription.setAttribute('content', t('legal.cookies.metaDescription'));
    }

    const canonical = document.querySelector('link[rel="canonical"]');
    if (canonical) {
      canonical.setAttribute('href', `${window.location.origin}/cookie-policy`);
    } else {
      const link = document.createElement('link');
      link.rel = 'canonical';
      link.href = `${window.location.origin}/cookie-policy`;
      document.head.appendChild(link);
    }
  }, [t]);

  const scrollToSection = (sectionId: string) => {
    const element = document.getElementById(sectionId);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const sections = [
    { id: 'introduction', key: 'introduction' },
    { id: 'what-are-cookies', key: 'whatAreCookies' },
    { id: 'types-of-cookies', key: 'typesOfCookies' },
    { id: 'essential-cookies', key: 'essentialCookies' },
    { id: 'analytics-cookies', key: 'analyticsCookies' },
    { id: 'managing-cookies', key: 'managingCookies' },
    { id: 'third-party-cookies', key: 'thirdPartyCookies' },
    { id: 'updates', key: 'updates' },
    { id: 'contact', key: 'contact' }
  ];

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-8 max-w-4xl">
        <div className="mb-6">
          <Link to="/">
            <Button variant="ghost" className="mb-4">
              <ArrowLeft className="mr-2 h-4 w-4" />
              {t('common.back')}
            </Button>
          </Link>
          <h1 className="text-3xl font-bold text-foreground mb-2">
            {t('legal.cookies.title')}
          </h1>
          <p className="text-muted-foreground">
            {t('legal.lastUpdated')}: {t('legal.cookies.lastUpdated')}
          </p>
        </div>

        <div className="mb-8 p-4 bg-muted/50 rounded-lg">
          <h2 className="text-lg font-semibold mb-3">{t('legal.tableOfContents')}</h2>
          <nav className="space-y-2">
            {sections.map((section) => (
              <button
                key={section.id}
                onClick={() => scrollToSection(section.id)}
                className="block text-sm text-primary hover:underline text-left focus:outline-none focus:ring-2 focus:ring-primary focus:ring-opacity-50 rounded px-1 py-0.5"
              >
                {t(`legal.cookies.sections.${section.key}.title`)}
              </button>
            ))}
          </nav>
        </div>

        <div className="prose prose-slate dark:prose-invert max-w-none">
          <div className="space-y-8 text-foreground">
            <section id="introduction">
              <h2 className="text-xl font-semibold mb-3">{t('legal.cookies.sections.introduction.title')}</h2>
              <div className="text-muted-foreground leading-relaxed space-y-3">
                {t('legal.cookies.sections.introduction.content').split('\n').map((paragraph, index) => (
                  <p key={index}>{paragraph}</p>
                ))}
              </div>
            </section>

            <section id="what-are-cookies">
              <h2 className="text-xl font-semibold mb-3">{t('legal.cookies.sections.whatAreCookies.title')}</h2>
              <div className="text-muted-foreground leading-relaxed space-y-3">
                {t('legal.cookies.sections.whatAreCookies.content').split('\n').map((paragraph, index) => (
                  <p key={index}>{paragraph}</p>
                ))}
              </div>
            </section>

            <section id="types-of-cookies">
              <h2 className="text-xl font-semibold mb-3">{t('legal.cookies.sections.typesOfCookies.title')}</h2>
              <div className="text-muted-foreground leading-relaxed space-y-3">
                {t('legal.cookies.sections.typesOfCookies.content').split('\n').map((paragraph, index) => (
                  <p key={index}>{paragraph}</p>
                ))}
              </div>
            </section>

            <section id="essential-cookies">
              <h2 className="text-xl font-semibold mb-3">{t('legal.cookies.sections.essentialCookies.title')}</h2>
              <div className="text-muted-foreground leading-relaxed space-y-3">
                {t('legal.cookies.sections.essentialCookies.content').split('\n').map((paragraph, index) => (
                  <p key={index}>{paragraph}</p>
                ))}
              </div>
            </section>

            <section id="analytics-cookies">
              <h2 className="text-xl font-semibold mb-3">{t('legal.cookies.sections.analyticsCookies.title')}</h2>
              <div className="text-muted-foreground leading-relaxed space-y-3">
                {t('legal.cookies.sections.analyticsCookies.content').split('\n').map((paragraph, index) => (
                  <p key={index}>{paragraph}</p>
                ))}
              </div>
            </section>

            <section id="managing-cookies">
              <h2 className="text-xl font-semibold mb-3">{t('legal.cookies.sections.managingCookies.title')}</h2>
              <div className="text-muted-foreground leading-relaxed space-y-3">
                {t('legal.cookies.sections.managingCookies.content').split('\n').map((paragraph, index) => (
                  <p key={index}>{paragraph}</p>
                ))}
              </div>
            </section>

            <section id="third-party-cookies">
              <h2 className="text-xl font-semibold mb-3">{t('legal.cookies.sections.thirdPartyCookies.title')}</h2>
              <div className="text-muted-foreground leading-relaxed space-y-3">
                {t('legal.cookies.sections.thirdPartyCookies.content').split('\n').map((paragraph, index) => (
                  <p key={index}>{paragraph}</p>
                ))}
              </div>
            </section>

            <section id="updates">
              <h2 className="text-xl font-semibold mb-3">{t('legal.cookies.sections.updates.title')}</h2>
              <div className="text-muted-foreground leading-relaxed space-y-3">
                {t('legal.cookies.sections.updates.content').split('\n').map((paragraph, index) => (
                  <p key={index}>{paragraph}</p>
                ))}
              </div>
            </section>

            <section id="contact">
              <h2 className="text-xl font-semibold mb-3">{t('legal.cookies.sections.contact.title')}</h2>
              <div className="text-muted-foreground leading-relaxed space-y-3">
                <p>{t('legal.cookies.sections.contact.content')}</p>
                <p>
                  <strong>{t('legal.legalMatters')}:</strong>{' '}
                  <a href="mailto:legal@tradeiqpro.com" className="text-primary hover:underline">
                    legal@tradeiqpro.com
                  </a>
                </p>
                <p>
                  <strong>{t('legal.generalSupport')}:</strong>{' '}
                  <a href="mailto:support@tradeiqpro.com" className="text-primary hover:underline">
                    support@tradeiqpro.com
                  </a>
                </p>
              </div>
            </section>

            <footer className="mt-12 pt-6 border-t border-border text-center text-sm text-muted-foreground">
              <p>{t('legal.copyright')}</p>
            </footer>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Cookies;
