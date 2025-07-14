
import { Link, useLocation } from "react-router-dom";
import { Brain, Book, Settings, Calendar, Crown } from "lucide-react";
import { useTranslation } from 'react-i18next';

const BottomNavigation = () => {
  const location = useLocation();
  const { t } = useTranslation();

  const navItems = [
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
      path: "/events",
      icon: Calendar,
      label: "Events",
    },
    {
      path: "/pricing",
      icon: Crown,
      label: "Pricing",
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
          const isActive = location.pathname === item.path || (item.path === "/trading-chat" && location.pathname === "/");
          return (
            <Link
              key={item.path}
              to={item.path}
              className={`flex flex-col items-center space-y-1 px-3 py-2 rounded-lg transition-colors min-h-[60px] min-w-[60px] ${
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
