// js/filtros.js

const estadoHistorial = {
    texto: '',
    movimiento: '',
    rpe: '',
    orden: 'fecha-desc'
};

function aplicarFiltrosHistorial(entrenamientos, movimientos) {
    let resultado = [...entrenamientos];

    if (estadoHistorial.texto.trim() !== '') {
        const texto = estadoHistorial.texto.toLowerCase();
        resultado = resultado.filter(en => {
            const movObj = movimientos.find(m => m.id === en.movimientoId);
            const nombreMov = movObj ? movObj.nombre.toLowerCase() : '';
            const notas = (en.notas || '').toLowerCase();
            return nombreMov.includes(texto) || notas.includes(texto);
        });
    }

    if (estadoHistorial.movimiento !== '') {
        resultado = resultado.filter(en => en.movimientoId === estadoHistorial.movimiento);
    }

    if (estadoHistorial.rpe !== '') {
        resultado = resultado.filter(en => {
            const rpeMax = Math.max(...en.series.map(s => s.rpe));
            return estadoHistorial.rpe === 'alto' ? rpeMax >= 8 : rpeMax < 8;
        });
    }

    resultado.sort((a, b) => {
        const pesoMaxA = Math.max(...a.series.map(s => s.peso_kg));
        const pesoMaxB = Math.max(...b.series.map(s => s.peso_kg));

        switch (estadoHistorial.orden) {
            case 'fecha-asc': return new Date(a.fecha) - new Date(b.fecha);
            case 'fecha-desc': return new Date(b.fecha) - new Date(a.fecha);
            case 'peso-asc': return pesoMaxA - pesoMaxB;
            case 'peso-desc': return pesoMaxB - pesoMaxA;
            default: return 0;
        }
    });

    return resultado;
}

function refrescarHistorialFiltrado() {
    const datos = obtenerDatosLocal();
    if (!datos) return;

    const usuarioActual = obtenerUsuarioActual();
    const base = usuarioActual
        ? datos.entrenamientos.filter(en => en.usuarioId === usuarioActual.id)
        : datos.entrenamientos;

    const filtrados = aplicarFiltrosHistorial(base, datos.movimientos);
    pintarTablaHistorial(filtrados, datos.movimientos);
}

document.addEventListener('DOMContentLoaded', () => {
    const buscador = document.getElementById('buscador-historial');
    const filtroMov = document.getElementById('filtro-movimiento');
    const filtroRpe = document.getElementById('filtro-rpe');
    const orden = document.getElementById('orden-historial');

    if (buscador) {
        buscador.addEventListener('input', (e) => {
            estadoHistorial.texto = e.target.value;
            refrescarHistorialFiltrado();
        });

        filtroMov.addEventListener('change', (e) => {
            estadoHistorial.movimiento = e.target.value;
            refrescarHistorialFiltrado();
        });

        filtroRpe.addEventListener('change', (e) => {
            estadoHistorial.rpe = e.target.value;
            refrescarHistorialFiltrado();
        });

        orden.addEventListener('change', (e) => {
            estadoHistorial.orden = e.target.value;
            refrescarHistorialFiltrado();
        });
    }
});

// ==========================================
// DELEGACIÓN DE EVENTOS: editar/eliminar filas creadas dinámicamente
// Un solo listener en el <tbody> en vez de onclick inline por cada fila.
// ==========================================
document.addEventListener('DOMContentLoaded', () => {
    const cuerpoTabla = document.getElementById('cuerpo-tabla-historial');
    if (!cuerpoTabla) return;

    cuerpoTabla.addEventListener('click', (e) => {
        const boton = e.target.closest('button[data-accion]');
        if (!boton) return;

        const id = Number(boton.dataset.id);
        const accion = boton.dataset.accion;

        if (accion === 'editar') {
            editarEntrenamiento(id);
        } else if (accion === 'eliminar') {
            eliminarEntrenamiento(id);
        } else if (accion === 'detalle') {
            verDetalleEntrenamiento(id);
        }
    });
});