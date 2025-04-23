import { api } from "../../api/api";
import { AlertNotification } from "../../components/AlertNotification/notification";
import { exampleCategories } from "../../data/exampleCategories";

export const loadExampleCategories = async () => {
  try {
    const userId = localStorage.getItem('userId');
    const authToken = localStorage.getItem('authToken');

    if (!userId || !authToken) {
      AlertNotification('Error', 'Debes iniciar sesión para cargar categorías de ejemplo', null, {
        showCancelButton: false
      });
      return false;
    }

    // Mostrar notificación de carga
    AlertNotification(
      'Cargando categorías',
      'Se están cargando las categorías de ejemplo...',
      null,
      {
        showCancelButton: false,
        timer: 1500
      }
    );

    // Crear cada categoría de ejemplo
    const creationPromises = exampleCategories.map(async (category) => {
      try {
        const response = await api({
          endpoint: 'categories',
          method: 'POST',
          body: {
            name: category.name,
            description: category.description,
            userId
          },
          token: authToken
        });
        
        return response;
      } catch (error) {
        console.error(`Error al crear categoría ${category.name}:`, error);
        return null;
      }
    });

    // Esperar a que todas las categorías se creen
    const results = await Promise.all(creationPromises);
    const successCount = results.filter(result => result !== null).length;

    // Mostrar notificación de éxito
    if (successCount > 0) {
      AlertNotification(
        'Éxito',
        `Se han cargado ${successCount} categorías de ejemplo correctamente`,
        null,
        {
          showCancelButton: false
        }
      );
      return true;
    } else {
      throw new Error('No se pudo cargar ninguna categoría');
    }
  } catch (error) {
    console.error('Error al cargar categorías de ejemplo:', error);
    AlertNotification('Error', `No se pudieron cargar las categorías de ejemplo: ${error.message}`, null, {
      showCancelButton: false
    });
    return false;
  }
};