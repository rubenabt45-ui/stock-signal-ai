import React from 'react';
import { Link } from 'react-router-dom';
import { X, Home, BookOpen, DollarSign, LogIn, UserPlus } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { LanguageSelector } from '@/components/LanguageSelector';
import { useTranslation } from 'react-i18next';

interface MobileMenuContentProps {
  isOpen: boolean;
  onClose: (reason: string) => void;
  onLogin: () => void;
  onSignUp: () => void;
  onLearnPreview: () => void;
  onPricing: () => void;
  menuRef: React.RefObject<HTMLDivElement>;
}

export const MobileMenuContent: React.FC<MobileMenuContentProps> = ({
  isOpen,
  onClose,
  onLogin,
  onSignUp,
  onLearnPreview,
  onPricing,
  menuRef
}) => {
  const { t } = useTranslation();

  const handleMenuClick = (action: () => void, itemName: string) => {
    console.log('🍔 [MobileMenu] Menu item clicked:', itemName);
    action();
    onClose('menu_item_selected');
  };

  if (!isOpen) return null;

  return (
    <div
      ref={menuRef}
      id="mobile-menu-content"
      className="fixed top-20 right-4 w-80 max-w-[calc(100vw-2rem)] bg-gray-900 border border-gray-700 rounded-lg shadow-2xl z-[50] transition-all duration-300 ease-in-out"
      data-testid="mobile-menu-content"
      style={{
        opacity: isOpen ? 1 : 0,
        transform: isOpen ? 'translateY(0) scale(1)' : 'translateY(-16px) scale(0.95)',
        pointerEvents: isOpen ? 'auto' : 'none'
      }}
    >
      {/* Menu Header */}
      <div className="flex items-center justify-between p-4 border-b border-gray-700 bg-gray-900">
        <h3 className="text-lg font-semibold text-white">Navigation</h3>
        <Button
          variant="ghost"
          onClick={() => onClose('header_close')}
          className="text-gray-400 hover:text-white hover:bg-gray-800 p-2 min-h-[48px] min-w-[48px]"
          aria-label="Close menu"
          data-testid="menu-close-button"
        >
          <X className="h-5 w-5" />
        </Button>
      </div>

      {/* Navigation Links */}
      <div className="py-2 bg-gray-900">
        <Link
          to="/"
          onClick={() => onClose('home_link')}
          className="flex items-center gap-3 px-6 py-4 text-white hover:bg-gray-800 transition-all duration-200 min-h-[48px] group"
          data-testid="menu-home-link"
        >
          <Home className="h-5 w-5 text-gray-400 group-hover:text-blue-400" />
          <span className="font-medium">{t('landing.navbar.home')}</span>
        </Link>
        
        <button
          onClick={() => handleMenuClick(onLearnPreview, 'Learn Preview')}
          className="w-full flex items-center gap-3 px-6 py-4 text-left text-white hover:bg-gray-800 transition-all duration-200 min-h-[48px] group"
          data-testid="menu-learn-link"
        >
          <BookOpen className="h-5 w-5 text-gray-400 group-hover:text-blue-400" />
          <span className="font-medium">{t('landing.navbar.learnPreview')}</span>
        </button>
        
        <button
          onClick={() => handleMenuClick(onPricing, 'Pricing')}
          className="w-full flex items-center gap-3 px-6 py-4 text-left text-white hover:bg-gray-800 transition-all duration-200 min-h-[48px] group"
          data-testid="menu-pricing-link"
        >
          <DollarSign className="h-5 w-5 text-gray-400 group-hover:text-blue-400" />
          <span className="font-medium">{t('landing.navbar.pricing')}</span>
        </button>
      </div>

      {/* Language Selector */}
      <div className="px-6 py-4 border-t border-gray-700 bg-gray-900">
        <p className="text-sm font-medium text-gray-400 mb-3">Language</p>
        <div className="bg-gray-800/50 p-3 rounded-lg">
          <LanguageSelector variant="landing" />
        </div>
      </div>

      {/* Action Buttons */}
      <div className="px-6 py-4 space-y-3 border-t border-gray-700 bg-gray-900">
        <Button
          variant="outline"
          onClick={() => handleMenuClick(onLogin, 'Login')}
          className="w-full justify-center text-white border-gray-600 hover:border-gray-500 hover:bg-gray-800 transition-all duration-200 min-h-[48px] text-base font-medium"
          data-testid="menu-login-button"
        >
          <LogIn className="h-4 w-4 mr-2" />
          {t('landing.navbar.login')}
        </Button>
        
        <Button
          onClick={() => handleMenuClick(onSignUp, 'Sign Up')}
          className="w-full justify-center bg-blue-600 hover:bg-blue-700 text-white transition-all duration-200 min-h-[48px] text-base font-medium shadow-lg"
          data-testid="menu-signup-button"
        >
          <UserPlus className="h-4 w-4 mr-2" />
          {t('landing.navbar.signUp')}
        </Button>
      </div>
    </div>
  );
};