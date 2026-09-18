import React, { Component, useEffect } from "react";
import ReactDOM from "react-dom/client";
import "./article-route.js";
import "./seo-runtime.js";
import App from "./AppProduction";
import LegacyApp from "./App";
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
    navigator.serviceWorker.register("/sw.js").then((registration) => {
      registration.update().catch(() => {});
    }).catch(() => {});
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
    // Keep the public site usable even if a production-only enhancement crashes.
    // The legacy renderer is maintained in-repo and provides the same news API
    // and core reading flows while the failing production component is isolated.
    return <LegacyApp />;
    /*
      <main style={{
        minHeight: "100dvh",
        display: "grid",
        placeItems: "center",
        padding: "24px",
        background: "#f4f5f7"
      }}>
        <section style={{
          width: "min(92vw, 420px)",
          textAlign: "center",
          background: "#fff",
          borderRadius: "24px",
          padding: "30px 22px",
          boxShadow: "0 16px 45px rgba(7,17,31,.12)"
        }}>
          <img
            src="/awaazrajasthan-logo.png"
            alt="आवाज़ राजस्थान"
            style={{ width: "min(58vw, 250px)", height: "auto", display: "block", margin: "0 auto 18px" }}
          />
          <h1 style={{ margin: "0 0 8px", color: "#07111f", fontSize: "25px" }}>आवाज़ राजस्थान</h1>
          <p style={{ margin: "0 0 18px", color: "#687282", lineHeight: 1.6 }}>वेबसाइट लोड करते समय एक समस्या आई। कृपया पेज को दोबारा खोलें।</p>
          <button
            type="button"
            onClick={() => window.location.reload()}
            style={{
              border: 0,
              borderRadius: "10px",
              background: "#d71920",
              color: "#fff",
              padding: "11px 20px",
              fontWeight: 800,
              cursor: "pointer"
            }}
          >फिर कोशिश करें</button>
        </section>
      </main>
    )*/
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
