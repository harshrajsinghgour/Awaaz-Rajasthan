const CACHE = "awaaz-rajasthan-v7";
const APP_SHELL = ["/", "/index.html", "/news-placeholder.svg", "/manifest.webmanifest"];

function safeNotificationUrl(value) {
  const fallback = "/";
  if (typeof value !== "string" || !value.trim()) return fallback;
  try {
    const url = new URL(value, self.location.origin);
    if (url.origin !== self.location.origin) return fallback;
    if (url.pathname === "/admin" || url.pathname.startsWith("/admin/") || url.pathname.startsWith("/api/")) return fallback;
    return `${url.pathname}${url.search}${url.hash}`;
  } catch {
    return fallback;
  }
}

self.addEventListener("install", (event) => {
  event.waitUntil(
    caches.open(CACHE)
      .then((cache) => cache.addAll(APP_SHELL))
      .then(() => self.skipWaiting())
  );
});

self.addEventListener("activate", (event) => {
  event.waitUntil(
    caches.keys()
      .then((keys) => Promise.all(
        keys.filter((key) => key.startsWith("awaaz-rajasthan-") && key !== CACHE).map((key) => caches.delete(key))
      ))
      .then(() => self.clients.claim())
  );
});

self.addEventListener("fetch", (event) => {
  if (event.request.method !== "GET") return;
  const url = new URL(event.request.url);
  if (url.origin !== self.location.origin) return;
  if (url.pathname === "/admin" || url.pathname.startsWith("/admin/") || url.pathname.startsWith("/api/")) return;

  event.respondWith(
    fetch(event.request)
      .then((response) => {
        if (!response || !response.ok) return response;
        if (event.request.mode === "navigate") {
          const copy = response.clone();
          caches.open(CACHE).then((cache) => cache.put("/index.html", copy)).catch(() => {});
        } else if (url.pathname.startsWith("/assets/") || url.pathname.endsWith(".css") || url.pathname.endsWith(".js") || url.pathname.endsWith(".svg")) {
          const copy = response.clone();
          caches.open(CACHE).then((cache) => cache.put(event.request, copy)).catch(() => {});
        }
        return response;
      })
      .catch(() => caches.match(event.request).then((cached) => {
        if (cached) return cached;
        if (event.request.mode === "navigate") return caches.match("/index.html");
        return new Response("Offline", { status: 503, statusText: "Offline" });
      }))
  );
});

self.addEventListener("push", (event) => {
  let data = {};
  try {
    data = event.data ? event.data.json() : {};
  } catch {
    data = { title: event.data?.text() };
  }

  event.waitUntil(
    self.registration.showNotification(data.title || "आवाज़ राजस्थान", {
      body: data.body || "नई खबर उपलब्ध है।",
      icon: data.icon || "/news-placeholder.svg",
      badge: data.badge || "/news-placeholder.svg",
      tag: data.tag || "awaaz-rajasthan-news",
      renotify: Boolean(data.renotify),
      data: { url: safeNotificationUrl(data.url) },
      vibrate: [100, 50, 100]
    })
  );
});

self.addEventListener("notificationclick", (event) => {
  event.notification.close();
  const target = safeNotificationUrl(event.notification.data?.url);
  event.waitUntil(
    clients.matchAll({ type: "window", includeUncontrolled: true })
      .then((list) => {
        for (const client of list) {
          if ("focus" in client && "navigate" in client) {
            return client.navigate(target).then(() => client.focus());
          }
        }
        return clients.openWindow(target);
      })
  );
});
