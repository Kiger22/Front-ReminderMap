import('./favoritesPlaces.css');
import { api } from '../../api/api';
import { AlertNotification } from '../../components/AlertNotification/notification';
import { showCategoryDetails } from '../../functions/showCategoryDetails';

export const favoritesPlacesPage = async (node) => {
  node.innerHTML = "";

  const placesContainer = document.createElement('div');
  placesContainer.classList.add('places-container');

  const header = document.createElement('h2');
  header.textContent = "Lugares Frecuentes";

  const content = document.createElement('p');
  content.textContent = "Lugares ordenados por frecuencia de uso.";

  placesContainer.appendChild(header);
  placesContainer.appendChild(content);

  try {
    const response = await api({
      endpoint: '/places',
      method: 'GET'
    });

    const places = response.lugares;

    if (places && places.length > 0) {
      places.forEach(place => {
        const placeItem = document.createElement('div');
        placeItem.classList.add('place-item');

        const placeInfo = document.createElement('div');
        placeInfo.classList.add('place-info');

        const placeName = document.createElement('h3');
        placeName.textContent = place.name;

        const placeAddress = document.createElement('p');
        placeAddress.textContent = place.address || place.location;

        const placeCategory = document.createElement('span');
        placeCategory.classList.add('place-category');
        placeCategory.textContent = place.category ? place.category.name : 'Sin categoría';

        // Añadimos el evento click si hay categoría
        if (place.category) {
          placeCategory.style.cursor = 'pointer';
          placeCategory.onclick = () => showCategoryDetails(place.category._id);
        }

        const useCount = document.createElement('span');
        useCount.classList.add('use-count');
        useCount.textContent = `Usado ${place.useCount || 0} ${place.useCount === 1 ? 'vez' : 'veces'}`;

        placeInfo.appendChild(placeName);
        placeInfo.appendChild(placeAddress);
        placeInfo.appendChild(placeCategory);
        placeInfo.appendChild(useCount);

        placeItem.appendChild(placeInfo);
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
    errorMessage.textContent = "Error al cargar los lugares.";
    placesContainer.appendChild(errorMessage);
  }

  node.appendChild(placesContainer);
};
