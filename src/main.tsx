
import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App";
import "./index.css";

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
    <App />
  </React.StrictMode>
);

// Remove loader after React renders
setTimeout(removeInitialLoader, 100);
