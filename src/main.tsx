
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

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);

// Remove loader after React renders
setTimeout(removeInitialLoader, 100);
