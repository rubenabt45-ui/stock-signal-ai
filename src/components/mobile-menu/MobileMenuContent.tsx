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

  return (
    <div
      ref={menuRef}
      id="mobile-menu-content"
      className={`fixed inset-0 z-[70] bg-gray-900 transition-all duration-300 ease-in-out ${
        isOpen 
          ? 'opacity-100 translate-x-0 pointer-events-auto' 
          : 'opacity-0 translate-x-full pointer-events-none'
      }`}
      data-testid="mobile-menu-content"
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        width: '100vw',
        height: '100vh',
        backgroundColor: 'rgb(17, 24, 39)',
        zIndex: 70
      }}
    >
      {/* Menu Header */}
      <div className="flex items-center justify-between p-6 border-b border-gray-700 min-h-[80px]">
        <h3 className="text-xl font-semibold text-white">Navigation</h3>
        <Button
          variant="ghost"
          onClick={() => onClose('header_close')}
          className="text-gray-400 hover:text-white hover:bg-gray-800 p-3 min-h-[48px] min-w-[48px] rounded-lg"
          aria-label="Close menu"
          data-testid="menu-close-button"
        >
          <X className="h-6 w-6" />
        </Button>
      </div>

      {/* Navigation Links */}
      <div className="flex-1 py-6 space-y-2">
        <Link
          to="/"
          onClick={() => onClose('home_link')}
          className="flex items-center gap-4 px-6 py-4 text-white hover:bg-gray-800 active:bg-gray-700 transition-all duration-200 min-h-[56px] w-full group"
          data-testid="menu-home-link"
        >
          <Home className="h-6 w-6 text-gray-400 group-hover:text-blue-400 flex-shrink-0" />
          <span className="text-lg font-medium">{t('landing.navbar.home')}</span>
        </Link>
        
        <button
          onClick={() => handleMenuClick(onLearnPreview, 'Learn Preview')}
          className="w-full flex items-center gap-4 px-6 py-4 text-left text-white hover:bg-gray-800 active:bg-gray-700 transition-all duration-200 min-h-[56px] group"
          data-testid="menu-learn-link"
        >
          <BookOpen className="h-6 w-6 text-gray-400 group-hover:text-blue-400 flex-shrink-0" />
          <span className="text-lg font-medium">{t('landing.navbar.learnPreview')}</span>
        </button>
        
        <button
          onClick={() => handleMenuClick(onPricing, 'Pricing')}
          className="w-full flex items-center gap-4 px-6 py-4 text-left text-white hover:bg-gray-800 active:bg-gray-700 transition-all duration-200 min-h-[56px] group"
          data-testid="menu-pricing-link"
        >
          <DollarSign className="h-6 w-6 text-gray-400 group-hover:text-blue-400 flex-shrink-0" />
          <span className="text-lg font-medium">{t('landing.navbar.pricing')}</span>
        </button>
      </div>

      {/* Language Selector */}
      <div className="px-6 py-6 border-t border-gray-700">
        <p className="text-base font-medium text-gray-400 mb-4">Language</p>
        <div className="bg-gray-800/50 p-4 rounded-lg min-h-[48px] flex items-center">
          <LanguageSelector variant="landing" />
        </div>
      </div>

      {/* Action Buttons */}
      <div className="px-6 py-6 space-y-4 border-t border-gray-700">
        <Button
          variant="outline"
          onClick={() => handleMenuClick(onLogin, 'Login')}
          className="w-full justify-center text-white border-gray-600 hover:border-gray-500 hover:bg-gray-800 transition-all duration-200 min-h-[56px] text-lg font-medium"
          data-testid="menu-login-button"
        >
          <LogIn className="h-5 w-5 mr-3" />
          {t('landing.navbar.login')}
        </Button>
        
        <Button
          onClick={() => handleMenuClick(onSignUp, 'Sign Up')}
          className="w-full justify-center bg-blue-600 hover:bg-blue-700 text-white transition-all duration-200 min-h-[56px] text-lg font-medium shadow-lg"
          data-testid="menu-signup-button"
        >
          <UserPlus className="h-5 w-5 mr-3" />
          {t('landing.navbar.signUp')}
        </Button>
      </div>
    </div>
  );
};