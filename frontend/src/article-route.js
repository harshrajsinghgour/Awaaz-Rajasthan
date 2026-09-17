// Article URL bridge.
// Keeps the existing React article loader compatible while exposing
// shareable /news/<id> paths instead of hash-only article URLs.
(function setupArticleRoute() {
  const PREFIX = "/news/";
  const HASH_PREFIX = "#news-";
  const originalReplaceState = window.history.replaceState.bind(window.history);

  function idFromPath(pathname = window.location.pathname) {
    if (!pathname.startsWith(PREFIX)) return "";
    const value = pathname.slice(PREFIX.length).split("/")[0];
    return value ? decodeURIComponent(value) : "";
  }

  function pathForId(id) {
    return `${PREFIX}${encodeURIComponent(String(id))}`;
  }

  // AppProduction currently calls replaceState(..., `#news-${id}`) when an
  // article is opened. Translate that legacy call into a real /news/<id> URL.
  window.history.replaceState = function articleAwareReplaceState(state, title, url) {
    if (typeof url === "string" && url.startsWith(HASH_PREFIX)) {
      const id = decodeURIComponent(url.slice(HASH_PREFIX.length));
      if (id) {
        originalReplaceState(state, title, pathForId(id));
        return;
      }
    }
    originalReplaceState(state, title, url);
  };

  // On a direct /news/<id> visit, temporarily expose the legacy hash so the
  // existing React effect can open the article after the API/news list loads.
  // The hash is removed shortly after hydration, leaving the clean path visible.
  const initialId = idFromPath();
  if (initialId && !window.location.hash) {
    const cleanUrl = window.location.pathname + window.location.search;
    originalReplaceState(null, "", `${cleanUrl}${HASH_PREFIX}${encodeURIComponent(initialId)}`);
    window.setTimeout(() => {
      if (window.location.hash.startsWith(HASH_PREFIX)) {
        originalReplaceState(null, "", cleanUrl);
      }
    }, 1500);
  }
})();
