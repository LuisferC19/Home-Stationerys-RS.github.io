document.addEventListener('DOMContentLoaded', () => {

    const mainContent = document.getElementById('producto-detalle');
    const nombreUsuarioSpan = document.getElementById('nombreUsuario');
    const toastDiv = document.getElementById('toast');
    let productos = [];

    async function cargarProducto() {
        try {
            // Cargar la base de datos de productos
            const response = await fetch('productos.json');
            if (!response.ok) throw new Error('No se pudo cargar la base de datos de productos.');
            productos = await response.json();

            // Obtener el ID del producto de la URL
            const params = new URLSearchParams(window.location.search);
            const productoId = parseInt(params.get('id'));

            if (!productoId) throw new Error('No se especificó un ID de producto.');

            const producto = productos.find(p => p.id === productoId);

            if (!producto) throw new Error('Producto no encontrado.');

            // Actualizar el título de la página
            document.title = `${producto.nombre} - Home & Stationery`;
            
            // Renderizar el producto
            renderizarDetalleProducto(producto);
            
            // Renderizar productos relacionados
            renderizarProductosRelacionados(producto.categoria, producto.id);

            // Log de visto recientemente
            logRecentView(producto.id);

        } catch (error) {
            console.error('Error al cargar el producto:', error);
            mainContent.innerHTML = `<p style="text-align: center; padding: 2rem;">${error.message}</p>`;
        }
    }

    function renderizarDetalleProducto(producto) {
        mainContent.innerHTML = `
            <div class="producto-detalle-container">
                <div class="producto-detalle-imagen">
                    <img src="${producto.imagen}" alt="${producto.nombre}">
                </div>
                <div class="producto-detalle-info">
                    <h1>${producto.nombre}</h1>
                    <p class="precio">$${producto.precio.toFixed(2)}</p>
                    <p class="descripcion">${producto.descripcion}</p>
                    <p class="stock-info">Disponibles: ${producto.stock}</p>
                    <div class="agregar-controls">
                        <input type="number" id="cantidad-detalle" class="cantidad-input" value="1" min="1" max="${producto.stock}" aria-label="Cantidad">
                        <button id="btn-agregar-detalle" class="btn-agregar-carrito">Agregar al Carrito</button>
                    </div>
                </div>
                <div id="productos-relacionados" class="productos-relacionados">
                    <h2>Productos Relacionados</h2>
                    <div id="catalogo-relacionados" class="catalogo-reducido"></div>
                </div>
            </div>
        `;

        // Añadir evento al botón de agregar
        document.getElementById('btn-agregar-detalle').addEventListener('click', () => {
            const cantidad = parseInt(document.getElementById('cantidad-detalle').value);
            agregarAlCarrito(producto, cantidad);
        });
    }

    function renderizarProductosRelacionados(categoria, idActual) {
        const catalogoRelacionadosDiv = document.getElementById('catalogo-relacionados');
        const relacionados = productos
            .filter(p => p.categoria === categoria && p.id !== idActual)
            .slice(0, 4); // Mostrar hasta 4 relacionados

        if (relacionados.length === 0) {
            document.getElementById('productos-relacionados').style.display = 'none';
            return;
        }
        
        relacionados.forEach(producto => {
            const productoCard = document.createElement('div');
            productoCard.classList.add('producto');
            productoCard.innerHTML = `
                <a href="producto.html?id=${producto.id}" class="producto-link">
                    <img src="${producto.imagen}" alt="${producto.nombre}" loading="lazy">
                    <h3>${producto.nombre}</h3>
                    <p class="precio">$${producto.precio.toFixed(2)}</p>
                </a>
            `;
            catalogoRelacionadosDiv.appendChild(productoCard);
        });
    }

    function agregarAlCarrito(producto, cantidad) {
        const carrito = JSON.parse(localStorage.getItem('carrito')) || [];
        const itemEnCarrito = carrito.find(p => p.id === producto.id);

        if (itemEnCarrito) {
            const nuevaCantidad = itemEnCarrito.cantidad + cantidad;
            if (nuevaCantidad <= producto.stock) {
                itemEnCarrito.cantidad = nuevaCantidad;
                mostrarToast(`${cantidad} x ${producto.nombre} agregado(s).`);
            } else {
                 mostrarToast(`No puedes agregar más. El total en carrito excedería el stock.`, 'error');
            }
        } else {
             if (cantidad <= producto.stock) {
                carrito.push({ ...producto, cantidad: cantidad });
                mostrarToast(`${cantidad} x ${producto.nombre} agregado(s) al carrito.`);
            } else {
                 mostrarToast(`No puedes agregar esa cantidad. Solo hay ${producto.stock} disponibles.`, 'error');
            }
        }
        localStorage.setItem('carrito', JSON.stringify(carrito));
    }
    
    function logRecentView(productId) {
        let recentlyViewed = JSON.parse(localStorage.getItem('recentlyViewed')) || [];
        recentlyViewed = recentlyViewed.filter(id => id !== productId);
        recentlyViewed.push(productId);
        if (recentlyViewed.length > 10) recentlyViewed.shift();
        localStorage.setItem('recentlyViewed', JSON.stringify(recentlyViewed));
    }
    
    function mostrarToast(mensaje, tipo = 'success', duracion = 3000) {
        toastDiv.textContent = mensaje;
        toastDiv.className = 'toast mostrar';
        if (tipo === 'error') toastDiv.classList.add('error');
        if (tipo === 'info') toastDiv.classList.add('info');
        setTimeout(() => { toastDiv.classList.remove('mostrar'); }, duracion);
    }
    
    function init() {
        // Cargar tema y nombre de usuario desde localStorage
        const theme = localStorage.getItem('theme') || 'light';
        document.body.dataset.theme = theme;
        
        const user = JSON.parse(localStorage.getItem('user')) || { nombre: 'Visitante' };
        nombreUsuarioSpan.textContent = user.nombre;

        cargarProducto();
    }

    init();
});
