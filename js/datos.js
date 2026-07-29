// js/datos.js

async function cargarDatosIniciales() {
    try {
        // 1. Verificamos si ya existen datos guardados en el navegador
        const datosLocales = obtenerDatosLocal();
        if (datosLocales) {
            console.log("Datos cargados exitosamente desde localStorage");
            return datosLocales;
        }

        // 2. Si no existen (primera vez), cargamos los JSON
        console.log("Primera ejecución: Cargando datos desde archivos JSON...");


        // Usamos Promise.all para cargar los 3 archivos de forma simultánea y optimizada
        const [resMovimientos, resEntrenamientos, resUsuarios] = await Promise.all([
            fetch('/json/movimientos.json'),
            fetch('/json/entrenamientos.json'),
            fetch('/json/usuarios.json')
        ]);

        // Manejo de errores: Verificamos que las tres respuestas sean correctas
        if (!resMovimientos.ok || !resEntrenamientos.ok || !resUsuarios.ok) {
            throw new Error("Error HTTP al leer uno o más archivos JSON");
        }

        // Convertimos las respuestas a formato JSON
        const movimientos = await resMovimientos.json();
        const entrenamientos = await resEntrenamientos.json();
        const usuarios = await resUsuarios.json();

        // Estructuramos todos los datos en un solo objeto central
        const datosApp = {
            movimientos: movimientos,
            entrenamientos: entrenamientos,
            usuarios: usuarios
        };

        // Guardamos en localStorage para que no se borren al recargar la página
        guardarDatosLocal(datosApp);

        return datosApp;

    } catch (error) {
        console.error("Error crítico en la carga de datos:", error);
        // Mostrar alerta al usuario en caso de fallo (como pide la rúbrica)
        // alert("Hubo un problema al cargar los datos del servidor local. Verifica que estás usando Live Server.");
        return null;
    }
}