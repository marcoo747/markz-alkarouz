const CACHE_NAME = "markz-alkarooz-cache-v2";
const urlsToCache = [
  "/manifest.json",
  "/icons/icon512_maskable.png",
  "/icons/icon512_rounded.png"
];

// Install event → cache static PWA assets only (never dynamic CSRF HTML)
self.addEventListener("install", event => {
  event.waitUntil(
    caches.open(CACHE_NAME).then(cache => {
      return cache.addAll(urlsToCache);
    })
  );
  self.skipWaiting();
});

// Activate event → cleanup old caches
self.addEventListener("activate", event => {
  event.waitUntil(
    caches.keys().then(keys =>
      Promise.all(
        keys.filter(key => key !== CACHE_NAME).map(key => caches.delete(key))
      )
    )
  );
  self.clients.claim();
});

// Fetch event → only serve pre-cached static manifest/icons from cache; pass dynamic requests to network
self.addEventListener("fetch", event => {
  if (event.request.method !== "GET") return;
  const url = new URL(event.request.url);
  if (!urlsToCache.includes(url.pathname)) return;

  event.respondWith(
    caches.match(event.request).then(response => {
      return response || fetch(event.request);
    })
  );
});
