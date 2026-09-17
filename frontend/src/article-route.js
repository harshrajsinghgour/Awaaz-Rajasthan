// Clean article URL bridge.
// Resolve /news/<slug> to the Mongo article id so the production React
// loader can open the correct article even when it is not in the first page.
const API_BASE = (import.meta.env.VITE_API_URL || import.meta.env.VITE_BACKEND_URL || "").replace(/\/$/, "");
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

async function resolveArticleId(value) {
  if (!API_BASE || !value) return value;
  try {
    const response = await fetch(`${API_BASE}/api/news/${encodeURIComponent(value)}`, {
      headers: { Accept: "application/json" }
    });
    if (!response.ok) return value;
    const data = await response.json();
    const item = data?.news || data?.data || data?.article || data;
    return String(item?._id || item?.id || value);
  } catch {
    return value;
  }
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

async function bootstrapArticlePath() {
  const initialValue = idFromPath();
  if (!initialValue || window.location.hash) return;

  const cleanUrl = window.location.pathname + window.location.search;
  const resolvedId = await resolveArticleId(initialValue);
  originalReplaceState(null, "", `${cleanUrl}${HASH_PREFIX}${encodeURIComponent(resolvedId)}`);

  let attempts = 0;
  const timer = window.setInterval(() => {
    attempts += 1;
    const mounted = document.querySelector(".article-modal");
    const stillOnArticle = window.location.pathname.startsWith(PREFIX);
    if (!stillOnArticle || mounted || attempts >= 40) {
      window.clearInterval(timer);
      if (stillOnArticle && window.location.hash.startsWith(HASH_PREFIX)) {
        originalReplaceState(null, "", cleanUrl);
      }
    }
  }, 100);
}

bootstrapArticlePath();

window.addEventListener("popstate", async () => {
  const value = idFromPath();
  if (!value || window.location.hash) return;
  const cleanUrl = window.location.pathname + window.location.search;
  const resolvedId = await resolveArticleId(value);
  originalReplaceState(null, "", `${cleanUrl}${HASH_PREFIX}${encodeURIComponent(resolvedId)}`);
});
