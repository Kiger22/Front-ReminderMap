import { AlertNotification } from '../../../components/AlertNotification/notification';
import { reminderPageForm } from '../../AddReminder/reminder';
import { ReminderDetails } from '../../../components/ReminderDetails/reminderDetails';
import { ButtonPlus } from '../../../components/ButtonPlus/buttonPlus';
import('./remindersList.scss');

//* Función para mostrar la lista de recordatorios en una notificación
export const RemindersList = (day, monthName, year, dayReminders, allReminders, formattedDate, onCalendarUpdate) => {
  const content = document.createElement('div');
  content.classList.add('reminder-notification-content');

  const heading = document.createElement('h3');
  heading.textContent = `Recordatorios para el ${day} de ${monthName} ${year}`;
  content.appendChild(heading);

  const reminderList = document.createElement('div');
  reminderList.classList.add('reminder-list');

  // Iteramos sobre los recordatorios del día
  dayReminders.forEach(reminder => {
    const reminderItem = document.createElement('div');
    reminderItem.classList.add('reminder-notification-item');
    reminderItem.setAttribute('data-reminder-id', reminder._id);
    reminderItem.style.cursor = 'pointer';

    // Simplificamos la visualización en una sola línea
    const reminderSummary = document.createElement('div');
    reminderSummary.classList.add('reminder-summary');

    // Mostramos el nombre, hora y ubicación en una sola línea
    reminderSummary.innerHTML = `
      <span class="reminder-name">${reminder.name}</span> | 
      <span class="reminder-time">⏰ ${reminder.time}</span> | 
      <span class="reminder-location">📍 ${typeof reminder.location === 'object' && reminder.location !== null
        ? reminder.location.name
        : reminder.location
      }</span>
    `;
    reminderItem.appendChild(reminderSummary);

    // Mantenemos el evento click para mostrar los detalles
    reminderItem.addEventListener('click', () => {
      // Cerramos la notificación actual
      const notification = document.querySelector('.notification-overlay');
      if (notification) notification.remove();

      // Mostramos los detalles del recordatorio
      ReminderDetails(
        reminder,
        day,
        monthName,
        year,
        dayReminders,
        allReminders,
        formattedDate,
        onCalendarUpdate,
        () => {
          // Función para volver a la lista de recordatorios
          RemindersList(day, monthName, year, dayReminders, allReminders, formattedDate, onCalendarUpdate);
        }
      );
    });

    reminderList.appendChild(reminderItem);
  });
  content.appendChild(reminderList);

  // Añadimos el botón para agregar un nuevo recordatorio
  const buttonContainer = document.createElement('div');
  buttonContainer.classList.add('calendar-button-plus-container');
  content.appendChild(buttonContainer);

  // Mostramos la notificación con la lista de recordatorios
  AlertNotification(
    `Recordatorios del día`,
    content,
    null,
    {
      showCancelButton: false,
      confirmButtonText: 'Cerrar'
    }
  );

  // Añadimos el ButtonPlus después de que se muestre la notificación
  setTimeout(() => {
    const container = document.querySelector('.calendar-button-plus-container');
    if (container) {
      ButtonPlus(container, "AÑADIR RECORDATORIO");

      // Añadimos el event listener al botón
      const button = container.querySelector('.button_plus');
      if (button) {
        button.addEventListener('click', () => {
          // Cerramos la notificación
          const notification = document.querySelector('.notification-overlay');
          if (notification) notification.remove();

          // Abrimos el formulario para añadir un nuevo recordatorio con la fecha seleccionada
          const heroContainer = document.querySelector('.hero-container');
          if (heroContainer) {
            // Pasamos la fecha formateada y true para indicar que venimos del calendario
            reminderPageForm(heroContainer, formattedDate, true);
          }
        });
      }
    }
  }, 100);
};