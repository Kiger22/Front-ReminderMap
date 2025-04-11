import("./insertMap.css");

const GOOGLE_MAPS_API_KEY = import.meta.env.VITE_GOOGLE_MAPS_API_KEY;
// URL por defecto que incluye la clave API
const DEFAULT_MAP_URL = `https://www.google.com/maps/embed/v1/view?key=${GOOGLE_MAPS_API_KEY}&center=40.416775,-3.703790&zoom=12`;

// Verificación de variables de entorno
console.log('API Key loaded:', !!GOOGLE_MAPS_API_KEY);

if (!GOOGLE_MAPS_API_KEY) {
  console.error('Error: La clave de API de Google Maps no está definida en el archivo .env');
}

export const insertMap = (node, Src, options = {}) => {
  const mapContainer = document.createElement('div');
  mapContainer.className = options.isBackground ? "background-map__wrapper" : "place-map__wrapper";

  const iframe = document.createElement('iframe');
  iframe.className = options.isBackground ? "background-map__iframe" : "iframe_map";
  iframe.allowFullscreen = true; // Corregido a camelCase
  iframe.loading = "lazy";
  iframe.referrerPolicy = "no-referrer-when-downgrade";
  iframe.src = Src || `https://www.google.com/maps/embed/v1/place?key=${GOOGLE_MAPS_API_KEY}&q=${encodeURIComponent(options.location || 'Madrid, España')}`;

  mapContainer.appendChild(iframe);
  node.appendChild(mapContainer);

  return {
    updateLocation: (location) => {
      if (location && GOOGLE_MAPS_API_KEY) {
        const newSrc = `https://www.google.com/maps/embed/v1/place?key=${GOOGLE_MAPS_API_KEY}&q=${encodeURIComponent(location)}`;
        iframe.src = newSrc;
      }
    }
  };
};
