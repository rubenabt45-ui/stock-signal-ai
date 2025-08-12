
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Label } from '@/components/ui/label';
import { Palette, Clock, Globe, Check } from 'lucide-react';
import { useTranslationWithFallback } from '@/hooks/useTranslationWithFallback';
import { useTheme } from '@/contexts/ThemeContext';
import { useLanguage } from '@/contexts/LanguageContext';
import { useRefreshInterval } from '@/hooks/useRefreshInterval';

export const PreferencesSection = () => {
  const { t } = useTranslationWithFallback();
  const { theme, setTheme } = useTheme();
  const { refreshInterval, setRefreshInterval } = useRefreshInterval();
  const { currentLanguage, changeLanguage, availableLanguages } = useLanguage();

  const handleLanguageChange = async (newLanguage: string) => {
    await changeLanguage(newLanguage);
  };

  return (
    <Card className="tradeiq-card">
      <CardHeader>
        <div className="flex items-center space-x-3">
          <Palette className="h-5 w-5 text-tradeiq-blue" />
          <CardTitle className="text-white">{t('settings.preferences.title') || 'Preferences'}</CardTitle>
        </div>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Theme Selection */}
        <div className="space-y-2">
          <Label className="text-white flex items-center space-x-2">
            <Palette className="h-4 w-4" />
            <span>{t('settings.preferences.theme') || 'Theme'}</span>
          </Label>
          <Select value={theme} onValueChange={setTheme}>
            <SelectTrigger className="bg-black/20 border-gray-700 text-white">
              <SelectValue />
            </SelectTrigger>
            <SelectContent className="bg-gray-900 border-gray-700">
              <SelectItem value="light" className="text-white hover:bg-gray-800">
                {t('settings.preferences.themes.light') || 'Light'}
              </SelectItem>
              <SelectItem value="dark" className="text-white hover:bg-gray-800">
                {t('settings.preferences.themes.dark') || 'Dark'}
              </SelectItem>
              <SelectItem value="system" className="text-white hover:bg-gray-800">
                {t('settings.preferences.themes.system') || 'System'}
              </SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* Data Refresh Interval */}
        <div className="space-y-2">
          <Label className="text-white flex items-center space-x-2">
            <Clock className="h-4 w-4" />
            <span>{t('settings.preferences.refreshInterval') || 'Refresh Interval'}</span>
          </Label>
          <Select value={refreshInterval} onValueChange={setRefreshInterval}>
            <SelectTrigger className="bg-black/20 border-gray-700 text-white">
              <SelectValue />
            </SelectTrigger>
            <SelectContent className="bg-gray-900 border-gray-700">
              <SelectItem value="30s" className="text-white hover:bg-gray-800">
                {t('settings.preferences.intervals.30s') || '30 seconds'}
              </SelectItem>
              <SelectItem value="1min" className="text-white hover:bg-gray-800">
                {t('settings.preferences.intervals.1min') || '1 minute'}
              </SelectItem>
              <SelectItem value="5min" className="text-white hover:bg-gray-800">
                {t('settings.preferences.intervals.5min') || '5 minutes'}
              </SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* Language Preference */}
        <div className="space-y-2">
          <Label className="text-white flex items-center space-x-2">
            <Globe className="h-4 w-4" />
            <span>{t('settings.preferences.language') || 'Language'}</span>
          </Label>
          <Select value={currentLanguage} onValueChange={handleLanguageChange}>
            <SelectTrigger className="bg-black/20 border-gray-700 text-white">
              <SelectValue />
            </SelectTrigger>
            <SelectContent className="bg-gray-900 border-gray-700">
              {availableLanguages.map((language) => (
                <SelectItem 
                  key={language.code} 
                  value={language.code} 
                  className="text-white hover:bg-gray-800"
                >
                  <div className="flex items-center space-x-2">
                    <span>{t(`settings.preferences.languages.${language.code}`) || language.name}</span>
                    {currentLanguage === language.code && (
                      <Check className="h-4 w-4 text-green-500" />
                    )}
                  </div>
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div className="text-xs text-gray-500 mt-4">
          <p>• {t('settings.preferences.notes.theme') || 'Theme preference will be applied across the application'}</p>
          <p>• {t('settings.preferences.notes.refresh') || 'Data refresh interval affects real-time updates'}</p>
          <p>• {t('settings.preferences.notes.language') || 'Language changes apply immediately'}</p>
        </div>
      </CardContent>
    </Card>
  );
};
