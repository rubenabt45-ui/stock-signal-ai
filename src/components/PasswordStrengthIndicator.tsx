
import React from 'react';
import { CheckCircle, XCircle } from 'lucide-react';
import { useTranslationWithFallback } from '@/hooks/useTranslationWithFallback';

interface PasswordStrengthIndicatorProps {
  password: string;
  className?: string;
}

interface PasswordRequirement {
  key: string;
  test: (password: string) => boolean;
  label: string;
}

export const PasswordStrengthIndicator: React.FC<PasswordStrengthIndicatorProps> = ({ 
  password, 
  className = "" 
}) => {
  const { t } = useTranslationWithFallback();

  const requirements: PasswordRequirement[] = [
    {
      key: 'length',
      test: (pwd) => pwd.length >= 8,
      label: t('auth.passwordRequirements.minLength')
    },
    {
      key: 'uppercase',
      test: (pwd) => /[A-Z]/.test(pwd),
      label: t('auth.passwordRequirements.uppercase')
    },
    {
      key: 'lowercase',
      test: (pwd) => /[a-z]/.test(pwd),
      label: t('auth.passwordRequirements.lowercase')
    },
    {
      key: 'number',
      test: (pwd) => /\d/.test(pwd),
      label: t('auth.passwordRequirements.number')
    },
    {
      key: 'special',
      test: (pwd) => /[!@#$%^&*(),.?":{}|<>]/.test(pwd),
      label: t('auth.passwordRequirements.special')
    }
  ];

  const getStrengthScore = () => {
    return requirements.filter(req => req.test(password)).length;
  };

  const getStrengthLabel = () => {
    const score = getStrengthScore();
    if (score <= 1) return { label: t('auth.passwordStrength.weak'), color: 'text-red-400' };
    if (score <= 3) return { label: t('auth.passwordStrength.fair'), color: 'text-yellow-400' };
    if (score <= 4) return { label: t('auth.passwordStrength.good'), color: 'text-blue-400' };
    return { label: t('auth.passwordStrength.strong'), color: 'text-green-400' };
  };

  if (!password) return null;

  const strength = getStrengthLabel();
  const score = getStrengthScore();

  return (
    <div className={`space-y-3 ${className}`}>
      {/* Strength Bar */}
      <div className="space-y-1">
        <div className="flex justify-between items-center">
          <span className="text-sm text-gray-400">{t('auth.passwordStrength.label')}</span>
          <span className={`text-sm font-medium ${strength.color}`}>{strength.label}</span>
        </div>
        <div className="w-full bg-gray-700 rounded-full h-2">
          <div 
            className={`h-2 rounded-full transition-all duration-300 ${
              score <= 1 ? 'bg-red-500' :
              score <= 3 ? 'bg-yellow-500' :
              score <= 4 ? 'bg-blue-500' : 'bg-green-500'
            }`}
            style={{ width: `${(score / 5) * 100}%` }}
          />
        </div>
      </div>

      {/* Requirements List */}
      <div className="space-y-2">
        {requirements.map((req) => {
          const isMet = req.test(password);
          return (
            <div key={req.key} className="flex items-center space-x-2">
              {isMet ? (
                <CheckCircle className="h-4 w-4 text-green-400" />
              ) : (
                <XCircle className="h-4 w-4 text-gray-500" />
              )}
              <span className={`text-sm ${isMet ? 'text-green-400' : 'text-gray-500'}`}>
                {req.label}
              </span>
            </div>
          );
        })}
      </div>
    </div>
  );
};
