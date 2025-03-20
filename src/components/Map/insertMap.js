import("./insertMap.css");

export const insertMap = (node, Src, options = {}) => {
  const mapContainer = document.createElement('div');
  mapContainer.className = "map-container";

  // Si se proporciona una ubicación específica, usar esa
  const defaultSrc = "https://www.google.com/maps/embed/v1/place?key=TU_API_KEY&q=";
  const mapSrc = options.location ? `${defaultSrc}${encodeURIComponent(options.location)}` : Src;

  const iframe = document.createElement('iframe');
  iframe.className = "iframe_map";
  iframe.allowFullscreen = true;
  iframe.src = mapSrc;

  // Si es modo selección, añadir controles
  if (options.selectable) {
    const controls = document.createElement('div');
    controls.className = "map-controls";

    const searchInput = document.createElement('input');
    searchInput.type = 'text';
    searchInput.placeholder = 'Buscar ubicación...';
    searchInput.className = 'map-search';

    const searchButton = document.createElement('button');
    searchButton.textContent = '🔍';
    searchButton.className = 'map-search-button';

    searchButton.addEventListener('click', () => {
      const query = searchInput.value.trim();
      if (query) {
        iframe.src = `${defaultSrc}${encodeURIComponent(query)}`;
        if (options.onLocationSelect) {
          options.onLocationSelect(query);
        }
      }
    });

    // Permitir búsqueda con Enter
    searchInput.addEventListener('keypress', (e) => {
      if (e.key === 'Enter') {
        searchButton.click();
      }
    });

    controls.appendChild(searchInput);
    controls.appendChild(searchButton);
    mapContainer.appendChild(controls);
  }

  mapContainer.appendChild(iframe);
  node.appendChild(mapContainer);

  return {
    updateLocation: (location) => {
      iframe.src = `${defaultSrc}${encodeURIComponent(location)}`;
    }
  };
};
