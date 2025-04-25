import { api } from '../../api/api';

//* Función para eliminar un recordatorio
export const deleteReminder = async (id) => {
  try {
    // Enviamos la solicitud de eliminación al API
    const response = await api({
      endpoint: `reminders/${id}`.replace(/\/+/g, '/'),
      method: 'DELETE',
    });

    // Devolvemos la respuesta
    return response;
  } catch (error) {
    console.error('Error en deleteReminder:', error);
    throw error;
  }
};
