import React from 'react';
import { Menu, X } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface MobileMenuButtonProps {
  isOpen: boolean;
  onClick: () => void;
  buttonRef: React.RefObject<HTMLButtonElement>;
}

export const MobileMenuButton: React.FC<MobileMenuButtonProps> = ({
  isOpen,
  onClick,
  buttonRef
}) => {
  return (
    <Button
      ref={buttonRef}
      variant="ghost"
      onClick={onClick}
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
  );
};