export const api = async ({ endpoint, method, body, headers = {} }) => {
  try {
    // URL de la API
    const API_URL = 'front-reminder-map-m1a1-7gfttyuwt-guillermo-mendozas-projects.vercel.app/api/v1';
    const cleanEndpoint = endpoint.replace(/^\/+/, '');
    console.log('Endpoint:', cleanEndpoint);
    // Obtenemos el token de autenticación del local storage
    const token = localStorage.getItem('authToken');

    // Configuración de la solicitud
    const config = {
      method,
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
        ...headers
      },
      mode: 'cors',
    };

    // Añadimos el cuerpo de la solicitud según el método
    // Automáticamente configura el body y el encabezado según el tipo
    if (body instanceof FormData) {
      config.body = body;
      delete config.headers['Content-Type'];
    } else if (body) {
      config.body = JSON.stringify(body);
    }
    // Mostramos el cuerpo de la solicitud en la consola
    console.log('Cuerpo de la solicitud:', config.body);

    // Mostramos el FormData en la consola
    if (body instanceof FormData) {
      console.log('FormData enviado:');
      body.forEach((value, key) => console.log(`${key}:`, value));
    }

    // Llamamos a la API y obtenemos la respuesta
    const url = `${API_URL}/${cleanEndpoint}`;
    console.log('Calling API:', { url, method, headers: config.headers });

    const response = await fetch(url, config);

    // Si la respuesta no es correcta, lanzamos una excepción con el mensaje de error
    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      console.error('API response error:', errorData);
      throw new Error(errorData.message || `Error: ${response.status}`);
    }

    // Si la respuesta es correcta, obtenemos el cuerpo y lo devolvemos
    // Devolvemos la respuesta JSON
    return await response.json();
  }
  catch (error) {
    console.error('Error en la API:', { error, endpoint });
    throw error;
  }
};