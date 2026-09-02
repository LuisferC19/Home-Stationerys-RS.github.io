// cart.js
// Toda la lógica del carrito en un solo lugar. Antes, index.html (script.js) y
// producto.html (producto.js) tenían cada uno su propia versión de "agregar al
// carrito", y podían desincronizarse (por ejemplo, agregar desde el detalle no
// disparaba la recomendación de productos). Ahora ambas páginas importan esto.

import { getItem, setItem } from './storage.js';

const CART_KEY = 'carrito';
const MONTO_ENVIO_GRATIS = 100;

export function getCart() {
    return getItem(CART_KEY, []);
}

export function saveCart(cart) {
    setItem(CART_KEY, cart);
}

export function addToCart(producto, cantidad = 1) {
    const cart = getCart();
    const itemEnCarrito = cart.find(p => p.id === producto.id);
    const yaEstaba = Boolean(itemEnCarrito);

    if (itemEnCarrito) {
        itemEnCarrito.cantidad += cantidad;
    } else {
        cart.push({ ...producto, cantidad });
    }

    saveCart(cart);
    return { cart, yaEstaba };
}

export function removeFromCart(idProducto) {
    const cart = getCart().filter(item => item.id !== idProducto);
    saveCart(cart);
    return cart;
}

export function clearCart() {
    saveCart([]);
    return [];
}

export function getCartTotals(cart) {
    let total = 0;
    let totalItems = 0;
    cart.forEach(item => {
        total += item.precio * item.cantidad;
        totalItems += item.cantidad;
    });
    return { total, totalItems };
}

export function getMontoEnvioGratis() {
    return MONTO_ENVIO_GRATIS;
}
