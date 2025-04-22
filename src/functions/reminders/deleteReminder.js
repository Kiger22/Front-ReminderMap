import { api } from '../../api/api';

export const deleteReminder = async (id) => {
  try {
    const response = await api({
      endpoint: `reminders/${id}`.replace(/\/+/g, '/'),
      method: 'DELETE',
    });
    return response;
  } catch (error) {
    console.error('Error en deleteReminder:', error);
    throw error;
  }
};
