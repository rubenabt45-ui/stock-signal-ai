
import React, { useState, useEffect } from 'react';
import { useTranslationWithFallback } from '@/hooks/useTranslationWithFallback';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog';
import { Switch } from '@/components/ui/switch';
import { X, Cookie, Settings } from 'lucide-react';

interface CookiePreferences {
  essential: boolean;
  analytics: boolean;
}

const COOKIE_CONSENT_KEY = 'tradeiq_cookie_consent';
const COOKIE_PREFERENCES_KEY = 'tradeiq_cookie_preferences';

export const CookieConsent = () => {
  const { t } = useTranslationWithFallback();
  const [showBanner, setShowBanner] = useState(false);
  const [showPreferences, setShowPreferences] = useState(false);
  const [preferences, setPreferences] = useState<CookiePreferences>({
    essential: true,
    analytics: false
  });

  useEffect(() => {
    const consent = localStorage.getItem(COOKIE_CONSENT_KEY);
    const savedPreferences = localStorage.getItem(COOKIE_PREFERENCES_KEY);
    
    if (savedPreferences) {
      setPreferences(JSON.parse(savedPreferences));
    }
    
    if (!consent) {
      setShowBanner(true);
    }
  }, []);

  const savePreferences = (newPreferences: CookiePreferences) => {
    setPreferences(newPreferences);
    localStorage.setItem(COOKIE_PREFERENCES_KEY, JSON.stringify(newPreferences));
    localStorage.setItem(COOKIE_CONSENT_KEY, 'true');
    
    // Handle analytics scripts based on preference
    if (!newPreferences.analytics) {
      // Remove or disable analytics scripts
      const gtmScript = document.querySelector('script[src*="googletagmanager"]');
      if (gtmScript) {
        gtmScript.remove();
      }
    }
  };

  const acceptAll = () => {
    const allAccepted = { essential: true, analytics: true };
    savePreferences(allAccepted);
    setShowBanner(false);
  };

  const rejectNonEssential = () => {
    const essentialOnly = { essential: true, analytics: false };
    savePreferences(essentialOnly);
    setShowBanner(false);
  };

  const openPreferences = () => {
    setShowPreferences(true);
  };

  const saveAndClose = () => {
    savePreferences(preferences);
    setShowPreferences(false);
    setShowBanner(false);
  };

  if (!showBanner && !showPreferences) {
    return null;
  }

  return (
    <>
      {/* Cookie Banner */}
      {showBanner && (
        <div className="fixed bottom-0 left-0 right-0 z-50 bg-background/95 backdrop-blur-sm border-t border-border shadow-lg">
          <div className="container mx-auto px-4 py-4">
            <div className="flex flex-col md:flex-row items-start md:items-center gap-4">
              <div className="flex items-start gap-3 flex-1">
                <Cookie className="h-5 w-5 text-primary mt-1 flex-shrink-0" />
                <div className="flex-1">
                  <h3 className="font-semibold text-foreground mb-1">
                    {t('legal.cookies.banner.title')}
                  </h3>
                  <p className="text-sm text-muted-foreground">
                    {t('legal.cookies.banner.description')}
                  </p>
                </div>
              </div>
              <div className="flex flex-wrap gap-2 items-center">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={openPreferences}
                  className="flex items-center gap-2"
                >
                  <Settings className="h-4 w-4" />
                  {t('legal.cookies.banner.managePreferences')}
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={rejectNonEssential}
                >
                  {t('legal.cookies.banner.rejectNonEssential')}
                </Button>
                <Button
                  size="sm"
                  onClick={acceptAll}
                >
                  {t('legal.cookies.banner.acceptAll')}
                </Button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Cookie Preferences Modal */}
      <Dialog open={showPreferences} onOpenChange={setShowPreferences}>
        <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <Cookie className="h-5 w-5" />
              {t('legal.cookies.preferences.title')}
            </DialogTitle>
            <DialogDescription>
              {t('legal.cookies.preferences.description')}
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-6">
            <Card>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle className="text-lg">
                    {t('legal.cookies.categories.essential.title')}
                  </CardTitle>
                  <Switch
                    checked={preferences.essential}
                    disabled
                    className="opacity-50"
                  />
                </div>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground">
                  {t('legal.cookies.categories.essential.description')}
                </p>
                <p className="text-xs text-muted-foreground mt-2">
                  {t('legal.cookies.categories.essential.note')}
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle className="text-lg">
                    {t('legal.cookies.categories.analytics.title')}
                  </CardTitle>
                  <Switch
                    checked={preferences.analytics}
                    onCheckedChange={(checked) => 
                      setPreferences(prev => ({ ...prev, analytics: checked }))
                    }
                  />
                </div>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground">
                  {t('legal.cookies.categories.analytics.description')}
                </p>
                <div className="mt-3 text-xs text-muted-foreground">
                  <p className="font-medium mb-1">{t('legal.cookies.categories.analytics.purposes')}:</p>
                  <ul className="list-disc list-inside space-y-1 ml-2">
                    <li>{t('legal.cookies.categories.analytics.purpose1')}</li>
                    <li>{t('legal.cookies.categories.analytics.purpose2')}</li>
                    <li>{t('legal.cookies.categories.analytics.purpose3')}</li>
                  </ul>
                </div>
              </CardContent>
            </Card>
          </div>

          <div className="flex justify-end gap-3 mt-6">
            <Button variant="outline" onClick={() => setShowPreferences(false)}>
              {t('common.cancel')}
            </Button>
            <Button onClick={saveAndClose}>
              {t('legal.cookies.preferences.savePreferences')}
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
};

export const CookieSettingsButton = () => {
  const { t } = useTranslationWithFallback();
  const [showPreferences, setShowPreferences] = useState(false);
  const [preferences, setPreferences] = useState<CookiePreferences>({
    essential: true,
    analytics: false
  });

  useEffect(() => {
    const savedPreferences = localStorage.getItem(COOKIE_PREFERENCES_KEY);
    if (savedPreferences) {
      setPreferences(JSON.parse(savedPreferences));
    }
  }, []);

  const savePreferences = (newPreferences: CookiePreferences) => {
    setPreferences(newPreferences);
    localStorage.setItem(COOKIE_PREFERENCES_KEY, JSON.stringify(newPreferences));
    
    if (!newPreferences.analytics) {
      const gtmScript = document.querySelector('script[src*="googletagmanager"]');
      if (gtmScript) {
        gtmScript.remove();
      }
    }
  };

  const saveAndClose = () => {
    savePreferences(preferences);
    setShowPreferences(false);
  };

  return (
    <>
      <button
        onClick={() => setShowPreferences(true)}
        className="text-sm text-muted-foreground hover:text-foreground transition-colors duration-200 hover:underline focus:outline-none focus:ring-2 focus:ring-primary focus:ring-opacity-50 rounded px-1 py-0.5"
      >
        {t('legal.cookies.settings')}
      </button>

      <Dialog open={showPreferences} onOpenChange={setShowPreferences}>
        <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <Cookie className="h-5 w-5" />
              {t('legal.cookies.preferences.title')}
            </DialogTitle>
            <DialogDescription>
              {t('legal.cookies.preferences.description')}
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-6">
            <Card>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle className="text-lg">
                    {t('legal.cookies.categories.essential.title')}
                  </CardTitle>
                  <Switch
                    checked={preferences.essential}
                    disabled
                    className="opacity-50"
                  />
                </div>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground">
                  {t('legal.cookies.categories.essential.description')}
                </p>
                <p className="text-xs text-muted-foreground mt-2">
                  {t('legal.cookies.categories.essential.note')}
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle className="text-lg">
                    {t('legal.cookies.categories.analytics.title')}
                  </CardTitle>
                  <Switch
                    checked={preferences.analytics}
                    onCheckedChange={(checked) => 
                      setPreferences(prev => ({ ...prev, analytics: checked }))
                    }
                  />
                </div>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground">
                  {t('legal.cookies.categories.analytics.description')}
                </p>
              </CardContent>
            </Card>
          </div>

          <div className="flex justify-end gap-3 mt-6">
            <Button variant="outline" onClick={() => setShowPreferences(false)}>
              {t('common.cancel')}
            </Button>
            <Button onClick={saveAndClose}>
              {t('legal.cookies.preferences.savePreferences')}
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
};
