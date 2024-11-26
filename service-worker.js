self.addEventListener('install', (event) => {
    event.waitUntil(
      caches.open('preventivo-cache').then((cache) => {
        return cache.addAll([
          '/',
          '/index.html',
          '/style.css',
          '/script.js',
          '/generate_pdf.js',
          '/icon.png', // Assicurati di avere un'icona per il caching
        ]);
      })
    );
  });
  
  self.addEventListener('fetch', (event) => {
    event.respondWith(
      caches.match(event.request).then((cachedResponse) => {
        return cachedResponse || fetch(event.request);
      })
    );
  });
  