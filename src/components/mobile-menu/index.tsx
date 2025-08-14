import React, { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { Menu, X, Home, TrendingUp, BookOpen, Settings, LogOut, Star } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';
import { useAuth } from '@/contexts/auth/auth.provider';
import { useSubscription } from '@/hooks/useSubscription';
import { useTranslationWithFallback } from '@/hooks/useTranslationWithFallback';

interface MobileMenuProps {
  isOpen: boolean;
  onClose: () => void;
}

const MobileMenu: React.FC<MobileMenuProps> = ({ isOpen, onClose }) => {
  const location = useLocation();
  const navigate = useNavigate();
  const { user, signOut } = useAuth();
  const { isPro } = useSubscription();
  const { t } = useTranslationWithFallback();
  const [isSigningOut, setIsSigningOut] = useState(false);

  const menuItems = [
    {
      href: '/app',
      label: t('mobileMenu.home'),
      icon: Home,
    },
    {
      href: '/app/strategy-ai',
      label: t('mobileMenu.strategyAI'),
      icon: Brain,
    },
    {
      href: '/app/learn',
      label: t('mobileMenu.learn'),
      icon: BookOpen,
    },
    {
      href: '/app/market-updates',
      label: t('mobileMenu.marketUpdates'),
      icon: TrendingUp,
    },
    {
      href: '/app/favorites',
      label: t('mobileMenu.favorites'),
      icon: Star,
    },
    {
      href: '/app/settings',
      label: t('mobileMenu.settings'),
      icon: Settings,
    },
  ];

  const handleSignOut = async () => {
    setIsSigningOut(true);
    try {
      await signOut();
      console.log('User signed out successfully');
      navigate('/login');
    } catch (error) {
      console.error('Sign out failed:', error);
    } finally {
      setIsSigningOut(false);
    }
  };

  return (
    <div
      className={cn(
        'fixed inset-0 z-50 bg-tradeiq-navy text-white transition-transform duration-300 transform origin-top',
        isOpen ? 'scale-100 opacity-100' : 'scale-y-0 opacity-0',
        '-translate-y-1',
      )}
    >
      <div className="p-4 flex items-center justify-between">
        <span className="font-bold text-xl">{t('mobileMenu.menu')}</span>
        <Button variant="ghost" size="icon" onClick={onClose}>
          <X className="h-6 w-6" />
        </Button>
      </div>

      <nav className="p-4 space-y-2">
        {menuItems.map((item) => (
          <Link
            key={item.href}
            to={item.href}
            className={cn(
              'flex items-center space-x-3 p-3 rounded-md hover:bg-gray-800/50 transition-colors duration-200',
              location.pathname === item.href ? 'bg-gray-800/50 font-medium' : 'font-normal',
            )}
            onClick={onClose}
          >
            <item.icon className="h-5 w-5" />
            <span>{item.label}</span>
          </Link>
        ))}
      </nav>

      <div className="p-4 mt-4 space-y-2 border-t border-gray-800">
        <Badge variant={isPro ? 'default' : 'secondary'} className="w-full justify-center px-3 py-1">
          {isPro ? (
            <>
              <Star className="h-3 w-3 mr-1" />
              {t('dashboard.plan.pro')}
            </>
          ) : (
            t('dashboard.plan.free')
          )}
        </Badge>
        <Button
          variant="destructive"
          className="w-full justify-center"
          onClick={handleSignOut}
          disabled={isSigningOut}
        >
          {isSigningOut ? (
            <>
              <LogOut className="mr-2 h-4 w-4 animate-spin" />
              {t('mobileMenu.signingOut')}
            </>
          ) : (
            <>
              <LogOut className="mr-2 h-4 w-4" />
              {t('mobileMenu.signOut')}
            </>
          )}
        </Button>
      </div>
    </div>
  );
};

export default MobileMenu;
