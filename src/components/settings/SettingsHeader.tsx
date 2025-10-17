
import { Settings } from "lucide-react";
import { LanguageSelector } from "@/components/LanguageSelector";
import { useTranslationWithFallback } from '@/hooks/useTranslationWithFallback';

export const SettingsHeader = () => {
  const { t } = useTranslationWithFallback();

  return (
    <header className="bg-black/90 backdrop-blur-xl border-b border-gray-800/50 sticky top-0 z-50 shadow-lg">
      <div className="container mx-auto px-6 py-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <Settings className="h-10 w-10 text-tradeiq-blue" />
            <div>
              <h1 className="text-2xl font-bold text-white">{t('settings.title')}</h1>
              <p className="text-sm text-gray-400">{t('settings.subtitle')}</p>
            </div>
          </div>
          <div className="flex items-center space-x-4">
            <LanguageSelector variant="app" showText />
            <div className="text-white font-medium">
              Free Plan
            </div>
          </div>
        </div>
      </div>
    </header>
  );
};
