
import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';

declare global {
  interface Window {
    gtag?: (...args: any[]) => void;
    plausible?: (...args: any[]) => void;
  }
}

export const Analytics: React.FC = () => {
  const location = useLocation();
  const analyticsId = import.meta.env.VITE_ANALYTICS_ID;
  const analyticsProvider = import.meta.env.VITE_ANALYTICS_PROVIDER || 'gtag'; // 'gtag' or 'plausible'
  
  useEffect(() => {
    // Only track in production and when analytics ID is configured
    if (!import.meta.env.PROD || !analyticsId) {
      return;
    }

    // Track page views
    if (analyticsProvider === 'plausible' && window.plausible) {
      window.plausible('pageview');
    } else if (analyticsProvider === 'gtag' && window.gtag) {
      window.gtag('config', analyticsId, {
        page_path: location.pathname + location.search,
      });
    }
  }, [location, analyticsId, analyticsProvider]);

  // Load analytics script only in production
  useEffect(() => {
    if (!import.meta.env.PROD || !analyticsId) {
      return;
    }

    if (analyticsProvider === 'gtag') {
      // Google Analytics
      const script = document.createElement('script');
      script.async = true;
      script.src = `https://www.googletagmanager.com/gtag/js?id=${analyticsId}`;
      document.head.appendChild(script);

      window.gtag = window.gtag || function(...args) {
        (window.gtag as any).dataLayer = (window.gtag as any).dataLayer || [];
        (window.gtag as any).dataLayer.push(arguments);
      };
      
      window.gtag('js', new Date());
      window.gtag('config', analyticsId, {
        send_page_view: false // We handle page views manually
      });
    } else if (analyticsProvider === 'plausible') {
      // Plausible Analytics
      const script = document.createElement('script');
      script.defer = true;
      script.src = 'https://plausible.io/js/plausible.js';
      script.setAttribute('data-domain', window.location.hostname);
      document.head.appendChild(script);
    }
  }, [analyticsId, analyticsProvider]);

  return null;
};

// Analytics event tracking helpers
export const trackEvent = (eventName: string, parameters?: Record<string, any>) => {
  if (!import.meta.env.PROD) {
    console.log('📊 Analytics Event:', eventName, parameters);
    return;
  }

  const analyticsProvider = import.meta.env.VITE_ANALYTICS_PROVIDER || 'gtag';

  if (analyticsProvider === 'plausible' && window.plausible) {
    window.plausible(eventName, { props: parameters });
  } else if (analyticsProvider === 'gtag' && window.gtag) {
    window.gtag('event', eventName, parameters);
  }
};

export const trackUpgrade = () => {
  trackEvent('upgrade_initiated', {
    event_category: 'subscription',
    event_label: 'pro_upgrade'
  });
};

export const trackDowngrade = () => {
  trackEvent('subscription_cancelled', {
    event_category: 'subscription',
    event_label: 'pro_downgrade'
  });
};
