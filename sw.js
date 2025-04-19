const CACHE_NAME = "tenacity-cache-v1";
const urlsToCache = [
  "/Tenacity/",
  "/Tenacity/index.html",
  "/Tenacity/style.css",
  "/Tenacity/script.js",
  "/Tenacity/manifest.json",
  "/Tenacity/assets/icons/logo.png",
  "/Tenacity/fonts/Markazi-Regular.ttf",
  "/Tenacity/data/quotes.json"
];

self.addEventListener("install", (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => cache.addAll(urlsToCache))
  );
});

self.addEventListener("fetch", (event) => {
  event.respondWith(
    caches.match(event.request).then((resp) => {
      return resp || fetch(event.request);
    })
  );
});