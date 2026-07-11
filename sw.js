// Gérak service worker — network-first with offline fallback
const CACHE = "gerak-v1";

self.addEventListener("install", (e) => {
  self.skipWaiting();
});

self.addEventListener("activate", (e) => {
  e.waitUntil(self.clients.claim());
});

self.addEventListener("fetch", (e) => {
  // Only handle GET requests
  if (e.request.method !== "GET") return;
  e.respondWith(
    fetch(e.request)
      .then((res) => {
        // Cache a copy of successful responses
        const copy = res.clone();
        caches.open(CACHE).then((c) => {
          try { c.put(e.request, copy); } catch (_) {}
        });
        return res;
      })
      .catch(() => caches.match(e.request))
  );
});
