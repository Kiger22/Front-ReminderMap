import { api } from "../api/api";

export const getCategories = async (userId = null) => {
  try {
    const endpoint = userId ? `/categories?userId=${userId}` : '/categories';
    const response = await api({
      endpoint,
      method: 'GET'
    });

    if (!response.success) {
      throw new Error(response.message || 'Error al obtener categorías');
    }

    return response.categories.map(category => ({
      value: category._id,
      label: category.name,
      description: category.description,
      placesCount: category.places?.length || 0
    }));
  } catch (error) {
    console.error('Error al obtener categorías:', error);
    throw error;
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