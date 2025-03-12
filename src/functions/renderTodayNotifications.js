import { AlertNotification } from '../components/AlertNotification/notification';
import { createReminderElement } from './renderReminder';
import { loadReminders } from './loadReminders';

export const renderTodayNotifications = async (container) => {
  try {
    const remindersList = container.querySelector('.reminders-list');
    if (!remindersList) {
      throw new Error('No se encontró el contenedor de recordatorios');
    }

    // Obtenemos la fecha actual 
    const today = new Date();
    const formattedDate = today.toISOString().split('T')[0];

    // Obtenemos recordatorios usando la función existente
    const reminders = await loadReminders({ render: false });

    if (reminders) {
      // Filtramos recordatorios para hoy
      const todayReminders = reminders.filter(reminder =>
        reminder.date.split('T')[0] === formattedDate
      );

      remindersList.innerHTML = '';

      if (todayReminders.length === 0) {
        const emptyMessage = document.createElement('p');
        emptyMessage.textContent = 'No tienes recordatorios para hoy';
        emptyMessage.classList.add('empty-message');
        remindersList.appendChild(emptyMessage);
      } else {
        // Ordenamos por hora
        todayReminders.sort((a, b) => {
          const timeA = new Date(`${formattedDate}T${a.time}`);
          const timeB = new Date(`${formattedDate}T${b.time}`);
          return timeA - timeB;
        });

        // Renderizamos cada recordatorio
        todayReminders.forEach(reminder => {
          createReminderElement(reminder, remindersList);
        });
      }
    }

    return true;
  } catch (error) {
    console.error('Error al cargar los datos:', error);
    AlertNotification('Error', 'No se pudieron cargar los recordatorios del día', () => { });
    return false;
  }
};


