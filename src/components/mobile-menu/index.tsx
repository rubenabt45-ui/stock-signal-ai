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
  const menuRef = useRef<HTMLDivElement>(null);
  const buttonRef = useRef<HTMLButtonElement>(null);
  const { t } = useTranslation();

  // Enhanced DOM inspection logging
  const logAction = (action: string, details?: any) => {
    const menuElement = document.getElementById('mobile-menu-content');
    const allMenuElements = document.querySelectorAll('[id*="menu"], [data-testid*="menu"], [class*="menu"]');
    const whiteBoxes = Array.from(document.querySelectorAll('*')).filter(el => {
      const styles = window.getComputedStyle(el);
      const rect = el.getBoundingClientRect();
      return (
        styles.backgroundColor === 'rgb(255, 255, 255)' &&
        styles.display !== 'none' &&
        styles.visibility !== 'hidden' &&
        rect.width > 20 && rect.height > 20
      );
    });
    
    console.log('🍔 [MobileMenu] DOM_INSPECTION', {
      action,
      isOpen,
      timestamp: new Date().toISOString(),
      viewport: `${window.innerWidth}x${window.innerHeight}`,
      menuInDOM: menuElement ? 'YES' : 'NO',
      menuVisible: menuElement ? window.getComputedStyle(menuElement).display !== 'none' : 'N/A',
      totalMenuElements: allMenuElements.length,
      whiteBoxCount: whiteBoxes.length,
      whiteBoxElements: whiteBoxes.map(el => ({
        tag: el.tagName,
        class: el.className,
        id: el.id,
        size: `${el.getBoundingClientRect().width}x${el.getBoundingClientRect().height}`
      })),
      ...details
    });
  };

  // Toggle menu
  const toggleMenu = () => {
    const newState = !isOpen;
    logAction('TOGGLE_MENU', { from: isOpen, to: newState });
    setIsOpen(newState);
  };
  
  // Close menu with enhanced cleanup
  const closeMenu = (reason = 'unknown') => {
    logAction('CLOSE_MENU_START', { reason });
    setIsOpen(false);
    
    // Force cleanup after state change
    setTimeout(() => {
      logAction('CLOSE_MENU_COMPLETE', { 
        reason,
        domCleanupCheck: 'POST_CLOSE'
      });
    }, 100);
  };

  // Handle menu item clicks
  const handleMenuClick = (action: () => void, itemName: string) => {
    logAction('MENU_ITEM_CLICKED', { item: itemName });
    action();
    closeMenu('menu_item_selected');
  };

  // Escape key handler
  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape' && isOpen) {
        logAction('ESCAPE_KEY_PRESSED');
        closeMenu('escape_key');
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

  // Click outside handler
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
      const currentScrollY = window.scrollY;
      document.body.style.overflow = 'hidden';
      document.body.style.position = 'fixed';
      document.body.style.width = '100%';
      document.body.style.top = `-${currentScrollY}px`;
      logAction('BODY_SCROLL_DISABLED');
    } else {
      const scrollY = document.body.style.top;
      document.body.style.overflow = '';
      document.body.style.position = '';
      document.body.style.width = '';
      document.body.style.top = '';
      if (scrollY) {
        window.scrollTo(0, parseInt(scrollY || '0') * -1);
      }
      logAction('BODY_SCROLL_ENABLED');
    }

    return () => {
      document.body.style.overflow = '';
      document.body.style.position = '';
      document.body.style.width = '';
      document.body.style.top = '';
    };
  }, [isOpen]);

  // Enhanced DOM inspection on every render
  React.useEffect(() => {
    logAction('COMPONENT_RENDER', {
      renderState: isOpen ? 'OPEN' : 'CLOSED'
    });
  });

  return (
    <div className="relative md:hidden">
      {/* Hamburger Button */}
      <Button
        ref={buttonRef}
        variant="ghost"
        onClick={toggleMenu}
        className="text-white hover:bg-white/10 p-3 transition-all duration-200 relative z-[80] min-h-[48px] min-w-[48px] border border-gray-700 hover:border-gray-500"
        aria-expanded={isOpen}
        aria-label={isOpen ? 'Close navigation menu' : 'Open navigation menu'}
        aria-controls="mobile-menu-content"
        data-testid="mobile-menu-toggle"
      >
        {isOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
      </Button>

      {/* Conditionally Rendered Menu - ONLY exists when open */}
      {isOpen ? (
        <div
          ref={menuRef}
          id="mobile-menu-content"
          className="fixed inset-0 z-[70]"
          data-testid="mobile-menu-content"
          style={{
            position: 'fixed',
            top: '0px',
            left: '0px',
            right: '0px',
            bottom: '0px',
            width: '100vw',
            height: '100vh',
            backgroundColor: '#09090b',
            zIndex: 70,
            display: 'block',
            opacity: 1,
            pointerEvents: 'auto'
          }}
          onClick={(e) => {
            // Close if clicking the background
            if (e.target === e.currentTarget) {
              closeMenu('background_click');
            }
          }}
        >
          {/* Menu Content - Full Screen */}
          <div 
            className="h-full w-full flex flex-col overflow-y-auto"
            style={{ 
              backgroundColor: 'transparent',
              position: 'relative',
              zIndex: 1
            }}
          >
            {/* Header */}
            <div 
              className="flex items-center justify-between p-6 border-b border-gray-600 min-h-[80px] flex-shrink-0"
              style={{ backgroundColor: 'transparent' }}
            >
              <h3 className="text-xl font-semibold text-white">Navigation</h3>
              <Button
                variant="ghost"
                onClick={() => closeMenu('close_button')}
                className="text-gray-400 hover:text-white hover:bg-gray-700/50 p-3 min-h-[48px] min-w-[48px] rounded-lg"
                aria-label="Close menu"
                data-testid="menu-close-button"
              >
                <X className="h-6 w-6" />
              </Button>
            </div>

            {/* Navigation Links */}
            <div 
              className="flex-1 py-6 space-y-2"
              style={{ backgroundColor: 'transparent' }}
            >
              <Link
                to="/"
                onClick={() => closeMenu('home_link')}
                className="flex items-center gap-4 px-6 py-4 text-white hover:bg-gray-700/30 active:bg-gray-600/30 transition-all duration-200 min-h-[56px] w-full group"
                data-testid="menu-home-link"
                style={{ backgroundColor: 'transparent' }}
              >
                <Home className="h-6 w-6 text-gray-300 group-hover:text-blue-400 flex-shrink-0" />
                <span className="text-lg font-medium">{t('landing.navbar.home')}</span>
              </Link>
              
              <button
                onClick={() => handleMenuClick(onLearnPreview, 'Learn Preview')}
                className="w-full flex items-center gap-4 px-6 py-4 text-left text-white hover:bg-gray-700/30 active:bg-gray-600/30 transition-all duration-200 min-h-[56px] group"
                data-testid="menu-learn-link"
                style={{ backgroundColor: 'transparent' }}
              >
                <BookOpen className="h-6 w-6 text-gray-300 group-hover:text-blue-400 flex-shrink-0" />
                <span className="text-lg font-medium">{t('landing.navbar.learnPreview')}</span>
              </button>
              
              <button
                onClick={() => handleMenuClick(onPricing, 'Pricing')}
                className="w-full flex items-center gap-4 px-6 py-4 text-left text-white hover:bg-gray-700/30 active:bg-gray-600/30 transition-all duration-200 min-h-[56px] group"
                data-testid="menu-pricing-link"
                style={{ backgroundColor: 'transparent' }}
              >
                <DollarSign className="h-6 w-6 text-gray-300 group-hover:text-blue-400 flex-shrink-0" />
                <span className="text-lg font-medium">{t('landing.navbar.pricing')}</span>
              </button>
            </div>

            {/* Language Selector */}
            <div 
              className="px-6 py-6 border-t border-gray-600 flex-shrink-0"
              style={{ backgroundColor: 'transparent' }}
            >
              <p className="text-base font-medium text-gray-300 mb-4">Language</p>
              <div className="bg-gray-700/20 p-4 rounded-lg min-h-[48px] flex items-center">
                <LanguageSelector variant="landing" />
              </div>
            </div>

            {/* Action Buttons */}
            <div 
              className="px-6 py-6 space-y-4 border-t border-gray-600 flex-shrink-0"
              style={{ backgroundColor: 'transparent' }}
            >
              <Button
                variant="outline"
                onClick={() => handleMenuClick(onLogin, 'Login')}
                className="w-full justify-center text-white border-gray-500 hover:border-gray-400 hover:bg-gray-700/30 transition-all duration-200 min-h-[56px] text-lg font-medium"
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

          {/* Background Overlay - Ensure clicks close menu */}
          <div 
            className="absolute inset-0"
            data-testid="mobile-menu-overlay"
            style={{ 
              backgroundColor: 'transparent',
              zIndex: -1,
              position: 'absolute',
              top: 0,
              left: 0,
              right: 0,
              bottom: 0
            }}
            onClick={() => closeMenu('overlay_click')}
          />
        </div>
      ) : null}
    </div>
  );
};