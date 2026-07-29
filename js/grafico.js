// js/grafico.js

// Guardamos la instancia del gráfico en una variable global
// para poder destruirla y volver a crearla cuando se agreguen/editen/eliminen registros
let instanciaGraficoVolumen = null;

function pintarGraficoVolumen(entrenamientos, movimientos) {
    const canvas = document.getElementById('grafico-volumen');
    if (!canvas) return; // No estamos en dashboard.html

    if (entrenamientos.length === 0) {
        canvas.parentElement.innerHTML = '<p>No hay datos suficientes para generar el gráfico.</p>';
        return;
    }

    // 1. Agrupamos el volumen (kg totales) por fecha, sumando peso*reps de todas las series
    const volumenPorFecha = {};

    entrenamientos.forEach(en => {
        const volumenSesion = en.series.reduce((acc, s) => acc + (s.peso_kg * s.reps), 0);
        if (!volumenPorFecha[en.fecha]) {
            volumenPorFecha[en.fecha] = 0;
        }
        volumenPorFecha[en.fecha] += volumenSesion;
    });

    // 2. Ordenamos las fechas cronológicamente
    const fechasOrdenadas = Object.keys(volumenPorFecha).sort((a, b) => new Date(a) - new Date(b));
    const valoresVolumen = fechasOrdenadas.map(fecha => volumenPorFecha[fecha]);

    // 3. Si ya existe un gráfico previo, lo destruimos antes de crear uno nuevo
    if (instanciaGraficoVolumen) {
        instanciaGraficoVolumen.destroy();
    }

    // 4. Creamos el gráfico
    instanciaGraficoVolumen = new Chart(canvas, {
        type: 'line',
        data: {
            labels: fechasOrdenadas,
            datasets: [{
                label: 'Volumen total (kg)',
                data: valoresVolumen,
                borderColor: '#e53935',
                backgroundColor: 'rgba(229, 57, 53, 0.2)',
                tension: 0.3,
                fill: true,
                pointBackgroundColor: '#e98707',
                pointRadius: 4
            }]
        },
        options: {
            responsive: true,
            plugins: {
                legend: {
                    labels: { color: '#ffffff' }
                }
            },
            scales: {
                x: {
                    ticks: { color: '#cccccc' },
                    grid: { color: '#333333' }
                },
                y: {
                    ticks: { color: '#cccccc' },
                    grid: { color: '#333333' },
                    beginAtZero: true
                }
            }
        }
    });
}