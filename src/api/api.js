export const api = async ({ endpoint, method, body, headers = {} }) => {
  try {
    const API_URL = 'https://back-reminder-7hy48dwmr-guillermo-mendozas-projects.vercel.app/api/v1';
    const cleanEndpoint = endpoint.replace(/^\/+/, '');
    const token = localStorage.getItem('authToken');

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
    } else if (body) {
      config.body = JSON.stringify(body);
    }
    console.log('Cuerpo de la solicitud:', config.body);
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