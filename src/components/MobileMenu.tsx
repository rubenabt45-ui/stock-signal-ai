import React, { useState, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import { Menu, X, Home, BookOpen, DollarSign, LogIn, UserPlus } from 'lucide-react';
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

  // Enhanced logging function
  const logAction = (action: string, details?: any) => {
    const logData = {
      action,
      isOpen,
      timestamp: new Date().toISOString(),
      viewport: `${window.innerWidth}x${window.innerHeight}`,
      userAgent: navigator.userAgent.includes('Mobile') ? 'Mobile' : 'Desktop',
      ...details
    };
    console.log('🍔 [MobileMenu]', logData);
  };

  // Toggle menu state
  const toggleMenu = () => {
    const newState = !isOpen;
    logAction('TOGGLE_MENU', { 
      from: isOpen, 
      to: newState,
      trigger: 'hamburger_click'
    });
    setIsOpen(newState);
  };
  
  // Close menu function
  const closeMenu = (reason = 'unknown') => {
    logAction('CLOSE_MENU', { reason });
    setIsOpen(false);
  };
  
  // Handle menu item clicks
  const handleMenuClick = (action: () => void, itemName: string) => {
    logAction('MENU_ITEM_CLICKED', { item: itemName });
    action();
    closeMenu('menu_item_selected');
  };

  // Handle escape key
  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape' && isOpen) {
        logAction('ESCAPE_KEY_PRESSED');
        closeMenu('escape_key');
        // Return focus to hamburger button
        if (buttonRef.current) {
          buttonRef.current.focus();
        }
      }
    };

    if (isOpen) {
      document.addEventListener('keydown', handleKeyDown);
      logAction('ESCAPE_LISTENER_ADDED');
    }

    return () => {
      document.removeEventListener('keydown', handleKeyDown);
      if (isOpen) {
        logAction('ESCAPE_LISTENER_REMOVED');
      }
    };
  }, [isOpen]);

  // Handle click outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent | TouchEvent) => {
      if (!isOpen) return;
      
      const target = event.target as Node;
      
      if (
        menuRef.current && 
        buttonRef.current &&
        !menuRef.current.contains(target) &&
        !buttonRef.current.contains(target)
      ) {
        logAction('CLICK_OUTSIDE_DETECTED', { 
          eventType: event.type,
          targetElement: (target as Element)?.tagName 
        });
        closeMenu('click_outside');
      }
    };

    if (isOpen) {
      // Add slight delay to prevent immediate closing when opening
      const timer = setTimeout(() => {
        document.addEventListener('mousedown', handleClickOutside);
        document.addEventListener('touchstart', handleClickOutside, { passive: true });
        logAction('OUTSIDE_CLICK_LISTENERS_ADDED');
      }, 100);

      return () => {
        clearTimeout(timer);
        document.removeEventListener('mousedown', handleClickOutside);
        document.removeEventListener('touchstart', handleClickOutside);
        logAction('OUTSIDE_CLICK_LISTENERS_REMOVED');
      };
    }
  }, [isOpen]);

  // Body scroll prevention
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
      document.body.style.position = 'fixed';
      document.body.style.width = '100%';
      document.body.style.top = '0';
      logAction('BODY_SCROLL_DISABLED');
    } else {
      document.body.style.overflow = '';
      document.body.style.position = '';
      document.body.style.width = '';
      document.body.style.top = '';
      logAction('BODY_SCROLL_ENABLED');
    }

    return () => {
      document.body.style.overflow = '';
      document.body.style.position = '';
      document.body.style.width = '';
      document.body.style.top = '';
    };
  }, [isOpen]);

  return (
    <div className="relative md:hidden">
      {/* Debug State Indicator - Remove in production */}
      <div 
        className="fixed top-16 left-2 bg-red-600 text-white px-2 py-1 text-xs font-bold rounded z-[200] shadow-lg"
        data-testid="menu-debug-state"
      >
        MENU: {isOpen ? 'OPEN' : 'CLOSED'}
      </div>

      {/* Hamburger Button */}
      <Button
        ref={buttonRef}
        variant="ghost"
        onClick={toggleMenu}
        className="text-white hover:bg-white/10 p-3 transition-all duration-200 relative z-[60] min-h-[48px] min-w-[48px] border border-gray-700 hover:border-gray-500"
        aria-expanded={isOpen}
        aria-label={isOpen ? 'Close navigation menu' : 'Open navigation menu'}
        aria-controls="mobile-menu-content"
        data-testid="mobile-menu-toggle"
      >
        {isOpen ? (
          <X className="h-6 w-6" />
        ) : (
          <Menu className="h-6 w-6" />
        )}
      </Button>

      {/* Menu Overlay - Fixed positioned backdrop */}
      {isOpen && (
        <div 
          className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[40] transition-opacity duration-300"
          onClick={() => closeMenu('overlay_click')}
          data-testid="mobile-menu-overlay"
        />
      )}

      {/* Menu Content - Fixed positioned dropdown */}
      <div
        ref={menuRef}
        id="mobile-menu-content"
        className={`
          fixed top-20 right-4 w-80 max-w-[calc(100vw-2rem)]
          bg-gray-900 border border-gray-600 rounded-lg shadow-2xl
          transition-all duration-300 ease-in-out
          ${isOpen 
            ? 'opacity-100 translate-y-0 scale-100 z-[50] pointer-events-auto' 
            : 'opacity-0 -translate-y-4 scale-95 z-[-1] pointer-events-none'
          }
        `}
        data-testid="mobile-menu-content"
        style={{
          background: 'rgba(17, 24, 39, 0.98)',
          backdropFilter: 'blur(12px)',
          boxShadow: isOpen ? '0 25px 50px -12px rgba(0, 0, 0, 0.8), 0 10px 20px -5px rgba(0, 0, 0, 0.4)' : 'none',
        }}
      >
        {/* Menu Header */}
        <div className="flex items-center justify-between p-4 border-b border-gray-700">
          <h3 className="text-lg font-semibold text-white">Navigation</h3>
          <Button
            variant="ghost"
            onClick={() => closeMenu('header_close')}
            className="text-gray-400 hover:text-white hover:bg-gray-800 p-2 min-h-[48px] min-w-[48px]"
            aria-label="Close menu"
            data-testid="menu-close-button"
          >
            <X className="h-5 w-5" />
          </Button>
        </div>

        {/* Navigation Links */}
        <div className="py-2">
          <Link
            to="/"
            onClick={() => closeMenu('home_link')}
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
        <div className="px-6 py-4 border-t border-gray-700">
          <p className="text-sm font-medium text-gray-400 mb-3">Language</p>
          <div className="bg-gray-800/50 p-3 rounded-lg">
            <LanguageSelector variant="landing" />
          </div>
        </div>

        {/* Action Buttons */}
        <div className="px-6 py-4 space-y-3 border-t border-gray-700 bg-gray-900/70">
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
    </div>
  );
};