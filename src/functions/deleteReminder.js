import { api } from '../api/api';

export const deleteReminder = async (id) => {
  await api({
    endpoint: `/reminders/${id}`,
    method: 'DELETE',
  });
};