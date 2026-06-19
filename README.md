# POWER APP - Plataforma de Entrenamiento de Powerlifting

## Descripción
POWER APP es una plataforma web responsiva diseñada para atletas de powerlifting. Permite a los usuarios registrar sus sesiones de entrenamiento, visualizar sus récords personales (PRs) de SBD (Squat, Bench Press, Deadlift), aprender la técnica correcta de los movimientos de competición y llevar un control de sus bloques de periodización.

## Objetivo
El objetivo de este proyecto es aplicar e integrar estilos CSS externos mediante el enfoque de diseño mobile-first, utilizar CSS Grid y Flexbox para la maquetación, incorporar y personalizar componentes interactivos del framework Bootstrap, y representar información estructurada del proyecto mediante formatos de intercambio de datos (JSON y XML).

## Tecnologías Utilizadas
* **HTML5:** Etiquetado semántico.
* **CSS3:** Estilos externos, variables, Flexbox, CSS Grid y Media Queries (Mobile-First).
* **Bootstrap 5.3.3:** Componentes interactivos personalizados.
* **FontAwesome 6.5.0:** Iconografía del sitio web.

## Estructura de Carpetas
La organización del proyecto es la siguiente:

```text
PROYECTO_POWER_APP/
│
├── index.html                  # Página de inicio de sesión (Login)
├── README.md                   # Documentación del proyecto
│
├── css/                        # Hojas de estilo
│   ├── general.css             # Estilos globales compartidos
│   ├── index.css
│   ├── dashboard.css
│   ├── tecnica.css
│   ├── registro.css
│   ├── historial.css
│   └── bloques.css
│
├── pages/                      # Páginas principales del proyecto
│   ├── dashboard/dashboard.html
│   ├── registros/registro.html
│   ├── bloque/bloques.html
│   ├── tecnicas/tecnica.html
│   └── historial/historial.html
│
├── img/                        # Recursos gráficos (Logos, imágenes de demostración)
├── iconos/                     # Favicons del proyecto
├── video/                      # Videos de demostración técnica (SBD)
│
└── data/                       # Archivos de representación de datos
    ├── datos.json
    └── datos.xml