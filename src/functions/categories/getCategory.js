import { api } from "../../api/api";

export const getCategories = async (userId = null) => {
  try {
    const authToken = localStorage.getItem('authToken');
    const endpoint = userId ? `categories?userId=${userId}` : 'categories';

    console.log('Obteniendo categorías con endpoint:', endpoint);
    console.log('Token de autenticación presente:', !!authToken);
    console.log('UserId:', userId);

    const response = await api({
      endpoint,
      method: 'GET',
      token: authToken
    });

    console.log('Respuesta completa de categorías:', response);

    if (!response || !response.categories) {
      console.error('Respuesta inválida de categorías:', response);
      return [];
    }

    const mappedCategories = response.categories.map(category => ({
      value: category._id,
      label: category.name,
      description: category.description,
      placesCount: category.places?.length || 0
    }));

    console.log('Categorías mapeadas:', mappedCategories);
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
