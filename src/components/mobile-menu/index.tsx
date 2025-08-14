// Remove or significantly reduce production logging in MobileMenu
import React, { useState, useEffect } from 'react';
import { Menu, X, Brain } from 'lucide-react';
import { Link, useLocation } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/contexts/auth/auth.provider';
import { cn } from '@/lib/utils';

// Reduced logging for production
const logMobileMenuAction = (action: string, data?: any) => {
  if (import.meta.env.DEV) {
    console.log(`🍔 [MobileMenu] ${action}`, data);
  }
};

export const MobileMenu: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const { user } = useAuth();
  const location = useLocation();

  // Close menu when route changes
  useEffect(() => {
    setIsOpen(false);
  }, [location.pathname]);

  // Prevent body scroll when menu is open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
      logMobileMenuAction('BODY_SCROLL_DISABLED');
    } else {
      document.body.style.overflow = '';
      logMobileMenuAction('BODY_SCROLL_ENABLED');
    }

    return () => {
      document.body.style.overflow = '';
    };
  }, [isOpen]);

  const toggleMenu = () => {
    const newIsOpen = !isOpen;
    setIsOpen(newIsOpen);
    logMobileMenuAction(newIsOpen ? 'MENU_OPENED' : 'MENU_CLOSED');
  };

  // Navigation items for authenticated users
  const appNavItems = [
    { to: '/app', label: 'Dashboard' },
    { to: '/app/strategy-ai', label: 'StrategyAI' },
    { to: '/app/learn', label: 'Learn' },
    { to: '/app/events', label: 'Events' },
    { to: '/app/market-updates', label: 'Market Updates' },
    { to: '/app/favorites', label: 'Favorites' },
    { to: '/app/settings', label: 'Settings' }
  ];

  // Navigation items for public pages
  const publicNavItems = [
    { to: '/', label: 'Home' },
    { to: '/learn-preview', label: 'Learn' },
    { to: '/pricing', label: 'Pricing' },
    { to: '/about', label: 'About' }
  ];

  const navItems = user ? appNavItems : publicNavItems;

  return (
    <>
      {/* Menu Toggle Button */}
      <Button
        variant="ghost"
        size="sm"
        className="md:hidden p-2"
        onClick={toggleMenu}
        aria-label="Toggle menu"
      >
        {isOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
      </Button>

      {/* Mobile Menu Overlay */}
      {isOpen && (
        <div 
          className="fixed inset-0 z-50 md:hidden"
          onClick={() => setIsOpen(false)}
        >
          {/* Backdrop */}
          <div className="absolute inset-0 bg-black/50" />
          
          {/* Menu Panel */}
          <div 
            className="absolute top-0 left-0 w-64 h-full bg-tradeiq-navy border-r border-gray-700 shadow-xl"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex flex-col h-full">
              {/* Header */}
              <div className="flex items-center justify-between p-4 border-b border-gray-700">
                <h2 className="text-lg font-semibold text-white">Menu</h2>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setIsOpen(false)}
                  className="p-2"
                >
                  <X className="h-5 w-5" />
                </Button>
              </div>

              {/* Navigation */}
              <nav className="flex-1 p-4">
                <ul className="space-y-2">
                  {navItems.map((item) => (
                    <li key={item.to}>
                      <Link
                        to={item.to}
                        className={cn(
                          "block px-3 py-2 rounded-md text-sm font-medium transition-colors",
                          location.pathname === item.to
                            ? "bg-tradeiq-blue text-white"
                            : "text-gray-300 hover:bg-gray-700 hover:text-white"
                        )}
                        onClick={() => setIsOpen(false)}
                      >
                        {item.label}
                      </Link>
                    </li>
                  ))}
                </ul>
              </nav>

              {/* Auth Actions */}
              <div className="p-4 border-t border-gray-700">
                {user ? (
                  <div className="space-y-2">
                    <p className="text-sm text-gray-400 truncate">
                      {user.email}
                    </p>
                    <Button
                      variant="outline"
                      size="sm"
                      className="w-full"
                      onClick={() => {
                        // Implement sign out
                        setIsOpen(false);
                      }}
                    >
                      Sign Out
                    </Button>
                  </div>
                ) : (
                  <div className="space-y-2">
                    <Link to="/login" onClick={() => setIsOpen(false)}>
                      <Button variant="outline" size="sm" className="w-full">
                        Login
                      </Button>
                    </Link>
                    <Link to="/signup" onClick={() => setIsOpen(false)}>
                      <Button size="sm" className="w-full">
                        Sign Up
                      </Button>
                    </Link>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
};
