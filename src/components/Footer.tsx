import React from 'react';

const Footer = () => {
  return (
    <footer className="border-t border-gray-800/50 bg-black/20 backdrop-blur-sm py-4 px-4">
      <div className="container mx-auto text-center">
        <p className="text-xs text-gray-400">
          TradeIQ Pro is the premium version of TradeIQ. For more resources, visit{' '}
          <a 
            href="https://www.tradeiqpro.com" 
            target="_blank" 
            rel="noopener noreferrer"
            className="text-tradeiq-blue hover:underline"
          >
            www.tradeiqpro.com
          </a>
        </p>
      </div>
    </footer>
  );
};

export default Footer;