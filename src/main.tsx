
import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App";
import "./index.css";
import { measurePerformance, setupPreconnections } from "./utils/performance";

// Set up preconnections and performance monitoring
setupPreconnections();
measurePerformance();

// Remove initial loader once React is ready
const removeInitialLoader = () => {
  const loader = document.querySelector('.initial-loader');
  if (loader) {
    loader.remove();
  }
};

// Validate root element exists
const rootElement = document.getElementById("root");
if (!rootElement) {
  throw new Error("Root element not found");
}

// Add error boundary for critical failures
const renderApp = () => {
  try {
    ReactDOM.createRoot(rootElement).render(
      <React.StrictMode>
        <App />
      </React.StrictMode>
    );
    
    // Remove loader after React renders
    setTimeout(removeInitialLoader, 100);
  } catch (error) {
    console.error('Critical app initialization error:', error);
    
    // Fallback error display
    rootElement.innerHTML = `
      <div style="
        min-height: 100vh; 
        background: #0a0f1c; 
        color: #fff; 
        display: flex; 
        align-items: center; 
        justify-content: center;
        font-family: system-ui, -apple-system, sans-serif;
      ">
        <div style="text-align: center; max-width: 500px; padding: 2rem;">
          <h1 style="color: #ef4444; margin-bottom: 1rem;">Application Error</h1>
          <p style="color: #94a3b8; margin-bottom: 1.5rem;">
            The application failed to load. Please check the console for details.
          </p>
          <button 
            onclick="window.location.reload()" 
            style="
              background: #3b82f6; 
              color: white; 
              border: none; 
              padding: 0.75rem 1.5rem; 
              border-radius: 0.5rem; 
              cursor: pointer;
            "
          >
            Reload Page
          </button>
        </div>
      </div>
    `;
    removeInitialLoader();
  }
};

renderApp();
