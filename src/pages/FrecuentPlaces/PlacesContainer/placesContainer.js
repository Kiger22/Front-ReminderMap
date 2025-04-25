import('./placesContainer.css');
import { api } from '../../../api/api';
import { createPlaceItem } from '../../../functions/places/createPlaceItem';

//* Función para crear el contenedor de lugares
export const createPlacesContainer = async () => {
  // Contenedor para los lugares
  const placesContainer = document.createElement('div');
  placesContainer.classList.add('places-container');

  // Obtenemos los lugares y los agregamos al contenedor
  try {
    const response = await api({
      endpoint: 'places',
      method: 'GET'
    });
    const places = response.lugares;

    // Si hay lugares, los agregamos al contenedor
    if (places && places.length > 0) {
      places.forEach(place => {
        const placeItem = createPlaceItem(place);
        placesContainer.appendChild(placeItem);
      });
    } else {
      const noPlacesMessage = document.createElement('p');
      noPlacesMessage.classList.add('no-places-message');
      noPlacesMessage.textContent = "No hay lugares registrados.";
      placesContainer.appendChild(noPlacesMessage);
    }
  } catch (error) {
    console.error('Error al obtener los lugares:', error);
    const errorMessage = document.createElement('p');
    errorMessage.classList.add('error-message');

    // Mensaje más descriptivo según el tipo de error
    if (error.message.includes('No se pudo conectar al servidor')) {
      errorMessage.textContent = "No se pudo conectar al servidor. Verifica que el servidor backend esté en ejecución.";
    } else {
      errorMessage.textContent = "Error al cargar los lugares: " + error.message;
    }

    placesContainer.appendChild(errorMessage);
  }

  return placesContainer;
};
