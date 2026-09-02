// detalle-page.js
// Lógica específica de producto.html. Usa los mismos módulos de carrito, tema,
// toast y tarjetas de producto que index-page.js, así que agregar un producto
// desde aquí se comporta exactamente igual que desde el catálogo.

import { getItem } from './storage.js';
import { mostrarToast } from './toast.js';
import { getTheme, applyTheme } from './theme.js';
import { addToCart } from './cart.js';
import { logRecentView } from './recentlyViewed.js';
import { fetchProductos, getProductoById } from './productsApi.js';
import { crearTarjetaProducto } from './productCard.js';

document.addEventListener('DOMContentLoaded', () => {
    const nombreUsuarioSpan = document.getElementById('nombreUsuario');

    const detalleSkeleton = document.getElementById('detalleSkeleton');
    const detalleReal = document.getElementById('detalleReal');

    const nombreEl = document.getElementById('producto-nombre');
    const precioEl = document.getElementById('producto-precio');
    const descripcionEl = document.getElementById('producto-descripcion');
    const imagenPrincipalEl = document.getElementById('imagen-principal');
    const galeriaThumbnailsEl = document.getElementById('galeria-thumbnails');
    const catalogoRelacionadosEl = document.getElementById('catalogo-relacionados');
    const productosRelacionadosContainer = document.getElementById('productos-relacionados');

    let productos = [];
    let productoActual = null;

    async function init() {
        try {
            productos = await fetchProductos();

            const params = new URLSearchParams(window.location.search);
            const productoId = parseInt(params.get('id'));
            if (!productoId) throw new Error('ID de producto no válido.');

            productoActual = getProductoById(productos, productoId);
            if (!productoActual) throw new Error('Producto no encontrado.');

            cargarInfoUsuario();
            renderizarDetalleProducto();
            renderizarProductosRelacionados();
            logRecentView(productoActual.id);

            detalleSkeleton.classList.add('oculto');
            detalleReal.classList.remove('oculto');
        } catch (error) {
            console.error('Error al inicializar la página:', error);
            detalleSkeleton.classList.add('oculto');
            detalleReal.classList.remove('oculto');
            nombreEl.textContent = 'Error';
            descripcionEl.textContent = error.message;
        }
    }

    function cargarInfoUsuario() {
        applyTheme(getTheme());
        const user = getItem('user', { nombre: 'Visitante' });
        nombreUsuarioSpan.textContent = user.nombre;
    }

    function renderizarDetalleProducto() {
        document.title = `${productoActual.nombre} - Home & Stationery`;
        nombreEl.textContent = productoActual.nombre;
        precioEl.textContent = `$${productoActual.precio.toFixed(2)}`;
        descripcionEl.textContent = productoActual.descripcion;

        if (productoActual.imagenes && productoActual.imagenes.length > 0) {
            imagenPrincipalEl.src = productoActual.imagenes[0];
            imagenPrincipalEl.alt = productoActual.nombre;
            imagenPrincipalEl.onerror = function () {
                this.onerror = null;
                this.src = 'img/full/FaltaImg.webp';
            };

            const miniaturas = productoActual.miniaturas || productoActual.imagenes;
            galeriaThumbnailsEl.innerHTML = '';
            miniaturas.forEach((thumbSrc, index) => {
                const thumb = document.createElement('img');
                thumb.src = thumbSrc;
                thumb.alt = `Vista ${index + 1} de ${productoActual.nombre}`;
                thumb.classList.add('thumbnail-img');
                thumb.loading = 'lazy';
                thumb.onerror = function () {
                    this.onerror = null;
                    this.src = 'img/thumb/FaltaImg.webp';
                };
                if (index === 0) {
                    thumb.classList.add('active');
                }
                thumb.addEventListener('click', () => {
                    imagenPrincipalEl.src = productoActual.imagenes[index];
                    galeriaThumbnailsEl.querySelector('.active')?.classList.remove('active');
                    thumb.classList.add('active');
                });
                galeriaThumbnailsEl.appendChild(thumb);
            });
        }

        document.getElementById('btn-agregar-detalle').addEventListener('click', () => {
            const cantidad = parseInt(document.getElementById('cantidad-detalle').value);
            addToCart(productoActual, cantidad);
            mostrarToast(`${cantidad} x ${productoActual.nombre} agregado(s) al carrito.`);
        });
    }

    function renderizarProductosRelacionados() {
        const relacionados = productos
            .filter(p => p.categoria === productoActual.categoria && p.id !== productoActual.id)
            .slice(0, 4);

        if (relacionados.length === 0) {
            productosRelacionadosContainer.style.display = 'none';
            return;
        }

        catalogoRelacionadosEl.innerHTML = '';
        relacionados.forEach(producto => {
            catalogoRelacionadosEl.appendChild(crearTarjetaProducto(producto, { variante: 'relacionada' }));
        });
    }

    init();
});
