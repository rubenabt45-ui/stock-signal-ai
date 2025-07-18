import React from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface BackToHomeButtonProps {
  className?: string;
}

export const BackToHomeButton: React.FC<BackToHomeButtonProps> = ({ className = "" }) => {
  const navigate = useNavigate();

  const handleBackToHome = () => {
    navigate('/');
  };

  return (
    <Button
      variant="outline"
      onClick={handleBackToHome}
      className={`w-full mt-4 border-gray-700 hover:bg-gray-800 text-gray-300 hover:text-white transition-colors ${className}`}
    >
      <ArrowLeft className="h-4 w-4 mr-2" />
      Back to Home
    </Button>
  );
};

export default BackToHomeButton;