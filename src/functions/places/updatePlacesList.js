import { getPlaces } from './getPlaces';
import { createPlaceItem } from './createPlaceItem';

//* Función para actualizar la lista de lugares
export const updatePlacesList = async () => {
  const placesContainer = document.querySelector('.places-container');
  if (!placesContainer) return;

  try {
    // Obtenemos los lugares y los agregamos al contenedor
    const places = await getPlaces();
    placesContainer.innerHTML = '';
    places.forEach(place => {
      const placeItem = createPlaceItem(place);
      placesContainer.appendChild(placeItem);
    });
  } catch (error) {
    console.error('Error al actualizar lista de lugares:', error);
  }
};