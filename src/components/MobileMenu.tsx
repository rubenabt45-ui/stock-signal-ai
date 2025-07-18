import React, { useState, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import { Menu, X, ChevronRight } from 'lucide-react';
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
  const buttonRef = useRef<HTMLButtonElement>(null);

  // Debug logging
  const toggleMenu = (e?: React.MouseEvent) => {
    e?.preventDefault();
    e?.stopPropagation();
    
    console.log('🍔 Mobile Menu Toggle Clicked:', {
      currentState: isOpen,
      newState: !isOpen,
      timestamp: new Date().toISOString()
    });
    
    setIsOpen(prev => {
      const newState = !prev;
      console.log('🔄 State changing from', prev, 'to', newState);
      return newState;
    });
  };
  
  const closeMenu = () => {
    console.log('🚪 Closing mobile menu');
    setIsOpen(false);
  };
  
  const handleMenuClick = (action: () => void, actionName: string) => {
    console.log('📱 Menu item clicked:', actionName);
    action();
    closeMenu();
  };

  // Log state changes
  useEffect(() => {
    console.log('📊 Mobile menu state changed:', { isOpen });
  }, [isOpen]);

  // Handle click outside to close menu
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent | TouchEvent) => {
      const target = event.target as Node;
      
      if (
        isOpen &&
        menuRef.current && 
        buttonRef.current &&
        !menuRef.current.contains(target) &&
        !buttonRef.current.contains(target)
      ) {
        console.log('👆 Click outside detected, closing menu');
        closeMenu();
      }
    };

    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside, { passive: true });
      document.addEventListener('touchstart', handleClickOutside, { passive: true });
      // Prevent body scroll
      document.body.style.overflow = 'hidden';
      document.body.style.position = 'fixed';
      document.body.style.width = '100%';
      document.body.style.top = '0';
    } else {
      document.body.style.overflow = '';
      document.body.style.position = '';
      document.body.style.width = '';
      document.body.style.top = '';
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
      document.removeEventListener('touchstart', handleClickOutside);
      document.body.style.overflow = '';
      document.body.style.position = '';
      document.body.style.width = '';
      document.body.style.top = '';
    };
  }, [isOpen]);

  // Handle escape key
  useEffect(() => {
    const handleEscapeKey = (event: KeyboardEvent) => {
      if (event.key === 'Escape' && isOpen) {
        console.log('⌨️ Escape key pressed, closing menu');
        closeMenu();
        buttonRef.current?.focus();
      }
    };

    document.addEventListener('keydown', handleEscapeKey);
    return () => document.removeEventListener('keydown', handleEscapeKey);
  }, [isOpen]);

  return (
    <>
      {/* Debug State Display (Remove in production) */}
      <div className="fixed top-16 left-4 bg-red-500 text-white px-2 py-1 text-xs z-[100] md:hidden">
        Menu: {isOpen ? 'OPEN' : 'CLOSED'}
      </div>

      <div className="relative md:hidden">
        {/* Hamburger Toggle Button */}
        <Button
          ref={buttonRef}
          variant="ghost"
          size="sm"
          className="text-white hover:bg-white/10 p-3 transition-all duration-200 relative z-[70] border border-gray-700 hover:border-gray-500"
          onClick={toggleMenu}
          aria-expanded={isOpen}
          aria-label={isOpen ? 'Close navigation menu' : 'Open navigation menu'}
          aria-controls="mobile-nav-menu"
          type="button"
        >
          {/* Simple Icon Toggle */}
          {isOpen ? (
            <X className="h-6 w-6 text-white" />
          ) : (
            <Menu className="h-6 w-6 text-white" />
          )}
        </Button>

        {/* Mobile Navigation Menu */}
        {isOpen && (
          <div
            ref={menuRef}
            id="mobile-nav-menu"
            className="absolute top-full right-0 mt-2 w-screen max-w-sm bg-gray-900 border border-gray-700 rounded-lg shadow-2xl z-[65] animate-in slide-in-from-top-2 duration-300"
            style={{
              minWidth: '280px',
              maxWidth: '90vw',
              boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.5), 0 10px 10px -5px rgba(0, 0, 0, 0.2)',
            }}
          >
            {/* Menu Header */}
            <div className="px-4 py-3 border-b border-gray-700">
              <div className="flex items-center justify-between">
                <span className="text-lg font-semibold text-white">Navigation</span>
                <button
                  onClick={closeMenu}
                  className="text-gray-400 hover:text-white p-1"
                  aria-label="Close menu"
                >
                  <X className="h-5 w-5" />
                </button>
              </div>
            </div>

            {/* Navigation Links */}
            <div className="py-2">
              <Link
                to="/"
                className="flex items-center justify-between px-4 py-3 text-white hover:bg-gray-800 transition-colors group"
                onClick={closeMenu}
              >
                <span className="font-medium">{t('landing.navbar.home')}</span>
                <ChevronRight className="h-4 w-4 text-gray-400 group-hover:text-white transition-colors" />
              </Link>
              
              <button
                onClick={() => handleMenuClick(onLearnPreview, 'Learn Preview')}
                className="w-full flex items-center justify-between px-4 py-3 text-left text-white hover:bg-gray-800 transition-colors group"
              >
                <span className="font-medium">{t('landing.navbar.learnPreview')}</span>
                <ChevronRight className="h-4 w-4 text-gray-400 group-hover:text-white transition-colors" />
              </button>
              
              <button
                onClick={() => handleMenuClick(onPricing, 'Pricing')}
                className="w-full flex items-center justify-between px-4 py-3 text-left text-white hover:bg-gray-800 transition-colors group"
              >
                <span className="font-medium">{t('landing.navbar.pricing')}</span>
                <ChevronRight className="h-4 w-4 text-gray-400 group-hover:text-white transition-colors" />
              </button>
            </div>

            {/* Language Selector */}
            <div className="px-4 py-3 border-t border-gray-700">
              <p className="text-sm font-medium text-gray-400 mb-2">Language</p>
              <LanguageSelector variant="landing" />
            </div>

            {/* Action Buttons */}
            <div className="px-4 py-4 space-y-3 border-t border-gray-700 bg-gray-900/50">
              <Button
                variant="outline"
                size="sm"
                className="w-full justify-center text-white border-gray-600 hover:border-gray-500 hover:bg-gray-800 transition-all duration-200"
                onClick={() => handleMenuClick(onLogin, 'Login')}
              >
                {t('landing.navbar.login')}
              </Button>
              
              <Button
                size="sm"
                className="w-full justify-center bg-tradeiq-blue hover:bg-tradeiq-blue/80 text-white transition-all duration-200 shadow-lg"
                onClick={() => handleMenuClick(onSignUp, 'Sign Up')}
              >
                {t('landing.navbar.signUp')}
              </Button>
            </div>
          </div>
        )}

        {/* Mobile Overlay */}
        {isOpen && (
          <div 
            className="fixed inset-0 bg-black/30 backdrop-blur-sm z-[60]"
            onClick={closeMenu}
            aria-hidden="true"
          />
        )}
      </div>
    </>
  );
};