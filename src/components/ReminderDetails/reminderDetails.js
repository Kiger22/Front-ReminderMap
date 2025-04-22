import { AlertNotification } from '../AlertNotification/notification';
import { createIconButton } from '../IconButton/iconButton';
import { deleteReminder } from '../../functions/reminders/deleteReminder';
import { loadReminders } from '../../functions/reminders/loadReminders';
import { updateReminderForm } from '../UpdateReminderForm/updateReminder';
import { createMapModal } from '../../components/MapModal/mapModal';
import('./reminderDetails.scss');

export const ReminderDetails = (
  reminder,
  day,
  monthName,
  year,
  dayReminders,
  allReminders,
  formattedDate,
  onCalendarUpdate,
  onBack
) => {
  // Formateamos la fecha para mostrarla
  const reminderDate = new Date(reminder.date);
  const formattedDisplayDate = reminderDate.toLocaleDateString();

  // Creamos el contenido detallado para la notificación
  const detailedContent = document.createElement('div');
  detailedContent.classList.add('reminder-detail-content');

  // Añadimos el título
  const title = document.createElement('h2');
  title.textContent = reminder.name;
  detailedContent.appendChild(title);

  // Añadimos la información del recordatorio
  const infoContainer = document.createElement('div');
  infoContainer.classList.add('reminder-detail-info');

  const dateInfo = document.createElement('p');
  dateInfo.innerHTML = '<strong>📅 Fecha:</strong> ' + formattedDisplayDate;
  infoContainer.appendChild(dateInfo);

  const timeInfo = document.createElement('p');
  timeInfo.innerHTML = '<strong>⏰ Hora:</strong> ' +
    reminderDate.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  infoContainer.appendChild(timeInfo);

  const descInfo = document.createElement('p');
  descInfo.innerHTML = '<strong>📝 Descripción:</strong> ' + reminder.description;
  infoContainer.appendChild(descInfo);

  const locInfo = document.createElement('p');
  locInfo.innerHTML = '<strong>📍 Ubicación:</strong> ' +
    (typeof reminder.location === 'object' && reminder.location !== null
      ? reminder.location.name
      : reminder.location);
  infoContainer.appendChild(locInfo);

  detailedContent.appendChild(infoContainer);

  // Añadimos los iconos de acción
  const actionsContainer = document.createElement('div');
  actionsContainer.classList.add('reminder-detail-actions');

  // Icono para ver en el mapa
  const mapIcon = document.createElement('img');
  mapIcon.src = '../assets/eye-svgrepo-com.svg';
  mapIcon.classList.add('svg-icon');
  mapIcon.setAttribute('aria-label', 'Ver ubicación en mapa');
  mapIcon.title = "Ver ubicación en mapa";
  mapIcon.addEventListener('click', () => {
    // Obtenemos la ubicación del recordatorio
    const location = typeof reminder.location === 'object' && reminder.location !== null
      ? reminder.location.location
      : reminder.location;

    // Obtenemos el nombre del lugar
    const placeName = typeof reminder.location === 'object' && reminder.location !== null
      ? reminder.location.name
      : 'Ubicación del recordatorio';

    // Mostramos el mapa en un modal
    createMapModal(location, placeName);
  });
  actionsContainer.appendChild(mapIcon);

  // Icono de editar - creamos manualmente el elemento
  const editIcon = document.createElement('img');
  editIcon.src = '../assets/edit-svgrepo-com.svg';
  editIcon.classList.add('svg-icon');
  editIcon.setAttribute('aria-label', 'Editar recordatorio');
  editIcon.title = "Editar recordatorio";
  editIcon.addEventListener('click', () => {
    // Cerramos la notificación actual
    const notification = document.querySelector('.notification-overlay');
    if (notification) notification.remove();

    // Abrimos el formulario de edición
    updateReminderForm(reminder, () => {
      // Cuando se cancela la edición, volvemos a mostrar los detalles
      ReminderDetails(
        reminder,
        day,
        monthName,
        year,
        dayReminders,
        allReminders,
        formattedDate,
        onCalendarUpdate,
        onBack
      );
    });
  });
  actionsContainer.appendChild(editIcon);

  // Icono de eliminar - creamos manualmente el elemento
  const deleteIcon = document.createElement('img');
  deleteIcon.src = '../assets/delette-svgrepo-com.svg';
  deleteIcon.classList.add('svg-icon');
  deleteIcon.setAttribute('aria-label', 'Eliminar recordatorio');
  deleteIcon.title = "Eliminar recordatorio";
  deleteIcon.addEventListener('click', () => {
    // Mostramos confirmación antes de eliminar
    AlertNotification(
      '¿Eliminar recordatorio?',
      '¿Estás seguro de que deseas eliminar este recordatorio?',
      async (confirmed) => {
        if (confirmed) {
          try {
            await deleteReminder(reminder._id);

            // Actualizamos los recordatorios
            await loadReminders({ render: false });

            // Notificamos al calendario para que se actualice
            if (onCalendarUpdate) onCalendarUpdate();

            // Cerramos la notificación
            const notification = document.querySelector('.notification-overlay');
            if (notification) notification.remove();
          } catch (error) {
            console.error('Error al eliminar el recordatorio:', error);
            AlertNotification('Error', 'No se pudo eliminar el recordatorio', null, {
              showCancelButton: false
            });
          }
        }
      },
      { showCancelButton: true }
    );
  });
  actionsContainer.appendChild(deleteIcon);

  detailedContent.appendChild(actionsContainer);

  // Mostramos la notificación con los detalles y añadimos un botón de volver
  AlertNotification(
    `Detalles del recordatorio`,
    detailedContent,
    null,
    {
      showCancelButton: true,
      confirmButtonText: 'Aceptar',
      cancelButtonText: 'Volver',
      onCancel: () => {
        // Si hay función de retorno, la llamamos
        if (onBack) onBack();
      }
    }
  );
};
