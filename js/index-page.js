// index-page.js
// Lógica específica de index.html: catálogo, filtros/búsqueda, carrito offcanvas,
// historial de pedidos y carritos guardados. La lógica compartida con producto.html
// (carrito, tema, toast, vistos recientemente, tarjetas de producto) vive en ./  como módulos.

import { getItem, setItem } from './storage.js';
import { mostrarToast } from './toast.js';
import { getTheme, applyTheme, toggleTheme } from './theme.js';
import { getCart, addToCart, removeFromCart, clearCart, getCartTotals, getMontoEnvioGratis } from './cart.js';
import { getRecentlyViewed, logRecentView } from './recentlyViewed.js';
import { fetchProductos } from './productsApi.js';
import { crearTarjetaProducto } from './productCard.js';

document.addEventListener('DOMContentLoaded', () => {

    // Quita acentos para que buscar "lapiz" también encuentre "Lápiz".
    function normalizar(texto) {
        return texto
            .toLowerCase()
            .normalize('NFD')
            .replace(/[\u0300-\u036f]/g, '');
    }

    const SKELETON_COUNT = 8;

    let productos = [];

    const appState = {
        user: getItem('user', { nombre: 'Visitante' }),
        orderHistory: getItem('orderHistory', []),
        savedCarts: getItem('savedCarts', []),
    };

    const catalogoDiv = document.getElementById('catalogo');
    const abrirCarritoBtn = document.getElementById('abrirCarrito');
    const cerrarCarritoBtn = document.getElementById('cerrarCarritoBtn');
    const contenidoCarritoDiv = document.getElementById('contenidoCarrito');
    const carritoTotalSpan = document.getElementById('carritoTotal');
    const contadorCarritoSpan = document.getElementById('contadorCarrito');
    const enviarPedidoBtn = document.getElementById('enviarPedidoBtn');
    const vaciarCarritoBtn = document.getElementById('vaciarCarritoBtn');
    const buscadorInput = document.getElementById('buscador');
    const categoriaFiltroSelect = document.getElementById('categoriaFiltro');
    const ordenarFiltroSelect = document.getElementById('ordenarFiltro');
    const btnMenu = document.getElementById('btnMenu');
    const sidebar = document.getElementById('sidebar');
    const nombreUsuarioSpan = document.getElementById('nombreUsuario');
    const themeToggleBtn = document.getElementById('themeToggleBtn');
    const carritoFlotante = document.getElementById('carritoFlotante');
    const searchSuggestionsDiv = document.getElementById('searchSuggestions');
    const vistosRecientementeDiv = document.getElementById('vistosRecientemente');
    const historialPedidosBtn = document.getElementById('historialPedidosBtn');
    const modalHistorial = document.getElementById('modalHistorial');
    const cerrarHistorialModalBtn = document.getElementById('cerrarHistorialModal');
    const contenidoHistorialDiv = document.getElementById('contenidoHistorial');
    const totalGastadoSpan = document.getElementById('totalGastado');
    const guardarCarritoBtn = document.getElementById('guardarCarritoBtn');
    const verCarritosGuardadosBtn = document.getElementById('verCarritosGuardadosBtn');
    const modalCarritosGuardados = document.getElementById('modalCarritosGuardados');
    const contenidoCarritosGuardadosDiv = document.getElementById('contenidoCarritosGuardados');
    const cerrarCarritosGuardadosModalBtn = document.getElementById('cerrarCarritosGuardadosModal');
    const infoDescuentoP = document.getElementById('infoDescuento');
    const infoEnvioP = document.getElementById('infoEnvio');
    const encuestaContainer = document.getElementById('encuestaContainer');

    function renderizarSkeleton() {
        catalogoDiv.innerHTML = '';
        for (let i = 0; i < SKELETON_COUNT; i++) {
            const card = document.createElement('div');
            card.classList.add('skeleton-card');
            card.setAttribute('aria-hidden', 'true');
            card.innerHTML = `
                <div class="skeleton-box skeleton-img"></div>
                <div class="skeleton-box skeleton-line"></div>
                <div class="skeleton-box skeleton-line short"></div>
                <div class="skeleton-box skeleton-btn"></div>
            `;
            catalogoDiv.appendChild(card);
        }
    }

    function renderizarProductos(productosAMostrar) {
        catalogoDiv.innerHTML = '';
        if (productosAMostrar.length === 0) {
            catalogoDiv.innerHTML = '<p>No se encontraron productos que coincidan con tu búsqueda.</p>';
            return;
        }
        productosAMostrar.forEach(producto => {
            catalogoDiv.appendChild(crearTarjetaProducto(producto, { variante: 'catalogo' }));
        });
    }

    function compartirProducto(idProducto) {
        const producto = productos.find(p => p.id === idProducto);
        if (!producto) return;

        const text = `¡Mira este producto en Home & Stationery: ${producto.nombre} por solo $${producto.precio.toFixed(2)}!`;
        const pageUrl = new URL(`producto.html?id=${producto.id}`, window.location.href).href;

        const url = `https://api.whatsapp.com/send?text=${encodeURIComponent(text + ' ' + pageUrl)}`;
        window.open(url, '_blank', 'noopener,noreferrer');
    }

    catalogoDiv.addEventListener('click', e => {
        const target = e.target;
        const productoCard = target.closest('.producto');
        if (!productoCard) return;

        const id = parseInt(productoCard.dataset.id);

        if (target.classList.contains('btn-agregar-carrito')) {
            const cantidadInput = productoCard.querySelector('.cantidad-input');
            const cantidad = parseInt(cantidadInput.value);
            const imgElement = productoCard.querySelector('.producto-imagen');
            agregarAlCarrito(id, cantidad, imgElement);
        } else if (target.closest('.share-btn')) {
            compartirProducto(id);
        }
    });

    async function init() {
        renderizarSkeleton();
        try {
            productos = await fetchProductos();

            applyTheme(getTheme());

            if (appState.user.nombre === 'Visitante') {
                setTimeout(() => {
                    const nombre = prompt("¡Bienvenido a la papelería! ¿Cuál es tu nombre?");
                    if (nombre && nombre.trim()) {
                        appState.user.nombre = nombre.trim();
                        setItem('user', appState.user);
                        nombreUsuarioSpan.textContent = appState.user.nombre;
                    }
                }, 500);
            }
            nombreUsuarioSpan.textContent = appState.user.nombre;

            renderizarProductos(productos);
            renderizarCarrito();
            renderizarVistosRecientemente();

        } catch (error) {
            console.error(error);
            catalogoDiv.innerHTML = "<p>Error al cargar los productos. Por favor, intenta de nuevo más tarde.</p>";
        }
    }

    function renderizarCarrito() {
        const carrito = getCart();
        contenidoCarritoDiv.innerHTML = '';

        if (carrito.length === 0) {
            contenidoCarritoDiv.innerHTML = '<p>Tu carrito está vacío.</p>';
            carritoTotalSpan.textContent = '0.00';
            contadorCarritoSpan.textContent = '0';
            infoDescuentoP.textContent = '';
            infoEnvioP.textContent = '';
            return;
        }

        infoDescuentoP.textContent = '';

        carrito.forEach(item => {
            const itemDiv = document.createElement('div');
            itemDiv.classList.add('carrito-item');
            itemDiv.dataset.id = item.id;
            itemDiv.innerHTML = `
                <img src="${item.miniaturas[0]}" alt="${item.nombre}" onerror="this.onerror=null;this.src='img/thumb/FaltaImg.webp';">
                <div class="carrito-item-info">
                    <h4>${item.nombre}</h4>
                    <p>$${item.precio.toFixed(2)} x ${item.cantidad}</p>
                </div>
                <button class="btn-eliminar-item" aria-label="Eliminar ${item.nombre} del carrito">X</button>
            `;
            contenidoCarritoDiv.appendChild(itemDiv);
        });

        const { total, totalItems } = getCartTotals(carrito);
        const montoEnvioGratis = getMontoEnvioGratis();

        if (total >= montoEnvioGratis) {
            infoEnvioP.textContent = '¡Felicidades! Tu envío es GRATIS.';
        } else {
            infoEnvioP.textContent = `Te faltan $${(montoEnvioGratis - total).toFixed(2)} para el envío gratis.`;
        }

        carritoTotalSpan.textContent = total.toFixed(2);
        contadorCarritoSpan.textContent = totalItems;
    }

    function renderizarSugerencias(query) {
        searchSuggestionsDiv.innerHTML = '';
        if (!query) return;
        const queryNorm = normalizar(query);
        const sugerencias = productos.filter(p => normalizar(p.nombre).includes(queryNorm));
        sugerencias.slice(0, 5).forEach(s => {
            const sugItem = document.createElement('div');
            sugItem.classList.add('suggestion-item');

            // Resalta la parte del nombre que coincide con la búsqueda.
            const nombreNorm = normalizar(s.nombre);
            const inicio = nombreNorm.indexOf(queryNorm);
            if (inicio === -1) {
                sugItem.textContent = s.nombre;
            } else {
                const fin = inicio + queryNorm.length;
                sugItem.innerHTML = `${s.nombre.slice(0, inicio)}<mark>${s.nombre.slice(inicio, fin)}</mark>${s.nombre.slice(fin)}`;
            }

            sugItem.onclick = () => {
                buscadorInput.value = s.nombre;
                searchSuggestionsDiv.innerHTML = '';
                filtrarProductos();
            };
            searchSuggestionsDiv.appendChild(sugItem);
        });
    }

    function renderizarVistosRecientemente() {
        vistosRecientementeDiv.innerHTML = '';
        const idsVistos = getRecentlyViewed();
        if (idsVistos.length === 0 || productos.length === 0) {
            document.getElementById('productosVistos').style.display = 'none';
            return;
        }
        document.getElementById('productosVistos').style.display = 'block';
        const productosVistos = idsVistos.map(id => productos.find(p => p.id === id)).filter(Boolean);
        productosVistos.reverse().slice(0, 5).forEach(producto => {
            vistosRecientementeDiv.appendChild(crearTarjetaProducto(producto, { variante: 'reducida' }));
        });
    }

    function renderizarHistorial() {
        contenidoHistorialDiv.innerHTML = '';
        let totalGastado = 0;
        if (appState.orderHistory.length === 0) {
            contenidoHistorialDiv.innerHTML = '<p>Aún no tienes pedidos.</p>';
        } else {
            appState.orderHistory.forEach(pedido => {
                const pedidoDiv = document.createElement('div');
                pedidoDiv.classList.add('historial-item');
                let contenidoPedido = `<h4>Pedido del ${new Date(pedido.fecha).toLocaleDateString()}</h4><ul>`;
                pedido.items.forEach(item => { contenidoPedido += `<li>${item.nombre} (x${item.cantidad})</li>`; });
                contenidoPedido += `</ul><p><b>Total: $${pedido.total.toFixed(2)}</b></p>`;
                pedidoDiv.innerHTML = contenidoPedido;
                contenidoHistorialDiv.appendChild(pedidoDiv);
                totalGastado += pedido.total;
            });
        }
        totalGastadoSpan.textContent = totalGastado.toFixed(2);
    }

    function renderizarCarritosGuardados() {
        contenidoCarritosGuardadosDiv.innerHTML = '';
        if (appState.savedCarts.length === 0) {
            contenidoCarritosGuardadosDiv.innerHTML = '<p>No tienes carritos guardados.</p>';
            return;
        }
        appState.savedCarts.forEach((carrito, index) => {
            const carritoDiv = document.createElement('div');
            carritoDiv.classList.add('guardado-item');
            const total = carrito.reduce((acc, item) => acc + item.precio * item.cantidad, 0);
            carritoDiv.innerHTML = `<h4>Carrito guardado (${carrito.length} prod.)</h4><p>Total: $${total.toFixed(2)}</p><button data-index="${index}" class="btn-recuperar-carrito">Recuperar</button><button data-index="${index}" class="btn-eliminar-carrito-guardado">Eliminar</button>`;
            contenidoCarritosGuardadosDiv.appendChild(carritoDiv);
        });
    }

    function animarVueloAlCarrito(imgElement) {
        const imgRect = imgElement.getBoundingClientRect();
        const carritoRect = abrirCarritoBtn.getBoundingClientRect();

        const imgClon = imgElement.cloneNode();
        imgClon.classList.add('producto-imagen-volando');

        imgClon.style.width = `${imgRect.width}px`;
        imgClon.style.height = `${imgRect.height}px`;
        imgClon.style.top = `${imgRect.top}px`;
        imgClon.style.left = `${imgRect.left}px`;

        document.body.appendChild(imgClon);

        requestAnimationFrame(() => {
            imgClon.style.top = `${carritoRect.top + carritoRect.height / 2}px`;
            imgClon.style.left = `${carritoRect.left + carritoRect.width / 2}px`;
        });

        imgClon.addEventListener('transitionend', () => {
            imgClon.remove();
        });
    }

    function agregarAlCarrito(idProducto, cantidad = 1, imgElement) {
        const producto = productos.find(p => p.id === idProducto);
        if (!producto) return;

        if (imgElement) {
            animarVueloAlCarrito(imgElement);
        }

        const { yaEstaba } = addToCart(producto, cantidad);
        if (!yaEstaba) {
            recomendarProductos(producto.categoria, producto.id);
        }
        mostrarToast(`${cantidad} x ${producto.nombre} agregado(s) al carrito.`);
        renderizarCarrito();
    }

    function recomendarProductos(categoria, excludeId) {
        const recomendados = productos.filter(p => p.categoria === categoria && p.id !== excludeId);
        if (recomendados.length > 0) {
            const productoRecomendado = recomendados[Math.floor(Math.random() * recomendados.length)];
            mostrarToast(`Quizás también te interese: ${productoRecomendado.nombre}`, 'info', 5000);
        }
    }

    function eliminarDelCarrito(idProducto) {
        removeFromCart(idProducto);
        mostrarToast('Producto eliminado del carrito.');
        renderizarCarrito();
    }

    function vaciarCarrito() {
        if (getCart().length > 0) {
            if (confirm('¿Estás seguro de que quieres vaciar todo tu carrito?')) {
                clearCart();
                renderizarCarrito();
                mostrarToast('El carrito ha sido vaciado.', 'info');
            }
        } else {
            mostrarToast('El carrito ya está vacío.', 'error');
        }
    }

    function guardarCarritoActual() {
        const carritoActual = getCart();
        if (carritoActual.length === 0) {
            mostrarToast('El carrito está vacío.', 'error');
            return;
        }
        appState.savedCarts.push(carritoActual);
        clearCart();
        renderizarCarrito();
        setItem('savedCarts', appState.savedCarts);
        mostrarToast('Carrito guardado. Puedes continuar comprando.');
    }

    function recuperarCarrito(index) {
        if (getCart().length > 0 && !confirm('Tienes productos en tu carrito actual. ¿Deseas reemplazarlos?')) return;
        setItem('carrito', appState.savedCarts[index]);
        appState.savedCarts.splice(index, 1);
        renderizarCarrito();
        setItem('savedCarts', appState.savedCarts);
        modalCarritosGuardados.classList.add('oculto');
        mostrarToast('Carrito recuperado exitosamente.');
    }

    function filtrarProductos() {
        const texto = normalizar(buscadorInput.value);
        const categoria = categoriaFiltroSelect.value;
        const orden = ordenarFiltroSelect.value;

        let productosFiltrados = productos.filter(producto => {
            const coincideTexto = normalizar(producto.nombre).includes(texto);
            const coincideCategoria = categoria === 'todos' || producto.categoria === categoria;
            return coincideTexto && coincideCategoria;
        });

        if (orden === 'precio-asc') {
            productosFiltrados = [...productosFiltrados].sort((a, b) => a.precio - b.precio);
        } else if (orden === 'precio-desc') {
            productosFiltrados = [...productosFiltrados].sort((a, b) => b.precio - a.precio);
        } else if (orden === 'nombre-asc') {
            productosFiltrados = [...productosFiltrados].sort((a, b) => a.nombre.localeCompare(b.nombre, 'es'));
        }

        renderizarProductos(productosFiltrados);
    }

    btnMenu.addEventListener('click', () => {
        const abierto = sidebar.classList.toggle('visible');
        btnMenu.setAttribute('aria-expanded', String(abierto));
    });
    buscadorInput.addEventListener('input', () => renderizarSugerencias(buscadorInput.value));
    buscadorInput.addEventListener('keyup', filtrarProductos);
    document.addEventListener('click', e => {
        if (!e.target.closest('.search-container')) {
            searchSuggestionsDiv.innerHTML = '';
        }
    });
    ordenarFiltroSelect.addEventListener('change', filtrarProductos);
    themeToggleBtn.addEventListener('click', toggleTheme);
    historialPedidosBtn.addEventListener('click', () => { renderizarHistorial(); modalHistorial.classList.remove('oculto'); });
    cerrarHistorialModalBtn.addEventListener('click', () => modalHistorial.classList.add('oculto'));
    guardarCarritoBtn.addEventListener('click', guardarCarritoActual);
    verCarritosGuardadosBtn.addEventListener('click', () => { renderizarCarritosGuardados(); modalCarritosGuardados.classList.remove('oculto'); });
    cerrarCarritosGuardadosModalBtn.addEventListener('click', () => modalCarritosGuardados.classList.add('oculto'));
    modalCarritosGuardados.addEventListener('click', e => { if (e.target.classList.contains('btn-recuperar-carrito')) { recuperarCarrito(parseInt(e.target.dataset.index)); } });
    encuestaContainer.addEventListener('click', e => { if (e.target.tagName === 'BUTTON') { encuestaContainer.innerHTML = '<p>¡Gracias por tu opinión!</p>'; setTimeout(() => encuestaContainer.classList.add('oculto'), 2000); } });
    contenidoCarritoDiv.addEventListener('click', e => { if (e.target.classList.contains('btn-eliminar-item')) { const id = parseInt(e.target.closest('.carrito-item').dataset.id); eliminarDelCarrito(id); } });
    abrirCarritoBtn.addEventListener('click', () => carritoFlotante.classList.add('abierto'));
    cerrarCarritoBtn.addEventListener('click', () => carritoFlotante.classList.remove('abierto'));
    enviarPedidoBtn.addEventListener('click', enviarPedidoWhatsApp);
    vaciarCarritoBtn.addEventListener('click', vaciarCarrito);
    categoriaFiltroSelect.addEventListener('change', filtrarProductos);

    function enviarPedidoWhatsApp() {
        const carrito = getCart();
        if (carrito.length === 0) {
            mostrarToast('Tu carrito está vacío.', 'error');
            return;
        }
        let mensaje = `¡Hola! Soy ${appState.user.nombre}, quisiera hacer el siguiente pedido:\n\n`;
        let total = 0;
        carrito.forEach(item => {
            mensaje += `- ${item.nombre} (x${item.cantidad}) - $${(item.precio * item.cantidad).toFixed(2)}\n`;
            total += item.precio * item.cantidad;
        });

        mensaje += `\n*Total: $${total.toFixed(2)}*`;

        appState.orderHistory.push({ fecha: new Date().toISOString(), items: [...carrito], total: total });
        setItem('orderHistory', appState.orderHistory);
        clearCart();
        renderizarCarrito();
        const telefono = '522481602590';
        const url = `https://wa.me/${telefono}?text=${encodeURIComponent(mensaje)}`;
        window.open(url, '_blank', 'noopener,noreferrer');
        setTimeout(() => encuestaContainer.classList.remove('oculto'), 2000);
    }

    init();
});
