import React, { Component, useEffect } from "react";
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
import "./premium-editorial.css";

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
class ProductionErrorBoundary extends Component {
  constructor(props) {
    super(props);
    this.state = { failed: false };
  }

  static getDerivedStateFromError() {
    return { failed: true };
  }

  componentDidCatch(error) {
    console.error("Awaaz Rajasthan frontend error:", error);
  }

  render() {
    if (!this.state.failed) return this.props.children;
    return (
      <main style={{
        minHeight: "100dvh",
        display: "grid",
        placeItems: "center",
        padding: "24px",
        background: "#f4f5f7"
      }}>
        <img
          src="/app-icon.svg"
          alt="आवाज़ राजस्थान"
          style={{ width: "min(58vw, 280px)", height: "auto", display: "block" }}
        />
      </main>
    )
  }
}

function AppBootstrap() {
  useEffect(() => {
    handlePwaShortcut();
  }, []);
  return <><App /><ProductionEnhancements /></>;
}
ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <ProductionErrorBoundary><AppBootstrap /></ProductionErrorBoundary>
  </React.StrictMode>
);
