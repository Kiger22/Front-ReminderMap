import { api } from "../../api/api";
import { AlertNotification } from "../../components/AlertNotification/notification";
import { goToHomePage } from "../navigation/goHomePage";

export const addCategory = async () => {
  try {
    const userId = localStorage.getItem('userId');
    const authToken = localStorage.getItem('authToken');

    if (!userId || !authToken) {
      throw new Error('No hay autorización');
    }

    const categoryName = document.getElementById('category-name')?.value?.trim();
    const descriptionName = document.getElementById('category-description')?.value?.trim();

    if (!categoryName) {
      throw new Error('El nombre de la categoría es obligatorio');
    }

    const categoryData = {
      name: categoryName,
      description: descriptionName || '',
      userId: userId  // Nos aseguramos de que userId se envía correctamente
    };

    console.log('Datos de categoría a enviar:', categoryData);

    // Verificar si ya existe una categoría con el mismo nombre
    const existingCategories = await api({
      endpoint: 'categories',
      method: 'GET',
      token: authToken
    });

    if (existingCategories.categories.some(category => category.name === categoryData.name)) {
      throw new Error('Ya existe una categoría con este nombre');
    }

    const response = await api({
      endpoint: 'categories',
      method: 'POST',
      body: categoryData,
      token: authToken  // Nos aseguramos de enviar el token
    });

    if (!response.success) {
      console.error('Error en la respuesta del servidor:', response);
      throw new Error(response.message || 'Error al crear la categoría');
    }

    console.log('Respuesta de creación de categoría:', response);

    // Limpiamos el formulario
    document.getElementById('category-name').value = '';
    document.getElementById('category-description').value = '';

    AlertNotification(
      'Éxito',
      'Categoría creada correctamente',
      () => goToHomePage()
    );

    return response.category;

  } catch (error) {
    console.error('Error en addCategory:', error);
    AlertNotification(
      'Error',
      error.message || 'No se pudo crear la categoría'
    );
    throw error;
  }
};
