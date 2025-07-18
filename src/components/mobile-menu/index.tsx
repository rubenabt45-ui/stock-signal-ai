import React, { useState, useEffect, useRef } from 'react';
import { MobileMenuButton } from './MobileMenuButton';
import { MobileMenuOverlay } from './MobileMenuOverlay';
import { MobileMenuContent } from './MobileMenuContent';

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

  // Logging function for debugging
  const logAction = (action: string, details?: any) => {
    console.log('🍔 [MobileMenu]', {
      action,
      isOpen,
      timestamp: new Date().toISOString(),
      viewport: `${window.innerWidth}x${window.innerHeight}`,
      ...details
    });
  };

  // Toggle menu state
  const toggleMenu = () => {
    const newState = !isOpen;
    logAction('TOGGLE_MENU', { from: isOpen, to: newState });
    setIsOpen(newState);
  };
  
  // Close menu function
  const closeMenu = (reason = 'unknown') => {
    logAction('CLOSE_MENU', { reason });
    setIsOpen(false);
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

  return (
    <div className="relative md:hidden">
      <MobileMenuButton
        isOpen={isOpen}
        onClick={toggleMenu}
        buttonRef={buttonRef}
      />
      
      <MobileMenuOverlay
        isOpen={isOpen}
        onClose={() => closeMenu('overlay_click')}
      />
      
      <MobileMenuContent
        isOpen={isOpen}
        onClose={closeMenu}
        onLogin={onLogin}
        onSignUp={onSignUp}
        onLearnPreview={onLearnPreview}
        onPricing={onPricing}
        menuRef={menuRef}
      />
    </div>
  );
};