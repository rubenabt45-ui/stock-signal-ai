
import '@testing-library/jest-dom';
import React from 'react';
import { render } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import { describe, it, expect, vi } from 'vitest';
import Terms from '../pages/legal/Terms';
import Privacy from '../pages/legal/Privacy';
import Cookies from '../pages/legal/Cookies';

// Mock the translation hook
vi.mock('../hooks/useTranslationWithFallback', () => ({
  useTranslationWithFallback: () => ({
    t: (key: string) => {
      const translations: Record<string, string> = {
        'legal.terms.title': 'Terms and Conditions',
        'legal.terms.lastUpdated': 'Last updated: January 1, 2025',
        'legal.privacy.title': 'Privacy Policy',
        'legal.privacy.lastUpdated': 'Last updated: January 1, 2025',
        'legal.cookies.title': 'Cookie Policy',
        'legal.cookies.lastUpdated': 'Last updated: January 1, 2025',
        'legal.contact.title': 'Contact Information',
        'legal.footer': '© 2025 TradeIQ Pro — INGENIO FINANCIERO DIGITAL, S.A.P.I. DE C.V.',
      };
      return translations[key] || key;
    },
  }),
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
    it('renders terms page with title', () => {
      const { container } = renderWithRouter(<Terms />);
      const titleElement = container.querySelector('h1');
      expect(titleElement).toBeInTheDocument();
    });

    it('renders table of contents', () => {
      const { container } = renderWithRouter(<Terms />);
      const tocElement = container.querySelector('nav');
      expect(tocElement).toBeInTheDocument();
    });

    it('renders main content sections', () => {
      const { container } = renderWithRouter(<Terms />);
      const sections = container.querySelectorAll('section');
      expect(sections.length).toBeGreaterThan(0);
    });
  });

  describe('Privacy Page', () => {
    it('renders privacy page with title', () => {
      const { container } = renderWithRouter(<Privacy />);
      const titleElement = container.querySelector('h1');
      expect(titleElement).toBeInTheDocument();
    });

    it('renders table of contents', () => {
      const { container } = renderWithRouter(<Privacy />);
      const tocElement = container.querySelector('nav');
      expect(tocElement).toBeInTheDocument();
    });

    it('renders main content sections', () => {
      const { container } = renderWithRouter(<Privacy />);
      const sections = container.querySelectorAll('section');
      expect(sections.length).toBeGreaterThan(0);
    });
  });

  describe('Cookies Page', () => {
    it('renders cookies page with title', () => {
      const { container } = renderWithRouter(<Cookies />);
      const titleElement = container.querySelector('h1');
      expect(titleElement).toBeInTheDocument();
    });

    it('renders table of contents', () => {
      const { container } = renderWithRouter(<Cookies />);
      const tocElement = container.querySelector('nav');
      expect(tocElement).toBeInTheDocument();
    });

    it('renders main content sections', () => {
      const { container } = renderWithRouter(<Cookies />);
      const sections = container.querySelectorAll('section');
      expect(sections.length).toBeGreaterThan(0);
    });
  });
});
