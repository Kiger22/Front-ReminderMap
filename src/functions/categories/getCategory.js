import { api } from "../../api/api";

export const getCategories = async (userId = null) => {
  try {
    // Construimos el endpoint basado en si se proporciona un userId
    const authToken = localStorage.getItem('authToken');
    const endpoint = userId ? `categories?userId=${userId}` : 'categories';

    // Realizamos la solicitud a la API
    const response = await api({
      endpoint,
      method: 'GET',
      token: authToken
    });

    console.log('Respuesta completa de categorías:', response);

    // Verificamos que la respuesta sea válida y contenga categorías
    if (!response || !response.categories) {
      console.error('Respuesta inválida de categorías:', response);
      return [];
    }

    // Mapeamos las categorías para que coincidan con el formato esperado por el componente Select
    const mappedCategories = response.categories.map(category => ({
      value: category._id,
      label: category.name,
      description: category.description,
      placesCount: category.places?.length || 0
    }));
    return mappedCategories;
  } catch (error) {
    console.error('Error al obtener categorías:', error);
    return [];
  }
};

export const getCategoryById = async (categoryId) => {
  try {
    const response = await api({
      endpoint: `/categories/${categoryId}`,
      method: 'GET'
    });

    if (!response.success) {
      throw new Error(response.message || 'Error al obtener la categoría');
    }

    return response.category;
  } catch (error) {
    console.error('Error al obtener categoría por ID:', error);
    throw error;
  }
};
