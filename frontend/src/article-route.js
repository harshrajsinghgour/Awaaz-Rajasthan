// Article URL bridge.
// Keeps the existing React article loader compatible while exposing
// shareable /news/<id> paths instead of hash-only article URLs.
(function setupArticleRoute() {
  const PREFIX = "/news/";
  const HASH_PREFIX = "#news-";
  const originalReplaceState = window.history.replaceState.bind(window.history);
  const originalPushState = window.history.pushState.bind(window.history);

  function idFromPath(pathname = window.location.pathname) {
    if (!pathname.startsWith(PREFIX)) return "";
    const value = pathname.slice(PREFIX.length).split("/")[0];
    try { return value ? decodeURIComponent(value) : ""; } catch { return value; }
  }

  function pathForId(id) {
    return `${PREFIX}${encodeURIComponent(String(id))}`;
  }

  function bridgeUrl(original, state, title, url) {
    if (typeof url === "string" && url.startsWith(HASH_PREFIX)) {
      const id = url.slice(HASH_PREFIX.length);
      if (id) {
        original(state, title, pathForId(decodeURIComponent(id)));
        return true;
      }
    }
    return false;
  }

  window.history.replaceState = function articleAwareReplaceState(state, title, url) {
    if (!bridgeUrl(originalReplaceState, state, title, url)) originalReplaceState(state, title, url);
  };

  window.history.pushState = function articleAwarePushState(state, title, url) {
    if (!bridgeUrl(originalPushState, state, title, url)) originalPushState(state, title, url);
  };

  const initialId = idFromPath();
  if (initialId && !window.location.hash) {
    const cleanUrl = window.location.pathname + window.location.search;
    originalReplaceState(null, "", `${cleanUrl}${HASH_PREFIX}${encodeURIComponent(initialId)}`);
    window.setTimeout(() => {
      if (window.location.pathname.startsWith(PREFIX) && window.location.hash.startsWith(HASH_PREFIX)) {
        originalReplaceState(null, "", cleanUrl);
      }
    }, 1800);
  }

  window.addEventListener("popstate", () => {
    const id = idFromPath();
    if (!id) return;
    const cleanUrl = window.location.pathname + window.location.search;
    if (!window.location.hash) originalReplaceState(null, "", `${cleanUrl}${HASH_PREFIX}${encodeURIComponent(id)}`);
  });
})();
