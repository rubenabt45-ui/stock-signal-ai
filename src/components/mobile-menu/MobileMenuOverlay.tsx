import React from 'react';

interface MobileMenuOverlayProps {
  isOpen: boolean;
  onClose: () => void;
}

export const MobileMenuOverlay: React.FC<MobileMenuOverlayProps> = ({
  isOpen,
  onClose
}) => {
  if (!isOpen) return null;

  return (
    <div 
      className="fixed inset-0 bg-black/70 backdrop-blur-sm z-[40] transition-opacity duration-300 ease-in-out"
      onClick={onClose}
      data-testid="mobile-menu-overlay"
      style={{ 
        opacity: isOpen ? 1 : 0,
        pointerEvents: isOpen ? 'auto' : 'none'
      }}
    />
  );
};