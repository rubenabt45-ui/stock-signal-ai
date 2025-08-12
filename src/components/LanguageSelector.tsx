
import { Globe } from 'lucide-react';
import { useLanguage } from '@/contexts/LanguageContext';
import { useTranslation } from 'react-i18next';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Button } from '@/components/ui/button';
import { Tooltip, TooltipContent, TooltipTrigger } from '@/components/ui/tooltip';

interface LanguageSelectorProps {
  variant?: 'landing' | 'app';
  showText?: boolean;
}

export const LanguageSelector = ({ variant = 'landing', showText = false }: LanguageSelectorProps) => {
  const { currentLanguage, changeLanguage, availableLanguages } = useLanguage();
  const { t } = useTranslation();

  const handleLanguageChange = async (languageCode: string) => {
    console.log('[i18n] Language selector clicked:', languageCode);
    
    if (languageCode !== currentLanguage) {
      try {
        await changeLanguage(languageCode);
        console.log('[i18n] Language changed successfully to:', languageCode);
      } catch (error) {
        console.error('[i18n] Language change failed:', error);
      }
    }
  };

  const getCurrentLanguageDisplay = () => {
    const lang = availableLanguages.find(l => l.code === currentLanguage);
    return lang ? lang.code.toUpperCase() : 'EN';
  };

  const buttonClasses = variant === 'landing' 
    ? "h-10 px-3 text-white hover:text-tradeiq-blue border-white/20 hover:border-tradeiq-blue/50 bg-transparent hover:bg-white/5"
    : "h-9 px-2 text-gray-300 hover:text-white border-gray-600 hover:border-gray-400 bg-transparent hover:bg-gray-800/50";

  return (
    <Tooltip>
      <DropdownMenu>
        <TooltipTrigger asChild>
          <DropdownMenuTrigger asChild>
            <Button
              variant="outline"
              size="sm"
              className={buttonClasses}
            >
              <Globe className="h-4 w-4" />
              {showText && (
                <span className="ml-2 text-sm font-medium">
                  {getCurrentLanguageDisplay()}
                </span>
              )}
              {!showText && (
                <span className="ml-1 text-xs font-medium">
                  {getCurrentLanguageDisplay()}
                </span>
              )}
            </Button>
          </DropdownMenuTrigger>
        </TooltipTrigger>
        <DropdownMenuContent 
          align="end" 
          className="w-40 bg-gray-900 border-gray-700 z-[9999]"
        >
          {availableLanguages.map((language) => (
            <DropdownMenuItem
              key={language.code}
              onClick={() => handleLanguageChange(language.code)}
              className="text-white hover:bg-gray-800 cursor-pointer flex items-center justify-between"
            >
              <span>{language.name}</span>
              {currentLanguage === language.code && (
                <span className="text-tradeiq-blue text-xs">✓</span>
              )}
            </DropdownMenuItem>
          ))}
        </DropdownMenuContent>
      </DropdownMenu>
      <TooltipContent side="bottom">
        <p>{t('common.selectLanguage')}</p>
      </TooltipContent>
    </Tooltip>
  );
};
