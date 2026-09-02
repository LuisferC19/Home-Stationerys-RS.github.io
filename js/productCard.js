// productCard.js
// Antes, el HTML de la tarjeta de producto estaba copiado y pegado en 3 lugares
// (catálogo principal, "vistos recientemente" y "productos relacionados"), cada
// uno ligeramente distinto. Aquí queda en un solo lugar, con una variante por caso.
//
// variante:
//   'catalogo'    -> tarjeta completa: imagen, nombre, botón compartir, precio,
//                     cantidad y botón "Agregar" (catálogo principal).
//   'reducida'    -> solo imagen + nombre, sin precio ni controles
//                     ("Vistos recientemente" en index.html).
//   'relacionada' -> imagen + nombre + precio, sin controles
//                     ("Productos relacionados" en producto.html).

const FALLBACK_ONERROR = "this.onerror=null;this.src='img/thumb/FaltaImg.webp';";

export function crearTarjetaProducto(producto, { variante = 'catalogo' } = {}) {
    const card = document.createElement('div');
    card.classList.add('producto');
    card.dataset.id = producto.id;

    if (variante === 'catalogo') {
        card.innerHTML = `
            <button class="share-btn" aria-label="Compartir por WhatsApp">
                <img src="https://img.icons8.com/color/24/000000/whatsapp--v1.png" alt="WhatsApp">
            </button>
            <a href="producto.html?id=${producto.id}" class="producto-link">
                <img src="${producto.miniaturas[0]}" alt="${producto.nombre}" loading="lazy" class="producto-imagen" onerror="${FALLBACK_ONERROR}">
                <h3>${producto.nombre}</h3>
            </a>
            <p class="precio">$${producto.precio.toFixed(2)}</p>
            <div class="agregar-controls">
                <input type="number" class="cantidad-input" value="1" min="1" aria-label="Cantidad">
                <button class="btn-agregar-carrito" aria-label="Agregar al carrito">Agregar</button>
            </div>
        `;
    } else if (variante === 'relacionada') {
        card.innerHTML = `
            <a href="producto.html?id=${producto.id}" class="producto-link">
                <img src="${producto.miniaturas[0]}" alt="${producto.nombre}" loading="lazy" onerror="${FALLBACK_ONERROR}">
                <h3>${producto.nombre}</h3>
                <p class="precio">$${producto.precio.toFixed(2)}</p>
            </a>
        `;
    } else {
        // 'reducida'
        card.innerHTML = `
            <a href="producto.html?id=${producto.id}" class="producto-link">
                <img src="${producto.miniaturas[0]}" alt="${producto.nombre}" loading="lazy" onerror="${FALLBACK_ONERROR}">
                <h3>${producto.nombre}</h3>
            </a>
        `;
    }

    return card;
}
