/* AtlasWeb — Service Worker
   Sempre busca a versão mais recente, nunca usa cache */

const VERSION = 'v20250320';

// Ao instalar — limpa caches antigos
self.addEventListener('install', event => {
  self.skipWaiting();
  event.waitUntil(
    caches.keys().then(keys =>
      Promise.all(keys.map(key => caches.delete(key)))
    )
  );
});

// Ao ativar — toma controle imediato
self.addEventListener('activate', event => {
  event.waitUntil(clients.claim());
});

// Toda requisição — vai direto na rede, sem cache
self.addEventListener('fetch', event => {
  // Só intercepta requisições do mesmo domínio
  if (!event.request.url.startsWith(self.location.origin)) return;

  event.respondWith(
    fetch(event.request, { cache: 'no-store' })
      .catch(() => caches.match(event.request)) // fallback se offline
  );
});
