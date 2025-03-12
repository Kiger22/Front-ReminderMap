import { AlertNotification } from '../AlertNotification/notification';
import { NotificationReminder } from '../ReminderNotification/reminderNotification';
import { loadReminders } from '../../functions/loadReminders';
import('./calendar.scss');

export const Calendar = async (node) => {
  node.innerHTML = '';

  let currentDate = new Date();
  let currentMonth = currentDate.getMonth();
  let currentYear = currentDate.getFullYear();
  let reminders = [];

  // Obtener recordatorios usando la función existente
  reminders = await loadReminders({ render: false }) || [];

  // Agregar un console.log para verificar los recordatorios cargados
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

    const firstDay = new Date(currentYear, currentMonth, 1).getDay();
    const daysInMonth = new Date(currentYear, currentMonth + 1, 0).getDate();

    // Agregar celdas vacías para los días antes del primer día del mes
    for (let i = 0; i < firstDay; i++) {
      const emptyCell = document.createElement('div');
      emptyCell.classList.add('day', 'empty');
      daysContainer.appendChild(emptyCell);
    }

    // Crear celdas para cada día del mes
    for (let day = 1; day <= daysInMonth; day++) {
      const dayCell = document.createElement('div');
      dayCell.classList.add('day');
      dayCell.textContent = day;

      // Formatear la fecha del calendario para comparar
      const currentDate = new Date(currentYear, currentMonth, day);
      currentDate.setHours(0, 0, 0, 0);
      const currentDateStr = currentDate.toISOString().split('T')[0];

      // Verificar si es el día actual
      const today = new Date();
      if (day === today.getDate() &&
        currentMonth === today.getMonth() &&
        currentYear === today.getFullYear()) {
        dayCell.classList.add('today');
      }

      // Buscar recordatorios para este día
      const dayReminders = reminders.filter(reminder => {
        const reminderDate = new Date(reminder.date);
        reminderDate.setHours(0, 0, 0, 0);
        return reminderDate.toISOString().split('T')[0] === currentDateStr;
      });

      // Si hay recordatorios, añadir el borde
      if (dayReminders.length > 0) {
        dayCell.classList.add('has-reminder');
      }

      dayCell.addEventListener('click', () => {
        if (dayReminders.length > 0) {
          // Pasar el primer recordatorio del día (o podrías mostrar una lista)
          NotificationReminder(dayReminders[0]);
        } else {
          AlertNotification(
            `${day} de ${monthNames[currentMonth]} ${currentYear}`,
            'No hay recordatorios programados para este día'
          );
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

    // Actualizar recordatorios
    reminders = await loadReminders({ render: false }) || [];
    console.log('Recordatorios actualizados al cambiar mes:', reminders);
    renderCalendar();
  };

  calendarContainer.appendChild(header);
  calendarContainer.appendChild(daysContainer);
  node.appendChild(calendarContainer);

  renderCalendar();
};
