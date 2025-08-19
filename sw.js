const CACHE_NAME = 'material-tepetitla-v8'; // Incrementé la versión para forzar la actualización
const urlsToCache = [
  './',
  './index.html',
  './producto.html',
  './styles.css',
  './script.js',
  './producto.js',
  './productos.json',
  './manifest.json',
  './sw-register.js',
  './img/HomeStatio.png',
  './icon-192.png',
  './icon-512.png',
  './img/FaltaImg.png',

  // --- Imágenes de productos que SÍ existen (Lista completa) ---
  './img/AudifonosCable2.jpg',
  './img/AudifonosCable3.jpg',
  './img/PortaCelulares1.jpg',
  './img/PortaCelulares2.jpg',
  './img/PortaCelulares3.jpg',
  './img/CintaAdesiva1.jpg',
  './img/CintaAdesiva2.jpg',
  './img/CintaAdesiva3.jpg',
  './img/ColoresVividel2.jpg',
  './img/ColoresVividel3.jpg',
  './img/Corrector2.jpg',
  './img/Corrector3.jpg',
  './img/PapelContac1.jpg',
  './img/PapelContac2.jpg',
  './img/GomaFactis1.jpg',
  './img/GomaFactis2.jpg',
  './img/GomaFactis3.jpg',
  './img/HojasColor1.jpg',
  './img/HojasDFomi1.jpg',
  './img/HojasDFomi2.jpg',
  './img/JuegoGeometrico1.jpg',
  './img/LapizBicolor2.jpg',
  './img/LapizDuo2.jpg',
  './img/LapizMaped2.jpg',
  './img/LapizMaped3.jpg',
  './img/MarcaTexto1.jpg',
  './img/MarcaTexto2.jpg',
  './img/MarcaTexto3.jpg',
  './img/MiniEngrapadoras1.jpg',
  './img/Plumonesloca241.jpg',
  './img/Plumonesloca243.jpg',
  './img/PlumonesWhiteBoard2.jpg',
  './img/PlumonesWhiteBoard3.jpg',
  './img/ResitolDixon1.jpg',
  './img/ResitolDixon2.jpg',
  './img/ResitolDixon3.jpg',
  './img/Sacapuntas1.jpg',
  './img/Sacapuntas3.jpg',
  './img/FiguraDLego1.jpg',
  './img/JuegoUno3.jpg',
  './img/PistolaSilicon1.jpg',
  './img/PistolaSilicon2.jpg'
];

self.addEventListener('install', event => {
  event.waitUntil(
    caches.open(CACHE_NAME)
    .then(cache => {
        console.log('Cache abierto y archivos añadidos');
        return cache.addAll(urlsToCache).catch(error => {
            console.error('Fallo al cachear durante la instalación:', error);
        });
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
