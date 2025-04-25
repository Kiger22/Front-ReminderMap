import { AlertNotification } from '../../components/AlertNotification/notification';
import { createReminderElement } from '../reminders/renderReminder';
import { loadReminders } from '../reminders/loadReminders';
import { createMapModal } from '../../components/MapModal/mapModal';

export const renderTodayNotifications = async (container) => {
  try {
    // Obtenemos el contenedor de recordatorios
    const remindersList = container.querySelector('.reminders-list');

    // Verificamos si el contenedor existe
    if (!remindersList) {
      throw new Error('No se encontró el contenedor de recordatorios');
    }

    // Obtenemos la fecha actual 
    const today = new Date();
    const formattedDate = today.toISOString().split('T')[0];

    // Obtenemos recordatorios usando la función existente
    const reminders = await loadReminders({ render: false });

    // Si se obtuvieron recordatorios, los procesamos
    if (reminders) {
      // Filtramos recordatorios para hoy
      const todayReminders = reminders.filter(reminder =>
        reminder.date.split('T')[0] === formattedDate
      );

      // Limpiamos el contenedor
      remindersList.innerHTML = '';

      // Si no hay recordatorios para hoy, mostramos un mensaje
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


