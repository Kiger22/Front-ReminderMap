import('./frequentPlaces.css');
import { createPlacesHeader } from './PlacesHeader/placesHeader';
import { createPlacesContainer } from './PlacesContainer/placesContainer';

//* Función para mostrar la página de lugares frecuentes
export const frequentPlacesPage = async (node) => {
  node.innerHTML = "";

  // Contenedor de la página de lugares frecuentes
  const placesPage = document.createElement('div');
  placesPage.classList.add('places-page');

  // Creamos y agregamos el header
  const placesHeader = createPlacesHeader();
  placesPage.appendChild(placesHeader);

  // Creamos y agregamos el contenedor de lugares
  const placesContainer = await createPlacesContainer();
  placesPage.appendChild(placesContainer);

  // Agregamos todo al nodo principal
  node.appendChild(placesPage);
};
