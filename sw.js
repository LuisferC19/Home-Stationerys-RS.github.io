// Se incrementa la versión para forzar la actualización del caché en los navegadores de los usuarios
const CACHE_NAME = 'home-stationery-v12';
const RUNTIME_CACHE = 'home-stationery-runtime-v12';

// Solo el "esqueleto" de la app se precachea al instalar.
// Las imágenes se cachean dinámicamente la primera vez que se piden (ver 'fetch' abajo),
// así no hace falta mantener a mano una lista de 200+ archivos.
const APP_SHELL = [
  './',
  './index.html',
  './producto.html',
  './styles.css',
  './manifest.json',
  './sw-register.js',
  './js/storage.js',
  './js/toast.js',
  './js/theme.js',
  './js/cart.js',
  './js/recentlyViewed.js',
  './js/productsApi.js',
  './js/productCard.js',
  './js/index-page.js',
  './js/detalle-page.js',
  './icon-192.png',
  './icon-512.png',
  './img/thumb/HomeStatio.webp',
  './img/thumb/FaltaImg.webp',
  './img/full/FaltaImg.webp',
];

self.addEventListener('install', event => {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then(cache => cache.addAll(APP_SHELL))
      .catch(error => console.error('Fallo al precachear el app shell:', error))
  );
  self.skipWaiting();
});

self.addEventListener('activate', event => {
  event.waitUntil(
    caches.keys().then(keys =>
      Promise.all(
        keys
          .filter(key => key !== CACHE_NAME && key !== RUNTIME_CACHE)
          .map(key => caches.delete(key))
      )
    )
  );
  self.clients.claim();
});

self.addEventListener('fetch', event => {
  const url = new URL(event.request.url);

  // productos.json: red primero (para ver precios/productos nuevos al instante),
  // con el caché como respaldo si no hay conexión.
  if (url.pathname.endsWith('/productos.json')) {
    event.respondWith(
      fetch(event.request)
        .then(response => {
          const clone = response.clone();
          caches.open(RUNTIME_CACHE).then(cache => cache.put(event.request, clone));
          return response;
        })
        .catch(() => caches.match(event.request))
    );
    return;
  }

  // Imágenes (img/thumb/ e img/full/): caché primero, y si no está, se pide
  // a la red y se guarda para la próxima vez (cache-first con relleno dinámico).
  if (url.pathname.includes('/img/thumb/') || url.pathname.includes('/img/full/')) {
    event.respondWith(
      caches.match(event.request).then(cached => {
        if (cached) return cached;
        return fetch(event.request).then(response => {
          const clone = response.clone();
          caches.open(RUNTIME_CACHE).then(cache => cache.put(event.request, clone));
          return response;
        });
      })
    );
    return;
  }

  // Resto de archivos (HTML, CSS, JS): caché primero, red como respaldo.
  event.respondWith(
    caches.match(event.request).then(resp => resp || fetch(event.request))
  );
});
