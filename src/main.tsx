
import { createRoot } from 'react-dom/client'
import './index.css'
import './i18n/config'
import { logPerformanceMetrics } from './utils/performanceMetrics'

// Lazy load the main App component
const App = React.lazy(() => import('./App'));

// Initialize theme early to prevent flash
const initializeTheme = () => {
  const savedTheme = localStorage.getItem('theme') || 'dark';
  const root = document.documentElement;
  
  if (savedTheme === 'system') {
    const systemDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
    if (systemDark) {
      root.classList.add('dark');
      root.classList.remove('light');
    } else {
      root.classList.add('light');
      root.classList.remove('dark');
    }
  } else if (savedTheme === 'light') {
    root.classList.add('light');
    root.classList.remove('dark');
  } else {
    root.classList.add('dark');
    root.classList.remove('light');
  }
};

// Apply theme immediately
initializeTheme();

// Log performance metrics in production
logPerformanceMetrics();

const rootElement = document.getElementById("root");
if (!rootElement) throw new Error('Failed to find the root element');

createRoot(rootElement).render(
  <React.Suspense fallback={
    <div className="min-h-screen bg-background text-foreground flex items-center justify-center">
      <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
    </div>
  }>
    <App />
  </React.Suspense>
);
