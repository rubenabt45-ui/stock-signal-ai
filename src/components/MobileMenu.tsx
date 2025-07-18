import React, { useState, useEffect, useRef } from 'react';
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
  const menuRef = useRef<HTMLDivElement>(null);

  const toggleMenu = () => {
    setIsOpen(!isOpen);
  };
  
  const closeMenu = () => {
    setIsOpen(false);
  };
  
  const handleMenuClick = (action: () => void) => {
    action();
    closeMenu();
  };

  // Handle click outside to close menu
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        closeMenu();
      }
    };

    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
      // Prevent body scroll when menu is open
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
      document.body.style.overflow = 'unset';
    };
  }, [isOpen]);

  // Handle escape key to close menu
  useEffect(() => {
    const handleEscapeKey = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        closeMenu();
      }
    };

    if (isOpen) {
      document.addEventListener('keydown', handleEscapeKey);
    }

    return () => {
      document.removeEventListener('keydown', handleEscapeKey);
    };
  }, [isOpen]);

  return (
    <>
      <Button
        variant="ghost"
        size="sm"
        className="md:hidden text-white hover:bg-white/10 p-2 relative z-[60]"
        onClick={toggleMenu}
        aria-label="Toggle mobile menu"
      >
        <Menu className="h-6 w-6" />
      </Button>

      {/* Mobile menu overlay with backdrop */}
      {isOpen && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-[55] md:hidden">
          {/* Menu content sliding from right */}
          <div 
            ref={menuRef}
            className={`fixed top-0 right-0 h-full w-80 max-w-[85vw] bg-gray-900 shadow-2xl transform transition-transform duration-300 ease-in-out ${
              isOpen ? 'translate-x-0' : 'translate-x-full'
            } flex flex-col overflow-y-auto`}
          >
            {/* Header */}
            <div className="flex items-center justify-between p-4 border-b border-gray-800/50 bg-gray-900/95 backdrop-blur-sm sticky top-0 z-10">
              <span className="text-xl font-bold text-white">TradeIQ</span>
              <Button
                variant="ghost"
                size="sm"
                className="text-white hover:bg-white/10 p-2"
                onClick={closeMenu}
                aria-label="Close menu"
              >
                <X className="h-6 w-6" />
              </Button>
            </div>

            {/* Navigation content */}
            <div className="flex-1 px-6 py-8 space-y-6">
              {/* Navigation links */}
              <div className="space-y-4">
                <Link
                  to="/"
                  className="block text-lg font-medium text-white hover:text-tradeiq-blue transition-colors py-3 px-2 rounded-lg hover:bg-white/5 min-h-[48px] flex items-center"
                  onClick={closeMenu}
                >
                  {t('landing.navbar.home')}
                </Link>
                
                <button
                  onClick={() => handleMenuClick(onLearnPreview)}
                  className="w-full text-left text-lg font-medium text-white hover:text-tradeiq-blue transition-colors py-3 px-2 rounded-lg hover:bg-white/5 min-h-[48px] flex items-center"
                >
                  {t('landing.navbar.learnPreview')}
                </button>
                
                <button
                  onClick={() => handleMenuClick(onPricing)}
                  className="w-full text-left text-lg font-medium text-white hover:text-tradeiq-blue transition-colors py-3 px-2 rounded-lg hover:bg-white/5 min-h-[48px] flex items-center"
                >
                  {t('landing.navbar.pricing')}
                </button>
              </div>

              {/* Language selector */}
              <div className="py-4 border-t border-gray-800/30">
                <p className="text-sm text-gray-400 mb-3 font-medium">Language</p>
                <div className="bg-gray-800/50 p-3 rounded-lg">
                  <LanguageSelector variant="landing" />
                </div>
              </div>

              {/* Action buttons */}
              <div className="space-y-3 pt-4 border-t border-gray-800/30">
                <Button
                  variant="ghost"
                  size="lg"
                  className="w-full text-lg py-4 text-white hover:bg-white/10 border border-gray-600 hover:border-white transition-all duration-200 min-h-[52px]"
                  onClick={() => handleMenuClick(onLogin)}
                >
                  {t('landing.navbar.login')}
                </Button>
                
                <Button
                  size="lg"
                  className="w-full text-lg py-4 bg-tradeiq-blue hover:bg-tradeiq-blue/80 transition-all duration-200 min-h-[52px] shadow-lg"
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