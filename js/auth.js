// js/auth.js
const USUARIO_ACTUAL_KEY = 'powerapp_usuario_actual';

function guardarUsuarioActual(usuarioId) {
    localStorage.setItem(USUARIO_ACTUAL_KEY, usuarioId);
}

function obtenerUsuarioActualId() {
    const id = localStorage.getItem(USUARIO_ACTUAL_KEY);
    return id ? Number(id) : null;
}

function obtenerUsuarioActual() {
    const datos = obtenerDatosLocal();
    const id = obtenerUsuarioActualId();
    if (!datos || !id) return null;
    return datos.usuarios.find(u => u.id === id) || null;
}

function cerrarSesion() {
    localStorage.removeItem(USUARIO_ACTUAL_KEY);
}

// Login real contra el arreglo de usuarios (solo corre en index.html)
document.getElementById('form-login-real')?.addEventListener('submit', async function (e) {
    e.preventDefault();
    const form = e.target;
    const correo = form.correo.value.trim().toLowerCase();
    const password = form.password.value;

    let datos = obtenerDatosLocal();
    if (!datos) datos = await cargarDatosIniciales();
    if (!datos) {
        mostrarNotificacion?.("No se pudieron cargar los usuarios", "error");
        return;
    }

    const usuario = datos.usuarios.find(
        u => u.correo.trim().toLowerCase() === correo && u.password === password
    );

    if (!usuario) {
        mostrarNotificacion?.("Correo o contraseña incorrectos", "error");
        return;
    }

    guardarUsuarioActual(usuario.id);
    window.location.href = 'pages/dashboard/dashboard.html';
});

// Cierre de sesión en cualquier página que tenga el formulario correspondiente
document.addEventListener('DOMContentLoaded', () => {
    document.querySelectorAll('.form-cerrar-sesion')
        .forEach(form => form.addEventListener('submit', () => cerrarSesion()));
});