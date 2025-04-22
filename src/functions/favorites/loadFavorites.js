import { getFavoritesByUser } from './getFavorites';
import { createMapModal } from '../../components/MapModal/mapModal';

// Función para cargar los favoritos del usuario
export const loadFavorites = async (container) => {
  try {
    const userId = localStorage.getItem('userId');
    const authToken = localStorage.getItem('authToken');

    if (!userId || !authToken) {
      container.innerHTML = '<p class="favorite-item">Inicia sesión para ver tus favoritos</p>';
      return;
    }

    const favorites = await getFavoritesByUser(userId);

    if (!favorites || favorites.length === 0) {
      container.innerHTML = '<p class="favorite-item">  No tienes lugares favoritos</p>';
      return;
    }

    container.innerHTML = '';

    favorites.forEach(favorite => {
      const favoriteItem = createFavoriteItem(favorite);
      container.appendChild(favoriteItem);
    });
  } catch (error) {
    console.error('Error al cargar favoritos:', error);
    container.innerHTML = '<p class="favorite-item">Error al cargar favoritos</p>';
  }
};

// Función para crear un elemento de favorito
export const createFavoriteItem = (favorite) => {
  const item = document.createElement('div');
  item.classList.add('favorite-item');

  const place = favorite.placeId;

  // Contenedor para la información del lugar
  const infoContainer = document.createElement('div');
  infoContainer.classList.add('favorite-info');

  // Nombre del lugar
  const name = document.createElement('span');
  name.classList.add('favorite-name');
  name.textContent = place.name;

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

  // Botón para ver en el mapa
  const viewButton = document.createElement('button');
  viewButton.classList.add('favorite-action', 'view-action');
  viewButton.innerHTML = '<img src="../assets/eye-svgrepo-com.svg" alt="Ver" width="30" height="30" title="Ver en mapa" style="filter: brightness(0);">';
  viewButton.title = 'Ver en mapa';
  viewButton.addEventListener('click', (e) => {
    e.stopPropagation(); // Evitar que el clic se propague al elemento padre

    // Crear y mostrar el modal con el mapa centrado en la ubicación del lugar
    createMapModal(place.location, place.name);
  });

  // Agregamos los elementos al contenedor de información
  infoContainer.insertBefore(name, infoContainer.firstChild);

  // Agregamos el contenedor de información y el botón al elemento principal
  item.appendChild(infoContainer);
  item.appendChild(viewButton);

  return item;
};


