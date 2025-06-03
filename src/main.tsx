
import { createRoot } from 'react-dom/client'
import App from './App.tsx'
import './index.css'
import { RealTimePriceProvider } from '@/components/RealTimePriceProvider'

createRoot(document.getElementById("root")!).render(
  <RealTimePriceProvider>
    <App />
  </RealTimePriceProvider>
);
