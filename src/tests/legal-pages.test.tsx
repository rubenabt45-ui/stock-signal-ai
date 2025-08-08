
import React from 'react';
import { render, screen } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import { describe, it, expect } from 'vitest';
import Terms from '../pages/legal/Terms';
import Privacy from '../pages/legal/Privacy';
import Cookies from '../pages/legal/Cookies';

// Mock the translation hook
jest.mock('../hooks/useTranslationWithFallback', () => ({
  useTranslationWithFallback: () => ({
    t: (key: string) => {
      const translations: Record<string, string> = {
        'legal.terms.title': 'Terms and Conditions',
        'legal.privacy.title': 'Privacy Policy',
        'legal.cookies.title': 'Cookie Policy',
        'legal.terms.metaTitle': 'Terms and Conditions | TradeIQ Pro',
        'legal.privacy.metaTitle': 'Privacy Policy | TradeIQ Pro',
        'legal.cookies.metaTitle': 'Cookie Policy | TradeIQ Pro',
        'common.back': 'Back',
        'legal.lastUpdated': 'Last updated',
        'legal.terms.lastUpdated': '2025-01-08',
        'legal.privacy.lastUpdated': '2025-01-08',
        'legal.cookies.lastUpdated': '2025-01-08'
      };
      return translations[key] || key;
    }
  })
}));

const renderWithRouter = (component: React.ReactElement) => {
  return render(
    <BrowserRouter>
      {component}
    </BrowserRouter>
  );
};

describe('Legal Pages', () => {
  describe('Terms Page', () => {
    it('renders terms and conditions title', () => {
      renderWithRouter(<Terms />);
      expect(screen.getByText('Terms and Conditions')).toBeInTheDocument();
    });

    it('renders back button', () => {
      renderWithRouter(<Terms />);
      expect(screen.getByText('Back')).toBeInTheDocument();
    });

    it('renders last updated date', () => {
      renderWithRouter(<Terms />);
      expect(screen.getByText(/Last updated/)).toBeInTheDocument();
    });
  });

  describe('Privacy Page', () => {
    it('renders privacy policy title', () => {
      renderWithRouter(<Privacy />);
      expect(screen.getByText('Privacy Policy')).toBeInTheDocument();
    });

    it('renders back button', () => {
      renderWithRouter(<Privacy />);
      expect(screen.getByText('Back')).toBeInTheDocument();
    });

    it('renders last updated date', () => {
      renderWithRouter(<Privacy />);
      expect(screen.getByText(/Last updated/)).toBeInTheDocument();
    });
  });

  describe('Cookies Page', () => {
    it('renders cookie policy title', () => {
      renderWithRouter(<Cookies />);
      expect(screen.getByText('Cookie Policy')).toBeInTheDocument();
    });

    it('renders back button', () => {
      renderWithRouter(<Cookies />);
      expect(screen.getByText('Back')).toBeInTheDocument();
    });

    it('renders last updated date', () => {
      renderWithRouter(<Cookies />);
      expect(screen.getByText(/Last updated/)).toBeInTheDocument();
    });
  });
});
