import React, { useEffect } from "react";
import ReactDOM from "react-dom/client";
import "./article-route.js";
import "./seo-runtime.js";
import App from "./AppProduction";
import ProductionEnhancements from "./production-enhancements";
import "./index.css";
import "./production-polish.css";
import "./app-production.css";
import "./final-production-polish.css";
import "./production-completion.css";

function handlePwaShortcut() {
  const section = new URLSearchParams(window.location.search).get("section");
  if (!section) return;

  const run = () => {
    if (section === "search") {
      document.querySelector('[aria-label="खोजें"]')?.click();
    } else if (section === "saved") {
      const button = [...document.querySelectorAll(".mobile-bottom-nav button")]
        .find((node) => node.textContent?.includes("सेव"));
      button?.click();
    } else if (section === "latest") {
      const heading = [...document.querySelectorAll("h2")]
        .find((node) => node.textContent?.trim() === "ताज़ा खबरें");
      heading?.closest(".latest-section")?.scrollIntoView({ behavior: "smooth", block: "start" });
    }

    const cleanUrl = `${window.location.pathname}${window.location.hash}`;
    window.history.replaceState(null, "", cleanUrl);
  };

  window.setTimeout(run, 0);
}

if ("serviceWorker" in navigator && import.meta.env.PROD) {
  window.addEventListener("load", () => {
    navigator.serviceWorker.register("/sw.js").catch(() => {});
  });
}

function AppBootstrap() {
  useEffect(() => {
    handlePwaShortcut();
  }, []);

  return <><App /><ProductionEnhancements /></>;
}

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <AppBootstrap />
  </React.StrictMode>
);
