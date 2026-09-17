import { useEffect } from "react";

const LIVE_TV_URL = import.meta.env.VITE_LIVE_TV_URL || "";

function scrollToElement(selector) {
  document.querySelector(selector)?.scrollIntoView({ behavior: "smooth", block: "start" });
}

function syncMobileNavigation() {
  const nav = document.querySelector(".mobile-bottom-nav");
  if (!nav) return;
  const buttons = [...nav.querySelectorAll("button")];
  if (buttons.length < 5) return;

  const setLabel = (button, label, aria) => {
    const span = button.querySelector("span");
    if (span) span.textContent = label;
    button.setAttribute("aria-label", aria);
  };

  setLabel(buttons[1], "खबरें", "ताज़ा खबरें खोलें");
  setLabel(buttons[2], "जिले", "जिलेवार खबरें खोलें");
  setLabel(buttons[3], "लाइव", "लाइव न्यूज़ खोलें");
  setLabel(buttons[4], "और", "और विकल्प खोलें");

  if (!buttons[1].dataset.productionBound) {
    buttons[1].dataset.productionBound = "1";
    buttons[1].addEventListener("click", () => {
      const target = [...document.querySelectorAll(".category-nav button")]
        .find((node) => node.textContent?.includes("राजस्थान"));
      target?.click();
      scrollToElement(".latest-section");
    });
  }
  if (!buttons[2].dataset.productionBound) {
    buttons[2].dataset.productionBound = "1";
    buttons[2].addEventListener("click", () => scrollToElement(".district-section"));
  }
  if (!buttons[3].dataset.productionBound) {
    buttons[3].dataset.productionBound = "1";
    buttons[3].addEventListener("click", () => scrollToElement(".live-hub"));
  }
}

function renderLiveHub() {
  const main = document.querySelector("main#main-content");
  if (!main) return;

  const tickerButtons = [...document.querySelectorAll(".ticker-track button")].slice(0, 6);
  let hub = main.querySelector(".live-hub");
  if (!hub) {
    hub = document.createElement("section");
    hub.className = "live-hub";
    const district = main.querySelector(".district-section");
    if (district) main.insertBefore(hub, district);
    else main.appendChild(hub);
  }

  const existingKey = hub.dataset.key || "";
  const key = `${LIVE_TV_URL}|${tickerButtons.map((node) => node.textContent).join("|")}`;
  if (existingKey === key) return;
  hub.dataset.key = key;

  hub.innerHTML = "";
  const header = document.createElement("div");
  header.className = "live-hub-head";
  header.innerHTML = `<div><span class="section-label">LIVE DESK</span><h2>लाइव न्यूज़</h2><p>ब्रेकिंग अपडेट्स और लाइव कवरेज एक ही जगह।</p></div><span class="live-status"><i></i> LIVE</span>`;
  hub.appendChild(header);

  const grid = document.createElement("div");
  grid.className = "live-hub-grid";

  if (LIVE_TV_URL) {
    const tv = document.createElement("a");
    tv.className = "live-tv-card";
    tv.href = LIVE_TV_URL;
    tv.target = "_blank";
    tv.rel = "noopener noreferrer";
    tv.innerHTML = `<div class="live-tv-art"><span>▶</span></div><div><b>आवाज़ राजस्थान LIVE TV</b><small>लाइव कवरेज देखें</small></div>`;
    grid.appendChild(tv);
  }

  tickerButtons.forEach((source, index) => {
    const card = document.createElement("button");
    card.className = "live-news-card";
    card.type = "button";
    card.innerHTML = `<span class="live-dot">LIVE</span><strong>${source.textContent || "ताज़ा अपडेट"}</strong><small>ब्रेकिंग अपडेट ${index + 1}</small>`;
    card.addEventListener("click", () => source.click());
    grid.appendChild(card);
  });

  if (!grid.children.length) {
    const empty = document.createElement("div");
    empty.className = "live-empty";
    empty.textContent = "अभी कोई लाइव अपडेट उपलब्ध नहीं है।";
    grid.appendChild(empty);
  }

  hub.appendChild(grid);
}

function enhance() {
  syncMobileNavigation();
  renderLiveHub();
}

export default function ProductionEnhancements() {
  useEffect(() => {
    enhance();
    const observer = new MutationObserver(() => {
      window.requestAnimationFrame(enhance);
    });
    observer.observe(document.body, { childList: true, subtree: true });
    return () => observer.disconnect();
  }, []);

  return null;
}
