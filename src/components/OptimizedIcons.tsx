import { lazy, Suspense, ComponentType } from 'react';

// Lazy load icon sets only when needed to reduce initial bundle
const LucideReactIcons = lazy(() => import('lucide-react'));

// Small placeholder for icon loading
const IconPlaceholder = ({ className }: { className?: string }) => (
  <div className={`w-4 h-4 bg-gray-400 rounded animate-pulse ${className}`} />
);

// HOC for lazy icon loading
export const createLazyIcon = (iconName: string): ComponentType<{ className?: string }> => {
  return (props) => (
    <Suspense fallback={<IconPlaceholder className={props.className} />}>
      <LucideReactIcons.then(icons => {
        const Icon = (icons as any)[iconName];
        return Icon ? <Icon {...props} /> : <IconPlaceholder {...props} />;
      })} />
    </Suspense>
  );
};

// Export commonly used icons (keep these loaded for critical UI)
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
