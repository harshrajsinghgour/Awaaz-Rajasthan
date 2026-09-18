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
        background: "#f4f5f7",
        color: "#071525",
        fontFamily: '"Noto Sans Devanagari", system-ui, sans-serif',
        textAlign: "center"
      }}>
        <section style={{ maxWidth: 520 }}>
          <strong style={{ display: "block", fontSize: 24, marginBottom: 10 }}>आवाज़ राजस्थान</strong>
          <p style={{ margin: 0, lineHeight: 1.7 }}>वेबसाइट लोड करते समय एक समस्या आई। कृपया पेज को दोबारा खोलें।</p>
          <button
            type="button"
            onClick={() => window.location.reload()}
            style={{
              marginTop: 16,
              border: 0,
              borderRadius: 10,
              padding: "11px 18px",
              background: "#d71920",
              color: "#fff",
              fontWeight: 800
            }}
          >
            फिर कोशिश करें
          </button>
        </section>
      </main>
    );
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
