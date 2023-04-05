// This code executes in its own worker or thread

// const cacheName = "2-4-23PWA-v1";

const appShellFiles = [
  "android-chrome-192x192.png",
  "android-chrome-512x512.png",
  "favicon-16x16.png",
  "favicon-32x32.png",
  "favicon.ico",
];

const contentToCache = appShellFiles;

self.addEventListener("install", (e) => {
  console.log("Service worker installed");
  e.waitUntil(
    (async () => {
      const cache = await caches.open(cacheName);
      console.log("[Service Worker] Caching all: app shell and content");
      await cache.addAll(contentToCache);
    })()
  );
});
self.addEventListener("activate", (e) => {
  console.log("Service worker activated");
});
