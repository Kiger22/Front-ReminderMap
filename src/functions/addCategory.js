import { api } from "../api/api";
import { AlertNotification } from "../components/AlertNotification/notification";
import { goToHomePage } from "./goHomePage";

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
      userId
    };

    console.log('Intentando crear categoría:', categoryData);

    const response = await api({
      endpoint: 'categories',
      method: 'POST',
      body: categoryData,
      token: authToken
    });

    console.log('Respuesta de creación de categoría:', response);

    if (!response.success) {
      throw new Error(response.message || 'Error al crear la categoría');
    }

    // Limpiar formulario
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
