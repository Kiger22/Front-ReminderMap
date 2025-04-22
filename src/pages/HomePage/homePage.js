import('./homePage.css');
import { insertMap } from '../../components/Map/insertMap';

export const homePage = (node) => {
  // Limpiamos el contenedor
  node.innerHTML = '';

  // Aseguramos que el nodo principal tenga altura completa
  node.style.height = '100%';

  // Creamos la primera pagina de nuestra APP
  const homeContainer = document.createElement("div");
  homeContainer.classList.add("home-container");

  // Creamos un contenedor para el mapa
  const mapContainer = document.createElement("div");
  mapContainer.classList.add("home-map-container");

  // Añadimos el contenedor del mapa al contenedor principal
  homeContainer.appendChild(mapContainer);

  // Añadimos el contenedor al nodo principal
  node.appendChild(homeContainer);

  // Obtenemos la ubicación actual del usuario
  if (navigator.geolocation) {
    // Mostramos un mensaje de carga mientras obtenemos la ubicación
    const loadingMsg = document.createElement("p");
    loadingMsg.textContent = "Obteniendo tu ubicación actual...";
    loadingMsg.classList.add("loading-message");
    mapContainer.appendChild(loadingMsg);

    navigator.geolocation.getCurrentPosition(
      (position) => {
        // Limpiamos el mensaje de carga
        mapContainer.innerHTML = '';

        // Obtenemos las coordenadas
        const lat = position.coords.latitude;
        const lng = position.coords.longitude;

        // Creamos la ubicación para el mapa
        const location = `${lat},${lng}`;

        // Insertamos el mapa con la ubicación actual
        insertMap(mapContainer, null, {
          location: location,
          isBackground: false
        });

        console.log("Mapa cargado con ubicación actual:", location);
      },
      (error) => {
        // En caso de error, mostramos un mapa con ubicación predeterminada
        console.error("Error al obtener la ubicación:", error);
        mapContainer.innerHTML = '';

        // Usamos Madrid como ubicación predeterminada
        insertMap(mapContainer, null, {
          location: "Madrid, España",
          isBackground: false
        });

        // Mostramos un mensaje de error
        const errorMsg = document.createElement("div");
        errorMsg.textContent = "No se pudo obtener tu ubicación actual";
        errorMsg.classList.add("location-error");
        mapContainer.appendChild(errorMsg);
      },
      {
        enableHighAccuracy: true,
        timeout: 5000,
        maximumAge: 0
      }
    );
  } else {
    // Si el navegador no soporta geolocalización
    mapContainer.innerHTML = '';
    insertMap(mapContainer, null, {
      location: "Madrid, España",
      isBackground: false
    });

    // Mostramos un mensaje de error
    const errorMsg = document.createElement("div");
    errorMsg.textContent = "Tu navegador no soporta geolocalización";
    errorMsg.classList.add("location-error");
    mapContainer.appendChild(errorMsg);
  }
};

