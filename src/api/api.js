import { AlertNotification } from "../components/AlertNotification/notification";

export const api = async ({ endpoint, method, body, headers = {} }) => {
  try {
    // URL de la API
    const API_URL = 'http://localhost:3001/api/v1';
    const cleanEndpoint = endpoint.replace(/^\/+/, '');
    console.log('Endpoint:', cleanEndpoint);
    // Obtenemos el token de autenticación del local storage
    const token = localStorage.getItem('authToken');

    // Configuración de la solicitud
    const config = {
      method,
      headers: {
        'Content-Type': 'application/json',
        ...(token && { Authorization: `Bearer ${token}` }),
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
    console.log('Fetching response:', response);

    const contentType = response.headers.get('content-type');
    const responseData = contentType && contentType.includes('application/json')
      ? await response.json()
      : null;
    console.log('Response data:', responseData);

    // Si la respuesta no es correcta
    if (!response.ok) {
      const errorMessage = responseData?.mensaje || 'Error en la API';
      AlertNotification('Error', errorMessage, () => { });
      console.error('Error en la API:', responseData);
      throw new Error(errorMessage);
    }

    // Si todo está bien, devolvemos los datos
    return responseData;

  } catch (error) {
    console.error('Error en la API:', { error, endpoint });
    throw error;
  }
};
