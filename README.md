# 📅 Daily Box Control

**Daily Box Control** es una solución profesional y minimalista para la gestión diaria de ingresos y egresos. Diseñada para comercios y finanzas personales, esta aplicación automatiza el seguimiento de caja, sincronizando datos en tiempo real con **Firebase** y generando reportes automáticos en **Google Sheets**.

---

## ✨ Características Principales

### 🧠 Inteligencia y Automatización
*   **Traspaso de Saldo Automático:** El efectivo final de ayer se convierte automáticamente en el efectivo inicial de hoy, garantizando la correlatividad de la caja.
*   **Dinamismo Total:** Secciones de gastos (efectivo/digital) y ventas que crecen bajo demanda. Agregá o eliminá filas según lo necesites con un solo clic.
*   **Resumen Mensual en Vivo:** Visualizá los totales de ventas y gastos directamente sobre cada mes en el calendario, sin necesidad de abrir reportes externos.

### 📊 Integración Pro
*   **Sincronización Dual:** Los datos se guardan de forma persistente en **Cloud Firestore** y se exportan automáticamente a una **Google Sheet** personalizada.
*   **Reportes Inteligentes:** El sistema crea automáticamente una nueva pestaña en tu planilla por cada mes (ej: "Mayo 2026"), organizando los datos del 1 al 31 y calculando rendimientos netos e impuestos.

### 🎨 Experiencia de Usuario (UX)
*   **Interfaz Minimalista:** Formulario "Zero-State" que solo muestra lo esencial al iniciar, reduciendo el ruido visual.
*   **Diseño Centrado:** Formulario modal flotante con cabecera fija para mantener siempre a la vista la fecha que estás editando.
*   **Indicadores Visuales:** Calendario tipo almanaque con indicadores de estado (puntos verdes) para identificar rápidamente los días ya procesados.
*   **Control Anti-Errores:** Prevención de cambios accidentales en montos mediante scroll y limpieza automática de filas vacías antes del guardado.

---

## 🛠️ Stack Tecnológico

*   **Frontend:** [React.js](https://reactjs.org/) + [Vite](https://vitejs.dev/)
*   **Estilos:** CSS3 Moderno (Custom Properties, Grid, Flexbox)
*   **Base de Datos:** [Firebase Firestore](https://firebase.google.com/products/firestore)
*   **Automatización:** [Google Apps Script](https://www.google.com/script/start/)
*   **Fechas:** [Luxon](https://moment.github.io/luxon/)

---

## 🚀 Instalación y Configuración

1.  **Clonar el repositorio:**
    ```bash
    git clone https://github.com/tu-usuario/daily-box-control.git
    cd daily-box-control
    ```

2.  **Instalar dependencias:**
    ```bash
    npm install
    ```

3.  **Variables de Entorno:**
    Crea un archivo `.env` en la raíz del proyecto con el nombre de tu colección de Firebase:
    ```env
    VITE_DB_FIRE=tu_nombre_de_coleccion
    ```

4.  **Correr en desarrollo:**
    ```bash
    npm run dev
    ```

---

## 📈 Estructura de la Planilla (Google Sheets)

La aplicación espera un script de Google Apps vinculado a tu hoja de cálculo que reciba peticiones POST. El script procesa:
- **Fecha:** Identifica automáticamente el día y la fila destino.
- **Ventas/Gastos:** Actualiza montos y recalcula el acumulado mensual.
- **Rendimiento Neto:** Descuenta automáticamente una tabla manual de Impuestos y Servicios.

---

## 📝 Notas de Versión
*   **v2.0:** Rediseño completo de UI, soporte para gastos dinámicos y sincronización avanzada con Sheets.
*   **v1.0:** Versión inicial (Calendario estático y variables fijas).

---
Desarrollado con ❤️ para mejorar la gestión financiera diaria.
