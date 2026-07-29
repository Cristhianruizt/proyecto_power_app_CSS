// js/api.js

// ==========================================
// 1. API de Países (countries.dev) - reutilizable en cualquier <select>
// ==========================================
async function cargarPaises(idSelect = 'select-nacionalidad') {
    const select = document.getElementById(idSelect);
    if (!select) return;

    try {
        select.innerHTML = '<option value="">-- Cargando países... --</option>';

        const response = await fetch(
            'https://countries.dev/countries?fields=name,alpha2Code,flag,flags,callingCodes&sort=name'
        );
        if (!response.ok) throw new Error(`Error HTTP ${response.status}`);

        let paises = await response.json();
        paises = paises.filter(p => p.name);
        paises.sort((a, b) => a.name.localeCompare(b.name));

        select.innerHTML = '<option value="">-- Selecciona tu país --</option>';

        paises.forEach(pais => {
            const option = document.createElement('option');
            option.value = pais.name;

            const bandera = pais.flag || codigoAEmoji(pais.alpha2Code);
            const codigo = pais.alpha2Code ? ` (${pais.alpha2Code})` : '';
            const marcacion = pais.callingCodes?.length ? ` · +${pais.callingCodes[0]}` : '';

            option.textContent = `${bandera} ${pais.name}${codigo}${marcacion}`;
            option.dataset.flagImg = pais.flags?.svg || pais.flags?.png || '';
            select.appendChild(option);
        });

        mostrarBanderaGrande(idSelect); // muestra la imagen real la primera vez
        select.addEventListener('change', () => mostrarBanderaGrande(idSelect));

    } catch (error) {
        console.error("Error al cargar la API de países:", error);
        select.innerHTML = '<option value="">Error al cargar la lista de países</option>';
        mostrarNotificacion?.("No se pudo cargar la lista de países. Verifica tu conexión.", "error");
    }
}

// Muestra una imagen real de la bandera junto al select (más confiable que el emoji)
function mostrarBanderaGrande(idSelect) {
    const select = document.getElementById(idSelect);
    const opcion = select.options[select.selectedIndex];
    const url = opcion?.dataset.flagImg;

    let img = document.getElementById(idSelect + '-bandera-img');
    if (!img) {
        img = document.createElement('img');
        img.id = idSelect + '-bandera-img';
        img.style.cssText = 'width:28px;height:auto;margin-left:8px;vertical-align:middle;border-radius:2px;';
        select.insertAdjacentElement('afterend', img);
    }
    img.style.display = url ? 'inline-block' : 'none';
    if (url) img.src = url;
}

// Convierte el código ISO (ej. "EC") al emoji de bandera 🇪🇨
function codigoAEmoji(iso2) {
    if (!iso2) return '';
    return iso2.toUpperCase().replace(/./g, c => String.fromCodePoint(c.charCodeAt(0) + 127397));
}

// Habilita búsqueda en vivo dentro de un <select> de países usando un <input> asociado.
// Como <select> nativo no permite filtrar opciones fácilmente, mostramos/ocultamos <option>.
function activarBusquedaPaises(idInput, idSelect) {
    const input = document.getElementById(idInput);
    const select = document.getElementById(idSelect);
    if (!input || !select) return;

    input.addEventListener('input', (e) => {
        const texto = e.target.value.toLowerCase();
        Array.from(select.options).forEach(opt => {
            if (opt.value === '') return; // siempre visible la opción placeholder
            const coincide = opt.textContent.toLowerCase().includes(texto);
            opt.hidden = !coincide;
        });
    });
}

// ==========================================
// 2. API Contextual de Clima (Open-Meteo) - con selector de ciudad
// ==========================================
const CIUDADES_CLIMA = {
    quito: { nombre: "Quito", lat: -0.18, lon: -78.47 },
    guayaquil: { nombre: "Guayaquil", lat: -2.17, lon: -79.90 },
    'santo-domingo': { nombre: "Santo Domingo", lat: -0.25, lon: -79.15 },
    quevedo: { nombre: "Quevedo", lat: -1.03, lon: -79.46 }
};

async function cargarClima(claveCiudad = 'quito') {
    const contenedorClima = document.getElementById('contenedor-clima');
    if (!contenedorClima) return;

    const ciudad = CIUDADES_CLIMA[claveCiudad] || CIUDADES_CLIMA.quito;

    contenedorClima.innerHTML = `
        <div class="clima-widget" style="background-color:#242424; padding:15px; border-radius:8px; border-left:5px solid #0dcaf0; margin-bottom:15px; text-align:left;">
            <p style="color:#cccccc; margin:0;"><i class="fa-solid fa-spinner fa-spin"></i> Cargando clima de ${ciudad.nombre}...</p>
        </div>
    `;

    try {
        const url = `https://api.open-meteo.com/v1/forecast?latitude=${ciudad.lat}&longitude=${ciudad.lon}&current=temperature_2m,relative_humidity_2m,wind_speed_10m&timezone=auto`;

        const response = await fetch(url);
        if (!response.ok) throw new Error("Error HTTP al consultar el clima");

        const datos = await response.json();
        const temperatura = datos.current.temperature_2m;
        const humedad = datos.current.relative_humidity_2m;
        const viento = datos.current.wind_speed_10m;

        contenedorClima.innerHTML = `
            <div class="clima-widget" style="background-color: #242424; padding: 15px; border-radius: 8px; border-left: 5px solid #0dcaf0; margin-bottom: 25px; text-align: left;">
                <h4 style="color: #0dcaf0; margin-bottom: 10px; font-size: 18px;"><i class="fa-solid fa-cloud-sun"></i> Condiciones de Entrenamiento (${ciudad.nombre})</h4>
                <p style="margin: 0; color: #cccccc;">Temperatura: <strong style="color: white;">${temperatura}°C</strong> | Humedad: <strong style="color: white;">${humedad}%</strong> | Viento: <strong style="color: white;">${viento} km/h</strong></p>
            </div>
        `;
    } catch (error) {
        console.error("Error al cargar la API de clima:", error);
        contenedorClima.innerHTML = '<p style="color: #e53935;">Servicio meteorológico no disponible en este momento.</p>';
    }
}

// Cada cambio de ciudad dispara una nueva consulta a Open-Meteo
document.addEventListener('DOMContentLoaded', () => {
    const selectorCiudad = document.getElementById('select-ciudad-clima');
    if (selectorCiudad) {
        selectorCiudad.addEventListener('change', (e) => {
            cargarClima(e.target.value);
        });
    }
});