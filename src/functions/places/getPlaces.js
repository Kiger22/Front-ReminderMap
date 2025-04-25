import { api } from '../../api/api';

//* Función para obtener los lugares del usuario
export const getPlaces = async () => {
  try {
    // Obtenemos los datos de usuario y token
    const userId = localStorage.getItem('userId');
    const authToken = localStorage.getItem('authToken');

    // Verificamos si el usuario está autenticado
    if (!userId || !authToken) {
      throw new Error('No hay autorización');
    }

    // Realizamos la solicitud a la API
    const response = await api({
      endpoint: `places/user/${userId}`,
      method: 'GET',
      token: authToken
    });

    // Verificamos si la respuesta es válida y contiene lugares
    if (response && response.lugares) {
      return response.lugares;
    }

    return [];
  } catch (error) {
    console.error('Error al obtener lugares:', error);
    return [];
  }
};


