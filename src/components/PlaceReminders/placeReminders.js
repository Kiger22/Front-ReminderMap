import { loadReminders } from '../../functions/reminders/loadReminders';
import { AlertNotification } from '../AlertNotification/notification';

export const showPlaceReminders = async (place) => {
  try {
    // Usamos loadReminders con render: false para obtener todos los recordatorios
    const reminders = await loadReminders({ render: false });

    if (reminders) {
      // Filtramos los recordatorios que corresponden a este lugar
      const placeReminders = reminders.filter(reminder =>
        reminder.location === place.location ||
        (reminder.location && reminder.location._id === place._id)
      );

      // Ordenamos por fecha y hora
      placeReminders.sort((a, b) => {
        const dateA = new Date(`${a.date.split('T')[0]}T${a.time}`);
        const dateB = new Date(`${b.date.split('T')[0]}T${b.time}`);
        return dateA - dateB;
      });

      const content = `
        <div class="reminder-notification-content">
          <h3>Recordatorios en ${place.name}</h3>
          <div class="reminder-list">
            ${placeReminders.length > 0
              ? placeReminders.map(reminder => `
                  <div class="reminder-notification-item">
                    <div class="reminder-header">
                      <h4>${reminder.name}</h4>
                      <span class="reminder-time">⏰ ${reminder.time}</span>
                    </div>
                    <div class="reminder-details">
                      <p class="reminder-description">📝 ${reminder.description}</p>
                      <p class="reminder-date">📅 ${new Date(reminder.date).toLocaleDateString()}</p>
                    </div>
                  </div>
                `).join('')
              : '<p class="empty-message">No hay recordatorios registrados para este lugar</p>'
            }
          </div>
        </div>
      `;

      AlertNotification(
        '',
        content,
        null,
        {
          showCancelButton: false,
          confirmButtonText: 'Cerrar'
        }
      );
    }
  } catch (error) {
    console.error('Error al obtener recordatorios:', error);
    AlertNotification(
      'Error',
      'No se pudieron cargar los recordatorios',
      null,
      { showCancelButton: false }
    );
  }
};