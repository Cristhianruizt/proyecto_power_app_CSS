// js/validaciones.js
// Funciones de validación reutilizables para todos los formularios del proyecto.

// ---------------------------------------------------------
// Validación de formato de correo electrónico
// ---------------------------------------------------------
function validarCorreo(correo) {
    const patron = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return patron.test(String(correo).trim());
}

// ---------------------------------------------------------
// Validación de contraseña: mínimo 8 caracteres, 1 número, 1 letra
// ---------------------------------------------------------
function validarPassword(password) {
    const patron = /^(?=.*[A-Za-z])(?=.*\d).{8,}$/;
    return patron.test(String(password));
}

// ---------------------------------------------------------
// Compara password y su confirmación
// ---------------------------------------------------------
function passwordsCoinciden(password, confirmacion) {
    return password === confirmacion && password.length > 0;
}

// ---------------------------------------------------------
// Validación de fecha (formato yyyy-mm-dd) y que no sea futura
// ---------------------------------------------------------
function validarFecha(fecha, permitirFutura = false) {
    if (!fecha) return false;
    const fechaObj = new Date(fecha);
    if (isNaN(fechaObj.getTime())) return false;
    if (!permitirFutura && fechaObj > new Date()) return false;
    return true;
}

// ---------------------------------------------------------
// Validación simple de URL (para imágenes/avatares por link)
// ---------------------------------------------------------
function validarURL(url) {
    if (!url) return true; // opcional
    try {
        new URL(url);
        return true;
    } catch {
        return false;
    }
}

// ---------------------------------------------------------
// Validación de teléfono (solo números, 7 a 10 dígitos)
// ---------------------------------------------------------
function validarTelefono(telefono) {
    const patron = /^\d{7,10}$/;
    return patron.test(String(telefono).trim());
}

// ---------------------------------------------------------
// Evita correos duplicados dentro de un arreglo de usuarios
// ---------------------------------------------------------
function correoDuplicado(correo, usuarios) {
    const correoNormalizado = String(correo).trim().toLowerCase();
    return usuarios.some(u => u.correo.trim().toLowerCase() === correoNormalizado);
}

// ---------------------------------------------------------
// Muestra un mensaje de error visual bajo un campo específico
// Requiere que exista un <small class="mensaje-error" data-para="ID_DEL_CAMPO"></small>
// junto al input, o lo crea dinámicamente si no existe.
// ---------------------------------------------------------
function mostrarErrorCampo(idCampo, mensaje) {
    const campo = document.getElementById(idCampo);
    if (!campo) return;

    let errorEl = campo.parentElement.querySelector('.mensaje-error');
    if (!errorEl) {
        errorEl = document.createElement('small');
        errorEl.className = 'mensaje-error';
        errorEl.style.color = '#e53935';
        errorEl.style.marginTop = '-6px';
        errorEl.style.display = 'block';
        campo.insertAdjacentElement('afterend', errorEl);
    }
    errorEl.textContent = mensaje;
    campo.style.borderColor = '#e53935';
}

function limpiarErrorCampo(idCampo) {
    const campo = document.getElementById(idCampo);
    if (!campo) return;
    const errorEl = campo.parentElement.querySelector('.mensaje-error');
    if (errorEl) errorEl.textContent = '';
    campo.style.borderColor = '';
}