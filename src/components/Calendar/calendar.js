import { AlertNotification } from '../AlertNotification/notification';
import { NotificationReminder } from '../ReminderNotification/reminderNotification';
import { loadReminders } from '../../functions/loadReminders';
import { reminderPageForm } from '../../pages/AddReminder/reminder';
import { ButtonPlus } from '../ButtonPlus/buttonPlus';
import('./calendar.scss');

export const Calendar = async (node) => {
  node.innerHTML = '';

  let currentDate = new Date();
  let currentMonth = currentDate.getMonth();
  let currentYear = currentDate.getFullYear();
  let reminders = [];

  // Obtenemos recordatorios usando la función existente
  reminders = await loadReminders({ render: false }) || [];

  // Agregamos un console.log para verificar los recordatorios cargados
  console.log('Recordatorios cargados:', reminders);

  const calendarContainer = document.createElement('div');
  calendarContainer.classList.add('calendar-content');

  const header = document.createElement('div');
  header.classList.add('calendar-header');

  const monthYearDisplay = document.createElement('h3');
  monthYearDisplay.classList.add('month-year');

  const btnPrev = document.createElement('button');
  btnPrev.textContent = '←';
  btnPrev.classList.add('calendar-nav');
  btnPrev.addEventListener('click', () => changeMonth(-1));

  const btnNext = document.createElement('button');
  btnNext.textContent = '→';
  btnNext.classList.add('calendar-nav');
  btnNext.addEventListener('click', () => changeMonth(1));

  header.appendChild(btnPrev);
  header.appendChild(monthYearDisplay);
  header.appendChild(btnNext);

  const daysContainer = document.createElement('div');
  daysContainer.classList.add('days-grid');

  const renderCalendar = () => {
    daysContainer.innerHTML = '';

    const monthNames = [
      'Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio',
      'Julio', 'Agosto', 'Septiembre', 'Octubre', 'Noviembre', 'Diciembre'
    ];
    monthYearDisplay.textContent = `${monthNames[currentMonth]} ${currentYear}`;

    const firstDay = new Date(currentYear, currentMonth, 1);
    const lastDay = new Date(currentYear, currentMonth + 1, 0);
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    // Agregamos celdas vacías para los días antes del primer día del mes
    for (let i = 0; i < firstDay.getDay(); i++) {
      const emptyCell = document.createElement('div');
      emptyCell.classList.add('day', 'empty');
      daysContainer.appendChild(emptyCell);
    }

    // Creamos celdas para cada día del mes
    for (let day = 1; day <= lastDay.getDate(); day++) {
      const dayCell = document.createElement('div');
      dayCell.classList.add('day');
      dayCell.textContent = day;

      // Verificamos si el día es pasado
      const currentDate = new Date(currentYear, currentMonth, day);
      currentDate.setHours(0, 0, 0, 0);
      const isPastDay = currentDate < today;

      if (isPastDay) {
        dayCell.classList.add('past');
      }

      // Marcamos el día actual
      if (currentDate.getTime() === today.getTime()) {
        dayCell.classList.add('today');
      }

      const currentDateStr = currentDate.toISOString().split('T')[0];

      // Buscamos recordatorios para este día
      const dayReminders = reminders.filter(reminder => {
        const reminderDate = new Date(reminder.date);
        reminderDate.setHours(0, 0, 0, 0);
        return reminderDate.toISOString().split('T')[0] === currentDateStr;
      });

      if (dayReminders.length > 0) {
        dayCell.classList.add('has-reminder');
      }

      dayCell.addEventListener('click', () => {
        // No hacer nada si es un día pasado
        if (isPastDay) {
          AlertNotification(
            'Día no disponible',
            'No puedes crear recordatorios en días pasados',
            null,
            { showCancelButton: false }
          );
          return;
        }

        const selectedDate = new Date(currentYear, currentMonth, day);
        const formattedDate = selectedDate.toISOString().split('T')[0];

        if (dayReminders.length > 0) {
          // Ordenamos los recordatorios por hora
          dayReminders.sort((a, b) => {
            const timeA = new Date(`${currentDateStr}T${a.time}`);
            const timeB = new Date(`${currentDateStr}T${b.time}`);
            return timeA - timeB;
          });

          // Creamos el contenido formateado para la notificación
          const content = `
            <div class="reminder-notification-content">
              <h3>Recordatorios para el ${day} de ${monthNames[currentMonth]} ${currentYear}</h3>
              <div class="reminder-list">
                ${dayReminders.map(reminder => `
                  <div class="reminder-notification-item">
                    <div class="reminder-header">
                      <h4>${reminder.name}</h4>
                      <span class="reminder-time">⏰ ${reminder.time}</span>
                    </div>
                    <div class="reminder-details">
                      <p class="reminder-description">📝 ${reminder.description}</p>
                      <p class="reminder-location">📍 ${reminder.location}</p>
                    </div>
                  </div>
                `).join('')}
              </div>
              <div class="calendar-button-plus-container"></div>
            </div>
          `;

          AlertNotification(
            '',
            content,
            () => { },
            false
          );

          // Agregamos el ButtonPlus después de que se muestre la notificación
          const buttonContainer = document.querySelector('.calendar-button-plus-container');
          if (buttonContainer) {
            ButtonPlus(buttonContainer, "AÑADIR RECORDATORIO");

            const plusButton = buttonContainer.querySelector('.button_plus');
            if (plusButton) {
              plusButton.addEventListener('click', () => {
                const notification = document.querySelector('.notification-overlay');
                if (notification) notification.remove();

                const heroContainer = document.querySelector('.hero-container');
                // Pasamos true como tercer parámetro para indicar que venimos del calendario
                reminderPageForm(heroContainer, formattedDate, true);
              });
            }
          }
        } else {
          const content = `
            <div class="reminder-notification-content">
              <p>No hay recordatorios programados para este día</p>
              <div class="calendar-button-plus-container"></div>
            </div>
          `;

          AlertNotification(
            `${day} de ${monthNames[currentMonth]} ${currentYear}`,
            content,
            () => { },
            false
          );

          // Agregamos el ButtonPlus después de que se muestre la notificación
          const buttonContainer = document.querySelector('.calendar-button-plus-container');
          if (buttonContainer) {
            ButtonPlus(buttonContainer, "AÑADIR RECORDATORIO");

            const plusButton = buttonContainer.querySelector('.button_plus');
            if (plusButton) {
              plusButton.addEventListener('click', () => {
                const notification = document.querySelector('.notification-overlay');
                if (notification) notification.remove();

                const heroContainer = document.querySelector('.hero-container');
                // Pasamos true como tercer parámetro para indicar que venimos del calendario
                reminderPageForm(heroContainer, formattedDate, true);
              });
            }
          }
        }
      });

      daysContainer.appendChild(dayCell);
    }
  };

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
