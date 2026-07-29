# 🏋️‍♂️ POWER APP

Plataforma web de entrenamiento de powerlifting que permite a un atleta registrar sus sesiones, hacer seguimiento de su progreso, consultar la técnica de los movimientos de competición y planificar sus bloques de entrenamiento.

Proyecto integrador desarrollado para la asignatura **Fundamentos Web**, evidenciando la evolución de una aplicación desde HTML semántico estático hasta un sistema web dinámico con JavaScript, JSON, `localStorage`, librerías externas y consumo de APIs.

---

## 👤 Estudiante

- **Nombre:** Cristhian Ruiz
- **Asignatura:** Fundamentos de Sistemas Web
---

## 📋 Descripción

POWER APP resuelve un problema común entre los atletas de powerlifting: la falta de una herramienta especializada para registrar y analizar su progreso en los tres movimientos de competición (sentadilla, press de banca y peso muerto). La aplicación permite iniciar sesión, registrar sesiones de entrenamiento con series de peso, repeticiones y RPE, visualizar el historial con búsqueda y filtros, consultar récords personales e indicadores generales, y revisar la técnica correcta de cada movimiento.

---

## 🎯 Objetivo

Desarrollar una aplicación web dinámica, responsiva e interactiva para powerlifting, integrando manipulación del DOM, archivos JSON relacionados, almacenamiento local, librerías JavaScript y consumo de APIs externas, evolucionando desde una maqueta estática de HTML semántico hasta un sistema funcional completo.

---

## ⚙️ Funcionalidades

- **Autenticación:** inicio y cierre de sesión contra un arreglo de usuarios, con persistencia de la sesión activa.
- **Registro de usuarios:** formulario completo con validaciones (correo, contraseña segura, confirmación de contraseña, fecha de nacimiento, URL de avatar) y selector de nacionalidad con buscador en vivo conectado a una API de países.
- **Dashboard del atleta:**
  - Tarjetas de récords personales (PR) por movimiento.
  - Panel de indicadores generales (sesiones registradas, series totales, RPE promedio, movimiento más entrenado, mayor peso levantado, etc.).
  - Gráfico de progresión de volumen de entrenamiento (Chart.js).
  - Widget de clima según ciudad seleccionada (Open-Meteo).
  - Sección de preguntas frecuentes con acordeón de Bootstrap.
- **Registro de sesiones de entrenamiento:** formulario con selección de movimiento, fecha, hasta 3 series (peso, repeticiones, RPE) y notas.
- **Historial de entrenamientos:**
  - Búsqueda en tiempo real por movimiento o notas.
  - Filtros por tipo de movimiento y por nivel de RPE.
  - Ordenamiento por fecha o por peso levantado.
  - Visualización de detalle completo, edición y eliminación de cada registro (con confirmación).
  - Botón de restablecimiento de datos originales.
- **Sección de técnica:** tarjetas generadas dinámicamente con puntos clave, imagen y video de cada movimiento, más un carrusel de Bootstrap y un video tutorial destacado.
- **Bloques de entrenamiento:** planificación por fases (fuerza máxima, hipertrofia) con modal explicativo sobre semanas de descarga.
- **Persistencia:** toda la información se guarda en `localStorage`, sobreviviendo a recargas y cierres del navegador.

---

## 🛠️ Tecnologías utilizadas

- **HTML5** semántico (`header`, `nav`, `main`, `section`, `article`, `aside`, `footer`).
- **CSS3** con diseño responsivo *Mobile First* y media queries.
- **JavaScript (ES6+)**: `fetch`, `async/await`, manipulación del DOM, `localStorage`, delegación de eventos.
- **Bootstrap 5.3.3**: acordeón, carrusel, modal y sistema de utilidades.
- **Font Awesome 6.5.0**: iconografía.

---

## 📚 Librerías incorporadas

| Librería | Uso en el proyecto |
|---|---|
| **SweetAlert2** | Confirmación de eliminaciones y restablecimiento de datos, modal de edición de entrenamientos, visualización de detalle completo, confirmación de registro de usuario. |
| **Toastify** | Notificaciones breves de éxito o error tras guardar, editar, eliminar o restablecer registros. |
| **Chart.js** | Gráfico de línea con la progresión del volumen de entrenamiento (peso × repeticiones) por fecha. |

---

## 🌐 APIs consumidas

| API | Uso en el proyecto |
|---|---|
| **[countries.dev](https://countries.dev/countries)** | Carga de la lista de países con bandera para el selector de nacionalidad, tanto en el registro de usuario como en el registro de sesión (ubicación de la competencia/gimnasio). Incluye buscador en vivo. |
| **[Open-Meteo](https://open-meteo.com/)** | Consulta de temperatura, humedad y velocidad del viento actuales de la ciudad seleccionada (Quito, Guayaquil, Santo Domingo, Quevedo), mostrada en el dashboard. |

---

## 📁 Estructura de carpetas

```
POWER-APP/
│
├── index.html
├── README.md
│
├── pages/
│   ├── dashboard/dashboard.html
│   ├── registros/registro.html
│   ├── historial/historial.html
│   ├── tecnicas/tecnica.html
│   ├── bloque/bloques.html
│   └── registroUsuario/registroUsuario.html
│
├── css/
│   ├── general.css
│   ├── index.css
│   ├── dashboard.css
│   ├── registro.css
│   ├── historial.css
│   ├── tecnica.css
│   ├── bloques.css
│   └── registro-usuario.css
│
├── js/
│   ├── main.js          → inicialización general de la app
│   ├── api.js            → consumo de countries.dev y Open-Meteo
│   ├── auth.js            → login y cierre de sesión
│   ├── datos.js           → carga inicial desde JSON / localStorage
│   ├── storage.js         → guardado y restablecimiento de localStorage
│   ├── crud.js            → registro, edición y eliminación de entrenamientos
│   ├── filtros.js         → búsqueda, filtros, orden y delegación de eventos
│   ├── grafico.js         → gráfico de progresión con Chart.js
│   ├── componentes.js     → renderizado dinámico del DOM y notificaciones
│   ├── validaciones.js    → validaciones del formulario de registro de usuario
│   └── usuarios.js        → lógica de registro de nuevos usuarios
│
├── json/
│   ├── usuarios.json         → 10 registros
│   ├── movimientos.json      → 15 registros
│   └── entrenamientos.json   → 100 registros
│
└── img/
    ├── logo.png
    ├── squat.png
    ├── bench.png
    └── deadlift.png
```

---

## ▶️ Instrucciones para ejecutar el proyecto

1. Clona el repositorio:
   ```bash
   git clone [PENDIENTE]
   ```
2. Abre la carpeta del proyecto en Visual Studio Code.
3. Instala la extensión **Live Server** (si no la tienes).
4. Haz clic derecho sobre `index.html` y selecciona **"Open with Live Server"**, o ejecuta un servidor local equivalente.
   > ⚠️ El proyecto debe ejecutarse mediante un servidor local (no abriendo el archivo directamente con doble clic), ya que utiliza `fetch()` para leer los archivos JSON.
5. Inicia sesión con cualquiera de los usuarios de prueba de `json/usuarios.json`, por ejemplo:
   - **Correo:** `admin@gmailcom`
   - **Contraseña:** `A1234567`
6. Explora el Dashboard, registra una nueva sesión de entrenamiento, revisa el historial, la sección de técnica y los bloques de planificación.

---

## 📝 Licencia

Proyecto desarrollado con fines académicos para la asignatura Fundamentos Web.

© 2026 — Cristhian Ruiz