# KGR Reminder Map - Frontend

## Descripción

KGR Reminder Map es una aplicación web que permite a los usuarios gestionar recordatorios basados en su geolocalización. La aplicación notifica a los usuarios cuando están cerca de una ubicación donde tienen una tarea pendiente.

## Características Principales

- **Gestión de Recordatorios**: Crear, editar, eliminar y visualizar recordatorios
- **Geolocalización**: Notificaciones basadas en la ubicación del usuario
- **Lugares Favoritos**: Guardar y gestionar ubicaciones frecuentes
- **Categorías**: Organizar lugares por categorías personalizadas
- **Perfil de Usuario**: Gestión de datos personales y preferencias
- **Mapa Interactivo**: Visualización de recordatorios en un mapa

## Estructura del Proyecto

```bash
src/
├── api/                # Configuración y funciones de API
│   └── api.js          # Cliente API principal
├── assets/             # Recursos estáticos (imágenes, iconos)
├── components/         # Componentes reutilizables
│   ├── AlertNotification/
│   ├── Button/
│   ├── ButtonPlus/
│   ├── Hero/
│   ├── LoginForm/
│   ├── Map/
│   ├── ReminderDetails/
│   ├── ReminderNotification/
│   ├── UpdateReminderForm/
│   └── UserHeader/
├── functions/          # Funciones de utilidad
│   ├── navigation/     # Funciones de navegación
│   ├── places/         # Gestión de lugares
│   ├── reminders/      # Gestión de recordatorios
│   └── users/          # Gestión de usuarios
├── pages/              # Páginas principales de la aplicación
│   ├── AddReminder/    # Página para añadir recordatorios
│   ├── CategoriesPage/ # Gestión de categorías
│   ├── HomePage/       # Página principal
│   ├── PlacesPage/     # Gestión de lugares
│   ├── ProfilePage/    # Perfil de usuario
│   └── RemindersPage/  # Lista de recordatorios
├── utils/              # Utilidades generales
│   └── formUtils.js    # Utilidades para formularios
└── main.js             # Punto de entrada de la aplicación
```

## Tecnologías Utilizadas

- JavaScript (ES6+)
- HTML5 y CSS3
- Leaflet.js para mapas interactivos
- Fetch API para comunicación con el backend
- LocalStorage para almacenamiento local
- Geolocalización API para obtener la ubicación del usuario

## Instalación y Ejecución

### Requisitos Previos

- Node.js (v14 o superior)
- npm (v6 o superior)

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

3. Iniciar el servidor de desarrollo:

   ```bash
   npm run dev
   ```

4. Abrir en el navegador:

   ```bash
   http://localhost:5173
   ```

## Flujo de Navegación

1. **Página de Inicio (HomePage)**:
   - Muestra información general de la aplicación
   - Botón para añadir recordatorios
   - Mapa con sugerencias de recordatorios cercanos

2. **Autenticación**:
   - Registro de nuevos usuarios
   - Inicio de sesión para usuarios existentes

3. **Gestión de Recordatorios**:
   - Crear nuevos recordatorios con nombre, descripción, fecha, hora y ubicación
   - Ver lista de recordatorios activos
   - Editar o eliminar recordatorios existentes

4. **Gestión de Lugares**:
   - Añadir lugares frecuentes
   - Categorizar lugares
   - Marcar lugares como favoritos

5. **Perfil de Usuario**:
   - Actualizar información personal
   - Configurar ubicaciones predeterminadas (casa, trabajo)
   - Gestionar preferencias de notificación

## Contribución

1. Fork del repositorio
2. Crear rama feature (`git checkout -b feature/NuevaCaracteristica`)
3. Commit cambios (`git commit -m 'Añadir nueva característica'`)
4. Push a la rama (`git push origin feature/NuevaCaracteristica`)
5. Crear Pull Request

## Licencia

Este proyecto está bajo la Licencia MIT - ver el archivo [LICENSE.md](LICENSE.md) para más detalles.

---

**⌨️ por [kiger22](https://github.com/Kiger22)**

## Contribuciones

Las contribuciones son bienvenidas. Por favor, asegúrate de:

1. Seguir las convenciones de código existentes
2. Documentar nuevas funcionalidades
3. Actualizar el README cuando sea necesario
4. Probar los cambios antes de hacer PR
