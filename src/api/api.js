export const api = async ({ endpoint, method, body, headers = {} }) => {
  try {
    const API_URL = 'https://back-reminder-map.vercel.app/api/v1';
    const cleanEndpoint = endpoint.replace(/^\/+/, '');

    const config = {
      method,
      headers: {
        'Content-Type': 'application/json',
        ...headers
      },
      mode: 'cors',
      credentials: 'include'
    };

    // Añadimos el cuerpo de la solicitud según el método
    if (body instanceof FormData) {
      delete config.headers['Content-Type'];
      config.body = body;
    } else if (body) {
      config.body = JSON.stringify(body);
    }
    console.log('Cuerpo de la solicitud:', config.body);

    // Llamamos a la API y obtener la respuesta
    const url = `${API_URL}/${cleanEndpoint}`;
    console.log('Calling API:', { url, method, headers: config.headers });

    const response = await fetch(url, config);

    // Si la respuesta no es correcta, lanzamos una excepción con el mensaje de error
    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(errorData.message || `Error: ${response.status}`);
    }

    // Devolvemos la respuesta JSON
    return await response.json();
  }
  catch (error) {
    console.error('Error en la API:', { error, endpoint });
    throw error;
  }
};