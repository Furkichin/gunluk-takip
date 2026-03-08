const CACHE = 'habitio-v1';

self.addEventListener('install', e => {
  self.skipWaiting();
});

self.addEventListener('activate', e => {
  e.waitUntil(self.clients.claim());
});

// Network-first: önce GitHub'dan çek, internet yoksa cache'den göster
self.addEventListener('fetch', e => {
  // Firebase isteklerini hiç dokunma
  if (e.request.url.includes('firestore') || e.request.url.includes('firebase')) return;

  e.respondWith(
    fetch(e.request)
      .then(response => {
        // Başarılı yanıtı cache'e de kaydet
        const clone = response.clone();
        caches.open(CACHE).then(c => c.put(e.request, clone));
        return response;
      })
      .catch(() => {
        // İnternet yoksa cache'den göster
        return caches.match(e.request);
      })
  );
});
