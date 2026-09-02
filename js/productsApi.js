// productsApi.js
// Punto único de carga de productos.json. Si dos partes de la misma página
// piden los productos, solo se hace un fetch (se comparte la misma promesa).

let productosCache = null;
let fetchEnCurso = null;

export async function fetchProductos() {
    if (productosCache) return productosCache;

    if (!fetchEnCurso) {
        fetchEnCurso = fetch('productos.json')
            .then(response => {
                if (!response.ok) throw new Error('No se pudo cargar la lista de productos.');
                return response.json();
            })
            .then(data => {
                productosCache = data;
                return data;
            })
            .finally(() => {
                fetchEnCurso = null;
            });
    }

    return fetchEnCurso;
}

export function getProductoById(productos, id) {
    return productos.find(p => p.id === id);
}
