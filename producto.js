document.addEventListener('DOMContentLoaded', () => {
    const nombreUsuarioSpan = document.getElementById('nombreUsuario');
    const toastDiv = document.getElementById('toast');
    
    // Selectores para los elementos de la página de detalle
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
            const response = await fetch('productos.json');
            if (!response.ok) throw new Error('No se pudo cargar la base de datos de productos.');
            productos = await response.json();

            const params = new URLSearchParams(window.location.search);
            const productoId = parseInt(params.get('id'));
            if (!productoId) throw new Error('ID de producto no válido.');

            productoActual = productos.find(p => p.id === productoId);
            if (!productoActual) throw new Error('Producto no encontrado.');

            cargarInfoUsuario();
            renderizarDetalleProducto();
            renderizarProductosRelacionados();
            logRecentView(productoActual.id);
        } catch (error) {
            console.error('Error al inicializar la página:', error);
            nombreEl.textContent = 'Error';
            descripcionEl.textContent = error.message;
        }
    }

    function cargarInfoUsuario() {
        const theme = localStorage.getItem('theme') || 'light';
        document.body.dataset.theme = theme;
        const user = JSON.parse(localStorage.getItem('user')) || { nombre: 'Visitante' };
        nombreUsuarioSpan.textContent = user.nombre;
    }

    function renderizarDetalleProducto() {
        document.title = `${productoActual.nombre} - Home & Stationery`;
        nombreEl.textContent = productoActual.nombre;
        precioEl.textContent = `$${productoActual.precio.toFixed(2)}`;
        descripcionEl.textContent = productoActual.descripcion;

        // Configurar galería de imágenes
        if (productoActual.imagenes && productoActual.imagenes.length > 0) {
            imagenPrincipalEl.src = productoActual.imagenes[0];
            imagenPrincipalEl.alt = productoActual.nombre;
            
            galeriaThumbnailsEl.innerHTML = '';
            productoActual.imagenes.forEach((imgSrc, index) => {
                const thumb = document.createElement('img');
                thumb.src = imgSrc;
                thumb.alt = `Vista ${index + 1} de ${productoActual.nombre}`;
                thumb.classList.add('thumbnail-img');
                if (index === 0) {
                    thumb.classList.add('active');
                }
                thumb.addEventListener('click', () => {
                    imagenPrincipalEl.src = imgSrc;
                    // Actualizar la clase 'active'
                    galeriaThumbnailsEl.querySelector('.active')?.classList.remove('active');
                    thumb.classList.add('active');
                });
                galeriaThumbnailsEl.appendChild(thumb);
            });
        }

        // Configurar botón de agregar
        document.getElementById('btn-agregar-detalle').addEventListener('click', () => {
            const cantidad = parseInt(document.getElementById('cantidad-detalle').value);
            agregarAlCarrito(productoActual, cantidad);
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
            const productoCard = document.createElement('div');
            productoCard.classList.add('producto');
            productoCard.innerHTML = `
                <a href="producto.html?id=${producto.id}" class="producto-link">
                    <img src="${producto.imagenes[0]}" alt="${producto.nombre}" loading="lazy">
                    <h3>${producto.nombre}</h3>
                    <p class="precio">$${producto.precio.toFixed(2)}</p>
                </a>
            `;
            catalogoRelacionadosEl.appendChild(productoCard);
        });
    }

    function agregarAlCarrito(producto, cantidad) {
        let carrito = JSON.parse(localStorage.getItem('carrito')) || [];
        const itemEnCarrito = carrito.find(p => p.id === producto.id);

        if (itemEnCarrito) {
            itemEnCarrito.cantidad += cantidad;
        } else {
            carrito.push({ ...producto, cantidad });
        }
        
        localStorage.setItem('carrito', JSON.stringify(carrito));
        mostrarToast(`${cantidad} x ${producto.nombre} agregado(s) al carrito.`);
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

    init();
});
