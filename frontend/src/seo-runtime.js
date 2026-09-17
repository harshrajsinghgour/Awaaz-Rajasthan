// Dynamic SEO layer for the existing article renderer.
// It watches the rendered article modal and adds article-specific canonical,
// Open Graph, Twitter and NewsArticle metadata without replacing the UI.
(function setupRuntimeSeo() {
  const ORIGIN = window.location.origin;
  const DEFAULT_TITLE = "आवाज़ राजस्थान | Rajasthan News";
  const DEFAULT_DESCRIPTION = "आवाज़ राजस्थान — राजस्थान की ताज़ा, स्थानीय और भरोसेमंद खबरें।";
  const SCRIPT_ID = "awaaz-article-jsonld";

  const clean = value => String(value || "").replace(/\s+/g, " ").trim();
  const escapeText = value => clean(value).slice(0, 500);

  function setMeta(key, value, property = false) {
    if (!value) return;
    const attr = property ? "property" : "name";
    let el = document.head.querySelector(`meta[${attr}="${key}"]`);
    if (!el) { el = document.createElement("meta"); el.setAttribute(attr, key); document.head.appendChild(el); }
    el.setAttribute("content", value);
  }

  function setCanonical(href) {
    let el = document.head.querySelector('link[rel="canonical"]');
    if (!el) { el = document.createElement("link"); el.rel = "canonical"; document.head.appendChild(el); }
    el.href = href;
  }

  function removeArticleData() {
    document.getElementById(SCRIPT_ID)?.remove();
    document.title = DEFAULT_TITLE;
    setMeta("description", DEFAULT_DESCRIPTION);
    setMeta("og:title", DEFAULT_TITLE, true);
    setMeta("og:description", DEFAULT_DESCRIPTION, true);
    setMeta("og:type", "website", true);
    setMeta("twitter:title", DEFAULT_TITLE);
    setMeta("twitter:description", DEFAULT_DESCRIPTION);
    setCanonical(`${ORIGIN}/`);
  }

  function build() {
    const modal = document.querySelector(".article-modal");
    if (!modal) { removeArticleData(); return; }
    const title = clean(modal.querySelector("h1")?.textContent);
    if (!title) return;
    const description = escapeText(modal.querySelector(".article-lead")?.textContent || modal.querySelector(".article-body p")?.textContent || DEFAULT_DESCRIPTION);
    const image = modal.querySelector(".article-cover")?.getAttribute("src");
    const path = window.location.pathname.startsWith("/news/") ? window.location.pathname : `${window.location.pathname}`;
    const canonical = `${ORIGIN}${path}`;
    const byline = clean(modal.querySelector(".article-byline span")?.textContent) || "आवाज़ राजस्थान";

    document.title = `${title} | आवाज़ राजस्थान`;
    setMeta("description", description);
    setMeta("og:title", title, true);
    setMeta("og:description", description, true);
    setMeta("og:type", "article", true);
    setMeta("og:url", canonical, true);
    setMeta("twitter:title", title);
    setMeta("twitter:description", description);
    if (image) {
      setMeta("og:image", new URL(image, ORIGIN).href, true);
      setMeta("twitter:image", new URL(image, ORIGIN).href);
    }
    setCanonical(canonical);

    let script = document.getElementById(SCRIPT_ID);
    if (!script) { script = document.createElement("script"); script.id = SCRIPT_ID; script.type = "application/ld+json"; document.head.appendChild(script); }
    script.textContent = JSON.stringify({
      "@context": "https://schema.org",
      "@type": "NewsArticle",
      "headline": title,
      "description": description,
      "inLanguage": "hi-IN",
      "mainEntityOfPage": { "@type": "WebPage", "@id": canonical },
      "author": { "@type": "Person", "name": byline },
      "publisher": { "@type": "NewsMediaOrganization", "name": "आवाज़ राजस्थान", "logo": { "@type": "ImageObject", "url": `${ORIGIN}/og-default.svg` } },
      ...(image ? { "image": [new URL(image, ORIGIN).href] } : {})
    });
  }

  let scheduled = false;
  function schedule() {
    if (scheduled) return;
    scheduled = true;
    requestAnimationFrame(() => { scheduled = false; build(); });
  }

  new MutationObserver(schedule).observe(document.body, { childList: true, subtree: true, attributes: true, attributeFilter: ["src"] });
  window.addEventListener("popstate", schedule);
  window.addEventListener("hashchange", schedule);
  schedule();
})();
