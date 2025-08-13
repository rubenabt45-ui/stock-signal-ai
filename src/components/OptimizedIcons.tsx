import { ComponentType } from 'react';

// Small placeholder for icon loading
const IconPlaceholder = ({ className }: { className?: string }) => (
  <div className={`w-4 h-4 bg-gray-400 rounded animate-pulse ${className}`} />
);

// For performance optimization, we'll keep critical icons loaded
// and only export the commonly used ones directly
export { 
  Menu,
  X,
  ChevronDown,
  ChevronRight,
  User,
  Settings,
  LogOut,
  Home,
  TrendingUp,
  BookOpen,
  Calendar,
  Heart,
  MessageSquare,
  Star
} from 'lucide-react';

// For non-critical icons, we can create a dynamic loader
export const createDynamicIcon = (iconName: string) => {
  // This will be a simple wrapper that imports the icon dynamically
  const DynamicIcon: ComponentType<{ className?: string; size?: number }> = (props) => {
    // For now, return placeholder - in production this would dynamically import
    return <IconPlaceholder className={props.className} />;
  };
  
  return DynamicIcon;
};
