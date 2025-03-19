export const api = async ({ endpoint, method = 'GET', body, token, isFormData = false }) => {
  try {
    const API_URL = 'http://localhost:3000/api/v1';
    const url = `${API_URL}/${endpoint}`;

    const headers = {};
    if (token) {
      headers['Authorization'] = `Bearer ${token}`;
    }
    if (!isFormData && method !== 'GET') {
      headers['Content-Type'] = 'application/json';
    }

    const options = {
      method,
      headers,
    };

    if (body && method !== 'GET') {
      options.body = isFormData ? body : JSON.stringify(body);
    }

    const response = await fetch(url, options);
    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.message || 'Error en la petición');
    }

    return data;
  } catch (error) {
    console.error('Error en la petición API:', error);
    throw error;
  }
};
