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

  // Enhanced debug logging
  const logAction = (action: string, data?: any) => {
    console.log(`🍔 [MobileMenu] ${action}:`, {
      timestamp: new Date().toISOString(),
      isOpen,
      viewport: `${window.innerWidth}x${window.innerHeight}`,
      userAgent: navigator.userAgent.includes('Mobile') ? 'Mobile' : 'Desktop',
      ...data
    });
  };

  // Toggle menu state with enhanced logging
  const toggleMenu = (e?: React.MouseEvent) => {
    e?.preventDefault();
    e?.stopPropagation();
    
    const newState = !isOpen;
    logAction('TOGGLE_CLICKED', { 
      previousState: isOpen, 
      newState,
      clickEvent: !!e 
    });
    
    setIsOpen(newState);
  };
  
  // Close menu with logging
  const closeMenu = (reason: string = 'unknown') => {
    logAction('CLOSE_MENU', { reason });
    setIsOpen(false);
  };
  
  // Handle menu item clicks
  const handleMenuClick = (action: () => void, actionName: string) => {
    logAction('MENU_ITEM_CLICKED', { actionName });
    action();
    closeMenu('menu_item_selected');
  };

  // Log state changes
  useEffect(() => {
    logAction('STATE_CHANGED', { newState: isOpen });
    
    if (isOpen) {
      // Prevent body scroll and fix positioning
      document.body.style.overflow = 'hidden';
      document.body.style.position = 'fixed';
      document.body.style.width = '100%';
      document.body.style.top = '0';
      logAction('BODY_SCROLL_DISABLED');
    } else {
      // Restore body scroll
      document.body.style.overflow = '';
      document.body.style.position = '';
      document.body.style.width = '';
      document.body.style.top = '';
      logAction('BODY_SCROLL_ENABLED');
    }

    return () => {
      // Cleanup on unmount
      document.body.style.overflow = '';
      document.body.style.position = '';
      document.body.style.width = '';
      document.body.style.top = '';
    };
  }, [isOpen]);

  // Handle click outside to close menu
  useEffect(() => {
    if (!isOpen) return;

    const handleClickOutside = (event: MouseEvent | TouchEvent) => {
      const target = event.target as Node;
      
      if (
        menuRef.current && 
        buttonRef.current &&
        !menuRef.current.contains(target) &&
        !buttonRef.current.contains(target)
      ) {
        logAction('CLICK_OUTSIDE_DETECTED', { 
          eventType: event.type,
          targetTag: (target as Element)?.tagName 
        });
        closeMenu('click_outside');
      }
    };

    // Add both mouse and touch event listeners for cross-platform support
    document.addEventListener('mousedown', handleClickOutside, { passive: true });
    document.addEventListener('touchstart', handleClickOutside, { passive: true });

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
      document.removeEventListener('touchstart', handleClickOutside);
    };
  }, [isOpen]);

  // Handle escape key to close menu
  useEffect(() => {
    if (!isOpen) return;

    const handleEscapeKey = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        logAction('ESCAPE_KEY_PRESSED');
        closeMenu('escape_key');
        buttonRef.current?.focus();
      }
    };

    document.addEventListener('keydown', handleEscapeKey);
    return () => document.removeEventListener('keydown', handleEscapeKey);
  }, [isOpen]);

  return (
    <div className="relative md:hidden">
      {/* Debug State Indicator */}
      <div className="fixed top-20 left-4 bg-red-600 text-white px-3 py-1 text-xs font-bold rounded z-[100] shadow-lg">
        MENU: {isOpen ? 'OPEN' : 'CLOSED'}
      </div>

      {/* Hamburger Toggle Button */}
      <Button
        ref={buttonRef}
        variant="ghost"
        size="sm"
        className="text-white hover:bg-white/10 p-3 transition-all duration-200 relative z-[60] min-h-[48px] min-w-[48px] border border-transparent hover:border-gray-600"
        onClick={toggleMenu}
        aria-expanded={isOpen}
        aria-label={isOpen ? 'Close navigation menu' : 'Open navigation menu'}
        aria-controls="mobile-navigation-menu"
        type="button"
      >
        <div className="flex flex-col justify-center items-center w-6 h-6">
          {isOpen ? (
            <X className="h-6 w-6 text-white transition-transform duration-200" />
          ) : (
            <Menu className="h-6 w-6 text-white transition-transform duration-200" />
          )}
        </div>
      </Button>

      {/* Mobile Navigation Menu - Conditional Rendering */}
      {isOpen && (
        <>
          {/* Background Overlay */}
          <div 
            className="fixed inset-0 bg-black/50 backdrop-blur-sm z-[50] transition-opacity duration-300 ease-in-out"
            onClick={() => closeMenu('overlay_click')}
            aria-hidden="true"
          />

          {/* Menu Container */}
          <div
            ref={menuRef}
            id="mobile-navigation-menu"
            className="absolute top-full right-0 mt-2 w-80 max-w-[90vw] bg-gray-900 border border-gray-700 rounded-lg shadow-2xl z-[55] transition-all duration-300 ease-in-out transform animate-in slide-in-from-top-4 fade-in-0"
            style={{
              boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.8), 0 10px 20px -5px rgba(0, 0, 0, 0.4)',
              background: 'rgba(17, 24, 39, 0.98)',
              backdropFilter: 'blur(16px)',
            }}
          >
            {/* Menu Header */}
            <div className="flex items-center justify-between p-4 border-b border-gray-700">
              <h3 className="text-lg font-semibold text-white">Navigation</h3>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => closeMenu('header_close_button')}
                className="text-gray-400 hover:text-white hover:bg-gray-800 p-2 min-h-[44px] min-w-[44px]"
                aria-label="Close menu"
              >
                <X className="h-5 w-5" />
              </Button>
            </div>

            {/* Navigation Links with Enhanced Touch Targets */}
            <div className="py-2">
              <Link
                to="/"
                className="flex items-center justify-between px-6 py-4 text-white hover:bg-gray-800 transition-all duration-200 min-h-[48px] group border-l-4 border-transparent hover:border-tradeiq-blue"
                onClick={() => closeMenu('home_link')}
              >
                <span className="font-medium text-base">{t('landing.navbar.home')}</span>
                <ChevronRight className="h-4 w-4 text-gray-400 group-hover:text-tradeiq-blue transition-colors" />
              </Link>
              
              <button
                onClick={() => handleMenuClick(onLearnPreview, 'Learn Preview')}
                className="w-full flex items-center justify-between px-6 py-4 text-left text-white hover:bg-gray-800 transition-all duration-200 min-h-[48px] group border-l-4 border-transparent hover:border-tradeiq-blue"
              >
                <span className="font-medium text-base">{t('landing.navbar.learnPreview')}</span>
                <ChevronRight className="h-4 w-4 text-gray-400 group-hover:text-tradeiq-blue transition-colors" />
              </button>
              
              <button
                onClick={() => handleMenuClick(onPricing, 'Pricing')}
                className="w-full flex items-center justify-between px-6 py-4 text-left text-white hover:bg-gray-800 transition-all duration-200 min-h-[48px] group border-l-4 border-transparent hover:border-tradeiq-blue"
              >
                <span className="font-medium text-base">{t('landing.navbar.pricing')}</span>
                <ChevronRight className="h-4 w-4 text-gray-400 group-hover:text-tradeiq-blue transition-colors" />
              </button>
            </div>

            {/* Language Selector Section */}
            <div className="px-6 py-4 border-t border-gray-700">
              <p className="text-sm font-medium text-gray-400 mb-3">Language</p>
              <div className="bg-gray-800/50 p-3 rounded-lg">
                <LanguageSelector variant="landing" />
              </div>
            </div>

            {/* Action Buttons with Enhanced Touch Targets */}
            <div className="px-6 py-4 space-y-3 border-t border-gray-700 bg-gray-900/70">
              <Button
                variant="outline"
                size="default"
                className="w-full justify-center text-white border-gray-600 hover:border-gray-500 hover:bg-gray-800 transition-all duration-200 min-h-[48px] text-base font-medium"
                onClick={() => handleMenuClick(onLogin, 'Login')}
              >
                {t('landing.navbar.login')}
              </Button>
              
              <Button
                size="default"
                className="w-full justify-center bg-tradeiq-blue hover:bg-tradeiq-blue/80 text-white transition-all duration-200 min-h-[48px] text-base font-medium shadow-lg"
                onClick={() => handleMenuClick(onSignUp, 'Sign Up')}
              >
                {t('landing.navbar.signUp')}
              </Button>
            </div>
          </div>
        </>
      )}
    </div>
  );
};