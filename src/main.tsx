import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App";
import "./index.css";
import { measurePerformance, setupPreconnections } from "./utils/performance";
import { AppProviders } from "@/providers/AppProviders";

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

ReactDOM.createRoot(rootElement).render(
  <React.StrictMode>
    <AppProviders>
      <App />
    </AppProviders>
  </React.StrictMode>
);

// Remove loader after React renders
setTimeout(removeInitialLoader, 100);
