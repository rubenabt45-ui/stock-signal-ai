import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Home, BarChart3, Star, Settings, User, LogOut, Brain } from 'lucide-react';
import { Link, useLocation } from 'react-router-dom';
import { useAuth } from '@/contexts/auth/auth.provider';

interface MobileMenuProps {
  isOpen: boolean;
  onClose: () => void;
}

export const MobileMenu: React.FC<MobileMenuProps> = ({ isOpen, onClose }) => {
  const { user, logout } = useAuth();
  const location = useLocation();

  const menuItems = [
    { path: '/app', label: 'Dashboard', icon: Home },
    { path: '/app/trading-chat', label: 'StrategyAI', icon: Brain },
    { path: '/app/favorites', label: 'Favorites', icon: Star },
    { path: '/app/settings', label: 'Settings', icon: Settings },
  ];

  const handleLogout = async () => {
    await logout();
    onClose();
  };

  const itemVariants = {
    hidden: { opacity: 0, y: -20 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.3 } },
    exit: { opacity: 0, y: -20, transition: { duration: 0.3 } },
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          className="fixed inset-0 z-50 bg-black/80 backdrop-blur-md flex justify-center items-center"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.3 }}
          onClick={onClose}
        >
          <motion.div
            className="relative bg-gray-900 rounded-2xl shadow-lg overflow-hidden w-full max-w-md mx-4"
            onClick={(e) => e.stopPropagation()}
            initial={{ scale: 0.9 }}
            animate={{ scale: 1 }}
            exit={{ scale: 0.9 }}
            transition={{ duration: 0.3 }}
          >
            {/* Close Button */}
            <button
              onClick={onClose}
              className="absolute top-4 right-4 text-gray-500 hover:text-white transition-colors duration-200"
            >
              <X className="h-6 w-6" />
            </button>

            {/* Menu Content */}
            <div className="p-6 flex flex-col items-center space-y-4">
              {/* User Info */}
              {user && (
                <div className="flex items-center space-x-3">
                  <User className="h-8 w-8 text-gray-400" />
                  <div>
                    <p className="text-white font-semibold">{user.email}</p>
                    <p className="text-gray-400 text-sm">TradeIQ Member</p>
                  </div>
                </div>
              )}

              {/* Menu Items */}
              <nav className="w-full">
                <ul className="space-y-2">
                  {menuItems.map((item) => (
                    <motion.li
                      key={item.path}
                      variants={itemVariants}
                      className="rounded-xl"
                      whileHover={{ backgroundColor: 'rgba(255, 255, 255, 0.05)' }}
                      exit={{ opacity: 0, y: -20, transition: { duration: 0.3 } }}
                    >
                      <Link
                        to={item.path}
                        className={`flex items-center space-x-3 p-3 text-gray-300 ${
                          location.pathname === item.path ? 'text-tradeiq-blue' : ''
                        }`}
                        onClick={onClose}
                      >
                        <item.icon className="h-5 w-5" />
                        <span>{item.label}</span>
                      </Link>
                    </motion.li>
                  ))}
                </ul>
              </nav>

              {/* Logout Button */}
              {user && (
                <motion.button
                  onClick={handleLogout}
                  className="w-full flex items-center justify-center space-x-3 bg-red-600 hover:bg-red-700 text-white rounded-xl p-3 transition-colors duration-200"
                  variants={itemVariants}
                  exit={{ opacity: 0, y: -20, transition: { duration: 0.3 } }}
                >
                  <LogOut className="h-5 w-5" />
                  <span>Logout</span>
                </motion.button>
              )}
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};
