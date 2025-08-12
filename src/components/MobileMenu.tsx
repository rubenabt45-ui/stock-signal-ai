
import React, { useState } from 'react';
import { Menu, X, ChevronRight } from 'lucide-react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet';
import { LanguageSelector } from '@/components/LanguageSelector';
import { useTranslationWithFallback } from '@/hooks/useTranslationWithFallback';

interface MobileMenuProps {
  onLogin?: () => void;
  onSignUp?: () => void;
  onLearnPreview?: () => void;
  onPricing?: () => void;
}

export const MobileMenu = ({ onLogin, onSignUp, onLearnPreview, onPricing }: MobileMenuProps) => {
  const [isOpen, setIsOpen] = useState(false);
  const { t } = useTranslationWithFallback();

  // Close menu when navigation occurs
  const handleNavigation = (callback?: () => void) => {
    setIsOpen(false);
    if (callback) {
      callback();
    }
  };

  return (
    <Sheet open={isOpen} onOpenChange={setIsOpen}>
      <SheetTrigger asChild>
        <Button
          variant="ghost"
          size="sm"
          className="text-gray-300 hover:text-white hover:bg-white/10 transition-all duration-300 focus:ring-2 focus:ring-white/20 hover:scale-105 cursor-pointer relative z-10 min-h-[44px] p-2"
          aria-label="Open menu"
        >
          <Menu className="h-5 w-5" />
        </Button>
      </SheetTrigger>
      <SheetContent 
        side="right" 
        className="w-[300px] bg-gray-900 border-gray-700 text-white"
      >
        <div className="flex flex-col h-full">
          {/* Header */}
          <div className="flex items-center justify-between p-4 border-b border-gray-700">
            <span className="text-lg font-semibold">Menu</span>
          </div>

          {/* Navigation Links */}
          <div className="flex-1 py-6">
            <nav className="space-y-2">
              <Link 
                to="/" 
                className="flex items-center justify-between px-4 py-3 text-gray-300 hover:text-white hover:bg-white/10 transition-colors rounded-lg mx-2"
                onClick={() => handleNavigation()}
              >
                <span>{t('landing.navbar.home')}</span>
                <ChevronRight className="h-4 w-4" />
              </Link>
              
              <button 
                className="flex items-center justify-between w-full px-4 py-3 text-gray-300 hover:text-white hover:bg-white/10 transition-colors rounded-lg mx-2 text-left"
                onClick={() => handleNavigation(onLearnPreview)}
              >
                <span>{t('landing.navbar.learnPreview')}</span>
                <ChevronRight className="h-4 w-4" />
              </button>
              
              <button 
                className="flex items-center justify-between w-full px-4 py-3 text-gray-300 hover:text-white hover:bg-white/10 transition-colors rounded-lg mx-2 text-left"
                onClick={() => handleNavigation(onPricing)}
              >
                <span>{t('landing.navbar.pricing')}</span>
                <ChevronRight className="h-4 w-4" />
              </button>
            </nav>
          </div>

          {/* Language Selector */}
          <div className="px-4 py-4 border-t border-gray-700">
            <div className="mb-4">
              <span className="text-sm text-gray-400 mb-2 block">Language</span>
              <LanguageSelector variant="landing" />
            </div>
          </div>

          {/* Auth Buttons */}
          <div className="p-4 space-y-3 border-t border-gray-700">
            <Button
              variant="ghost"
              className="w-full justify-start text-gray-300 hover:text-white hover:bg-white/10"
              onClick={() => handleNavigation(onLogin)}
            >
              {t('landing.navbar.login')}
            </Button>
            <Button
              variant="outline"
              className="w-full justify-start border-gray-600 hover:border-white hover:bg-white/10"
              onClick={() => handleNavigation(onSignUp)}
            >
              {t('landing.navbar.signUp')}
            </Button>
          </div>
        </div>
      </SheetContent>
    </Sheet>
  );
};
