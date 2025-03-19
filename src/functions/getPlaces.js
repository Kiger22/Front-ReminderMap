import { api } from "../api/api";

export const getPlaces = async () => {
  try {
    const userId = localStorage.getItem('userId');
    const authToken = localStorage.getItem('authToken');

    if (!userId || !authToken) {
      throw new Error('No hay autorización');
    }

    const response = await api({
      endpoint: `places/user/${userId}`,
      method: 'GET',
      token: authToken
    });

    if (!response.éxito) {
      throw new Error(response.mensaje || 'Error al obtener lugares');
    }

    return response.lugares || [];
  } catch (error) {
    console.error('Error al obtener lugares:', error);
    return [];
  }
};

