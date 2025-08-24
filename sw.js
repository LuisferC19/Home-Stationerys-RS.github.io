// Se incrementa la versión para forzar la actualización del caché en los navegadores de los usuarios
const CACHE_NAME = 'material-tepetitla-v9'; 
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
  './img/HomeStationery.png',
  './icon-192.png',
  './icon-512.png',
  './img/FaltaImg.png',

  // --- Lista completa y actualizada de imágenes de productos ---
  './img/AudifonosCable1.png', './img/AudifonosCable2.png', './img/AudifonosCable3.png',
  './img/SoporteCelulares1.png', './img/SoporteCelulares2.png', './img/SoporteCelulares3.png',
  './img/CintaAdesiva1.png', './img/CintaAdesiva2.png', './img/CintaAdesiva3.png',
  './img/ColoresVividel1.png', './img/ColoresVividel2.png', './img/ColoresVividel3.png',
  './img/CorrectorPen1.png', './img/CorrectorPen2.png', './img/CorrectorPen3.png',
  './img/PapelContac1.png', './img/PapelContac2.png', './img/PapelContac3.png',
  './img/GomasFactis1.png', './img/GomasFactis2.png', './img/GomasFactis3.png',
  './img/HojasFomi1.png', './img/HojasFomi2.png',
  './img/JuegoGeometrico1.png',
  './img/LapizBicolor1.png', './img/LapizBicolor2.png', './img/LapizBicolor3.png',
  './img/LapizDuo1.png', './img/LapizDuo2.png', './img/LapizDuo3.png',
  './img/LapizMaped1.png', './img/LapizMaped2.png', './img/LapizMaped3.png',
  './img/LapiceroAzulBic1.png', './img/LapiceroAzulBic2.png', './img/LapiceroAzulBic3.png',
  './img/LapiceroNegroBic1.png', './img/LapiceroNegroBic2.png', './img/LapiceroNegroBic3.png',
  './img/LapiceroRojoBic1.png', './img/LapiceroRojoBic2.png', './img/LapiceroRojoBic3.png',
  './img/LibretaCuadradaEstrella1.png', './img/LibretaCuadradaEstrella2.png',
  './img/LibretaCuadradaPerron1.png', './img/LibretaCuadradaPerron2.png', './img/LibretaCuadradaPerron3.png',
  './img/LibretaCuadriculadaScribe1.png', './img/LibretaCuadriculadaScribe2.png', './img/LibretaCuadriculadaScribe3.png',
  './img/LibretaRayadaPerron1.png', './img/LibretaRayadaPerron2.png',
  './img/MarcaTextos1.png', './img/MarcaTextos2.png', './img/MarcaTextos3.png',
  './img/MiniEngrapadoras1.png', './img/MiniEngrapadoras2.png', './img/MiniEngrapadoras3.png',
  './img/PlumonesJocar121.png', './img/PlumonesJocar122.png', './img/PlumonesJocar123.png',
  './img/PlumonesJocar241.png', './img/PlumonesJocar242.png', './img/PlumonesJocar243.png',
  './img/PlumonesWhiteboard1.png', './img/PlumonesWhiteboard2.png', './img/PlumonesWhiteboard3.png',
  './img/ResistolDixon1.png', './img/ResistolDixon2.png', './img/ResistolDixon3.png',
  './img/Sacapuntas1.png', './img/Sacapuntas2.png', './img/Sacapuntas3.png',
  './img/JuegosLegos1.png',
  './img/JuegoUno1.png', './img/JuegoUno3.png',
  './img/PistolaSilicon1.png', './img/PistolaSilicon2.png', './img/PistolaSilicon3.png',
  './img/BarrasSilicon1.png', './img/BarrasSilicon2.png', './img/BarrasSilicon3.png',
  './img/Impermiable1.png'
];

self.addEventListener('install', event => {
  event.waitUntil(
    caches.open(CACHE_NAME)
    .then(cache => {
        console.log('Cache abierto y archivos añadidos');
        // Usar un catch para evitar que un solo error de imagen rompa toda la instalación
        return cache.addAll(urlsToCache).catch(error => {
            console.error('Fallo al cachear algunos archivos durante la instalación:', error);
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
        // Devuelve la respuesta del caché si existe, si no, la busca en la red
        return resp || fetch(event.request);
    })
  );
});


