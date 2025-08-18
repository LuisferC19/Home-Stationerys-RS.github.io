document.addEventListener('DOMContentLoaded', () => {

    // --- Base de datos de productos ---
    const productos = [
        // Productos existentes
        { id: 1, nombre: "Audífonos Inalámbricos", precio: 350, imagen: "img/Audifonos.jpg", categoria: "tecnologia", stock: 15, initialStock: 15 },
        { id: 2, nombre: "Calculadora Científica", precio: 280, imagen: "img/Calculadora.jpg", categoria: "utiles", stock: 25, initialStock: 25 },
        { id: 3, nombre: "Cargador de iPhone", precio: 250, imagen: "img/Cargador-iphone.jpg", categoria: "tecnologia", stock: 20, initialStock: 20 },
        { id: 8, nombre: "Mochila Escolar", precio: 450, imagen: "img/Mochila.jpg", categoria: "otros", stock: 10, initialStock: 10 },
        
        // --- NUEVOS PRODUCTOS DE LA LISTA ---
        // Recuerda cambiar la ruta de la imagen en cada uno de estos productos.
        { id: 10, nombre: "Libretas Cuadradas Scribe", precio: 23.00, imagen: "img/Libretas.jpg", categoria: "utiles", stock: 50, initialStock: 50 }, // CAMBIAR IMAGEN
        { id: 11, nombre: "Libretas Cuadradas Perron", precio: 28.00, imagen: "img/Libretas.jpg", categoria: "utiles", stock: 50, initialStock: 50 }, // CAMBIAR IMAGEN
        { id: 12, nombre: "Libretas Rayadas Perron", precio: 28.00, imagen: "img/Libretas.jpg", categoria: "utiles", stock: 50, initialStock: 50 }, // CAMBIAR IMAGEN
        { id: 13, nombre: "Libretas Cuadradas Estrella", precio: 20.00, imagen: "img/Libretas.jpg", categoria: "utiles", stock: 50, initialStock: 50 }, // CAMBIAR IMAGEN
        { id: 14, nombre: "Hojas de Color 50 pz", precio: 45.00, imagen: "img/Plato-ceramica.jpg", categoria: "utiles", stock: 40, initialStock: 40 }, // CAMBIAR IMAGEN
        { id: 15, nombre: "Hojas Blancas 50 pz", precio: 30.00, imagen: "img/Plato-ceramica.jpg", categoria: "utiles", stock: 40, initialStock: 40 }, // CAMBIAR IMAGEN
        { id: 16, nombre: "Resistol Dixon", precio: 11.00, imagen: "img/Goma.jpg", categoria: "utiles", stock: 80, initialStock: 80 }, // CAMBIAR IMAGEN
        { id: 17, nombre: "Plumones de 24 piezas", precio: 60.00, imagen: "img/Lapizero.jpg", categoria: "utiles", stock: 30, initialStock: 30 }, // CAMBIAR IMAGEN
        { id: 18, nombre: "Plumones de 12 piezas", precio: 35.00, imagen: "img/Lapizero.jpg", categoria: "utiles", stock: 30, initialStock: 30 }, // CAMBIAR IMAGEN
        { id: 19, nombre: "Lapicero negro Bic", precio: 7.00, imagen: "img/Lapizero.jpg", categoria: "utiles", stock: 100, initialStock: 100 }, // CAMBIAR IMAGEN
        { id: 20, nombre: "Lapicero Rojo Bic", precio: 7.00, imagen: "img/Lapizero.jpg", categoria: "utiles", stock: 100, initialStock: 100 }, // CAMBIAR IMAGEN
        { id: 21, nombre: "Lapicero Azul Bic", precio: 7.00, imagen: "img/Lapizero.jpg", categoria: "utiles", stock: 100, initialStock: 100 }, // CAMBIAR IMAGEN
        { id: 22, nombre: "Lápiz Maped", precio: 6.00, imagen: "img/Lapiz.jpg", categoria: "utiles", stock: 150, initialStock: 150 }, // CAMBIAR IMAGEN
        { id: 23, nombre: "Sacapuntas", precio: 2.00, imagen: "img/Goma.jpg", categoria: "utiles", stock: 200, initialStock: 200 }, // CAMBIAR IMAGEN
        { id: 24, nombre: "Corrector Pen de Lápiz", precio: 16.00, imagen: "img/Lapizero.jpg", categoria: "utiles", stock: 60, initialStock: 60 }, // CAMBIAR IMAGEN
        { id: 25, nombre: "Colores Vividel 12 pz", precio: 55.00, imagen: "img/Lapiz.jpg", categoria: "utiles", stock: 40, initialStock: 40 }, // CAMBIAR IMAGEN
        { id: 26, nombre: "Goma Factis", precio: 6.00, imagen: "img/Goma.jpg", categoria: "utiles", stock: 100, initialStock: 100 }, // CAMBIAR IMAGEN
        { id: 27, nombre: "Hojas de Fomi", precio: 5.00, imagen: "img/Plato-ceramica.jpg", categoria: "utiles", stock: 100, initialStock: 100 }, // CAMBIAR IMAGEN
        { id: 28, nombre: "Juego Geométrico", precio: 35.00, imagen: "img/Calculadora.jpg", categoria: "utiles", stock: 30, initialStock: 30 }, // CAMBIAR IMAGEN
        { id: 29, nombre: "Figuras de lego", precio: 30.00, imagen: "img/Mochila.jpg", categoria: "otros", stock: 20, initialStock: 20 }, // CAMBIAR IMAGEN
        { id: 30, nombre: "Lápiz duo", precio: 8.00, imagen: "img/Lapiz.jpg", categoria: "utiles", stock: 100, initialStock: 100 }, // CAMBIAR IMAGEN
        { id: 31, nombre: "Lápiz bicolor", precio: 8.00, imagen: "img/Lapiz.jpg", categoria: "utiles", stock: 100, initialStock: 100 }, // CAMBIAR IMAGEN
        { id: 32, nombre: "Audífonos de cable", precio: 25.00, imagen: "img/Audifonos.jpg", categoria: "tecnologia", stock: 40, initialStock: 40 }, // CAMBIAR IMAGEN
        { id: 33, nombre: "Plumones de pizarrón 3pz", precio: 36.00, imagen: "img/Lapizero.jpg", categoria: "utiles", stock: 30, initialStock: 30 }, // CAMBIAR IMAGEN
        { id: 34, nombre: "Marca textos 3pz", precio: 30.00, imagen: "img/Lapizero.jpg", categoria: "utiles", stock: 30, initialStock: 30 }, // CAMBIAR IMAGEN
        { id: 35, nombre: "Soportes para celular", precio: 12.00, imagen: "img/Cargador-iphone.jpg", categoria: "tecnologia", stock: 50, initialStock: 50 }, // CAMBIAR IMAGEN
        { id: 36, nombre: "Juego de uno", precio: 25.00, imagen: "img/Mochila.jpg", categoria: "otros", stock: 25, initialStock: 25 }, // CAMBIAR IMAGEN
        { id: 37, nombre: "Pistola de silicón", precio: 40.00, imagen: "img/Calculadora.jpg", categoria: "otros", stock: 20, initialStock: 20 }, // CAMBIAR IMAGEN
        { id: 38, nombre: "Mini engrapadora", precio: 30.00, imagen: "img/Calculadora.jpg", categoria: "utiles", stock: 30, initialStock: 30 }, // CAMBIAR IMAGEN
        { id: 39, nombre: "Cinta adhesiva", precio: 5.00, imagen: "img/Goma.jpg", categoria: "utiles", stock: 100, initialStock: 100 }, // CAMBIAR IMAGEN
        { id: 40, nombre: "Forro adhesivo 1 metro", precio: 11.00, imagen: "img/Plato-ceramica.jpg", categoria: "utiles", stock: 80, initialStock: 80 } // CAMBIAR IMAGEN
    ];

    // --- Estado de la aplicación ---
    const appState = {
        carrito: JSON.parse(localStorage.getItem('carrito')) || [],
        user: JSON.parse(localStorage.getItem('user')) || { nombre: 'Visitante' },
        theme: localStorage.getItem('theme') || 'light',
        recentlyViewed: JSON.parse(localStorage.getItem('recentlyViewed')) || [],
        orderHistory: JSON.parse(localStorage.getItem('orderHistory')) || [],
        savedCarts: JSON.parse(localStorage.getItem('savedCarts')) || [],
    };
    
    // --- Selectores del DOM ---
    const catalogoDiv = document.getElementById('catalogo');
    const abrirCarritoBtn = document.getElementById('abrirCarrito');
    const cerrarCarritoBtn = document.getElementById('cerrarCarritoBtn');
    const contenidoCarritoDiv = document.getElementById('contenidoCarrito');
    const carritoTotalSpan = document.getElementById('carritoTotal');
    const contadorCarritoSpan = document.getElementById('contadorCarrito');
    const enviarPedidoBtn = document.getElementById('enviarPedidoBtn');
    const buscadorInput = document.getElementById('buscador');
    const categoriaFiltroSelect = document.getElementById('categoriaFiltro');
    const btnMenu = document.getElementById('btnMenu');
    const sidebar = document.getElementById('sidebar');
    const nombreUsuarioSpan = document.getElementById('nombreUsuario');
    const themeToggleBtn = document.getElementById('themeToggleBtn');
    const carritoFlotante = document.getElementById('carritoFlotante');
    const toastDiv = document.getElementById('toast');
    const modalImagen = document.getElementById('modalImagen');
    const imagenModalContent = document.getElementById('imagenModal');
    const cerrarModalBtn = document.getElementById('cerrarModal');
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


    // --- Renderiza los productos en el catálogo ---
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
                <img src="${producto.imagen}" alt="${producto.nombre}" class="imagen-producto" loading="lazy">
                <h3>${producto.nombre}</h3>
                <p class="precio">$${producto.precio.toFixed(2)}</p>
                <p class="stock-info">Disponibles: ${producto.stock}</p>
                <button class="btn-agregar-carrito" aria-label="Agregar ${producto.nombre} al carrito">Agregar al Carrito</button>
            `;
            catalogoDiv.appendChild(productoCard);
        });
    }
    
    // --- Comparte un producto por WhatsApp ---
    function compartirProducto(idProducto) {
        const producto = productos.find(p => p.id === idProducto);
        const text = `¡Mira este producto en Material Escolar Tepetitla: ${producto.nombre} por solo $${producto.precio.toFixed(2)}!`;
        const pageUrl = window.location.href;
        
        const url = `https://api.whatsapp.com/send?text=${encodeURIComponent(text + ' ' + pageUrl)}`;
        window.open(url, '_blank');
    }

    // --- Controla el menú lateral en móviles ---
    btnMenu.addEventListener('click', () => {
        sidebar.classList.toggle('visible');
    });

    // --- Maneja los clics en el catálogo ---
    catalogoDiv.addEventListener('click', e => {
        const productoCard = e.target.closest('.producto');
        if (!productoCard) return;

        const id = parseInt(productoCard.dataset.id);
        
        if (e.target.classList.contains('btn-agregar-carrito')) {
            agregarAlCarrito(id);
        } else if (e.target.classList.contains('imagen-producto')) {
            logRecentView(id);
        } else if (e.target.closest('.share-btn')) {
            compartirProducto(id);
        }
    });

    // --- Inicializa la aplicación ---
    function init() {
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
    }
    
    // --- Renderiza el contenido del carrito ---
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
    
    // --- Muestra sugerencias de búsqueda ---
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

    // --- Muestra productos vistos recientemente ---
    function renderizarVistosRecientemente() {
        vistosRecientementeDiv.innerHTML = '';
        if (appState.recentlyViewed.length === 0) {
            document.getElementById('productosVistos').style.display = 'none';
            return;
        }
        document.getElementById('productosVistos').style.display = 'block';
        const productosVistos = appState.recentlyViewed.map(id => productos.find(p => p.id === id)).filter(Boolean);
        productosVistos.reverse().slice(0, 5).forEach(producto => {
            const productoCard = document.createElement('div');
            productoCard.classList.add('producto');
            productoCard.innerHTML = `<img src="${producto.imagen}" alt="${producto.nombre}" loading="lazy"><h3>${producto.nombre}</h3><button onclick="document.getElementById('buscador').value='${producto.nombre}'; filtrarProductos();">Ver producto</button>`;
            vistosRecientementeDiv.appendChild(productoCard);
        });
    }

    // --- Muestra el historial de pedidos ---
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

    // --- Muestra los carritos guardados ---
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

    // --- Agrega un producto al carrito ---
    function agregarAlCarrito(idProducto) {
        const producto = productos.find(p => p.id === idProducto);
        const itemEnCarrito = appState.carrito.find(p => p.id === idProducto);
        if (itemEnCarrito) {
            if (itemEnCarrito.cantidad < producto.stock) {
                itemEnCarrito.cantidad++;
                mostrarToast(`${producto.nombre} agregado.`);
            } else {
                mostrarToast('No hay más stock disponible.', 'error');
            }
        } else {
            appState.carrito.push({ ...producto, cantidad: 1 });
            mostrarToast(`${producto.nombre} agregado al carrito.`);
            recomendarProductos(producto.categoria, producto.id);
        }
        actualizarYGuardarCarrito();
    }
    
    // --- Recomienda productos similares ---
    function recomendarProductos(categoria, excludeId) {
        const recomendados = productos.filter(p => p.categoria === categoria && p.id !== excludeId);
        if (recomendados.length > 0) {
            const productoRecomendado = recomendados[Math.floor(Math.random() * recomendados.length)];
            mostrarToast(`Quizás también te interese: ${productoRecomendado.nombre}`, 'info', 5000);
        }
    }

    // --- Elimina un producto del carrito ---
    function eliminarDelCarrito(idProducto) {
        appState.carrito = appState.carrito.filter(item => item.id !== idProducto);
        mostrarToast('Producto eliminado del carrito.');
        actualizarYGuardarCarrito();
    }
    
    // --- Guarda el carrito actual para más tarde ---
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

    // --- Recupera un carrito guardado ---
    function recuperarCarrito(index) {
        if(appState.carrito.length > 0 && !confirm('Tienes productos en tu carrito actual. ¿Deseas reemplazarlos?')) return;
        appState.carrito = appState.savedCarts[index];
        appState.savedCarts.splice(index, 1);
        actualizarYGuardarCarrito();
        saveState('savedCarts');
        modalCarritosGuardados.classList.add('oculto');
        mostrarToast('Carrito recuperado exitosamente.');
    }
    
    // --- Filtra productos por texto y categoría ---
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
    
    // --- Guarda una parte del estado en localStorage ---
    function saveState(key) {
        localStorage.setItem(key, JSON.stringify(appState[key]));
    }

    // --- Actualiza el carrito y lo guarda ---
    function actualizarYGuardarCarrito() {
        renderizarCarrito();
        saveState('carrito');
    }
    
    // --- Registra un producto como visto recientemente ---
    function logRecentView(productId) {
        appState.recentlyViewed = appState.recentlyViewed.filter(id => id !== productId);
        appState.recentlyViewed.push(productId);
        if (appState.recentlyViewed.length > 10) appState.recentlyViewed.shift();
        saveState('recentlyViewed');
        renderizarVistosRecientemente();
    }

    // --- Muestra una notificación (toast) ---
    function mostrarToast(mensaje, tipo = 'success', duracion = 3000) {
        toastDiv.textContent = mensaje;
        toastDiv.className = 'toast mostrar';
        if (tipo === 'error') toastDiv.classList.add('error');
        if (tipo === 'info') toastDiv.classList.add('info');
        setTimeout(() => { toastDiv.classList.remove('mostrar'); }, duracion);
    }

    // --- Cambia entre tema claro y oscuro ---
    function toggleTheme() {
        appState.theme = appState.theme === 'light' ? 'dark' : 'light';
        document.body.dataset.theme = appState.theme;
        themeToggleBtn.textContent = appState.theme === 'light' ? '🌙' : '☀️';
        saveState('theme');
    }

    // --- Envía el pedido por WhatsApp ---
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
    cerrarModalBtn.addEventListener('click', () => modalImagen.classList.add('oculto'));
    enviarPedidoBtn.addEventListener('click', enviarPedidoWhatsApp);
    categoriaFiltroSelect.addEventListener('change', filtrarProductos);

    init();
});
