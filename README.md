# 🌱 FOODCHAIN

Sistema de trazabilidad de productos alimentarios que permite rastrear el recorrido completo de los productos desde el origen hasta el consumidor final.

## 📋 Descripción

FOODCHAIN es una aplicación web moderna diseñada para gestionar y rastrear productos alimentarios de manera eficiente y transparente. El sistema permite a diferentes tipos de usuarios (administradores, distribuidores y visitantes) interactuar con productos, gestionar inventarios, revisar trazabilidad y compartir reseñas.

## ✨ Características Principales

### 🔐 Autenticación y Roles
- Sistema de autenticación con JWT
- Tres tipos de usuarios: **Administrador**, **Distribuidor** y **Visitante**
- Gestión de roles y permisos

### 📦 Gestión de Productos
- Crear, editar y eliminar productos
- Códigos de trazabilidad únicos
- Gestión de imágenes de productos
- Sistema de etiquetas (tags)
- Exportación a PDF y Excel

### 🔍 Trazabilidad
- Seguimiento completo del recorrido del producto
- Timeline de etapas de producción y distribución
- Códigos QR para acceso rápido a información del producto

### ⭐ Reseñas y Calificaciones
- Sistema de reseñas por usuarios
- Calificaciones con estrellas
- Edición y eliminación de reseñas propias

### 📊 Dashboards Personalizados
- **Administrador**: Gestión de usuarios, productos, gráficos y reportes, historial de auditoría
- **Distribuidor**: Gestión de inventario, lotes y estadísticas
- **Visitante**: Exploración de productos, favoritos y recomendaciones

### 🔔 Notificaciones en Tiempo Real
- Sistema de notificaciones usando WebSockets (Socket.IO)
- Notificaciones push para eventos importantes

### 🎨 Interfaz Moderna
- Diseño responsive y adaptable
- Modo oscuro/claro
- Elementos HTML semánticos (respetando el box model)
- Accesibilidad mejorada con ARIA

### 📱 PWA (Progressive Web App)
- Instalable como aplicación nativa
- Funcionalidad offline básica
- Service Worker para caché

### 🔎 Búsqueda Avanzada
- Búsqueda con autocompletado
- Filtros por tipo, disponibilidad, rating
- Ordenamiento y paginación

### 🏷️ Sistema de Recomendaciones
- Recomendaciones basadas en favoritos y reseñas
- Productos relacionados por tipo y etiquetas

## 🛠️ Tecnologías Utilizadas

### Frontend
- **React 18.2** - Biblioteca de UI
- **Vite 5.0** - Build tool y dev server
- **React Router DOM 6.8** - Enrutamiento
- **Axios 1.6** - Cliente HTTP
- **Socket.IO Client 4.8** - WebSockets para notificaciones
- **Recharts 3.4** - Gráficos y visualizaciones
- **React Toastify 11.0** - Notificaciones toast
- **jsPDF 3.0** + **jsPDF-AutoTable 5.0** - Exportación a PDF
- **XLSX 0.18** - Exportación a Excel
- **qrcode.react 4.2** - Generación de códigos QR

### Estilos
- CSS3 con variables CSS
- Diseño responsive
- Modo oscuro/claro

## 📦 Instalación

### Prerrequisitos
- Node.js (versión 16 o superior)
- npm o yarn
- Backend de FOODCHAIN ejecutándose (puerto 3000)

### Pasos

1. **Clonar o descargar el repositorio**
   ```bash
   cd front-food-chain
   ```

2. **Instalar dependencias**
   ```bash
   npm install
   ```

3. **Configurar variables de entorno** (si es necesario)
   - El proyecto usa un proxy configurado en `vite.config.js` que redirige `/api` a `http://localhost:3000`

4. **Iniciar el servidor de desarrollo**
   ```bash
   npm run dev
   ```

5. **Abrir en el navegador**
   - La aplicación estará disponible en `http://localhost:5173`

## 🚀 Scripts Disponibles

- `npm run dev` - Inicia el servidor de desarrollo
- `npm run build` - Construye la aplicación para producción
- `npm run preview` - Previsualiza la build de producción
- `npm run lint` - Ejecuta el linter para verificar código

## 📁 Estructura del Proyecto

```
front-food-chain/
├── public/              # Archivos estáticos
│   ├── manifest.json   # Configuración PWA
│   └── sw.js          # Service Worker
├── src/
│   ├── components/     # Componentes reutilizables
│   │   └── auth/
│   │       ├── admin/      # Componentes de administrador
│   │       ├── common/     # Componentes comunes (Header, Modal, etc.)
│   │       ├── distributor/# Componentes de distribuidor
│   │       └── shared/     # Componentes compartidos
│   ├── context/        # Contextos de React (AuthContext)
│   ├── hooks/          # Custom hooks (useApi)
│   ├── pages/          # Páginas principales
│   │   └── auth/
│   │       ├── admin/      # Dashboard de administrador
│   │       ├── distributor/# Dashboard de distribuidor
│   │       ├── shared/      # Páginas compartidas
│   │       └── visitor/     # Dashboard de visitante
│   ├── services/       # Servicios de API
│   ├── styles/         # Estilos globales
│   ├── utils/          # Utilidades (export, validators, etc.)
│   ├── App.jsx         # Componente principal
│   └── main.jsx        # Punto de entrada
├── index.html          # HTML principal
├── package.json        # Dependencias y scripts
└── vite.config.js      # Configuración de Vite
```

## 🔗 Conexión con Backend

El frontend se conecta al backend a través de:
- **URL Base**: `http://localhost:3000/api`
- **Proxy**: Configurado en `vite.config.js` para desarrollo
- **Autenticación**: JWT tokens almacenados en localStorage

## 👥 Tipos de Usuario

### 👨‍💼 Administrador
- Gestión completa de usuarios y productos
- Visualización de estadísticas y gráficos
- Historial de auditoría
- Exportación de datos

### 🚚 Distribuidor
- Gestión de inventario
- Gestión de lotes
- Visualización de estadísticas de distribución

### 👤 Visitante
- Exploración de productos
- Visualización de detalles y trazabilidad
- Sistema de favoritos
- Reseñas y calificaciones
- Recomendaciones personalizadas

## 🎨 Características de Diseño

- **HTML Semántico**: Uso de elementos semánticos (`<article>`, `<section>`, `<nav>`, etc.) respetando el box model
- **Accesibilidad**: Atributos ARIA, roles y etiquetas semánticas
- **Responsive**: Diseño adaptable a diferentes tamaños de pantalla
- **Modo Oscuro**: Tema claro/oscuro con persistencia en localStorage

## 📝 Notas Importantes

- El backend debe estar ejecutándose en el puerto 3000
- Los tokens JWT tienen una expiración de 24 horas
- Las notificaciones en tiempo real requieren conexión WebSocket
- El PWA funciona mejor en HTTPS (requerido en producción)

## 🤝 Contribución

Este es un proyecto académico. Para contribuir:
1. Asegúrate de seguir las convenciones de código
2. Usa elementos HTML semánticos
3. Mantén la accesibilidad en mente
4. Ejecuta `npm run lint` antes de commitear

## 📄 Licencia

Este proyecto es parte de un trabajo académico.

---

**Desarrollado con ❤️ usando React + Vite**
