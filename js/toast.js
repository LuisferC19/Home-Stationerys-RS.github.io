// toast.js
// Notificación flotante ("toast") reutilizada en index.html y producto.html.
// Ambas páginas tienen un <div id="toast"> en su HTML.

let hideTimeout = null;

export function mostrarToast(mensaje, tipo = 'success', duracion = 3000) {
    const toastDiv = document.getElementById('toast');
    if (!toastDiv) return;

    toastDiv.textContent = mensaje;
    toastDiv.className = 'toast mostrar';
    if (tipo === 'error') toastDiv.classList.add('error');
    if (tipo === 'info') toastDiv.classList.add('info');

    clearTimeout(hideTimeout);
    hideTimeout = setTimeout(() => toastDiv.classList.remove('mostrar'), duracion);
}
