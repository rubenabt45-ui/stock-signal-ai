
import React from 'react';
import { useTranslationWithFallback } from '@/hooks/useTranslationWithFallback';
import { ArrowLeft } from 'lucide-react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';

const Privacy = () => {
  const { t } = useTranslationWithFallback();

  React.useEffect(() => {
    document.title = t('legal.privacy.metaTitle');
    const metaDescription = document.querySelector('meta[name="description"]');
    if (metaDescription) {
      metaDescription.setAttribute('content', t('legal.privacy.metaDescription'));
    }

    const canonical = document.querySelector('link[rel="canonical"]');
    if (canonical) {
      canonical.setAttribute('href', `${window.location.origin}/privacy-policy`);
    } else {
      const link = document.createElement('link');
      link.rel = 'canonical';
      link.href = `${window.location.origin}/privacy-policy`;
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
    { id: 'data-collection', key: 'dataCollection' },
    { id: 'data-use', key: 'dataUse' },
    { id: 'data-sharing', key: 'dataSharing' },
    { id: 'cookies', key: 'cookies' },
    { id: 'data-security', key: 'dataSecurity' },
    { id: 'user-rights', key: 'userRights' },
    { id: 'retention', key: 'retention' },
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
            {t('legal.privacy.title')}
          </h1>
          <p className="text-muted-foreground">
            {t('legal.lastUpdated')}: {t('legal.privacy.lastUpdated')}
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
                {t(`legal.privacy.sections.${section.key}.title`)}
              </button>
            ))}
          </nav>
        </div>

        <div className="prose prose-slate dark:prose-invert max-w-none">
          <div className="space-y-8 text-foreground">
            <section id="introduction">
              <h2 className="text-xl font-semibold mb-3">{t('legal.privacy.sections.introduction.title')}</h2>
              <div className="text-muted-foreground leading-relaxed space-y-3">
                {t('legal.privacy.sections.introduction.content').split('\n').map((paragraph, index) => (
                  <p key={index}>{paragraph}</p>
                ))}
              </div>
            </section>

            <section id="data-collection">
              <h2 className="text-xl font-semibold mb-3">{t('legal.privacy.sections.dataCollection.title')}</h2>
              <div className="text-muted-foreground leading-relaxed space-y-3">
                {t('legal.privacy.sections.dataCollection.content').split('\n').map((paragraph, index) => (
                  <p key={index}>{paragraph}</p>
                ))}
              </div>
            </section>

            <section id="data-use">
              <h2 className="text-xl font-semibold mb-3">{t('legal.privacy.sections.dataUse.title')}</h2>
              <div className="text-muted-foreground leading-relaxed space-y-3">
                {t('legal.privacy.sections.dataUse.content').split('\n').map((paragraph, index) => (
                  <p key={index}>{paragraph}</p>
                ))}
              </div>
            </section>

            <section id="data-sharing">
              <h2 className="text-xl font-semibold mb-3">{t('legal.privacy.sections.dataSharing.title')}</h2>
              <div className="text-muted-foreground leading-relaxed space-y-3">
                {t('legal.privacy.sections.dataSharing.content').split('\n').map((paragraph, index) => (
                  <p key={index}>{paragraph}</p>
                ))}
              </div>
            </section>

            <section id="cookies">
              <h2 className="text-xl font-semibold mb-3">{t('legal.privacy.sections.cookies.title')}</h2>
              <div className="text-muted-foreground leading-relaxed space-y-3">
                {t('legal.privacy.sections.cookies.content').split('\n').map((paragraph, index) => (
                  <p key={index}>{paragraph}</p>
                ))}
              </div>
            </section>

            <section id="data-security">
              <h2 className="text-xl font-semibold mb-3">{t('legal.privacy.sections.dataSecurity.title')}</h2>
              <div className="text-muted-foreground leading-relaxed space-y-3">
                {t('legal.privacy.sections.dataSecurity.content').split('\n').map((paragraph, index) => (
                  <p key={index}>{paragraph}</p>
                ))}
              </div>
            </section>

            <section id="user-rights">
              <h2 className="text-xl font-semibold mb-3">{t('legal.privacy.sections.userRights.title')}</h2>
              <div className="text-muted-foreground leading-relaxed space-y-3">
                {t('legal.privacy.sections.userRights.content').split('\n').map((paragraph, index) => (
                  <p key={index}>{paragraph}</p>
                ))}
              </div>
            </section>

            <section id="retention">
              <h2 className="text-xl font-semibold mb-3">{t('legal.privacy.sections.retention.title')}</h2>
              <div className="text-muted-foreground leading-relaxed space-y-3">
                {t('legal.privacy.sections.retention.content').split('\n').map((paragraph, index) => (
                  <p key={index}>{paragraph}</p>
                ))}
              </div>
            </section>

            <section id="updates">
              <h2 className="text-xl font-semibold mb-3">{t('legal.privacy.sections.updates.title')}</h2>
              <div className="text-muted-foreground leading-relaxed space-y-3">
                {t('legal.privacy.sections.updates.content').split('\n').map((paragraph, index) => (
                  <p key={index}>{paragraph}</p>
                ))}
              </div>
            </section>

            <section id="contact">
              <h2 className="text-xl font-semibold mb-3">{t('legal.privacy.sections.contact.title')}</h2>
              <div className="text-muted-foreground leading-relaxed space-y-3">
                <p>{t('legal.privacy.sections.contact.content')}</p>
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

export default Privacy;
