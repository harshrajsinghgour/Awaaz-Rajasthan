/*
 * Article URL bridge
 * Keeps the existing article renderer compatible while moving article views
 * from hash-only URLs to crawlable /news/<id> paths.
 */

const ARTICLE_PREFIX = "/news/";
const HASH_PREFIX = "#news-";

function pathId(pathname = window.location.pathname) {
  if (!pathname.startsWith(ARTICLE_PREFIX)) return "";
  const value = pathname.slice(ARTICLE_PREFIX.length).split("/")[0];
  return value ? decodeURIComponent(value) : "";
}

function pathForId(id) {
  return `${ARTICLE_PREFIX}${encodeURIComponent(String(id))}`;
}

const originalReplaceState = window.history.replaceState.bind(window.history);

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

// The current React article loader understands the legacy #news-<id> form.
// Add that hash only during the initial hydration, then remove it again after
// React has had a chance to open the article. The visible/canonical URL stays
// /news/<id>.
const initialId = pathId();
if (initialId && !window.location.hash) {
  const cleanPath = window.location.pathname + window.location.search;
  originalReplaceState(null, "", `${cleanPath}${HASH_PREFIX}${encodeURIComponent(initialId)}`);
  window.setTimeout(() => {
    if (window.location.hash.startsWith(HASH_PREFIX)) {
      originalReplaceState(null, "", cleanPath);
    }
  }, 1200);
}
