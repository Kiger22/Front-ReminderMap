import { api } from "../api/api";

export const getCategories = async () => {
  try {
    // await new Promise(resolve => setTimeout(resolve, 1000));

    const response = await api({
      endpoint: '/categories',
      method: 'GET'
    });

    return response.map(category => ({
      value: category._id,
      label: category.name
    }));
  } catch (error) {
    console.error('Error al obtener Categorias:', error);
    return [];
  }
};