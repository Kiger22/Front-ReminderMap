import { api } from "../api/api";
import { AlertNotification } from "../components/AlertNotification/notification";

export const deletePlace = async (placeId, categoryId) => {
  try {
    // Eliminamos el lugar
    const placeResponse = await api({
      endpoint: `/places/${placeId}`,
      method: 'DELETE'
    });

    if (!placeResponse) {
      throw new Error('Error al eliminar el lugar');
    }

    // Eliminamos la referencia del lugar en la categoría
    await api({
      endpoint: `/categories/${categoryId}`,
      method: 'PUT',
      body: {
        place: placeId,
        action: 'remove'
      }
    });

    AlertNotification('Éxito', 'Lugar eliminado correctamente', () => { }, false);
    return placeResponse;

  } catch (error) {
    console.error('Error al eliminar el lugar:', error);
    AlertNotification('Error', error.message, () => { });
    throw error;
  }
};