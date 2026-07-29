// js/componentes.js

// ==========================================
// ALERTAS Y NOTIFICACIONES
// ==========================================

window.mostrarNotificacion = (mensaje, tipo = "exito") => {
    const colorFondo = tipo === "exito" ? "linear-gradient(to right, #00b09b, #96c93d)" : "linear-gradient(to right, #ff5f6d, #ffc371)";

    Toastify({
        text: mensaje,
        duration: 3000,
        gravity: "bottom",
        position: "right",
        stopOnFocus: true,
        style: {
            background: colorFondo,
            borderRadius: "8px",
            fontWeight: "bold"
        }
    }).showToast();
};

window.confirmarAccion = async (titulo, texto) => {
    const resultado = await Swal.fire({
        title: titulo,
        text: texto,
        icon: 'warning',
        showCancelButton: true,
        confirmButtonColor: '#d33',
        cancelButtonColor: '#3085d6',
        confirmButtonText: 'Sí, continuar',
        cancelButtonText: 'Cancelar',
        background: '#1e1e1e',
        color: '#ffffff'
    });
    return resultado.isConfirmed;
};

// URL de imagen de respaldo cuando una ruta del JSON no carga
const IMAGEN_RESPALDO = 'https://via.placeholder.com/400x300/242424/e53935?text=Imagen+no+disponible';

function conRespaldoImagen(rutaImagen) {
    return `onerror="this.onerror=null; this.src='${IMAGEN_RESPALDO}';"`;
}

// ==========================================
// RENDERIZADO DE INTERFAZ (DOM)
// ==========================================

// 1. Llenar la tabla del Historial
// IMPORTANTE: ya NO usa onclick inline; los botones llevan data-id
// y son manejados por delegación de eventos en filtros.js
function pintarTablaHistorial(entrenamientos, movimientos) {
    const tbody = document.getElementById('cuerpo-tabla-historial');
    if (!tbody) return;

    tbody.innerHTML = '';

    if (entrenamientos.length === 0) {
        tbody.innerHTML = `<tr><td colspan="6">No se encontraron resultados con los filtros aplicados.</td></tr>`;
        return;
    }

    entrenamientos.forEach(entrenamiento => {
        const movimientoObj = movimientos.find(m => m.id === entrenamiento.movimientoId);
        const nombreMovimiento = movimientoObj ? movimientoObj.nombre : "Movimiento Desconocido";

        const series = entrenamiento.series || [];
        const pesoMaximo = series.length ? Math.max(...series.map(s => s.peso_kg)) : 0;
        const resumenSeries = series.map(s => `${s.peso_kg}kg×${s.reps}`).join(' / ');
        const resumenRPE = series.map(s => s.rpe).join(' / ');   // <-- esta es la que reemplaza a rpeMaximo

        const tr = document.createElement('tr');
        tr.className = 'fila-dato';
        tr.innerHTML = `
        <td>${entrenamiento.fecha}</td>
        <td>${nombreMovimiento}</td>
        <td>${pesoMaximo} kg</td>
        <td>${resumenSeries || 'Sin series'}</td>
        <td>${resumenRPE || '-'}</td>
   <td>
        <button class="btn-detalle" data-accion="detalle" data-id="${entrenamiento.id}">
            <i class="fa-solid fa-eye"></i>
        </button>
        <button class="btn-editar" data-accion="editar" data-id="${entrenamiento.id}">
            <i class="fa-solid fa-pen"></i>
        </button>
        <button class="btn-eliminar" data-accion="eliminar" data-id="${entrenamiento.id}">
            <i class="fa-solid fa-trash"></i>
        </button>
    </td>
    `;
        tbody.appendChild(tr);
    });
}

// 2. Llenar el selector de movimientos en el Registro
function llenarSelectorMovimientos(movimientos) {
    const select = document.getElementById('select-movimiento');
    if (!select) return;

    movimientos.forEach(movimiento => {
        const option = document.createElement('option');
        option.value = movimiento.id;
        option.textContent = movimiento.nombre;
        select.appendChild(option);
    });
}

// 3. Llenar las tarjetas de Técnica
function pintarTarjetasTecnica(movimientos) {
    const contenedor = document.getElementById('contenedor-tarjetas-tecnica');
    if (!contenedor) return;

    contenedor.innerHTML = '';

    movimientos.forEach((mov, index) => {
        let listaClavesHTML = '';
        if (mov.puntos_clave && Array.isArray(mov.puntos_clave)) {
            mov.puntos_clave.forEach(punto => {
                listaClavesHTML += `<li>${punto}</li>`;
            });
        }

        const article = document.createElement('article');
        article.className = 'tarjeta-tecnica';
        article.id = `${mov.id}-section`;

        article.innerHTML = `
            <h2 class="titulo-movimiento">${index + 1}. ${mov.nombre}</h2>
            <div class="grid-ejecucion">
                <div class="columna-texto">
                    <p>Puntos clave para la ejecución:</p>
                    <ul class="lista-claves">
                        ${listaClavesHTML}
                    </ul>
                    <img src="${mov.imagen}" alt="Demostración de ${mov.nombre}" class="img-demostracion" ${conRespaldoImagen(mov.imagen)}>
                </div>
                <div class="columna-video">
                    <h3>Video de Ejemplo</h3>
                    <video src="${mov.video}" controls class="video-demostracion"></video>
                </div>
            </div>
        `;

        contenedor.appendChild(article);

        // Evento mouseenter: resalta la tarjeta técnica al pasar el mouse
        // (requisito de eventos obligatorios: mouseover/mouseenter)
        article.addEventListener('mouseenter', () => {
            article.style.transition = 'transform 0.2s ease';
            article.style.transform = 'scale(1.01)';
        });
        article.addEventListener('mouseleave', () => {
            article.style.transform = 'scale(1)';
        });
    });
}

// ==========================================
// PANEL DE RÉCORDS PERSONALES (PR)
// ==========================================
function pintarTarjetasPR(entrenamientos, movimientos) {
    const contenedor = document.getElementById('contenedor-pr');
    if (!contenedor) return;

    contenedor.innerHTML = '';

    movimientos.forEach(mov => {
        const sesiones = entrenamientos.filter(en => en.movimientoId === mov.id);

        const article = document.createElement('article');
        article.className = 'tarjeta-pr';

        if (sesiones.length === 0) {
            article.innerHTML = `
                <h3>${mov.nombre}</h3>
                <span class="peso-maximo">Sin registros</span>
            `;
            contenedor.appendChild(article);
            return;
        }

        const prKg = sesiones.reduce((maximoActual, sesion) => {
            const maxSesion = sesion.series.reduce((max, s) => Math.max(max, s.peso_kg), 0);
            return Math.max(maximoActual, maxSesion);
        }, 0);

        article.innerHTML = `
            <h3>${mov.nombre}</h3>
            <span class="peso-maximo">${prKg} kg</span>
            <p>${sesiones.length} sesión(es) registrada(s)</p>
        `;

        // Evento mouseenter adicional: muestra un pequeño detalle al pasar el mouse
        article.addEventListener('mouseenter', () => {
            article.title = `Mejor marca en ${mov.nombre}: ${prKg} kg`;
        });

        contenedor.appendChild(article);
    });
}

// ==========================================
// PANEL DE INDICADORES GENERALES
// ==========================================
function pintarIndicadoresGenerales(entrenamientos, movimientos) {
    const contenedor = document.getElementById('contenedor-indicadores');
    if (!contenedor) return;

    if (entrenamientos.length === 0) {
        contenedor.innerHTML = '<p>No hay datos suficientes para calcular indicadores.</p>';
        return;
    }

    const totalSesiones = entrenamientos.length;
    const totalSeries = entrenamientos.reduce((acc, en) => acc + en.series.length, 0);

    const todosLosRpe = entrenamientos.flatMap(en => en.series.map(s => s.rpe));
    const promedioRpe = (todosLosRpe.reduce((a, b) => a + b, 0) / todosLosRpe.length).toFixed(1);

    const movimientoTop = movimientos.reduce((topActual, mov) => {
        const cantidad = entrenamientos.filter(en => en.movimientoId === mov.id).length;
        const cantidadTop = entrenamientos.filter(en => en.movimientoId === topActual.id).length;
        return cantidad > cantidadTop ? mov : topActual;
    }, movimientos[0]);

    const sesionMasPesada = entrenamientos.reduce((topActual, en) => {
        const maxEnSesion = Math.max(...en.series.map(s => s.peso_kg));
        const maxEnTop = Math.max(...topActual.series.map(s => s.peso_kg));
        return maxEnSesion > maxEnTop ? en : topActual;
    }, entrenamientos[0]);

    const hayRpeMaximo = entrenamientos.some(en => en.series.some(s => s.rpe >= 9.5));

    contenedor.innerHTML = `
        <div class="tarjeta-indicador">
            <span class="valor-indicador">${totalSesiones}</span>
            <p>Sesiones registradas</p>
        </div>
        <div class="tarjeta-indicador">
            <span class="valor-indicador">${totalSeries}</span>
            <p>Series totales ejecutadas</p>
        </div>
        <div class="tarjeta-indicador">
            <span class="valor-indicador">${promedioRpe}</span>
            <p>RPE promedio</p>
        </div>
        <div class="tarjeta-indicador">
            <span class="valor-indicador">${movimientoTop.nombre}</span>
            <p>Movimiento más entrenado</p>
        </div>
        <div class="tarjeta-indicador">
            <span class="valor-indicador">${Math.max(...sesionMasPesada.series.map(s => s.peso_kg))} kg</span>
            <p>Mayor peso levantado (${sesionMasPesada.fecha})</p>
        </div>
        <div class="tarjeta-indicador">
            <span class="valor-indicador">${hayRpeMaximo ? 'Sí' : 'No'}</span>
            <p>¿Alguna serie a RPE 9.5+?</p>
        </div>
    `;
}