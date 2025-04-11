import { api } from "../../api/api";
import { AlertNotification } from "../../components/AlertNotification/notification";

export const updatePlace = async (placeId, oldCategoryId, newData) => {
  try {
    // Actualizamos el lugar
    const placeResponse = await api({
      endpoint: `/places/${placeId}`,
      method: 'PUT',
      body: newData
    });

    if (!placeResponse) {
      throw new Error('Error al actualizar el lugar');
    }

    // Si la categoría ha cambiado, actualizamos ambas categorías
    if (newData.category && newData.category !== oldCategoryId) {
      // Eliminamos el lugar de la categoría anterior
      await api({
        endpoint: `/categories/${oldCategoryId}`,
        method: 'PUT',
        body: {
          place: placeId,
          action: 'remove'
        }
      });

      // Añadimos el lugar a la nueva categoría
      await api({
        endpoint: `/categories/${newData.category}`,
        method: 'PUT',
        body: {
          place: placeId,
          action: 'add'
        }
      });
    }

    AlertNotification('Éxito', 'Lugar actualizado correctamente', () => { }, false);
    return placeResponse;

  } catch (error) {
    console.error('Error al actualizar el lugar:', error);
    AlertNotification('Error', error.message, () => { });
    throw error;
  }
};