import { getFavoritesByUser } from './getFavorites';
import { createFavoriteItem } from './createFavoriteItem';

// Función para cargar los favoritos del usuario
export const loadFavorites = async (container) => {
  try {

    // Obtenemos el ID del usuario y el token de autenticación
    const userId = localStorage.getItem('userId');
    const authToken = localStorage.getItem('authToken');

    // Verificamos si el usuario está autenticado
    if (!userId || !authToken) {
      container.innerHTML = '<p class="favorite-item">Inicia sesión para ver tus favoritos</p>';
      return;
    }

    // Obtenemos los favoritos del usuario
    const favorites = await getFavoritesByUser(userId);

    // Verificamos si hay favoritos
    if (!favorites || favorites.length === 0) {
      container.innerHTML = '<p class="favorite-item">  No tienes lugares favoritos</p>';
      return;
    }

    // Limpiamos el contenedor
    container.innerHTML = '';

    // Filtrar favoritos válidos (con placeId no nulo)
    const validFavorites = favorites.filter(favorite => favorite && favorite.placeId);

    // Verificamos si hay favoritos válidos
    if (validFavorites.length === 0) {
      container.innerHTML = '<p class="favorite-item">No tienes lugares favoritos válidos</p>';
      return;
    }

    // Agregamos cada favorito válido al contenedor
    validFavorites.forEach(favorite => {
      try {
        const favoriteItem = createFavoriteItem(favorite);
        container.appendChild(favoriteItem);
      } catch (itemError) {
        console.error('Error al crear elemento favorito:', itemError, favorite);
      }
    });
  } catch (error) {
    console.error('Error al cargar favoritos:', error);
    container.innerHTML = '<p class="favorite-item">Error al cargar favoritos</p>';
  }
};





