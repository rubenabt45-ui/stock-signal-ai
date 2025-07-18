import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Menu, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { LanguageSelector } from '@/components/LanguageSelector';
import { useTranslation } from 'react-i18next';

interface MobileMenuProps {
  onLogin: () => void;
  onSignUp: () => void;
  onLearnPreview: () => void;
  onPricing: () => void;
}

export const MobileMenu: React.FC<MobileMenuProps> = ({
  onLogin,
  onSignUp,
  onLearnPreview,
  onPricing,
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const { t } = useTranslation();

  const toggleMenu = () => setIsOpen(!isOpen);
  
  const handleMenuClick = (action: () => void) => {
    action();
    setIsOpen(false);
  };

  return (
    <>
      <Button
        variant="ghost"
        size="sm"
        className="md:hidden text-white hover:bg-white/10 p-2"
        onClick={toggleMenu}
        aria-label="Toggle mobile menu"
      >
        {isOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
      </Button>

      {/* Mobile menu overlay */}
      {isOpen && (
        <div className="fixed inset-0 bg-black/90 backdrop-blur-sm z-50 md:hidden">
          <div className="flex flex-col h-full">
            {/* Header */}
            <div className="flex items-center justify-between p-4 border-b border-gray-800/50">
              <span className="text-xl font-bold text-white">TradeIQ</span>
              <Button
                variant="ghost"
                size="sm"
                className="text-white hover:bg-white/10 p-2"
                onClick={toggleMenu}
                aria-label="Close menu"
              >
                <X className="h-6 w-6" />
              </Button>
            </div>

            {/* Navigation links */}
            <div className="flex-1 flex flex-col justify-center px-6 space-y-8">
              <Link
                to="/"
                className="text-2xl font-semibold text-white hover:text-tradeiq-blue transition-colors py-4 border-b border-gray-800/30"
                onClick={() => setIsOpen(false)}
              >
                {t('landing.navbar.home')}
              </Link>
              
              <button
                onClick={() => handleMenuClick(onLearnPreview)}
                className="text-2xl font-semibold text-white hover:text-tradeiq-blue transition-colors py-4 border-b border-gray-800/30 text-left"
              >
                {t('landing.navbar.learnPreview')}
              </button>
              
              <button
                onClick={() => handleMenuClick(onPricing)}
                className="text-2xl font-semibold text-white hover:text-tradeiq-blue transition-colors py-4 border-b border-gray-800/30 text-left"
              >
                {t('landing.navbar.pricing')}
              </button>

              {/* Language selector */}
              <div className="py-4 border-b border-gray-800/30">
                <p className="text-sm text-gray-400 mb-3">Language</p>
                <LanguageSelector variant="landing" />
              </div>

              {/* Action buttons */}
              <div className="space-y-4 pt-8">
                <Button
                  variant="ghost"
                  size="lg"
                  className="w-full text-xl py-6 text-white hover:bg-white/10 border border-gray-600 hover:border-white transition-all"
                  onClick={() => handleMenuClick(onLogin)}
                >
                  {t('landing.navbar.login')}
                </Button>
                
                <Button
                  size="lg"
                  className="w-full text-xl py-6 bg-tradeiq-blue hover:bg-tradeiq-blue/80 transition-all"
                  onClick={() => handleMenuClick(onSignUp)}
                >
                  {t('landing.navbar.signUp')}
                </Button>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
};