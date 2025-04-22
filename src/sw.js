// sw.js
const CACHE_NAME = 'cost-per-mile-v1';
const FILES_TO_CACHE = [
  '/',
  '/index.html',
  '/src/manifest.json',
  '/src/assets/favicon.ico',
  '/src/assets/favicon-16x16.png',
  '/src/assets/favicon-32x32.png',
  '/src/assets/apple-touch-icon.png',
  '/src/assets/android-chrome-192x192.png',
  '/src/assets/android-chrome-512x512.png',
  'https://cdn.tailwindcss.com',
  'https://cdn.jsdelivr.net/npm/alpinejs@3.x.x/dist/cdn.min.js'
];

// Cache-first strategy for static assets
const STATIC_CACHE = 'static-cache-v1';

self.addEventListener('install', event => {
  event.waitUntil(
    Promise.all([
      caches.open(CACHE_NAME).then(cache => cache.addAll(FILES_TO_CACHE)),
      caches.open(STATIC_CACHE).then(cache => cache.addAll(FILES_TO_CACHE))
    ])
  );
  // Force the waiting service worker to become the active service worker
  self.skipWaiting();
});

self.addEventListener('fetch', event => {
  // Skip cross-origin requests
  if (!event.request.url.startsWith(self.location.origin)) {
    return;
  }

  // For static assets, use cache-first strategy
  if (FILES_TO_CACHE.some(url => event.request.url.includes(url))) {
    event.respondWith(
      caches.match(event.request).then(response => {
        return response || fetch(event.request).then(response => {
          return caches.open(STATIC_CACHE).then(cache => {
            cache.put(event.request, response.clone());
            return response;
          });
        });
      })
    );
    return;
  }

  // For other requests, use network-first strategy
  event.respondWith(
    fetch(event.request).catch(() => {
      return caches.match(event.request);
    })
  );
});

self.addEventListener('activate', event => {
  event.waitUntil(
    Promise.all([
      // Clean up old caches
      caches.keys().then(keys =>
        Promise.all(
          keys.map(key => {
            if (key !== CACHE_NAME && key !== STATIC_CACHE) {
              return caches.delete(key);
            }
          })
        )
      ),
      // Take control of all clients
      clients.claim()
    ])
  );
});