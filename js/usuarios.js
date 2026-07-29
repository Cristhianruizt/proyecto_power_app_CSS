// js/usuarios.js
// Maneja el registro de nuevos usuarios (sección 8 de la rúbrica)

document.addEventListener('DOMContentLoaded', () => {
    // Cargamos la lista de países en el select de esta página específica
    // y activamos el buscador en vivo sobre ese select.
    if (document.getElementById('select-nacionalidad-usuario')) {
        cargarPaises('select-nacionalidad-usuario');
        activarBusquedaPaises('buscador-pais', 'select-nacionalidad-usuario');
    }
});

document.getElementById('form-registro-usuario')?.addEventListener('submit', async function (e) {
    e.preventDefault();
    const form = e.target;

    // Limpiamos errores previos
    ['ru-nombres', 'ru-apellidos', 'ru-correo', 'ru-password', 'ru-password2',
     'ru-fecha-nacimiento', 'select-nacionalidad-usuario', 'ru-avatar'].forEach(limpiarErrorCampo);

    let esValido = true;

    // Nombres y apellidos obligatorios
    if (form.nombres.value.trim().length < 2) {
        mostrarErrorCampo('ru-nombres', 'Ingresa un nombre válido.');
        esValido = false;
    }
    if (form.apellidos.value.trim().length < 2) {
        mostrarErrorCampo('ru-apellidos', 'Ingresa un apellido válido.');
        esValido = false;
    }

    // Correo con formato válido
    if (!validarCorreo(form.correo.value)) {
        mostrarErrorCampo('ru-correo', 'El formato del correo no es válido.');
        esValido = false;
    }

    // Password segura
    if (!validarPassword(form.password.value)) {
        mostrarErrorCampo('ru-password', 'Mínimo 8 caracteres, con letras y números.');
        esValido = false;
    }

    // Confirmación de password
    if (!passwordsCoinciden(form.password.value, form.password2.value)) {
        mostrarErrorCampo('ru-password2', 'Las contraseñas no coinciden.');
        esValido = false;
    }

    // Fecha de nacimiento válida y no futura
    if (!validarFecha(form.fechaNacimiento.value)) {
        mostrarErrorCampo('ru-fecha-nacimiento', 'Ingresa una fecha de nacimiento válida.');
        esValido = false;
    }

    // Nacionalidad seleccionada
    if (!form.nacionalidad.value) {
        mostrarErrorCampo('select-nacionalidad-usuario', 'Selecciona tu país.');
        esValido = false;
    }

    // Avatar (si se ingresó) debe ser una URL válida
    if (form.avatar.value && !validarURL(form.avatar.value)) {
        mostrarErrorCampo('ru-avatar', 'Ingresa una URL de imagen válida.');
        esValido = false;
    }

    // Términos aceptados
    if (!form.terminos.checked) {
        mostrarNotificacion('Debes aceptar los términos y condiciones', 'error');
        esValido = false;
    }

    if (!esValido) return;

    // Cargamos los datos actuales (o inicializamos si es la primera vez)
    let datos = obtenerDatosLocal();
    if (!datos) {
        datos = await cargarDatosIniciales();
    }
    if (!datos.usuarios) datos.usuarios = [];

    // Evitamos correos duplicados
    if (correoDuplicado(form.correo.value, datos.usuarios)) {
        mostrarErrorCampo('ru-correo', 'Ya existe una cuenta con este correo.');
        mostrarNotificacion('Ese correo ya está registrado', 'error');
        return;
    }

    // Generamos un id único que no choque con los existentes
    const nuevoId = datos.usuarios.length
        ? Math.max(...datos.usuarios.map(u => u.id)) + 1
        : 1;

    const nuevoUsuario = {
        id: nuevoId,
        nombres: form.nombres.value.trim(),
        apellidos: form.apellidos.value.trim(),
        correo: form.correo.value.trim(),
        password: form.password.value,
        fechaNacimiento: form.fechaNacimiento.value,
        nacionalidad: form.nacionalidad.value,
        categoriaKg: form.categoriaKg.value.trim() || null,
        contacto: {
            telefono: form.telefono.value.trim(),
            direccion: { ciudad: '', pais: form.nacionalidad.value }
        },
        preferencias: { unidadPeso: 'kg', notificaciones: true },
        terminosAceptados: true,
        fechaRegistro: new Date().toISOString().slice(0, 10),
        avatar: form.avatar.value.trim() || null
    };

    datos.usuarios.push(nuevoUsuario);
    guardarDatosLocal(datos);

    mostrarNotificacion('Cuenta creada correctamente', 'exito');

    await Swal.fire({
        icon: 'success',
        title: '¡Bienvenido a POWER APP!',
        html: `Tu cuenta fue creada con nacionalidad <strong>${nuevoUsuario.nacionalidad}</strong>.`,
        background: '#1e1e1e',
        color: '#ffffff',
        confirmButtonColor: '#0dcaf0',
        confirmButtonText: 'Ir a iniciar sesión'
    });

    window.location.href = '../../index.html';
});