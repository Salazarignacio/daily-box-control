# 📊 Daily Box Control

**Control de Caja Diario** es una aplicación web moderna diseñada para simplificar el cierre de caja y el seguimiento financiero de pequeños y medianos comercios. Enfocada en la simplicidad y la agilidad, permite a dueños y empleados registrar movimientos diarios en menos de 2 minutos.

[![Vercel Deployment](https://img.shields.io/badge/Deploy-Vercel-black?style=for-the-badge&logo=vercel)](https://balance-five-gamma.vercel.app/)
[![React](https://img.shields.io/badge/React-20232A?style=for-the-badge&logo=react&logoColor=61DAFB)](https://reactjs.org/)
[![Firebase](https://img.shields.io/badge/firebase-%23039BE5.svg?style=for-the-badge&logo=firebase&logoColor=ffca28)](https://firebase.google.com/)

---

## ✨ Características Principales

*   **🔐 Sistema de Roles (RBAC):** Diferenciación entre perfiles **ADMIN** y **CLIENT**.
    *   *ADMIN:* Control total, visualización de ventas totales, gastos mensuales y acceso a planillas.
    *   *CLIENT:* Interfaz operativa simplificada, carga de movimientos sin acceso a cifras de rentabilidad total.
*   **⚡ Carga Rápida (Vista "Día"):** Botón de acción directa para abrir el formulario del día de la fecha sin clics innecesarios.
*   **🗓️ Navegación Inteligente:** Selector de vistas (Día / Mes / Año) con interfaz táctil deslizable (drag & swipe).
*   **🇦🇷 Formato Localizado:** Manejo automático de moneda argentina (punto para miles, coma para decimales).
*   **📑 Sincronización en Tiempo Real:** Todos los datos se guardan en **Firebase Firestore** y se exportan automáticamente a una **Planilla de Google Sheets**.
*   **📈 Resumen Mensual Visual:** Barra de progreso de gastos vs. ventas y cálculo automático de **Rendimiento Neto**.
*   **📱 Mobile First:** Interfaz optimizada para el uso diario desde celulares en el punto de venta.

![alt text](image.png)
![alt text](image-1.png)
![alt text](image-2.png)
![alt text](image-3.png)

## 🛠️ Stack Tecnológico

*   **Frontend:** React (Vite)
*   **Autenticación:** Firebase Auth
*   **Ani![alt text](image-1.png)maciones:** Framer Motion
*   **Backend & DB:** Firebase Firestore
*   **Fechas:** Luxon
*   **Integración:** Google Apps Script

---

## 🚀 Instalación y Configuración

### Variables de Entorno
Crea un archivo `.env` en la raíz del proyecto con tus credenciales:
```env
VITE_DB_FIRE=tu_coleccion_de_firebase
VITE_GOOGLE_SHEETS_URL=tu_url_de_google_script
VITE_SHEET_URL=tu_url_de_la_planilla_de_visualizacion
VITE_ENABLE_AUTH=true (Activa/Desactiva el login para demos)
```

---

## 💼 Visión Comercial

Esta aplicación está diseñada como una solución SaaS (Software as a Service) para:
*   Kioscos y almacenes.
*   Cafeterías y Gastronomía.
*   Showrooms y locales de ropa.

**Diferenciales:**
*   **Privacidad:** El dueño puede delegar la carga de datos sin exponer la rentabilidad real del negocio.
*   **Modo Demo:** Posibilidad de desplegar versiones de prueba sin login para potenciales clientes mediante configuración.

---
DEMO: https://balance-five-gamma.vercel.app/
Desarrollado por [Ignacio Salazar](https://github.com/ignaciosalazar986) 🇦🇷
