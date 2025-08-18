document.addEventListener('DOMContentLoaded', () => {

    let productos = [];

    const appState = {
        carrito: JSON.parse(localStorage.getItem('carrito')) || [],
        user: JSON.parse(localStorage.getItem('user')) || { nombre: 'Visitante' },
        theme: localStorage.getItem('theme') || 'light',
        recentlyViewed: JSON.parse(localStorage.getItem('recentlyViewed')) || [],
        orderHistory: JSON.parse(localStorage.getItem('orderHistory')) || [],
        savedCarts: JSON.parse(localStorage.getItem('savedCarts')) || [],
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
    const btnMenu = document.getElementById('btnMenu');
    const sidebar = document.getElementById('sidebar');
    const nombreUsuarioSpan = document.getElementById('nombreUsuario');
    const themeToggleBtn = document.getElementById('themeToggleBtn');
    const carritoFlotante = document.getElementById('carritoFlotante');
    const toastDiv = document.getElementById('toast');
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

    function renderizarProductos(productosAMostrar) {
        catalogoDiv.innerHTML = '';
        if (productosAMostrar.length === 0) {
            catalogoDiv.innerHTML = '<p>No se encontraron productos que coincidan con tu búsqueda.</p>';
            return;
        }

        productosAMostrar.forEach(producto => {
            const productoCard = document.createElement('div');
            productoCard.classList.add('producto');
            productoCard.dataset.id = producto.id;

            productoCard.innerHTML = `
                <button class="share-btn" aria-label="Compartir por WhatsApp">
                    <img src="https://img.icons8.com/color/24/000000/whatsapp--v1.png" alt="WhatsApp">
                </button>
                <a href="producto.html?id=${producto.id}" class="producto-link">
                    <img src="${producto.imagen}" alt="${producto.nombre}" loading="lazy" class="producto-imagen">
                    <h3>${producto.nombre}</h3>
                </a>
                <p class="precio">$${producto.precio.toFixed(2)}</p>
                <p class="stock-info">Disponibles: ${producto.stock}</p>
                <div class="agregar-controls">
                    <input type="number" class="cantidad-input" value="1" min="1" max="${producto.stock}" aria-label="Cantidad">
                    <button class="btn-agregar-carrito" aria-label="Agregar al carrito">Agregar</button>
                </div>
            `;
            catalogoDiv.appendChild(productoCard);
        });
    }
    
    function compartirProducto(idProducto) {
        const producto = productos.find(p => p.id === idProducto);
        const text = `¡Mira este producto en Home & Stationery: ${producto.nombre} por solo $${producto.precio.toFixed(2)}!`;
        const pageUrl = window.location.origin + window.location.pathname.replace('index.html', '') + `producto.html?id=${producto.id}`;
        
        const url = `https://api.whatsapp.com/send?text=${encodeURIComponent(text + ' ' + pageUrl)}`;
        window.open(url, '_blank');
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
        // El clic en la imagen o título se maneja por el enlace <a> ahora
    });

    async function init() {
        try {
            const response = await fetch('productos.json');
            if (!response.ok) throw new Error('No se pudo cargar la lista de productos.');
            productos = await response.json();
            
            document.body.dataset.theme = appState.theme;
            themeToggleBtn.textContent = appState.theme === 'light' ? '🌙' : '☀️';

            if (appState.user.nombre === 'Visitante') {
                setTimeout(() => {
                    const nombre = prompt("¡Bienvenido a la papelería! ¿Cuál es tu nombre?");
                    if (nombre && nombre.trim()) {
                        appState.user.nombre = nombre.trim();
                        saveState('user');
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
        contenidoCarritoDiv.innerHTML = '';
        if (appState.carrito.length === 0) {
            contenidoCarritoDiv.innerHTML = '<p>Tu carrito está vacío.</p>';
            carritoTotalSpan.textContent = '0.00';
            contadorCarritoSpan.textContent = '0';
            infoDescuentoP.textContent = '';
            infoEnvioP.textContent = '';
            return;
        }

        let total = 0;
        let totalItems = 0;
        let descuento = 0;
        const MONTO_ENVIO_GRATIS = 100;

        const libretasEnCarrito = appState.carrito.find(item => item.nombre.toLowerCase().includes("libreta"));
        if (libretasEnCarrito && libretasEnCarrito.cantidad >= 3) {
            descuento = 15;
            infoDescuentoP.textContent = '¡Descuento de $15.00 aplicado por combo de libretas!';
        } else {
            infoDescuentoP.textContent = '';
        }

        appState.carrito.forEach(item => {
            const itemDiv = document.createElement('div');
            itemDiv.classList.add('carrito-item');
            itemDiv.dataset.id = item.id;
            itemDiv.innerHTML = `
                <img src="${item.imagen}" alt="${item.nombre}">
                <div class="carrito-item-info">
                    <h4>${item.nombre}</h4>
                    <p>$${item.precio.toFixed(2)} x ${item.cantidad}</p>
                </div>
                <button class="btn-eliminar-item" aria-label="Eliminar ${item.nombre} del carrito">X</button>
            `;
            contenidoCarritoDiv.appendChild(itemDiv);
            total += item.precio * item.cantidad;
            totalItems += item.cantidad;
        });

        const totalConDescuento = total - descuento;

        if (totalConDescuento >= MONTO_ENVIO_GRATIS) {
            infoEnvioP.textContent = '¡Felicidades! Tu envío es GRATIS.';
        } else {
            infoEnvioP.textContent = `Te faltan $${(MONTO_ENVIO_GRATIS - totalConDescuento).toFixed(2)} para el envío gratis.`;
        }

        carritoTotalSpan.textContent = totalConDescuento.toFixed(2);
        contadorCarritoSpan.textContent = totalItems;
    }
    
    function renderizarSugerencias(query) {
        searchSuggestionsDiv.innerHTML = '';
        if (!query) return;
        const sugerencias = productos.filter(p => p.nombre.toLowerCase().includes(query.toLowerCase()));
        sugerencias.slice(0, 5).forEach(s => {
            const sugItem = document.createElement('div');
            sugItem.classList.add('suggestion-item');
            sugItem.textContent = s.nombre;
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
        if (appState.recentlyViewed.length === 0 || productos.length === 0) {
            document.getElementById('productosVistos').style.display = 'none';
            return;
        }
        document.getElementById('productosVistos').style.display = 'block';
        const productosVistos = appState.recentlyViewed.map(id => productos.find(p => p.id === id)).filter(Boolean);
        productosVistos.reverse().slice(0, 5).forEach(producto => {
            const productoCard = document.createElement('div');
            productoCard.classList.add('producto');
            productoCard.innerHTML = `
                <a href="producto.html?id=${producto.id}" class="producto-link">
                    <img src="${producto.imagen}" alt="${producto.nombre}" loading="lazy">
                    <h3>${producto.nombre}</h3>
                </a>`;
            vistosRecientementeDiv.appendChild(productoCard);
        });
    }

    function renderizarHistorial() {
        contenidoHistorialDiv.innerHTML = '';
        let totalGastado = 0;
        if(appState.orderHistory.length === 0) {
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

        // Forzar reflow para que la transición se aplique
        imgClon.offsetHeight; 

        imgClon.style.setProperty('--target-top', `${carritoRect.top + carritoRect.height / 2}px`);
        imgClon.style.setProperty('--target-left', `${carritoRect.left + carritoRect.width / 2}px`);
        
        imgClon.style.top = `var(--target-top)`;
        imgClon.style.left = `var(--target-left)`;

        imgClon.addEventListener('animationend', () => {
            imgClon.remove();
        });
    }

    function agregarAlCarrito(idProducto, cantidad = 1, imgElement) {
        const producto = productos.find(p => p.id === idProducto);
        if (!producto) return;

        if (imgElement) {
            animarVueloAlCarrito(imgElement);
        }

        const itemEnCarrito = appState.carrito.find(p => p.id === idProducto);
        if (itemEnCarrito) {
            const nuevaCantidad = itemEnCarrito.cantidad + cantidad;
            if (nuevaCantidad <= producto.stock) {
                itemEnCarrito.cantidad = nuevaCantidad;
                mostrarToast(`${cantidad} x ${producto.nombre} agregado(s).`);
            } else {
                mostrarToast(`No puedes agregar más. Solo quedan ${producto.stock - itemEnCarrito.cantidad} disponibles.`, 'error');
            }
        } else {
            if (cantidad <= producto.stock) {
                appState.carrito.push({ ...producto, cantidad: cantidad });
                mostrarToast(`${cantidad} x ${producto.nombre} agregado(s) al carrito.`);
                recomendarProductos(producto.categoria, producto.id);
            } else {
                 mostrarToast(`No puedes agregar esa cantidad. Solo hay ${producto.stock} disponibles.`, 'error');
            }
        }
        actualizarYGuardarCarrito();
    }
    
    function recomendarProductos(categoria, excludeId) {
        const recomendados = productos.filter(p => p.categoria === categoria && p.id !== excludeId);
        if (recomendados.length > 0) {
            const productoRecomendado = recomendados[Math.floor(Math.random() * recomendados.length)];
            mostrarToast(`Quizás también te interese: ${productoRecomendado.nombre}`, 'info', 5000);
        }
    }

    function eliminarDelCarrito(idProducto) {
        appState.carrito = appState.carrito.filter(item => item.id !== idProducto);
        mostrarToast('Producto eliminado del carrito.');
        actualizarYGuardarCarrito();
    }
    
    function vaciarCarrito() {
        if (appState.carrito.length > 0) {
            if (confirm('¿Estás seguro de que quieres vaciar todo tu carrito?')) {
                appState.carrito = [];
                actualizarYGuardarCarrito();
                mostrarToast('El carrito ha sido vaciado.', 'info');
            }
        } else {
            mostrarToast('El carrito ya está vacío.', 'error');
        }
    }

    function guardarCarritoActual() {
        if(appState.carrito.length === 0) {
            mostrarToast('El carrito está vacío.', 'error');
            return;
        }
        appState.savedCarts.push([...appState.carrito]);
        appState.carrito = [];
        actualizarYGuardarCarrito();
        saveState('savedCarts');
        mostrarToast('Carrito guardado. Puedes continuar comprando.');
    }

    function recuperarCarrito(index) {
        if(appState.carrito.length > 0 && !confirm('Tienes productos en tu carrito actual. ¿Deseas reemplazarlos?')) return;
        appState.carrito = appState.savedCarts[index];
        appState.savedCarts.splice(index, 1);
        actualizarYGuardarCarrito();
        saveState('savedCarts');
        modalCarritosGuardados.classList.add('oculto');
        mostrarToast('Carrito recuperado exitosamente.');
    }
    
    function filtrarProductos() {
        const texto = buscadorInput.value.toLowerCase();
        const categoria = categoriaFiltroSelect.value;
        const productosFiltrados = productos.filter(producto => {
            const coincideTexto = producto.nombre.toLowerCase().includes(texto);
            const coincideCategoria = categoria === 'todos' || producto.categoria === categoria;
            return coincideTexto && coincideCategoria;
        });
        renderizarProductos(productosFiltrados);
    }
    
    function saveState(key) {
        localStorage.setItem(key, JSON.stringify(appState[key]));
    }

    function actualizarYGuardarCarrito() {
        renderizarCarrito();
        saveState('carrito');
    }
    
    function logRecentView(productId) {
        appState.recentlyViewed = appState.recentlyViewed.filter(id => id !== productId);
        appState.recentlyViewed.push(productId);
        if (appState.recentlyViewed.length > 10) appState.recentlyViewed.shift();
        saveState('recentlyViewed');
        renderizarVistosRecientemente();
    }

    function mostrarToast(mensaje, tipo = 'success', duracion = 3000) {
        toastDiv.textContent = mensaje;
        toastDiv.className = 'toast mostrar';
        if (tipo === 'error') toastDiv.classList.add('error');
        if (tipo === 'info') toastDiv.classList.add('info');
        setTimeout(() => { toastDiv.classList.remove('mostrar'); }, duracion);
    }

    function toggleTheme() {
        appState.theme = appState.theme === 'light' ? 'dark' : 'light';
        document.body.dataset.theme = appState.theme;
        themeToggleBtn.textContent = appState.theme === 'light' ? '🌙' : '☀️';
        localStorage.setItem('theme', appState.theme);
    }

    function enviarPedidoWhatsApp() {
        if (appState.carrito.length === 0) {
            mostrarToast('Tu carrito está vacío.', 'error');
            return;
        }
        let mensaje = `¡Hola! Soy ${appState.user.nombre}, quisiera hacer el siguiente pedido:\n\n`;
        let total = 0;
        appState.carrito.forEach(item => {
            mensaje += `- ${item.nombre} (x${item.cantidad}) - $${(item.precio * item.cantidad).toFixed(2)}\n`;
            total += item.precio * item.cantidad;
        });
        const libretasEnCarrito = appState.carrito.find(item => item.nombre.toLowerCase().includes("libreta"));
        if (libretasEnCarrito && libretasEnCarrito.cantidad >= 3) {
            total -= 15;
            mensaje += `\nDescuento "Combo Libretas": -$15.00\n`;
        }
        mensaje += `\n*Total: $${total.toFixed(2)}*`;
        appState.orderHistory.push({ fecha: new Date().toISOString(), items: [...appState.carrito], total: total });
        saveState('orderHistory');
        appState.carrito = [];
        actualizarYGuardarCarrito();
        const telefono = '522481602590';
        const url = `https://wa.me/${telefono}?text=${encodeURIComponent(mensaje)}`;
        window.open(url, '_blank');
        setTimeout(() => encuestaContainer.classList.remove('oculto'), 2000);
    }
    
    // --- Event Listeners ---
    btnMenu.addEventListener('click', () => sidebar.classList.toggle('visible'));
    buscadorInput.addEventListener('input', () => renderizarSugerencias(buscadorInput.value));
    buscadorInput.addEventListener('keyup', filtrarProductos);
    themeToggleBtn.addEventListener('click', toggleTheme);
    historialPedidosBtn.addEventListener('click', () => { renderizarHistorial(); modalHistorial.classList.remove('oculto'); });
    cerrarHistorialModalBtn.addEventListener('click', () => modalHistorial.classList.add('oculto'));
    guardarCarritoBtn.addEventListener('click', guardarCarritoActual);
    verCarritosGuardadosBtn.addEventListener('click', () => { renderizarCarritosGuardados(); modalCarritosGuardados.classList.remove('oculto'); });
    cerrarCarritosGuardadosModalBtn.addEventListener('click', () => modalCarritosGuardados.classList.add('oculto'));
    modalCarritosGuardados.addEventListener('click', e => { if(e.target.classList.contains('btn-recuperar-carrito')) { recuperarCarrito(parseInt(e.target.dataset.index)); } });
    encuestaContainer.addEventListener('click', e => { if(e.target.tagName === 'BUTTON') { encuestaContainer.innerHTML = '<p>¡Gracias por tu opinión!</p>'; setTimeout(() => encuestaContainer.classList.add('oculto'), 2000); } });
    contenidoCarritoDiv.addEventListener('click', e => { if (e.target.classList.contains('btn-eliminar-item')) { const id = parseInt(e.target.closest('.carrito-item').dataset.id); eliminarDelCarrito(id); } });
    abrirCarritoBtn.addEventListener('click', () => carritoFlotante.classList.add('abierto'));
    cerrarCarritoBtn.addEventListener('click', () => carritoFlotante.classList.remove('abierto'));
    enviarPedidoBtn.addEventListener('click', enviarPedidoWhatsApp);
    vaciarCarritoBtn.addEventListener('click', vaciarCarrito);
    categoriaFiltroSelect.addEventListener('change', filtrarProductos);

    init();
});
