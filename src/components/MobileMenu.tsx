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
  const buttonRef = useRef<HTMLButtonElement>(null);

  const toggleMenu = (e?: React.MouseEvent) => {
    e?.preventDefault();
    e?.stopPropagation();
    setIsOpen(prev => !prev);
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
    const handleClickOutside = (event: MouseEvent | TouchEvent) => {
      const target = event.target as Node;
      
      if (
        isOpen &&
        menuRef.current && 
        buttonRef.current &&
        !menuRef.current.contains(target) &&
        !buttonRef.current.contains(target)
      ) {
        closeMenu();
      }
    };

    if (isOpen) {
      // Use both mouse and touch events for better mobile support
      document.addEventListener('mousedown', handleClickOutside);
      document.addEventListener('touchstart', handleClickOutside);
      // Prevent body scroll when menu is open
      document.body.style.overflow = 'hidden';
      document.body.style.position = 'fixed';
      document.body.style.width = '100%';
    } else {
      document.body.style.overflow = '';
      document.body.style.position = '';
      document.body.style.width = '';
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
      document.removeEventListener('touchstart', handleClickOutside);
      document.body.style.overflow = '';
      document.body.style.position = '';
      document.body.style.width = '';
    };
  }, [isOpen]);

  // Handle escape key to close menu
  useEffect(() => {
    const handleEscapeKey = (event: KeyboardEvent) => {
      if (event.key === 'Escape' && isOpen) {
        closeMenu();
        buttonRef.current?.focus(); // Return focus to button
      }
    };

    document.addEventListener('keydown', handleEscapeKey);
    return () => document.removeEventListener('keydown', handleEscapeKey);
  }, [isOpen]);

  return (
    <div className="relative md:hidden">
      {/* Hamburger Toggle Button */}
      <Button
        ref={buttonRef}
        variant="ghost"
        size="sm"
        className="text-white hover:bg-white/10 p-2 transition-all duration-200 relative z-[60]"
        onClick={toggleMenu}
        aria-expanded={isOpen}
        aria-label={isOpen ? 'Close navigation menu' : 'Open navigation menu'}
        aria-controls="mobile-dropdown-menu"
        aria-haspopup="menu"
      >
        {/* Animated Hamburger Icon */}
        <div className="w-6 h-6 flex flex-col justify-center items-center">
          <span className={`block h-0.5 w-6 bg-current transition-all duration-300 ease-in-out ${
            isOpen ? 'rotate-45 translate-y-1.5' : '-translate-y-1'
          }`} />
          <span className={`block h-0.5 w-6 bg-current transition-all duration-300 ease-in-out ${
            isOpen ? 'opacity-0' : 'opacity-100'
          }`} />
          <span className={`block h-0.5 w-6 bg-current transition-all duration-300 ease-in-out ${
            isOpen ? '-rotate-45 -translate-y-1.5' : 'translate-y-1'
          }`} />
        </div>
      </Button>

      {/* Dropdown Menu */}
      <div
        ref={menuRef}
        id="mobile-dropdown-menu"
        role="menu"
        aria-hidden={!isOpen}
        className={`absolute top-full right-0 w-screen min-w-[280px] max-w-[400px] bg-gray-900/95 backdrop-blur-md border border-gray-800/50 shadow-2xl transition-all duration-300 ease-in-out transform origin-top-right z-[55] ${
          isOpen 
            ? 'opacity-100 scale-100 translate-y-0' 
            : 'opacity-0 scale-95 -translate-y-2 pointer-events-none'
        }`}
        style={{
          borderRadius: '0 0 12px 12px',
          marginTop: '4px',
          boxShadow: '0 10px 40px rgba(0, 0, 0, 0.4)',
        }}
      >
        {/* Menu Content */}
        <div className="py-4 px-6 space-y-1">
          {/* Navigation Links */}
          <div className="space-y-1 pb-4 border-b border-gray-800/30">
            <Link
              to="/"
              role="menuitem"
              className="block w-full text-left px-4 py-3 text-white hover:text-tradeiq-blue hover:bg-white/5 rounded-lg transition-all duration-200 font-medium focus:outline-none focus:ring-2 focus:ring-tradeiq-blue/50"
              onClick={closeMenu}
              tabIndex={isOpen ? 0 : -1}
            >
              {t('landing.navbar.home')}
            </Link>
            
            <button
              role="menuitem"
              onClick={() => handleMenuClick(onLearnPreview)}
              className="block w-full text-left px-4 py-3 text-white hover:text-tradeiq-blue hover:bg-white/5 rounded-lg transition-all duration-200 font-medium focus:outline-none focus:ring-2 focus:ring-tradeiq-blue/50"
              tabIndex={isOpen ? 0 : -1}
            >
              {t('landing.navbar.learnPreview')}
            </button>
            
            <button
              role="menuitem"
              onClick={() => handleMenuClick(onPricing)}
              className="block w-full text-left px-4 py-3 text-white hover:text-tradeiq-blue hover:bg-white/5 rounded-lg transition-all duration-200 font-medium focus:outline-none focus:ring-2 focus:ring-tradeiq-blue/50"
              tabIndex={isOpen ? 0 : -1}
            >
              {t('landing.navbar.pricing')}
            </button>
          </div>

          {/* Language Selector */}
          <div className="py-3 border-b border-gray-800/30">
            <p className="text-xs font-medium text-gray-400 mb-2 px-4">Language</p>
            <div className="px-4">
              <LanguageSelector variant="landing" />
            </div>
          </div>

          {/* Action Buttons */}
          <div className="space-y-3 pt-3">
            <Button
              variant="ghost"
              size="sm"
              className="w-full justify-start text-white hover:bg-white/5 border border-gray-700 hover:border-gray-600 transition-all duration-200 min-h-[48px]"
              onClick={() => handleMenuClick(onLogin)}
              tabIndex={isOpen ? 0 : -1}
            >
              {t('landing.navbar.login')}
            </Button>
            
            <Button
              size="sm"
              className="w-full justify-start bg-tradeiq-blue hover:bg-tradeiq-blue/80 text-white transition-all duration-200 min-h-[48px] shadow-lg"
              onClick={() => handleMenuClick(onSignUp)}
              tabIndex={isOpen ? 0 : -1}
            >
              {t('landing.navbar.signUp')}
            </Button>
          </div>
        </div>
      </div>

      {/* Overlay for mobile devices */}
      {isOpen && (
        <div 
          className="fixed inset-0 bg-black/20 backdrop-blur-sm z-[50] md:hidden"
          onClick={closeMenu}
          aria-hidden="true"
        />
      )}
    </div>
  );
};