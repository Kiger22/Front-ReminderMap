import { api } from "../api/api";
import { AlertNotification } from "../components/AlertNotification/notification";
import { goToHomePage } from "./goHomePage";

export const addPlace = async () => {
  console.log('Iniciando addPlace');
  try {
    const userId = localStorage.getItem('userId');
    const authToken = localStorage.getItem('authToken');

    if (!userId || !authToken) {
      throw new Error('No hay autorización');
    }

    // Obtener datos del formulario
    const placeName = document.getElementById("place-name").value;
    const categoryId = document.getElementById("place-category").value;
    const placeDescription = document.getElementById("place-description").value;
    const placeLocation = document.getElementById("location").value;

    console.log('Datos del formulario:', {
      placeName,
      categoryId,
      placeDescription,
      placeLocation,
      userId
    });

    // Validar datos
    if (!placeName || !categoryId || !placeDescription || !placeLocation) {
      throw new Error('Todos los campos son obligatorios');
    }

    // Crear objeto con los datos del lugar
    const placeData = {
      name: placeName,
      description: placeDescription,
      location: placeLocation,
      category: categoryId,
      userId: userId  // Incluir el userId en los datos
    };

    console.log('Intentando crear lugar:', placeData);

    // 1. Crear el lugar
    const placeResponse = await api({
      endpoint: 'places',
      method: 'POST',
      body: placeData,
      token: authToken
    });

    console.log('Respuesta de creación de lugar:', placeResponse);

    if (!placeResponse || !placeResponse.lugar) {
      throw new Error('Error al crear el lugar');
    }

    // 2. Actualizar la categoría
    const categoryResponse = await api({
      endpoint: `categories/${categoryId}`,
      method: 'PUT',
      body: {
        placeId: placeResponse.lugar._id,
        action: 'add'
      },
      token: authToken
    });

    console.log('Respuesta de actualización de categoría:', categoryResponse);

    if (!categoryResponse.success) {
      // Solo hacer rollback si la actualización de categoría falló
      console.log('Iniciando rollback del lugar creado');
      await api({
        endpoint: `places/${placeResponse.lugar._id}`,
        method: 'DELETE',
        token: authToken
      });
      throw new Error(categoryResponse?.message || 'Error al actualizar la categoría');
    }

    console.log('Proceso completado con éxito');

    // Si todo fue exitoso, mostrar notificación y limpiar formulario
    AlertNotification(
      'Éxito',
      'Lugar creado y añadido a la categoría correctamente',
      () => {
        document.getElementById("place-name").value = '';
        document.getElementById("place-category").value = '';
        document.getElementById("place-description").value = '';
        document.getElementById("location").value = '';
        goToHomePage();
      }
    );

  } catch (error) {
    console.error('Error en addPlace:', error);
    AlertNotification('Error', error.message || 'Error al procesar la solicitud', () => { });
  }
};
