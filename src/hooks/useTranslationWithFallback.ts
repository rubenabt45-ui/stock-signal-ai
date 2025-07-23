import { useTranslation } from 'react-i18next';

// Translation fallbacks mapping
const TRANSLATION_FALLBACKS: Record<string, string> = {
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
  'landing.earlyAccess.success': 'Thanks for joining! We\'ll be in touch soon.'
};

export const useTranslationWithFallback = () => {
  const { t, i18n } = useTranslation();

  const tWithFallback = (key: string, options?: any): string => {
    try {
      const translation = t(key, options);
      
      // If translation returns the key itself (no translation found), use fallback
      if (translation === key && TRANSLATION_FALLBACKS[key]) {
        console.warn(`Translation missing for key: ${key}, using fallback`);
        return TRANSLATION_FALLBACKS[key];
      }
      
      // Ensure we always return a string
      return typeof translation === 'string' ? translation : String(translation);
    } catch (error) {
      console.warn(`Translation error for key: ${key}`, error);
      return TRANSLATION_FALLBACKS[key] || key;
    }
  };

  return { 
    t: tWithFallback, 
    i18n,
    ready: i18n.isInitialized 
  };
};