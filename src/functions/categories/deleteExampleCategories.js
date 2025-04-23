import { api } from '../../api/api';
import { AlertNotification } from '../../components/AlertNotification/notification';
import { exampleCategories } from "../../data/exampleCategories";

export const deleteExampleCategories = async () => {
  try {
    const authToken = localStorage.getItem('authToken');
    const userId = localStorage.getItem('userId');

    if (!authToken || !userId) {
      AlertNotification('Error', 'Debes iniciar sesión para realizar esta acción', null, {
        showCancelButton: false
      });
      return false;
    }

    // Primero obtenemos las categorías de ejemplo
    const response = await api({
      endpoint: `categories?userId=${userId}`,
      method: 'GET',
      token: authToken
    });

    // Obtenemos los nombres de las categorías de ejemplo del archivo de datos
    const exampleCategoryNames = exampleCategories.map(cat => cat.name);

    // Identificamos las categorías de ejemplo por nombre
    const categoriesToDelete = response.categories.filter(
      cat => exampleCategoryNames.includes(cat.name) && cat.name !== "Desconocida"
    );

    // Si no hay ejemplos, no hacemos nada
    if (categoriesToDelete.length === 0) {
      AlertNotification('Información', 'No hay categorías de ejemplo para eliminar', null, {
        showCancelButton: false
      });
      return false;
    }

    console.log('Categorías a eliminar:', categoriesToDelete.length, categoriesToDelete.map(c => c.name));

    // Eliminamos cada categoría de ejemplo usando Promise.all para hacerlo en paralelo
    const deletePromises = categoriesToDelete.map(category =>
      api({
        endpoint: `categories/${category._id}`,
        method: 'DELETE',
        token: authToken
      }).catch(err => {
        console.error(`Error al eliminar categoría ${category.name}:`, err);
        return null; // Devolvemos null para poder contar los fallos después
      })
    );

    const results = await Promise.all(deletePromises);
    const successCount = results.filter(result => result !== null).length;

    if (successCount === categoriesToDelete.length) {
      AlertNotification('Éxito', 'Todas las categorías de ejemplo fueron eliminadas correctamente', null, {
        showCancelButton: false
      });
      return true;
    } else {
      AlertNotification('Advertencia', `Se eliminaron ${successCount} de ${categoriesToDelete.length} categorías de ejemplo`, null, {
        showCancelButton: false
      });
      return successCount > 0; // Retornamos true si al menos se eliminó una
    }
  } catch (error) {
    console.error('Error al eliminar categorías de ejemplo:', error);
    AlertNotification('Error', 'No se pudieron eliminar las categorías de ejemplo', null, {
      showCancelButton: false
    });
    return false;
  }
};

