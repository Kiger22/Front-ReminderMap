# ReminderMap Frontend

## Descripción

ReminderMap es una aplicación web moderna que permite a los usuarios crear y gestionar recordatorios basados en ubicación. Desarrollada con JavaScript vanilla y arquitectura modular, ofrece una experiencia fluida y responsive para recibir notificaciones cuando estás cerca de lugares específicos.

## Características Principales

- Gestión de recordatorios geográficos
- Sistema de autenticación de usuarios
- Integración con mapas interactivos (Google Maps)
- Categorización de lugares
- Sistema de notificaciones
- Modo claro/oscuro
- Visualización de lugares frecuentes
- Detalles de categorías de lugares
- Sistema de conteo de uso de lugares
- Scroll personalizado y responsivo
- Interfaz de usuario intuitiva
- Gestión de perfil de usuario con avatar
- Marcado de lugares favoritos

## Tecnologías Utilizadas

- Vanilla JavaScript (ES6+)
- HTML5 & CSS3/SASS
- Vite como bundler y herramienta de desarrollo
- Google Maps API para mapas interactivos
- API REST personalizada
- FormData para manejo de archivos
- Cloudinary para almacenamiento de imágenes
- LocalStorage para persistencia local

## Estructura del Proyecto

```bash
├── public/    
│   └── assets/          # Recursos estáticos (imágenes, iconos)
├── src/
│   ├── api/            # Configuración y servicios de API
│   ├── components/     # Componentes reutilizables
│   │   ├── Home/
│   │   ├── Hero/
│   │   ├── Map/
│   │   ├── LoginForm/
│   │   ├── AlertNotification/
│   │   ├── Footer/
│   │   ├── Header/
│   │   ├── MenuAsside/
│   │   ├── SwitchButton/
│   │   ├── UpdateReminderForm/
│   │   └── ...
│   ├── data/          # Datos estáticos (configuraciones, textos)
│   ├── functions/     # Funciones utilitarias
│   │   ├── favorites/
│   │   ├── navigation/
│   │   ├── reminders/
│   │   └── ...
│   ├── pages/         # Páginas principales
│   │   ├── FavoritesPlaces/
│   │   └── ...
│   ├── styles/        # Estilos globales SASS
│   └── utils/         # Utilidades y helpers
├── index.html         # Punto de entrada HTML
├── main.js            # Punto de entrada JavaScript
└── vite.config.js     # Configuración de Vite
```

## Instalación y Desarrollo

### Prerrequisitos

- Node.js (versión 14 o superior)
- npm (incluido con Node.js)

### Configuración Inicial

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

Crear archivo `.env`:

```plaintext
VITE_API_URL=http://localhost:3000/api/v1
VITE_GOOGLE_MAPS_API_KEY=tu_api_key_de_google_maps
VITE_CLOUDINARY_URL=tu_cloudinary_url
```

### Scripts Disponibles

- `npm run dev`: Inicia el servidor de desarrollo con Vite
- `npm run build`: Construye la aplicación para producción
- `npm run preview`: Vista previa de la build de producción

## Componentes Principales

### Hero

- Componente principal que maneja la vista inicial
- Integra el mapa y los controles principales
- Gestiona la navegación principal

### Map

- Integración con Google Maps API
- Manejo de marcadores y eventos
- Geolocalización y cálculo de distancias

### LoginForm

- Sistema de autenticación
- Validación de formularios
- Gestión de sesiones con localStorage

### Recordatorios

- Creación, edición y eliminación de recordatorios
- Asociación con ubicaciones específicas
- Notificaciones basadas en proximidad

### Favoritos

- Marcado de lugares como favoritos
- Gestión de lista de favoritos
- Contador de uso de lugares

## Guía de Desarrollo

### Estándares de Código

- Usar ES6+ features
- Mantener componentes modulares
- Seguir principios DRY (Don't Repeat Yourself)
- Documentar funciones y componentes principales

### Buenas Prácticas

1. **Manejo de Estado**
   - Usar LocalStorage para persistencia
   - Mantener estado global mínimo
   - Implementar patrón observer cuando sea necesario

2. **Optimización**
   - Lazy loading de componentes
   - Optimización de imágenes
   - Minificación de assets en producción

3. **Seguridad**
   - Validación de inputs
   - Sanitización de datos
   - Manejo seguro de tokens

## Funcionalidades Implementadas

- [x] Sistema de autenticación
- [x] Gestión de recordatorios
- [x] Integración con mapas
- [x] Modo claro/oscuro
- [x] Perfil de usuario
- [x] Sistema de notificaciones
- [x] Visualización de lugares frecuentes
- [x] Sistema de conteo de uso de lugares
- [x] Detalles de categorías
- [x] Interfaz responsiva
- [x] Gestión de perfil de usuario
- [x] Carga y actualización de avatar
- [x] Almacenamiento de ubicaciones personalizadas
- [x] Marcado de lugares favoritos

## Próximas Funcionalidades

- [ ] Compartir recordatorios
- [ ] Estadísticas de uso
- [ ] Integración con calendario
- [ ] Modo offline
- [ ] Notificaciones push
- [ ] Rutas y navegación entre lugares
- [ ] Filtrado avanzado de recordatorios
- [ ] Exportación de datos

## Contribución

1. Fork del repositorio
2. Crear rama feature (`git checkout -b feature/NuevaCaracteristica`)
3. Commit cambios (`git commit -m 'Añadir nueva característica'`)
4. Push a la rama (`git push origin feature/NuevaCaracteristica`)
5. Crear Pull Request

## Licencia

Este proyecto está bajo la Licencia MIT - ver el archivo [LICENSE.md](LICENSE.md) para detalles

---

**⌨️ Desarrollado por [kiger22](https://github.com/Kiger22)**

## Contribuciones

Las contribuciones son bienvenidas. Por favor, asegúrate de:

1. Seguir las convenciones de código existentes
2. Documentar nuevas funcionalidades
3. Actualizar el README cuando sea necesario
4. Probar los cambios antes de hacer PR
