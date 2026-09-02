// recentlyViewed.js
// Guarda los últimos productos vistos por el usuario (máx. 10), usado tanto
// en el catálogo (index.html) como al ver el detalle de un producto.

import { getItem, setItem } from './storage.js';

const KEY = 'recentlyViewed';
const MAX_ITEMS = 10;

export function getRecentlyViewed() {
    return getItem(KEY, []);
}

export function logRecentView(productId) {
    let ids = getRecentlyViewed().filter(id => id !== productId);
    ids.push(productId);
    if (ids.length > MAX_ITEMS) ids.shift();
    setItem(KEY, ids);
    return ids;
}
