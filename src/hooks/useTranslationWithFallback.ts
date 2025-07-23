import { useTranslation } from 'react-i18next';

// Comprehensive translation fallbacks mapping
const TRANSLATION_FALLBACKS: Record<string, string> = {
  // Common/Global
  'common.loading': 'Loading...',
  'common.error': 'Error',
  'common.success': 'Success',
  'common.save': 'Save',
  'common.cancel': 'Cancel',
  'common.continue': 'Continue',
  'common.back': 'Back',
  'common.retry': 'Retry',
  'common.comingSoon': 'Coming Soon',
  
  // Navigation
  'navigation.home': 'Home',
  'navigation.learn': 'Learn',
  'navigation.pricing': 'Pricing',
  'navigation.about': 'About',
  
  // Landing page
  'landing.hero.title': 'Master Trading with AI-Powered Insights',
  'landing.hero.subtitle': 'Transform your trading strategy with real-time market analysis, personalized AI recommendations, and comprehensive learning resources.',
  'landing.hero.joinBeta': 'Join Beta',
  'landing.hero.watchDemo': 'Watch Demo',
  'landing.hero.stats.accuracy': 'Prediction Accuracy',
  'landing.hero.stats.speed': 'AI Signal Speed',
  'landing.hero.stats.monitoring': 'Real-Time Monitoring',
  'landing.about.title': 'About TradeIQ',
  'landing.about.description': 'TradeIQ combines cutting-edge AI with comprehensive market analysis to help traders make informed decisions. Our platform provides real-time insights, personalized tools, and a thriving trading community.',
  'landing.navbar.home': 'Home',
  'landing.navbar.learnPreview': 'Learn',
  'landing.navbar.pricing': 'Pricing',
  'landing.navbar.login': 'Login',
  'landing.navbar.signUp': 'Sign Up',
  'landing.features.title': 'Powerful Features',
  'landing.features.patternDetection.title': 'Pattern Detection',
  'landing.features.patternDetection.description': 'AI-powered pattern recognition to identify profitable trading opportunities',
  'landing.features.trendAnalysis.title': 'Trend Analysis',
  'landing.features.trendAnalysis.description': 'Advanced trend analysis with real-time market sentiment indicators',
  'landing.features.volatilityHeatmaps.title': 'Volatility Heatmaps',
  'landing.features.volatilityHeatmaps.description': 'Visual volatility analysis to optimize entry and exit timing',
  'landing.features.aiInsights.title': 'AI Insights',
  'landing.features.aiInsights.description': 'Personalized AI recommendations based on your trading style',
  'landing.benefits.title': 'Why Choose TradeIQ?',
  'landing.benefits.reducedSubjectivity.title': 'Reduced Subjectivity',
  'landing.benefits.reducedSubjectivity.description': 'Remove emotional bias with data-driven AI analysis and objective market insights',
  'landing.benefits.fasterDecisions.title': 'Faster Decisions',
  'landing.benefits.fasterDecisions.description': 'Make quicker trading decisions with real-time AI processing and instant alerts',
  'landing.benefits.practicalEducation.title': 'Practical Education',
  'landing.benefits.practicalEducation.description': 'Learn through real market examples and AI-guided trading scenarios',
  'landing.benefits.higherPrecision.title': 'Higher Precision',
  'landing.benefits.higherPrecision.description': 'Improve your trading accuracy with advanced pattern recognition algorithms',
  'landing.learningSection.title': 'Master Trading with Our Learning Platform',
  'landing.learningSection.description': 'Access comprehensive courses, tutorials, and real-world examples to enhance your trading skills.',
  'landing.learningSection.fundamentals.title': 'Trading Fundamentals',
  'landing.learningSection.fundamentals.description': 'Learn the basics of market analysis, chart reading, and fundamental concepts',
  'landing.learningSection.patterns.title': 'Pattern Recognition',
  'landing.learningSection.patterns.description': 'Master technical patterns and learn to identify profitable trading setups',
  'landing.learningSection.riskManagement.title': 'Risk Management',
  'landing.learningSection.riskManagement.description': 'Develop proper risk management strategies to protect your capital',
  'landing.earlyAccess.title': 'Get Early Access',
  'landing.earlyAccess.subtitle': 'Be among the first to experience the future of AI-powered trading',
  'landing.earlyAccess.email': 'Email Address',
  'landing.earlyAccess.submit': 'Join Waitlist',
  'landing.earlyAccess.success': 'Thanks for joining! We\'ll be in touch soon.',
  
  // Dashboard
  'dashboard.welcomeBack': 'Welcome back',
  'dashboard.subtitle': 'Your AI-powered trading companion',
  'dashboard.quickActions': 'Quick Actions',
  'dashboard.recentActivity': 'Recent Activity',
  'dashboard.marketMonitoring': 'Market Monitoring',
  'dashboard.patternAccuracy': 'Pattern Accuracy',
  'dashboard.analysisSpeed': 'Analysis Speed',
  'dashboard.strategyAI.title': 'StrategyAI',
  'dashboard.strategyAI.description': 'AI-powered trading analysis and insights',
  'dashboard.learn.title': 'Learn',
  'dashboard.learn.description': 'Master trading skills with our educational resources',
  'dashboard.events.title': 'Economic Events',
  'dashboard.events.description': 'Track important market events and earnings',
  'dashboard.marketUpdates.title': 'Market Updates',
  'dashboard.marketUpdates.description': 'Real-time market data and analysis',
  'dashboard.plan.pro': 'Pro',
  'dashboard.plan.free': 'Free',
  
  // Learn section
  'learn.title': 'Learn',
  'learn.subtitle': 'Master Trading Skills',
  'learn.comingSoon': 'Coming Soon',
  
  // Settings
  'settings.title': 'Settings',
  'settings.subtitle': 'Manage your account and preferences',
  'settings.pro.title': 'Pro Features',
  'settings.pro.currentPlan': 'Current Plan',
  'settings.pro.proPlan': 'Pro Plan',
  'settings.pro.benefits': 'Benefits',
  'settings.pro.managedBy': 'Managed through Stripe',
  
  // Trading Chat
  'tradingChat.welcome': 'Welcome to StrategyAI! Upload a chart or ask me about trading strategies, market analysis, or any trading-related questions.',
  
  // Placeholders
  'placeholders.enterEmail': 'Enter your email',
  'placeholders.enterPassword': 'Enter your password',
  'placeholders.enterFullName': 'Enter your full name',
  'placeholders.confirmPassword': 'Confirm your password',
  
  // Pricing
  'pricing.getStarted': 'Get Started',
  'pricing.upgradeToPro': 'Upgrade to Pro',
  
  // Economic Events
  'economicEvents.title': 'Economic Events',
  'economicEvents.subtitle': 'High-impact macroeconomic events',
  'economicEvents.comingSoon': 'Coming Soon',
  'economicEvents.description': 'We\'re building a comprehensive economic calendar with high-impact events, earnings reports, and market-moving announcements.',
  
  // Market Updates
  'marketUpdates.title': 'Real-Time Market Updates',
  'marketUpdates.subtitle': 'Stay ahead of the market with real-time data, alerts, and AI-powered insights',
  'marketUpdates.comingSoon': 'Coming Soon',
  'marketUpdates.liveData.title': 'Live Market Data',
  'marketUpdates.liveData.description': 'Real-time price feeds and market movements across all major exchanges',
  'marketUpdates.smartAlerts.title': 'Smart Alerts',
  'marketUpdates.smartAlerts.description': 'AI-powered notifications for market opportunities and risk management'
};

export const useTranslationWithFallback = () => {
  const { t, i18n } = useTranslation();

  const tWithFallback = (key: string, options?: any): string => {
    try {
      // First try to get the translation
      const translation = t(key, options);
      const translationStr = typeof translation === 'string' ? translation : String(translation);
      
      // If translation returns the key itself (no translation found) or is empty, use fallback
      if ((translationStr === key || !translationStr || translationStr.trim() === '') && TRANSLATION_FALLBACKS[key]) {
        console.warn(`Translation missing for key: ${key}, using fallback`);
        return TRANSLATION_FALLBACKS[key];
      }
      
      // Ensure we always return a string
      return translationStr;
    } catch (error) {
      console.warn(`Translation error for key: ${key}`, error);
      // Return fallback if available, otherwise return the key as last resort
      return TRANSLATION_FALLBACKS[key] || key;
    }
  };

  return { 
    t: tWithFallback, 
    i18n,
    ready: i18n.isInitialized 
  };
};