import { createMapModal } from '../../components/MapModal/mapModal';
import { createIconButton } from '../../components/IconButton/iconButton';

// Función para crear un elemento de favorito
export const createFavoriteItem = (favorite) => {
  const item = document.createElement('div');
  item.classList.add('favorite-item');

  const place = favorite.placeId;

  // Verificar si place existe y no es null
  if (!place) {
    console.error('Error: placeId es null o undefined en el favorito:', favorite);

    // Creamos un elemento de error para mostrar en lugar del favorito
    const errorInfo = document.createElement('div');
    errorInfo.classList.add('favorite-info');

    const errorText = document.createElement('span');
    errorText.classList.add('favorite-error');
    errorText.textContent = 'Error: Lugar no disponible';

    errorInfo.appendChild(errorText);
    item.appendChild(errorInfo);

    return item;
  }

  // Contenedor para la información del lugar
  const infoContainer = document.createElement('div');
  infoContainer.classList.add('favorite-info');

  // Nombre del lugar
  const name = document.createElement('span');
  name.classList.add('favorite-name');
  name.textContent = place.name || 'Lugar sin nombre';

  // Dirección del lugar (si está disponible)
  if (place.address) {
    const address = document.createElement('span');
    address.classList.add('favorite-address');
    address.textContent = place.address;
    infoContainer.appendChild(address);
  }

  // Categoría del lugar (si está disponible)
  if (place.category) {
    const category = document.createElement('span');
    category.classList.add('favorite-category');
    category.textContent = `Categoría: ${place.category.name || 'Sin categoría'}`;
    infoContainer.appendChild(category);
  }

  // Contenedor para el botón de acción
  const actionContainer = document.createElement('div');
  actionContainer.classList.add('favorite-action-container');

  // Creamos el botón de ver en el mapa
  createIconButton(
    actionContainer,
    '../assets/eye-svgrepo-com.svg',
    (e) => {
      e.stopPropagation(); // Evitar que el clic se propague al elemento padre

      // Crear y mostrar el modal con el mapa centrado en la ubicación del lugar
      createMapModal(place.location, place.name);
    },
    'Ver en mapa'
  );

  // Agregamos los elementos al contenedor de información
  infoContainer.insertBefore(name, infoContainer.firstChild);

  // Agregamos el contenedor de información y el contenedor de acción al elemento principal
  item.appendChild(infoContainer);
  item.appendChild(actionContainer);

  return item;
};
