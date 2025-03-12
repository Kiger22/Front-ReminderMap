import { api } from "../api/api";
import { AlertNotification } from "../components/AlertNotification/notification";
import { goToHomePage } from "./goHomePage";

export const addCategory = async () => {
  try {

    // Obtenemos el ID del usuario
    const userId = localStorage.getItem('userId');
    const authToken = localStorage.getItem('authToken');
    console.log('userID', userId, 'Token de autenticación:', authToken);

    // Validamos que haya un ID de usuario
    if (!userId) {
      throw new Error('No hay ID de usuario');
    }

    // Validamos que el formato de userId sea un ObjectID válido
    const isValidObjectId = /^[a-f\d]{24}$/i.test(userId);
    if (!isValidObjectId) {
      throw new Error('El ID de usuario no tiene un formato válido de ObjectID');
    }

    // Validamos que haya un token de autenticación
    if (!authToken) {
      throw new Error('No hay token de autenticación');
    }

    // Obtenemos los datos del formulario
    const categoryName = document.getElementById('category-name').value;
    const descriptionName = document.getElementById('category-description').value;

    // Validamos que el campo del nombre no esté vacío
    if (!categoryName) {
      throw new Error('el campo del nombre es obligatorio');
    }

    // Creamos el objeto con los datos de la categoría
    const categoryData = {
      userId: userId,
      name: categoryName,
      description: descriptionName
    };
    console.log('Datos de la categoría:', categoryData);

    const response = await api({
      endpoint: '/categories',
      method: 'POST',
      body: categoryData,
      token: authToken
    });
    console.log('Respuesta del servidor:', response);

    // Verificar que la categoría creada corresponde al usuario actual
    if (response.userId !== userId) {
      throw new Error('Error de validación: La categoría no corresponde al usuario actual');
    }

    // Si llegamos aquí, significa que la categoría se creó correctamente
    AlertNotification('Categoría creada', 'La categoría se ha creado correctamente', () => {
      // Este callback solo se ejecutará cuando el usuario haga clic en OK
      document.getElementById('category-name').value = '';
      document.getElementById('category-description').value = '';
      goToHomePage();
    });

  } catch (error) {
    console.error('Error al crear la categoría:', error);
    AlertNotification('Error al crear la categoría', error.message || 'Error desconocido', () => { });
  }
}