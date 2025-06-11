
import { createRoot } from 'react-dom/client'
import App from './App.tsx'
import './index.css'
import { RealTimePriceProvider } from '@/components/RealTimePriceProvider'

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

createRoot(document.getElementById("root")!).render(
  <RealTimePriceProvider>
    <App />
  </RealTimePriceProvider>
);
