import { api } from '../api/api';

export const reminderService = {
  getAll: () => api({ endpoint: 'reminders', method: 'GET' }),
  create: (data) => api({ endpoint: 'reminders', method: 'POST', body: data }),
  update: (id, data) => api({ endpoint: `reminders/${id}`, method: 'PUT', body: data }),
  delete: (id) => api({ endpoint: `reminders/${id}`, method: 'DELETE' })
};