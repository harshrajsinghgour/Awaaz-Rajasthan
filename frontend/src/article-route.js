// Lightweight client-side article route bridge.
// AppProduction currently opens articles from #news-<id>. This bridge also
// supports shareable /news/<id> URLs without replacing the existing UI flow.
(function setupArticleRoute() {
  const match = window.location.pathname.match(/^\/news\/([^/]+)\/?$/);
  if (match && !window.location.hash) {
    const id = decodeURIComponent(match[1]);
    window.history.replaceState(null, "", `${window.location.pathname}#news-${encodeURIComponent(id)}`);
  }

  window.addEventListener("hashchange", () => {
    if (!window.location.pathname.startsWith("/news/") && window.location.hash.startsWith("#news-")) {
      const id = window.location.hash.slice(6);
      window.history.replaceState(null, "", `/news/${id}${window.location.hash}`);
    }
  });
})();
