const CACHE_NAME = 'material-tepetitla-v5';
const urlsToCache = [
  './',
  './index.html',
  './styles.css',
  './script.js',
  './manifest.json',
  './sw-register.js',
  './img/HomeStatio.png',
  './img/Audifonos.jpg',
  './img/Calculadora.jpg',
  './img/Cargador-iphone.jpg',
  './img/Goma.jpg',
  './img/Lapiz.jpg',
  './img/Lapizero.jpg',
  './img/Libretas.jpg',
  './img/Mochila.jpg',
  './img/Plato-ceramica.jpg',
  './icon-192.png',
  './icon-512.png'
];

self.addEventListener('install', event => {
  event.waitUntil(
    caches.open(CACHE_NAME)
    .then(cache => {
        console.log('Cache abierto y archivos añadidos');
        return cache.addAll(urlsToCache);
    })
  );
});

self.addEventListener('activate', event => {
  event.waitUntil(
    caches.keys().then(keys =>
      Promise.all(
        keys.filter(key => key !== CACHE_NAME)
        .map(key => caches.delete(key))
      )
    )
  );
});

self.addEventListener('fetch', event => {
  event.respondWith(
    caches.match(event.request)
    .then(resp => {
        return resp || fetch(event.request);
    })
  );
});
