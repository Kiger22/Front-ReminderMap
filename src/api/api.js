export const api = async ({ endpoint, method = 'GET', body, token, isFormData = false }) => {
  try {
    const API_URL = 'http://localhost:3000/api/v1';
    const url = `${API_URL}/${endpoint}`;

    console.log('URL de la API:', url);
    console.log('Datos a enviar:', body); // Debug

    // Crear objeto de cabeceras para la petición
    const headers = {};
    if (token) {
      headers['Authorization'] = `Bearer ${token}`;
    }

    // Solo agregamos Content-Type si no es FormData
    if (!isFormData && method !== 'GET') {
      headers['Content-Type'] = 'application/json';
    }

    // Configurar opciones de la petición
    const options = {
      method,
      headers,
      body: isFormData ? body : (body ? JSON.stringify(body) : undefined)
    };

    console.log('Opciones completas de la petición:', {
      method: options.method,
      headers: options.headers,
      body: options.body
    });

    if (method === 'GET') delete options.body;

    const response = await fetch(url, options);
    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.message || data.error || 'Error en la petición');
    }

    return data;
  }
  catch (error) {
    console.error('Error detallado en la API:', error);
    throw error;
  }
};
