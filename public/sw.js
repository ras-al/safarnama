const CACHE_NAME = 'safarnama-cache-v1';
const DATA_CACHE_NAME = 'safarnama-data-cache-v1';

const PRECACHE_ASSETS = [
  '/',
  '/trip',
  '/trip/transport',
  '/trip/hotels',
  '/trip/places',
  '/announcements',
  '/journal',
  '/documents',
  '/participants',
  '/emergency',
  '/manifest.json',
  '/icons/icon-192.png',
  '/icons/icon-512.png',
];

self.addEventListener('install', (event) => {
  self.skipWaiting();
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      return cache.addAll(PRECACHE_ASSETS);
    })
  );
});

self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((cacheNames) => {
      return Promise.all(
        cacheNames.map((cacheName) => {
          if (cacheName !== CACHE_NAME && cacheName !== DATA_CACHE_NAME) {
            return caches.delete(cacheName);
          }
        })
      );
    })
  );
  self.clients.claim();
});

self.addEventListener('message', (event) => {
  if (event.data && event.data.type === 'CACHE_DATA') {
    // We can handle specific offline data caching here if needed,
    // though we are mostly using IndexedDB (Firestore) and LocalStorage.
    console.log('SW received data to cache:', event.data.payload);
  }
});

self.addEventListener('fetch', (event) => {
  const url = new URL(event.request.url);

  // Exclude admin routes, API routes, and non-GET requests from service worker caching
  if (
    event.request.method !== 'GET' ||
    url.pathname.startsWith('/admin') ||
    url.pathname.startsWith('/api') ||
    url.pathname.startsWith('/_next/webpack-hmr') // Don't cache HMR
  ) {
    return;
  }

  event.respondWith(
    caches.match(event.request).then((cachedResponse) => {
      if (cachedResponse) {
        // If we have a cached response, return it, but also update it in the background (stale-while-revalidate)
        event.waitUntil(
          fetch(event.request)
            .then((networkResponse) => {
              if (networkResponse && networkResponse.status === 200) {
                caches.open(CACHE_NAME).then((cache) => {
                  cache.put(event.request, networkResponse.clone());
                });
              }
            })
            .catch(() => {}) // Ignore fetch errors in background
        );
        return cachedResponse;
      }

      // If not in cache, fetch from network and cache
      return fetch(event.request)
        .then((networkResponse) => {
          if (networkResponse && networkResponse.status === 200) {
            const clonedResponse = networkResponse.clone();
            caches.open(CACHE_NAME).then((cache) => {
              cache.put(event.request, clonedResponse);
            });
          }
          return networkResponse;
        })
        .catch(() => {
          // If offline and not cached, return the root cache or a fallback if available
          return caches.match('/');
        });
    })
  );
});
