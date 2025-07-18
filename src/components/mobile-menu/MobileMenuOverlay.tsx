import React from 'react';

interface MobileMenuOverlayProps {
  isOpen: boolean;
  onClose: () => void;
}

export const MobileMenuOverlay: React.FC<MobileMenuOverlayProps> = ({
  isOpen,
  onClose
}) => {
  return (
    <div 
      className={`fixed inset-0 bg-gray-900/90 backdrop-blur-sm z-[60] transition-all duration-300 ease-in-out ${
        isOpen 
          ? 'opacity-100 pointer-events-auto' 
          : 'opacity-0 pointer-events-none'
      }`}
      onClick={onClose}
      data-testid="mobile-menu-overlay"
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        width: '100vw',
        height: '100vh',
        backgroundColor: 'rgba(17, 24, 39, 0.9)',
        zIndex: 60
      }}
    />
  );
};