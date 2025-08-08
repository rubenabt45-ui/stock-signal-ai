
import React from 'react';
import { useTranslationWithFallback } from '@/hooks/useTranslationWithFallback';
import { ArrowLeft } from 'lucide-react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';

const Terms = () => {
  const { t } = useTranslationWithFallback();

  React.useEffect(() => {
    document.title = t('legal.terms.metaTitle');
    const metaDescription = document.querySelector('meta[name="description"]');
    if (metaDescription) {
      metaDescription.setAttribute('content', t('legal.terms.metaDescription'));
    }

    const canonical = document.querySelector('link[rel="canonical"]');
    if (canonical) {
      canonical.setAttribute('href', `${window.location.origin}/terms-of-service`);
    } else {
      const link = document.createElement('link');
      link.rel = 'canonical';
      link.href = `${window.location.origin}/terms-of-service`;
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
    { id: 'acceptance', key: 'acceptance' },
    { id: 'description', key: 'description' },
    { id: 'user-obligations', key: 'userObligations' },
    { id: 'prohibited-uses', key: 'prohibitedUses' },
    { id: 'intellectual-property', key: 'intellectualProperty' },
    { id: 'limitation-liability', key: 'limitationLiability' },
    { id: 'modifications', key: 'modifications' },
    { id: 'termination', key: 'termination' },
    { id: 'governing-law', key: 'governingLaw' },
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
            {t('legal.terms.title')}
          </h1>
          <p className="text-muted-foreground">
            {t('legal.lastUpdated')}: {t('legal.terms.lastUpdated')}
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
                {t(`legal.terms.sections.${section.key}.title`)}
              </button>
            ))}
          </nav>
        </div>

        <div className="prose prose-slate dark:prose-invert max-w-none">
          <div className="space-y-8 text-foreground">
            <section id="acceptance">
              <h2 className="text-xl font-semibold mb-3">{t('legal.terms.sections.acceptance.title')}</h2>
              <div className="text-muted-foreground leading-relaxed space-y-3">
                {t('legal.terms.sections.acceptance.content').split('\n').map((paragraph, index) => (
                  <p key={index}>{paragraph}</p>
                ))}
              </div>
            </section>

            <section id="description">
              <h2 className="text-xl font-semibold mb-3">{t('legal.terms.sections.description.title')}</h2>
              <div className="text-muted-foreground leading-relaxed space-y-3">
                {t('legal.terms.sections.description.content').split('\n').map((paragraph, index) => (
                  <p key={index}>{paragraph}</p>
                ))}
              </div>
            </section>

            <section id="user-obligations">
              <h2 className="text-xl font-semibold mb-3">{t('legal.terms.sections.userObligations.title')}</h2>
              <div className="text-muted-foreground leading-relaxed space-y-3">
                {t('legal.terms.sections.userObligations.content').split('\n').map((paragraph, index) => (
                  <p key={index}>{paragraph}</p>
                ))}
              </div>
            </section>

            <section id="prohibited-uses">
              <h2 className="text-xl font-semibold mb-3">{t('legal.terms.sections.prohibitedUses.title')}</h2>
              <div className="text-muted-foreground leading-relaxed space-y-3">
                {t('legal.terms.sections.prohibitedUses.content').split('\n').map((paragraph, index) => (
                  <p key={index}>{paragraph}</p>
                ))}
              </div>
            </section>

            <section id="intellectual-property">
              <h2 className="text-xl font-semibold mb-3">{t('legal.terms.sections.intellectualProperty.title')}</h2>
              <div className="text-muted-foreground leading-relaxed space-y-3">
                {t('legal.terms.sections.intellectualProperty.content').split('\n').map((paragraph, index) => (
                  <p key={index}>{paragraph}</p>
                ))}
              </div>
            </section>

            <section id="limitation-liability">
              <h2 className="text-xl font-semibold mb-3">{t('legal.terms.sections.limitationLiability.title')}</h2>
              <div className="text-muted-foreground leading-relaxed space-y-3">
                {t('legal.terms.sections.limitationLiability.content').split('\n').map((paragraph, index) => (
                  <p key={index}>{paragraph}</p>
                ))}
              </div>
            </section>

            <section id="modifications">
              <h2 className="text-xl font-semibold mb-3">{t('legal.terms.sections.modifications.title')}</h2>
              <div className="text-muted-foreground leading-relaxed space-y-3">
                {t('legal.terms.sections.modifications.content').split('\n').map((paragraph, index) => (
                  <p key={index}>{paragraph}</p>
                ))}
              </div>
            </section>

            <section id="termination">
              <h2 className="text-xl font-semibold mb-3">{t('legal.terms.sections.termination.title')}</h2>
              <div className="text-muted-foreground leading-relaxed space-y-3">
                {t('legal.terms.sections.termination.content').split('\n').map((paragraph, index) => (
                  <p key={index}>{paragraph}</p>
                ))}
              </div>
            </section>

            <section id="governing-law">
              <h2 className="text-xl font-semibold mb-3">{t('legal.terms.sections.governingLaw.title')}</h2>
              <div className="text-muted-foreground leading-relaxed space-y-3">
                {t('legal.terms.sections.governingLaw.content').split('\n').map((paragraph, index) => (
                  <p key={index}>{paragraph}</p>
                ))}
              </div>
            </section>

            <section id="contact">
              <h2 className="text-xl font-semibold mb-3">{t('legal.terms.sections.contact.title')}</h2>
              <div className="text-muted-foreground leading-relaxed space-y-3">
                <p>{t('legal.terms.sections.contact.content')}</p>
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

export default Terms;
