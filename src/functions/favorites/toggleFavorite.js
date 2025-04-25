import { api } from '../../api/api';
import { AlertNotification } from '../../components/AlertNotification/notification';

export const toggleFavorite = async (placeId) => {
  try {

    // Obtenemos el ID del usuario
    const userId = localStorage.getItem('userId');
    if (!userId) {
      throw new Error('Usuario no autenticado');
    }

    // Enviamos la solicitud para marcar como favorito
    const response = await api({
      endpoint: '/favorites',
      method: 'POST',
      body: {
        userId,
        placeId
      }
    });

    // obtenemos la respuesta
    if (response) {
      return true;
    }
    return false;
  } catch (error) {
    console.error('Error al marcar favorito:', error);
    AlertNotification('Error', 'No se pudo marcar como favorito', null, {
      showCancelButton: false
    });
    return false;
  }
};

export const removeFavorite = async (placeId) => {
  try {
    // Obtenemos el ID del usuario
    const userId = localStorage.getItem('userId');
    if (!userId) {
      throw new Error('Usuario no autenticado');
    }

    // Construimos el endpoint basado en el userId y el placeId
    const endpoint = `favorites/${userId}/${placeId}`.replace(/\/+/g, '/');

    // Enviamos la solicitud para quitar de favoritos
    const response = await api({
      endpoint,
      method: 'DELETE'
    });

    // obtenemos la respuesta
    if (response) {
      return true;
    }
    return false;
  } catch (error) {
    console.error('Error al quitar favorito:', error);
    const message = error.message === 'Favorito no encontrado'
      ? 'Este lugar ya no está en favoritos'
      : 'No se pudo quitar de favoritos';

    AlertNotification('Error', message, null, {
      showCancelButton: false
    });
    return false;
  }
};


