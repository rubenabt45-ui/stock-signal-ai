
import { Helmet } from 'react-helmet-async';

interface SEOHeadProps {
  title?: string;
  description?: string;
  canonical?: string;
  image?: string;
  type?: 'website' | 'article';
}

export const SEOHead: React.FC<SEOHeadProps> = ({
  title = 'TradeIQ - AI-Powered Trading Platform',
  description = 'Advanced AI trading tools, market analysis, and educational resources for traders. Get real-time insights with StrategyAI, market updates, and comprehensive learning materials.',
  canonical,
  image = '/placeholder.svg',
  type = 'website'
}) => {
  const fullTitle = title.includes('TradeIQ') ? title : `${title} | TradeIQ`;
  const currentUrl = canonical || window.location.href;

  return (
    <Helmet>
      <title>{fullTitle}</title>
      <meta name="description" content={description} />
      <link rel="canonical" href={currentUrl} />
      
      {/* Open Graph */}
      <meta property="og:title" content={fullTitle} />
      <meta property="og:description" content={description} />
      <meta property="og:image" content={image} />
      <meta property="og:url" content={currentUrl} />
      <meta property="og:type" content={type} />
      <meta property="og:site_name" content="TradeIQ" />
      
      {/* Twitter Card */}
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:title" content={fullTitle} />
      <meta name="twitter:description" content={description} />
      <meta name="twitter:image" content={image} />
      
      {/* Additional SEO */}
      <meta name="robots" content="index, follow" />
      <meta name="viewport" content="width=device-width, initial-scale=1.0" />
      
      {/* Preconnect to external domains */}
      <link rel="preconnect" href="https://js.stripe.com" />
      <link rel="preconnect" href="https://fonts.googleapis.com" />
      <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="" />
    </Helmet>
  );
};
