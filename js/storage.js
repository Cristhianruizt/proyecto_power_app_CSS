// js/storage.js

// Clave principal para guardar todo nuestro objeto de la app
const STORAGE_KEY = 'powerapp_datos';

function guardarDatosLocal(datos) {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(datos));
}

function obtenerDatosLocal() {
    const datos = localStorage.getItem(STORAGE_KEY);
    // Si hay datos, los convierte de texto a objeto, si no, devuelve null
    return datos ? JSON.parse(datos) : null;
}

// ==========================================
// RESTABLECIMIENTO DE DATOS (punto 7.9 de la rúbrica)
// Borra localStorage y vuelve a cargar los JSON originales desde el servidor.
// ==========================================
async function restablecerDatos() {
    const confirmado = await confirmarAccion(
        "¿Restablecer todos los datos?",
        "Se perderán los cambios guardados en este navegador y se recargará la información original de los archivos JSON."
    );
    if (!confirmado) return;

    localStorage.removeItem(STORAGE_KEY);

    const datos = await cargarDatosIniciales(); // en datos.js: como no hay localStorage, vuelve a leer los JSON
    if (!datos) {
        mostrarNotificacion("No se pudieron recargar los datos originales", "error");
        return;
    }

    mostrarNotificacion("Datos restablecidos correctamente", "exito");

    // Volvemos a pintar todo lo que exista en la página actual
    if (typeof pintarTablaHistorial === 'function' && document.getElementById('cuerpo-tabla-historial')) {
        pintarTablaHistorial(datos.entrenamientos, datos.movimientos);
    }
    if (typeof pintarTarjetasPR === 'function' && document.getElementById('contenedor-pr')) {
        pintarTarjetasPR(datos.entrenamientos, datos.movimientos);
    }
    if (typeof pintarIndicadoresGenerales === 'function' && document.getElementById('contenedor-indicadores')) {
        pintarIndicadoresGenerales(datos.entrenamientos, datos.movimientos);
    }
    if (typeof pintarGraficoVolumen === 'function' && document.getElementById('grafico-volumen')) {
        pintarGraficoVolumen(datos.entrenamientos, datos.movimientos);
    }
}

// Conecta el botón de restablecimiento si existe en la página actual
document.addEventListener('DOMContentLoaded', () => {
    document.getElementById('btn-restablecer-datos')?.addEventListener('click', restablecerDatos);
});