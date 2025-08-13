
import { Settings } from "lucide-react";
import { LanguageSelector } from "@/components/LanguageSelector";
import { useTranslationWithFallback } from '@/hooks/useTranslationWithFallback';

export const SettingsHeader = () => {
  const { t } = useTranslationWithFallback();

  return (
    <header className="border-b border-gray-800/50 bg-black/20 backdrop-blur-sm sticky top-0 z-50">
      <div className="container mx-auto px-4 py-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <Settings className="h-8 w-8 text-tradeiq-blue" />
            <div>
              <h1 className="text-2xl font-bold text-white tracking-tight">{t('settings.title')}</h1>
              <p className="text-sm text-gray-400 font-medium">{t('settings.subtitle')}</p>
            </div>
          </div>
          <div className="flex items-center space-x-2">
            <LanguageSelector variant="app" showText />
          </div>
        </div>
      </div>
    </header>
  );
};
