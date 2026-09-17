import React from "react";
import ReactDOM from "react-dom/client";
import "./article-route.js";
import "./seo-runtime.js";
import App from "./AppProduction";
import "./index.css";
import "./production-polish.css";
import "./app-production.css";

if ("serviceWorker" in navigator && import.meta.env.PROD) {
  window.addEventListener("load", () => {
    navigator.serviceWorker.register("/sw.js").catch(() => {});
  });
}

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);
