//* Función para interactuar con la API
export const api = async ({ endpoint, method = 'GET', body, token, isFormData = false }) => {
  try {

    // URL de la API
    const API_URL = 'http://localhost:3000/api/v1';
    const url = `${API_URL}/${endpoint}`;

    // Configuración de cabeceras
    const headers = {};
    if (token) {
      headers['Authorization'] = `Bearer ${token}`;
    }
    if (!isFormData && method !== 'GET') {
      headers['Content-Type'] = 'application/json';
    }

    // Configuración de opciones de la petición
    const options = {
      method,
      headers,
    };

    // Añadir el cuerpo de la petición si es necesario
    if (body && method !== 'GET') {
      options.body = isFormData ? body : JSON.stringify(body);
    }

    // Realizar la petición a la API y manejar la respuesta
    const response = await fetch(url, options);
    const data = await response.json();

    // Manejar errores de la API
    if (!response.ok) {
      throw new Error(data.message || 'Error en la petición');
    }

    return data;
  }
  catch (error) {
    console.error('Error en la petición API:', error);
    throw error;
  }
};
