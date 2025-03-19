import { api } from '../api/api';
import { AlertNotification } from '../components/AlertNotification/notification';
import { createLoginForm } from '../components/LoginForm/login';
import { createReminderElement } from './renderReminder';

// Función para cargar los recordatorios
export const loadReminders = async (options = { render: true }) => {
  try {
    const userId = localStorage.getItem('userId');
    const authToken = localStorage.getItem('authToken');

    if (!userId) {
      throw new Error('No hay ID de usuario');
    }

    if (!authToken) {
      AlertNotification('Debes ser usuario', 'Inicia Sesión', () => {
        createLoginForm();
      });
      return null;
    }

    const response = await api({
      endpoint: `reminders/${userId}`, // Removido el slash extra
      method: 'GET',
    });

    if (response && response.recordatorios && Array.isArray(response.recordatorios)) {
      // Si la opción render está activada, renderizamos en el DOM
      if (options.render) {
        const remindersList = document.querySelector('.reminders-list');
        if (!remindersList) {
          console.error('No se encontró el elemento .reminders-list');
          throw new Error('No se encontró el contenedor de recordatorios');
        }

        remindersList.innerHTML = '';

        if (response.recordatorios.length === 0) {
          const emptyMessage = document.createElement('p');
          emptyMessage.textContent = 'No hay recordatorios disponibles';
          emptyMessage.classList.add('empty-message');
          remindersList.appendChild(emptyMessage);
          return [];
        }

        // Procesar y ordenar recordatorios
        const uniqueReminders = Array.from(
          new Map(response.recordatorios.map(reminder => [reminder._id, reminder])).values()
        );

        uniqueReminders.sort((a, b) => {
          const dateTimeA = new Date(`${a.date.split('T')[0]}T${a.time}:00`).getTime();
          const dateTimeB = new Date(`${b.date.split('T')[0]}T${b.time}:00`).getTime();
          return dateTimeA - dateTimeB;
        });

        // Renderizar recordatorios
        uniqueReminders.forEach(reminder => {
          try {
            createReminderElement(reminder, remindersList);
          } catch (renderError) {
            console.error('Error al renderizar recordatorio:', renderError);
          }
        });

        return uniqueReminders;
      }

      return response.recordatorios;
    }

    throw new Error('Formato de respuesta inválido');

  } catch (error) {
    console.error('Error al cargar recordatorios:', error);
    return null;
  }
};
