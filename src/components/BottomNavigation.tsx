
import { Link, useLocation } from "react-router-dom";
import { ChartCandlestick, Brain, Book, Settings, Newspaper } from "lucide-react";
import { useTranslation } from 'react-i18next';

const BottomNavigation = () => {
  const location = useLocation();
  const { t } = useTranslation();

  const navItems = [
    {
      path: "/",
      icon: ChartCandlestick,
      label: t('navigation.chartIA'),
    },
    {
      path: "/trading-chat",
      icon: Brain,
      label: "StrategyAI",
    },
    {
      path: "/learn",
      icon: Book,
      label: t('navigation.learn'),
    },
    {
      path: "/news-ai",
      icon: Newspaper,
      label: t('navigation.newsAI'),
    },
    {
      path: "/settings",
      icon: Settings,
      label: t('navigation.settings'),
    },
  ];

  return (
    <nav className="fixed bottom-0 left-0 right-0 bg-black/90 backdrop-blur-sm border-t border-gray-800/50 z-50">
      <div className="flex justify-around items-center py-2">
        {navItems.map((item) => {
          const isActive = location.pathname === item.path;
          return (
            <Link
              key={item.path}
              to={item.path}
              className={`flex flex-col items-center space-y-1 px-3 py-2 rounded-lg transition-colors ${
                isActive
                  ? "text-tradeiq-blue bg-tradeiq-blue/10"
                  : "text-gray-400 hover:text-gray-300"
              }`}
            >
              <item.icon className="h-5 w-5" />
              <span className="text-xs font-medium">{item.label}</span>
            </Link>
          );
        })}
      </div>
    </nav>
  );
};

export default BottomNavigation;
