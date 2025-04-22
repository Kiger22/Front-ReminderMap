import("./insertMap.css");

const GOOGLE_MAPS_API_KEY = import.meta.env.VITE_GOOGLE_MAPS_API_KEY;

// Verificación de variables de entorno
console.log('API Key loaded:', !!GOOGLE_MAPS_API_KEY);

if (!GOOGLE_MAPS_API_KEY) {
  console.error('Error: La clave de API de Google Maps no está definida en el archivo .env');
}

export const insertMap = (node, Src, options = {}) => {
  const mapContainer = document.createElement('div');
  mapContainer.className = options.isBackground ? "background-map__wrapper" : "place-map__wrapper";

  // Crear el iframe para el mapa
  const iframe = document.createElement('iframe');
  iframe.className = options.isBackground ? "background-map__iframe" : "iframe_map";
  iframe.allowFullscreen = true;
  iframe.loading = "lazy";
  iframe.referrerPolicy = "no-referrer-when-downgrade";

  // Aseguramos que la ubicación esté codificada correctamente
  const location = options.location || 'Madrid, España';
  iframe.src = Src || `https://www.google.com/maps/embed/v1/place?key=${GOOGLE_MAPS_API_KEY}&q=${encodeURIComponent(location)}`;

  // Si el mapa es seleccionable, añadimos un overlay para capturar clics
  if (options.selectable) {
    // Crear un contenedor para el iframe y el overlay
    const iframeContainer = document.createElement('div');
    iframeContainer.className = 'map-iframe-container';

    // Añadir el iframe al contenedor
    iframeContainer.appendChild(iframe);

    // Crear un overlay para mostrar instrucciones y capturar la ubicación actual
    const overlay = document.createElement('div');
    overlay.className = 'map-overlay';

    // Mensaje de instrucción
    const instructionMsg = document.createElement('div');
    instructionMsg.className = 'map-instruction-message';
    instructionMsg.textContent = 'Navega en el mapa y haz clic en "Usar esta ubicación" cuando encuentres el lugar deseado';
    overlay.appendChild(instructionMsg);

    // Botón para usar la ubicación actual del mapa
    const useLocationBtn = document.createElement('button');
    useLocationBtn.textContent = 'Usar esta ubicación';
    useLocationBtn.className = 'use-location-btn';

    // Añadir controles de búsqueda
    const searchContainer = document.createElement('div');
    searchContainer.className = 'place-map__controls';

    const searchInput = document.createElement('input');
    searchInput.className = 'place-map__search-input';
    searchInput.type = 'text';
    searchInput.placeholder = 'Buscar ubicación...';

    const searchButton = document.createElement('button');
    searchButton.className = 'place-map__search-button';
    searchButton.textContent = 'Buscar';

    // Variable para almacenar la ubicación actual
    let currentSearchLocation = location;

    searchButton.addEventListener('click', () => {
      const searchLocation = searchInput.value.trim();
      if (searchLocation) {
        currentSearchLocation = searchLocation;
        iframe.src = `https://www.google.com/maps/embed/v1/place?key=${GOOGLE_MAPS_API_KEY}&q=${encodeURIComponent(searchLocation)}`;
      }
    });

    // También permitir búsqueda al presionar Enter
    searchInput.addEventListener('keypress', (e) => {
      if (e.key === 'Enter') {
        const searchLocation = searchInput.value.trim();
        if (searchLocation) {
          currentSearchLocation = searchLocation;
          iframe.src = `https://www.google.com/maps/embed/v1/place?key=${GOOGLE_MAPS_API_KEY}&q=${encodeURIComponent(searchLocation)}`;
        }
      }
    });

    // Evento para capturar la ubicación actual
    useLocationBtn.addEventListener('click', (e) => {
      // Prevenir comportamiento por defecto
      e.preventDefault();
      e.stopPropagation();

      // Usar la ubicación actual de búsqueda
      if (currentSearchLocation) {
        console.log('Usando ubicación actual:', currentSearchLocation);

        // Llamar al callback con la ubicación actual
        if (options.onLocationSelect && typeof options.onLocationSelect === 'function') {
          try {
            options.onLocationSelect(currentSearchLocation);
            console.log('Callback de selección ejecutado correctamente con:', currentSearchLocation);
          } catch (error) {
            console.error('Error en el callback de selección:', error);
          }
        } else {
          console.warn('No se proporcionó un callback onLocationSelect válido');
        }

        // Mostrar mensaje de confirmación
        instructionMsg.textContent = '¡Ubicación seleccionada!';
        instructionMsg.classList.add('location-selected');

        // Ocultar el mensaje después de 2 segundos
        setTimeout(() => {
          instructionMsg.textContent = 'Navega en el mapa y haz clic en "Usar esta ubicación" cuando encuentres el lugar deseado';
          instructionMsg.classList.remove('location-selected');
        }, 2000);
      } else {
        console.warn('No hay ubicación para seleccionar');
      }
    });

    overlay.appendChild(useLocationBtn);
    iframeContainer.appendChild(overlay);

    searchContainer.appendChild(searchInput);
    searchContainer.appendChild(searchButton);
    iframeContainer.appendChild(searchContainer);

    // Añadir el contenedor al nodo principal
    mapContainer.appendChild(iframeContainer);
  } else {
    // Si no es seleccionable, simplemente añadimos el iframe
    mapContainer.appendChild(iframe);
  }

  node.appendChild(mapContainer);

  // Devolver objeto con métodos para interactuar con el mapa
  return {
    updateLocation: (location) => {
      if (location && GOOGLE_MAPS_API_KEY) {
        const newSrc = `https://www.google.com/maps/embed/v1/place?key=${GOOGLE_MAPS_API_KEY}&q=${encodeURIComponent(location)}`;
        iframe.src = newSrc;
      }
    }
  };
};
