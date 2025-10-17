
import { Link, useLocation } from "react-router-dom";
import { Brain, Book, Settings, Newspaper, LayoutDashboard } from "lucide-react";
import { useTranslation } from 'react-i18next';
import chartIcon from "@/assets/chart-icon.png";

const BottomNavigation = () => {
  const location = useLocation();
  const { t } = useTranslation();

  const navItems = [
    {
      path: "/app/dashboard",
      icon: LayoutDashboard,
      label: "Dashboard",
    },
    {
      path: "/app/strategy-ai",
      icon: Brain,
      label: "Chat",
    },
    {
      path: "/app/learn",
      icon: Book,
      label: t('navigation.learn'),
    },
    {
      path: "/app/chartia",
      icon: Brain,
      label: "Chart",
    },
    {
      path: "/blog",
      icon: Newspaper,
      label: "News",
    },
    {
      path: "/app/settings",
      icon: Settings,
      label: t('navigation.settings'),
    },
  ];

  return (
    <nav className="fixed bottom-0 left-0 right-0 bg-black/90 backdrop-blur-sm border-t border-gray-800/50 z-50 safe-area-inset-bottom">
      <div className="flex justify-around items-center py-2 px-1">
        {navItems.map((item) => {
          const isActive = location.pathname === item.path || 
            (item.path === "/app/chartia" && (location.pathname === "/app" || location.pathname === "/app/")) ||
            (item.path === "/app/strategy-ai" && location.pathname === "/app/trading-chat");
          return (
            <Link
              key={item.path}
              to={item.path}
              className={`flex flex-col items-center space-y-1 px-2 sm:px-3 py-2 rounded-lg transition-colors min-h-[60px] min-w-[60px] flex-1 max-w-[80px] ${
                isActive
                  ? "text-tradeiq-blue bg-tradeiq-blue/10"
                  : "text-gray-400 hover:text-gray-300"
              }`}
            >
              {item.path === "/app/chartia" ? (
                <img 
                  src={chartIcon} 
                  alt="Chart" 
                  className="h-4 w-4 sm:h-5 sm:w-5"
                  style={{
                    filter: isActive 
                      ? 'brightness(0) saturate(100%) invert(55%) sepia(95%) saturate(2426%) hue-rotate(188deg) brightness(103%) contrast(101%)'
                      : 'brightness(0) saturate(100%) invert(60%) sepia(0%) saturate(0%) hue-rotate(0deg) brightness(95%) contrast(90%)'
                  }}
                />
              ) : (
                <item.icon className="h-4 w-4 sm:h-5 sm:w-5" />
              )}
              <span className="text-xs font-medium text-center leading-tight">{item.label}</span>
            </Link>
          );
        })}
      </div>
    </nav>
  );
};

export default BottomNavigation;
