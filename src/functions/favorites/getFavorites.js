import { api } from '../../api/api';

export const getFavoritesByUser = async (userId) => {
  try {
    if (!userId) {
      throw new Error('Usuario no autenticado');
    }

    const response = await api({
      endpoint: `/favorites/${userId}`,
      method: 'GET'
    });

    return response || [];
  } catch (error) {
    console.error('Error al obtener favoritos:', error);
    return [];
  }
};