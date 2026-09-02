// storage.js
// Helpers para leer/guardar datos en localStorage como JSON, con manejo de errores.
// Todo el resto de la app pasa por aquí en vez de llamar a localStorage directamente,
// así evitamos que cada módulo repita su propio try/catch y JSON.parse/stringify.

export function getItem(key, fallback) {
    try {
        const raw = localStorage.getItem(key);
        return raw !== null ? JSON.parse(raw) : fallback;
    } catch (error) {
        console.error(`No se pudo leer "${key}" de localStorage:`, error);
        return fallback;
    }
}

export function setItem(key, value) {
    try {
        localStorage.setItem(key, JSON.stringify(value));
        return true;
    } catch (error) {
        console.error(`No se pudo guardar "${key}" en localStorage:`, error);
        return false;
    }
}
