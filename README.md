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

## 🚀 Configuración de Google Apps Script

Para que la sincronización con Google Sheets funcione correctamente, debes seguir estos pasos:

1. Crea una nueva hoja de cálculo en Google Sheets.
2. Ve a `Extensiones` > `Apps Script`.
3. Reemplaza el código existente con el siguiente bloque:

```javascript
function doPost(e) {
  try {
    var data = JSON.parse(e.postData.contents);
    var ss = SpreadsheetApp.getActiveSpreadsheet();
    var nombreHoja = data.month + " " + data.year;
    var sheet = ss.getSheetByName(nombreHoja);

    // Si la hoja no existe, la creamos con la estructura base
    if (!sheet) {
      sheet = ss.insertSheet(nombreHoja);
      var colores = ["#f87171", "#fb923c", "#fbbf24", "#4ade80", "#2dd4bf", "#38bdf8", "#818cf8", "#a78bfa", "#f472b6"];
      var colorAzar = colores[Math.floor(Math.random() * colores.length)];
      sheet.getRange("A1:E1").merge().setValue(nombreHoja.toUpperCase())
        .setBackground(colorAzar).setFontColor("white").setFontWeight("bold")
        .setHorizontalAlignment("center").setFontSize(14);
      
      sheet.getRange("A2").setValue("D"); sheet.getRange("B2").setValue("Ventas");
      sheet.getRange("C2").setValue("Gastos"); sheet.getRange("D2").setValue("Diferencia");
      sheet.getRange("E2").setValue("Acumulado");
      sheet.getRange("A2:E2").setFontWeight("bold").setBackground("#f3f3f3").setHorizontalAlignment("center");

      for (var i = 1; i <= 31; i++) {
        var fila = i + 2;
        sheet.getRange(fila, 1).setValue(i);
        sheet.getRange(fila, 4).setFormula("=B" + fila + "-C" + fila);
        if (i === 1) { sheet.getRange(fila, 5).setFormula("=D" + fila); } 
        else { sheet.getRange(fila, 5).setFormula("=E" + (fila - 1) + "+D" + fila); }
      }

      sheet.getRange("A34").setValue("TOTAL MES").setFontWeight("bold");
      sheet.getRange("B34").setFormula("=SUM(B3:B33)");
      sheet.getRange("C34").setFormula("=SUM(C3:C33)");
      sheet.getRange("D34").setFormula("=SUM(D3:D33)");
      sheet.getRange("A34:E34").setFontWeight("bold").setBackground("#EFEFEF");

      // 5. Tabla de Impuestos y Servicios (G-H)
      sheet.getRange("G1:H1").merge().setValue("IMPUESTOS Y SERVICIOS")
        .setBackground("#475569").setFontColor("white").setFontWeight("bold").setHorizontalAlignment("center");
      sheet.getRange("G2").setValue("Detalle").setFontWeight("bold");
      sheet.getRange("H2").setValue("Monto").setFontWeight("bold");
      sheet.getRange("G21").setValue("TOTAL IMPUESTOS").setFontWeight("bold");
      sheet.getRange("H21").setFormula("=SUM(H3:H20)").setFontWeight("bold").setBackground("#fee2e2");

      // 6. RESUMEN FINAL
      sheet.getRange("J1:K1").merge().setValue("RESUMEN FINAL")
        .setBackground("#1e293b").setFontColor("white").setFontWeight("bold").setHorizontalAlignment("center");
      sheet.getRange("J2").setValue("Caja Acumulada"); sheet.getRange("K2").setFormula("=D34");
      sheet.getRange("J3").setValue("Gastos Fijos"); sheet.getRange("K3").setFormula("=H21");
      sheet.getRange("J5").setValue("RENDIMIENTO NETO").setFontWeight("bold").setFontSize(12);
      sheet.getRange("K5").setFormula("=K2-K3").setFontWeight("bold").setFontSize(12).setBackground("#dcfce7");

      // Formatos
      sheet.getRange("A2:E34").setBorder(true, true, true, true, true, true);
      sheet.getRange("G1:H21").setBorder(true, true, true, true, true, true);
      sheet.getRange("J1:K5").setBorder(true, true, true, true, true, true);
      sheet.getRange("B3:E34").setNumberFormat("$#,##0");
      sheet.getRange("H3:H21").setNumberFormat("$#,##0");
      sheet.getRange("K2:K5").setNumberFormat("$#,##0");
    }

    // --- LÓGICA DE CARGA ---
    
    // Caso 1: Gastos Mensuales (Fijos)
    if (data.type === 'monthly_fixed') {
      sheet.getRange("G3:H20").clearContent();
      if (data.expenses && data.expenses.length > 0) {
        var filasGastos = [];
        for (var j = 0; j < data.expenses.length; j++) {
          if (j < 18) {
            filasGastos.push([data.expenses[j].n, data.expenses[j].v]);
          }
        }
        if (filasGastos.length > 0) {
          sheet.getRange(3, 7, filasGastos.length, 2).setValues(filasGastos);
        }
      }
      return ContentService.createTextOutput(JSON.stringify({ result: 'success', type: 'fixed' })).setMimeType(ContentService.MimeType.JSON);
    } 
    
    // Caso 2: Carga Diaria
    else {
      var diaNumero = parseInt(data.fecha.split(" de ")[0]);
      var filaDestino = diaNumero + 2;
      sheet.getRange(filaDestino, 2).setValue(parseFloat(data.ventas) || 0);
      sheet.getRange(filaDestino, 3).setValue(parseFloat(data.gastos) || 0);
      return ContentService.createTextOutput(JSON.stringify({ result: 'success', type: 'daily' })).setMimeType(ContentService.MimeType.JSON);
    }

  } catch (error) {
    return ContentService.createTextOutput(JSON.stringify({ result: 'error', error: error.toString() })).setMimeType(ContentService.MimeType.JSON);
  }
}
```

4. Haz clic en `Implementar` > `Nueva implementación`.
5. Selecciona `Tipo: Aplicación Web`.
6. Configura `Quién tiene acceso: Cualquiera`.
7. Copia la URL generada y pégala en tu archivo `.env` bajo la variable `VITE_GOOGLE_SHEETS_URL`.
