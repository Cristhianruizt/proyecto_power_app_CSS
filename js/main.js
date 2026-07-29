// js/main.js

// js/main.js

document.addEventListener('DOMContentLoaded', async () => {
    const datos = await cargarDatosIniciales();

    if (datos) {
        const usuarioActual = obtenerUsuarioActual();
        pintarNombreUsuarioHeader(usuarioActual);
        pintarCabeceraAtleta(usuarioActual); //

        // Relación por ID: solo los entrenamientos del usuario logueado
        const entrenamientosUsuario = usuarioActual
            ? datos.entrenamientos.filter(en => en.usuarioId === usuarioActual.id)
            : datos.entrenamientos;

        console.log("POWER APP inicializada. Pintando interfaz...");
        pintarTablaHistorial(entrenamientosUsuario, datos.movimientos);
        llenarSelectorMovimientos(datos.movimientos);
        pintarTarjetasTecnica(datos.movimientos);
        pintarTarjetasPR(entrenamientosUsuario, datos.movimientos);
        pintarIndicadoresGenerales(entrenamientosUsuario, datos.movimientos);
        pintarGraficoVolumen(entrenamientosUsuario, datos.movimientos);
    }

    cargarPaises();
    cargarClima();
});

function pintarNombreUsuarioHeader(usuario) {
    const el = document.getElementById('nombre-usuario-header');
    if (!el) return;
    el.textContent = usuario ? `${usuario.nombres} (${usuario.categoriaKg} kg)` : 'Invitado';
}

function pintarCabeceraAtleta(usuario) {
    const titulo = document.getElementById('titulo-bienvenida');
    const categoria = document.getElementById('texto-categoria');
    const nacionalidad = document.getElementById('texto-nacionalidad');
    if (!titulo || !categoria || !nacionalidad) return;

    if (usuario) {
        titulo.textContent = `Hola, ${usuario.nombres}`;
        categoria.textContent = `Categoría: ${usuario.categoriaKg} kg`;
        nacionalidad.textContent = `Nacionalidad: ${usuario.nacionalidad}`;
    } else {
        titulo.textContent = 'Hola, Invitado';
        categoria.textContent = 'Categoría: -- kg';
        nacionalidad.textContent = 'Nacionalidad: --';
    }
}
