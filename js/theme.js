// theme.js
// Manejo del tema claro/oscuro. Se guarda como texto plano en localStorage
// (igual que en la versión original), no como JSON.

const THEME_KEY = 'theme';

export function getTheme() {
    return localStorage.getItem(THEME_KEY) || 'light';
}

export function setTheme(theme) {
    localStorage.setItem(THEME_KEY, theme);
}

// Aplica el tema al <body> y, si existe en la página, actualiza el ícono del botón.
export function applyTheme(theme) {
    document.body.dataset.theme = theme;
    const btn = document.getElementById('themeToggleBtn');
    if (btn) btn.textContent = theme === 'light' ? '🌙' : '☀️';
}

export function toggleTheme() {
    const nuevoTema = getTheme() === 'light' ? 'dark' : 'light';
    setTheme(nuevoTema);
    applyTheme(nuevoTema);
    return nuevoTema;
}
