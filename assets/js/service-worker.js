const CACHE_NAME = 'my-doc-cache-v3';
const urlsToCache = [
  'https://darpanadhikari.com.np'
];

self.addEventListener('install', event => {
  console.log('[Service Worker] Installed');
});

self.addEventListener('fetch', event => {
  console.log('[Service Worker] Fetch event: ', event.request.url);
});

self.addEventListener('push', event => {
  console.log('[Service Worker] Push notification received');
});
