// service-worker.js
const CACHE_VERSION = '1.0.0';
const CACHE_NAME = `cost-per-mile-${CACHE_VERSION}`;
const FILES_TO_CACHE = [
  '/',
  '/index.html',
  '/manifest.json',
  '/assets/favicon.ico',
  '/assets/favicon-16x16.png',
  '/assets/favicon-32x32.png',
  '/assets/apple-touch-icon.png',
  '/assets/android-chrome-192x192.png',
  '/assets/android-chrome-512x512.png',
]

const CDN_FILES = [
  'https://cdn.jsdelivr.net/npm/alpinejs@3.x.x/dist/cdn.min.js',
  'https://cdn.jsdelivr.net/npm/@alpinejs/mask@3.x.x/dist/cdn.min.js',
  'https://cdn.jsdelivr.net/npm/chart.js',
  'https://cdn.jsdelivr.net/npm/chartjs-plugin-annotation@2.1.0/dist/chartjs-plugin-annotation.min.js'
];

// TODO: don't be as aggressive with the cache busting
// Add timestamp to cache name to force updates
const CACHE_TIMESTAMP = new Date().toISOString();
const CACHE_KEY = `${CACHE_NAME}-${CACHE_TIMESTAMP}`;

self.addEventListener('install', event => {
  event.waitUntil(
    caches.open(CACHE_KEY).then(cache => {
      // Add cache control headers to all requests
      const requests = FILES_TO_CACHE.map(url => {
        const request = new Request(url, {
          headers: new Headers({
            'Cache-Control': 'no-cache, no-store, must-revalidate',
            'Pragma': 'no-cache',
            'Expires': '0'
          })
        });
        // Skip cross-origin requests
        if (!url.startsWith(self.location.origin) && !CDN_FILES.includes(url)) {
          return cache.add(request);
        }
        return cache.add(request);
      });
      return Promise.all(requests);
    })
  );
  // Force the waiting service worker to become the active service worker
  self.skipWaiting();
});

self.addEventListener('fetch', event => {
  // Skip cross-origin requests
  if (!event.request.url.startsWith(self.location.origin)) {
    return;
  }

  // For static assets, use cache-first strategy with exact path match
  const url = new URL(event.request.url);
  if (FILES_TO_CACHE.includes(url.pathname)) {
    event.respondWith(
      caches.match(event.request).then(response => {
        // Always fetch from network first
        return fetch(event.request)
          .then(networkResponse => {
            // Update cache with new response
            return caches.open(CACHE_KEY).then(cache => {
              cache.put(event.request, networkResponse.clone());
              return networkResponse;
            });
          })
          .catch(() => {
            // Fall back to cache if network fails
            return response;
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
            if (key.startsWith('cost-per-mile-') && key !== CACHE_KEY) {
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

// Add update notification
self.addEventListener('message', event => {
  if (event.data === 'SKIP_WAITING') {
    self.skipWaiting();
  }
});// Check for updates every hour
setInterval(() => {
  self.registration.update();
}, 3600000);

