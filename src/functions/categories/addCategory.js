import { api } from "../../api/api";
import { AlertNotification } from "../../components/AlertNotification/notification";

export const addCategory = async () => {
  try {
    // Obtenemos los valores del formulario
    const categoryName = document.getElementById('category-name').value;
    const categoryDescription = document.getElementById('category-description').value;
    const userId = localStorage.getItem('userId');
    const authToken = localStorage.getItem('authToken');

    // Validamos que se proporcionen los datos necesarios
    if (!categoryName || !userId || !authToken) {
      console.error('Faltan datos para crear la categoría');
      AlertNotification('Error', 'Faltan datos para crear la categoría', null, {
        showCancelButton: false
      });
      return false;
    }

    // Enviamos la solicitud para crear la categoría
    const response = await api({
      endpoint: 'categories',
      method: 'POST',
      body: {
        name: categoryName,
        description: categoryDescription,
        userId
      },
      token: authToken
    });

    console.log('Categoría creada:', response);

    // Guardamos el ID de la categoría recién creada para seleccionarla al volver
    if (response && response.category && response.category._id) {
      localStorage.setItem('lastCreatedCategoryId', response.category._id);
      localStorage.setItem('lastCreatedCategoryName', categoryName);
    }

    // Mostramos notificación de éxito
    AlertNotification('Éxito', `Categoría "${categoryName}" creada correctamente`, null, {
      showCancelButton: false
    });

    return true;
  } catch (error) {
    console.error('Error al crear categoría:', error);
    AlertNotification('Error', `No se pudo crear la categoría: ${error.message}`, null, {
      showCancelButton: false
    });
    return false;
  }
};
