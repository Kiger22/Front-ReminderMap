# KGR Reminder Map - Frontend

## Descripción

KGR Reminder Map es una aplicación web que permite a los usuarios gestionar recordatorios basados en su geolocalización. La aplicación notifica a los usuarios cuando están cerca de una ubicación donde tienen una tarea pendiente, ayudándoles a optimizar sus rutas diarias y no olvidar tareas importantes.

## Características Principales

- **Gestión de Recordatorios**: Crear, editar, eliminar y visualizar recordatorios con fechas, horas y ubicaciones específicas
- **Geolocalización**: Notificaciones basadas en la ubicación del usuario en tiempo real
- **Lugares Favoritos**: Guardar y gestionar ubicaciones frecuentes para rápido acceso
- **Categorías Personalizables**: Organizar lugares por categorías definidas por el usuario
- **Perfil de Usuario**: Gestión de datos personales y preferencias de notificación
- **Mapa Interactivo**: Visualización de recordatorios en un mapa con marcadores personalizados
- **Calendario Integrado**: Vista de recordatorios por fecha en formato calendario
- **Modo Offline**: Almacenamiento local para funcionamiento sin conexión

## Arquitectura del Proyecto

La aplicación sigue una arquitectura modular basada en componentes, con separación clara entre la lógica de negocio, la presentación y la comunicación con el backend.

```bash
src/
├── api/                # Configuración y funciones de API
│   └── api.js          # Cliente API principal con manejo de autenticación
├── assets/             # Recursos estáticos (imágenes, iconos, SVG)
├── components/         # Componentes reutilizables
│   ├── AlertNotification/  # Sistema de notificaciones y alertas
│   ├── Button/         # Componente de botón estándar
│   ├── ButtonPlus/     # Botón flotante de acción principal
│   ├── Calendar/       # Componente de calendario para visualizar recordatorios
│   ├── Hero/           # Componente de cabecera principal
│   ├── LoginForm/      # Formulario de inicio de sesión y registro
│   ├── Map/            # Componente de mapa interactivo con Leaflet
│   ├── ReminderDetails/ # Vista detallada de recordatorios
│   ├── ReminderNotification/ # Sistema de notificaciones de recordatorios
│   ├── UpdateReminderForm/ # Formulario para actualizar recordatorios
│   ├── UserHeader/     # Cabecera con información del usuario
│   └── WelcomeModal/   # Modal de bienvenida para nuevos usuarios
├── functions/          # Funciones de utilidad y lógica de negocio
│   ├── navigation/     # Funciones de navegación entre páginas
│   ├── places/         # Gestión de lugares y ubicaciones
│   ├── reminders/      # Gestión de recordatorios
│   └── users/          # Gestión de usuarios y autenticación
├── pages/              # Páginas principales de la aplicación
│   ├── AddCategory/    # Página para añadir categorías
│   ├── AddPlace/       # Página para añadir lugares
│   ├── AddReminder/    # Página para añadir recordatorios
│   ├── CategoriesPage/ # Gestión de categorías
│   ├── HomePage/       # Página principal
│   ├── PlacesPage/     # Gestión de lugares
│   ├── ProfilePage/    # Perfil de usuario
│   └── RemindersList/  # Lista de recordatorios
├── utils/              # Utilidades generales
│   └── formUtils.js    # Utilidades para formularios
└── main.js             # Punto de entrada de la aplicación
```

## Tecnologías Utilizadas

- **JavaScript (ES6+)**: Lenguaje principal de desarrollo
- **HTML5 y CSS3**: Estructura y estilos de la aplicación
- **Leaflet.js**: Biblioteca para mapas interactivos
- **Fetch API**: Comunicación con el backend RESTful
- **LocalStorage**: Almacenamiento local para datos de usuario y caché
- **Geolocation API**: Obtención de la ubicación del usuario
- **Vite**: Herramienta de construcción y desarrollo
- **SASS**: Preprocesador CSS para estilos avanzados
- **SVG**: Iconos y gráficos vectoriales

## Instalación y Ejecución

### Requisitos Previos

- Node.js (v14 o superior)
- npm (v6 o superior)
- Conexión a internet para la primera instalación

### Pasos de Instalación

1. Clonar el repositorio:

   ```bash
   git clone https://github.com/Kiger22/Front-ReminderMap.git
   cd Front-ReminderMap
   ```

2. Instalar dependencias:

   ```bash
   npm install
   ```

3. Configurar variables de entorno:
   
   Crear un archivo `.env` en la raíz del proyecto con las siguientes variables:
   
   ```
   VITE_API_URL=https://tu-backend-url.com/api/v1
   VITE_GOOGLE_MAPS_API_KEY=tu_clave_api_google_maps
   ```

4. Iniciar el servidor de desarrollo:

   ```bash
   npm run dev
   ```

5. Abrir en el navegador:

   ```
   http://localhost:5173
   ```

## Flujo de Navegación

1. **Página de Inicio (HomePage)**:
   - Muestra información general de la aplicación
   - Botón para añadir recordatorios
   - Mapa con recordatorios cercanos
   - Acceso rápido a funciones principales

2. **Autenticación**:
   - Registro de nuevos usuarios con validación
   - Inicio de sesión seguro con JWT
   - Recuperación de contraseña

3. **Gestión de Recordatorios**:
   - Crear recordatorios con nombre, descripción, fecha, hora y ubicación
   - Ver lista de recordatorios activos con filtros
   - Editar o eliminar recordatorios existentes
   - Visualizar recordatorios en calendario

4. **Gestión de Lugares**:
   - Añadir lugares con nombre, descripción y coordenadas
   - Categorizar lugares para mejor organización
   - Marcar lugares como favoritos
   - Ver historial de lugares visitados

5. **Perfil de Usuario**:
   - Actualizar información personal y avatar
   - Configurar ubicaciones predeterminadas (casa, trabajo)
   - Gestionar preferencias de notificación
   - Ver estadísticas de uso

## Integración con Backend

La aplicación se comunica con un backend RESTful desarrollado en Node.js. La comunicación se realiza mediante la API definida en `src/api/api.js`, que maneja:

- Autenticación mediante JWT
- Gestión de sesiones
- Peticiones CRUD para recordatorios, lugares y categorías
- Manejo de errores y reintentos
- Caché de datos para funcionamiento offline

## Despliegue

Para desplegar la aplicación en producción:

```bash
# Construir la aplicación
npm run build

# Los archivos generados estarán en la carpeta 'dist'
# Puedes desplegarlos en cualquier servidor web estático
```

## Buenas Prácticas Implementadas

- **Componentes Reutilizables**: Diseño modular para maximizar la reutilización
- **Separación de Responsabilidades**: Cada módulo tiene una función específica
- **Manejo de Errores**: Sistema robusto de captura y notificación de errores
- **Almacenamiento Local**: Caché de datos para mejorar rendimiento y experiencia offline
- **Diseño Responsivo**: Adaptable a diferentes tamaños de pantalla
- **Accesibilidad**: Implementación de prácticas WCAG para mejorar accesibilidad

## Contribución

Las contribuciones son bienvenidas. Por favor, sigue estos pasos:

1. Fork del repositorio
2. Crear rama feature (`git checkout -b feature/NuevaCaracteristica`)
3. Commit cambios (`git commit -m 'Añadir nueva característica'`)
4. Push a la rama (`git push origin feature/NuevaCaracteristica`)
5. Crear Pull Request

### Guía de Contribución

1. Seguir las convenciones de código existentes
2. Documentar nuevas funcionalidades
3. Añadir pruebas para nuevas características
4. Actualizar el README cuando sea necesario
5. Probar los cambios en diferentes navegadores

## Licencia

Este proyecto está bajo la Licencia MIT - ver el archivo [LICENSE.md](LICENSE.md) para más detalles.

---

**⌨️ Desarrollado por [kiger22](https://github.com/Kiger22)**

## Contribuciones

Las contribuciones son bienvenidas. Por favor, asegúrate de:

1. Seguir las convenciones de código existentes
2. Documentar nuevas funcionalidades
3. Actualizar el README cuando sea necesario
4. Probar los cambios antes de hacer PR
