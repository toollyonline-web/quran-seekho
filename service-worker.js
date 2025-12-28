const CACHE_NAME = 'quran-seekho-static-v2';
const DATA_CACHE_NAME = 'quran-seekho-data-v1';

const STATIC_ASSETS = [
  '/',
  '/index.html',
  '/manifest.json',
  'https://cdn.tailwindcss.com',
  'https://fonts.googleapis.com/css2?family=Amiri:wght@400;700&family=Inter:wght@300;400;500;600;700&family=Noto+Sans+Arabic:wght@400;700&display=swap'
];

// Install event: Pre-cache static assets
self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      console.log('[Service Worker] Pre-caching static assets');
      return cache.addAll(STATIC_ASSETS);
    })
  );
  self.skipWaiting();
});

// Activate event: Clean up old caches
self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((cacheNames) => {
      return Promise.all(
        cacheNames.map((cacheName) => {
          if (cacheName !== CACHE_NAME && cacheName !== DATA_CACHE_NAME) {
            console.log('[Service Worker] Removing old cache', cacheName);
            return caches.delete(cacheName);
          }
        })
      );
    })
  );
  self.clients.claim();
});

// Fetch event: Handle requests
self.addEventListener('fetch', (event) => {
  const { request } = event;
  const url = new URL(request.url);

  // Strategy for API requests (Quran data and Prayer times)
  // We use "Network First" to get the latest data if online, 
  // but fall back to cache for offline reading.
  if (url.hostname === 'api.alquran.cloud' || url.hostname === 'api.aladhan.com') {
    event.respondWith(
      fetch(request)
        .then((response) => {
          // If the request was successful, clone the response and store it in the data cache
          if (response.status === 200) {
            const responseToCache = response.clone();
            caches.open(DATA_CACHE_NAME).then((cache) => {
              cache.put(request, responseToCache);
            });
          }
          return response;
        })
        .catch(() => {
          // If the network request fails (offline), try to serve from cache
          console.log('[Service Worker] Network failed, serving from cache:', request.url);
          return caches.match(request);
        })
    );
    return;
  }

  // Strategy for Static Assets (HTML, JS, CSS, Fonts)
  // We use "Cache First" to speed up loading and ensure availability offline.
  event.respondWith(
    caches.match(request).then((cachedResponse) => {
      if (cachedResponse) {
        return cachedResponse;
      }

      return fetch(request).then((networkResponse) => {
        // Optionally cache new static assets encountered (like external images)
        if (!networkResponse || networkResponse.status !== 200 || networkResponse.type !== 'basic') {
          return networkResponse;
        }

        const responseToCache = networkResponse.clone();
        caches.open(CACHE_NAME).then((cache) => {
          cache.put(request, responseToCache);
        });

        return networkResponse;
      });
    })
  );
});
