// js/crud.js

// ==========================================
// REGISTRO DE NUEVOS ENTRENAMIENTOS
// ==========================================

document.getElementById('form-entrenamiento')?.addEventListener('submit', async function (e) {
    e.preventDefault();

    const form = e.target;

    if (!form.checkValidity()) {
        form.reportValidity();
        return;
    }

    const datos = obtenerDatosLocal();
    if (!datos) {
        mostrarNotificacion("No se pudieron cargar los datos", "error");
        return;
    }

    const usuario = obtenerUsuarioActual();

    const series = [];
    for (let i = 1; i <= 3; i++) {
        const peso = form[`peso${i}`].value;
        const reps = form[`reps${i}`].value;
        const rpe = form[`rpe${i}`].value;

        if (!peso && !reps && !rpe) continue;

        series.push({
            numero: i,
            peso_kg: Number(peso) || 0,
            reps: Number(reps) || 0,
            rpe: Number(rpe) || 0
        });
    }

    if (series.length === 0) {
        mostrarNotificacion("Debes completar al menos una serie", "error");
        return;
    }

    const nuevoId = datos.entrenamientos.length
        ? Math.max(...datos.entrenamientos.map(en => en.id)) + 1
        : 1;

    const nuevoEntrenamiento = {
        id: nuevoId,
        usuarioId: usuario ? usuario.id : null,
        movimientoId: form.movimiento.value,
        fecha: form.fecha.value,
        notas: form.notas.value.trim(),
        series: series
    };

    datos.entrenamientos.push(nuevoEntrenamiento);
    guardarDatosLocal(datos);

    // CORREGIDO: filtramos por usuario antes de intentar pintar el gráfico
    const entrenamientosUsuario = usuario
        ? datos.entrenamientos.filter(en => en.usuarioId === usuario.id)
        : datos.entrenamientos;
    pintarGraficoVolumen(entrenamientosUsuario, datos.movimientos);

    mostrarNotificacion("Entrenamiento guardado con éxito", "exito");

    await Swal.fire({
        icon: 'success',
        title: 'Registro guardado',
        text: `Se guardaron ${series.length} serie(s) de ${nuevoEntrenamiento.movimientoId} del ${nuevoEntrenamiento.fecha}`,
        background: '#1e1e1e',
        color: '#ffffff',
        confirmButtonColor: '#e53935'
    });

    form.reset();
});


// ==========================================
// ELIMINACIÓN DE ENTRENAMIENTOS
// ==========================================

async function eliminarEntrenamiento(id) {
    const confirmado = await confirmarAccion("¿Eliminar este registro?", "Esta acción no se puede deshacer");
    if (!confirmado) return;

    const datos = obtenerDatosLocal();
    datos.entrenamientos = datos.entrenamientos.filter(en => en.id !== id);
    guardarDatosLocal(datos);

    // CORREGIDO: filtramos solo los entrenamientos del usuario actual
    const usuario = obtenerUsuarioActual();
    const entrenamientosUsuario = usuario
        ? datos.entrenamientos.filter(en => en.usuarioId === usuario.id)
        : datos.entrenamientos;

    pintarTablaHistorial(entrenamientosUsuario, datos.movimientos);
    if (typeof pintarGraficoVolumen === 'function' && document.getElementById('grafico-volumen')) {
        pintarGraficoVolumen(entrenamientosUsuario, datos.movimientos);
    }
    mostrarNotificacion("Registro eliminado", "error");
}

// ==========================================
// VISUALIZACIÓN DE DETALLE COMPLETO
// ==========================================
async function verDetalleEntrenamiento(id) {
    const datos = obtenerDatosLocal();
    const entrenamiento = datos.entrenamientos.find(en => en.id === id);
    if (!entrenamiento) return;

    const movimiento = datos.movimientos.find(m => m.id === entrenamiento.movimientoId);
    const nombreMovimiento = movimiento ? movimiento.nombre : 'Movimiento desconocido';

    const filasSeries = entrenamiento.series.map(s => `
        <tr>
            <td>${s.numero}</td>
            <td>${s.peso_kg} kg</td>
            <td>${s.reps}</td>
            <td>${s.rpe}</td>
        </tr>
    `).join('');

    await Swal.fire({
        title: nombreMovimiento,
        html: `
            <p style="text-align:left;"><strong>Fecha:</strong> ${entrenamiento.fecha}</p>
            <p style="text-align:left;"><strong>Notas:</strong> ${entrenamiento.notas || 'Sin notas'}</p>
            <table style="width:100%; text-align:center; margin-top:10px; border-collapse:collapse;">
                <thead>
                    <tr style="color:#e53935;">
                        <th>Serie</th><th>Peso</th><th>Reps</th><th>RPE</th>
                    </tr>
                </thead>
                <tbody>${filasSeries}</tbody>
            </table>
        `,
        background: '#1e1e1e',
        color: '#ffffff',
        confirmButtonColor: '#e53935',
        confirmButtonText: 'Cerrar'
    });
}

// ==========================================
// EDICIÓN DE ENTRENAMIENTOS
// ==========================================

async function editarEntrenamiento(id) {
    const datos = obtenerDatosLocal();
    const entrenamiento = datos.entrenamientos.find(en => en.id === id);
    if (!entrenamiento) return;

    let filasHTML = '';
    entrenamiento.series.forEach((s) => {
        filasHTML += `
            <div style="display:flex; gap:8px; margin-bottom:6px;">
                <input type="number" class="swal2-input serie-peso" style="margin:0" value="${s.peso_kg}" placeholder="Peso serie ${s.numero}">
                <input type="number" class="swal2-input serie-reps" style="margin:0" value="${s.reps}" placeholder="Reps">
                <input type="number" step="0.5" class="swal2-input serie-rpe" style="margin:0" value="${s.rpe}" placeholder="RPE">
            </div>
        `;
    });

    const { value: formValues } = await Swal.fire({
        title: 'Editar entrenamiento',
        html: `
            <input id="swal-fecha" class="swal2-input" type="date" value="${entrenamiento.fecha}">
            ${filasHTML}
            <input id="swal-notas" class="swal2-input" value="${entrenamiento.notas || ''}" placeholder="Notas">
        `,
        background: '#1e1e1e',
        color: '#ffffff',
        confirmButtonColor: '#e53935',
        showCancelButton: true,
        confirmButtonText: 'Guardar cambios',
        cancelButtonText: 'Cancelar',
        preConfirm: () => {
            const pesos = document.querySelectorAll('.serie-peso');
            const reps = document.querySelectorAll('.serie-reps');
            const rpes = document.querySelectorAll('.serie-rpe');

            const nuevasSeries = entrenamiento.series.map((s, i) => ({
                numero: s.numero,
                peso_kg: Number(pesos[i].value) || 0,
                reps: Number(reps[i].value) || 0,
                rpe: Number(rpes[i].value) || 0
            }));

            return {
                fecha: document.getElementById('swal-fecha').value,
                notas: document.getElementById('swal-notas').value,
                series: nuevasSeries
            };
        }
    });

    if (!formValues) return;

    datos.entrenamientos = datos.entrenamientos.map(en =>
        en.id === id ? { ...en, ...formValues } : en
    );
    guardarDatosLocal(datos);

    // CORREGIDO: filtramos solo los entrenamientos del usuario actual
    const usuario = obtenerUsuarioActual();
    const entrenamientosUsuario = usuario
        ? datos.entrenamientos.filter(en => en.usuarioId === usuario.id)
        : datos.entrenamientos;

    pintarTablaHistorial(entrenamientosUsuario, datos.movimientos);
    if (typeof pintarGraficoVolumen === 'function' && document.getElementById('grafico-volumen')) {
        pintarGraficoVolumen(entrenamientosUsuario, datos.movimientos);
    }
    mostrarNotificacion("Registro actualizado", "exito");
}

