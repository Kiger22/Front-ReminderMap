import { AlertNotification } from '../../components/AlertNotification/notification';
import { loadReminders } from '../../functions/reminders/loadReminders';
import { reminderPageForm } from '../../pages/AddReminder/reminder';
import { createButton } from '../../components/Button/button';
import { ButtonPlus } from '../../components/ButtonPlus/buttonPlus';
import { renderCalendarGrid } from './components/CalendarGrid/calendarGrid';
import { ReminderDetails } from '../ReminderDetails/reminderDetails';
import { RemindersList } from '../RemindersList/remindersList';
import { CalendarHeader } from './components/CalendarHeader/calendarHeader';
import('./calendar.scss');

export const Calendar = async (node) => {
  node.innerHTML = '';

  let currentDate = new Date();
  let currentMonth = currentDate.getMonth();
  let currentYear = currentDate.getFullYear();
  let reminders = [];

  // Obtenemos recordatorios usando la función existente
  reminders = await loadReminders({ render: false }) || [];
  console.log('Recordatorios cargados:', reminders);

  const calendarContainer = document.createElement('div');
  calendarContainer.classList.add('calendar-content');

  // Creamos el encabezado del calendario con los controles de navegación
  const { header, monthYearDisplay } = CalendarHeader(currentMonth, currentYear, (direction) => {
    changeMonth(direction);
  });

  // Contenedor para los días del calendario
  const daysContainer = document.createElement('div');
  daysContainer.classList.add('calendar-days');

  // Función para renderizar el calendario
  const renderCalendar = () => {
    const monthNames = [
      'Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio',
      'Julio', 'Agosto', 'Septiembre', 'Octubre', 'Noviembre', 'Diciembre'
    ];

    monthYearDisplay.textContent = `${monthNames[currentMonth]} ${currentYear}`;

    renderCalendarGrid(
      daysContainer,
      currentYear,
      currentMonth,
      reminders,
      (day, dayReminders) => {
        handleDayClick(day, dayReminders, monthNames);
      }
    );
  };

  // Manejador para cuando se hace clic en un día
  const handleDayClick = (day, dayReminders, monthNames) => {
    const selectedDate = new Date(currentYear, currentMonth, day);
    const formattedDate = selectedDate.toISOString().split('T')[0];

    if (dayReminders.length > 0) {
      // Si hay recordatorios, mostramos la lista
      RemindersList(
        day,
        monthNames[currentMonth],
        currentYear,
        dayReminders,
        reminders,
        formattedDate,
        renderCalendar
      );
    } else {
      // Si no hay recordatorios, creamos un contenedor para el mensaje y el botón
      const content = document.createElement('div');
      content.classList.add('add-reminder-prompt');

      // Mensaje
      const message = document.createElement('p');
      message.textContent = `No hay recordatorios para el ${day} de ${monthNames[currentMonth]} de ${currentYear}?`;
      content.appendChild(message);

      // Contenedor para el botón
      const buttonContainer = document.createElement('div');
      buttonContainer.classList.add('button-plus-container');
      content.appendChild(buttonContainer);

      // Mostramos la notificación con el contenido
      AlertNotification(
        'Crear Recordatorio',
        content,
        null,
        { showCancelButton: true }
      );

      // Añadimos el ButtonPlus después de que se muestre la notificación
      setTimeout(() => {
        const container = document.querySelector('.button-plus-container');
        if (container) {
          ButtonPlus(container, "AÑADIR RECORDATORIO");

          // Añadimos el event listener al botón
          const button = container.querySelector('.button_plus');
          if (button) {
            button.addEventListener('click', () => {
              // Cerramos la notificación
              const notification = document.querySelector('.notification-overlay');
              if (notification) notification.remove();

              // Abrimos el formulario de recordatorio
              const heroContainer = document.querySelector('.hero-container');
              reminderPageForm(heroContainer, formattedDate, true);
            });
          }
        }
      }, 100);
    }
  };

  // Función para cambiar de mes
  const changeMonth = async (direction) => {
    currentMonth += direction;
    if (currentMonth < 0) {
      currentMonth = 11;
      currentYear--;
    } else if (currentMonth > 11) {
      currentMonth = 0;
      currentYear++;
    }

    // Actualizamos recordatorios
    reminders = await loadReminders({ render: false }) || [];
    console.log('Recordatorios actualizados al cambiar mes:', reminders);
    renderCalendar();
  };

  calendarContainer.appendChild(header);
  calendarContainer.appendChild(daysContainer);
  node.appendChild(calendarContainer);

  renderCalendar();
};

// Mantenemos la función calendarRemindersPage para compatibilidad
export const calendarRemindersPage = async (node) => {
  node.innerHTML = '';

  // Creamos el contenedor principal
  const remindersContainer = document.createElement('div');
  remindersContainer.classList.add('reminders-container');

  // Título de la página
  const title = document.createElement('h2');
  title.textContent = 'Mis Recordatorios';
  remindersContainer.appendChild(title);

  // Contenedor para la lista de recordatorios
  const remindersList = document.createElement('div');
  remindersList.classList.add('reminders-list');
  remindersContainer.appendChild(remindersList);

  // Agregamos el contenedor al nodo
  node.appendChild(remindersContainer);

  // Cargamos los recordatorios
  const reminders = await loadReminders();
};
