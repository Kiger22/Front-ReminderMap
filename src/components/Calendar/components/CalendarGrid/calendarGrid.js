import './calendarGrid.scss';
import { AlertNotification } from '../../../../components/AlertNotification/notification';

export const renderCalendarGrid = (container, currentYear, currentMonth, reminders, onDayClick) => {
  container.innerHTML = '';
  container.classList.add('calendar-grid');

  const firstDay = new Date(currentYear, currentMonth, 1);
  const lastDay = new Date(currentYear, currentMonth + 1, 0);
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  // Agregamos los nombres de los días de la semana
  const weekDays = ['Dom', 'Lun', 'Mar', 'Mié', 'Jue', 'Vie', 'Sáb'];
  weekDays.forEach(day => {
    const dayHeader = document.createElement('div');
    dayHeader.classList.add('day-header');
    dayHeader.textContent = day;
    container.appendChild(dayHeader);
  });

  // Agregamos celdas vacías para los días antes del primer día del mes
  for (let i = 0; i < firstDay.getDay(); i++) {
    const emptyCell = document.createElement('div');
    emptyCell.classList.add('day', 'empty');
    container.appendChild(emptyCell);
  }

  // Creamos celdas para cada día del mes
  for (let day = 1; day <= lastDay.getDate(); day++) {
    const dayCell = document.createElement('div');
    dayCell.classList.add('day');

    // Creamos un contenedor para el número del día
    const dayNumber = document.createElement('span');
    dayNumber.classList.add('day-number');
    dayNumber.textContent = day;
    dayCell.appendChild(dayNumber);

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

      // Mostramos el número de recordatorios entre paréntesis
      const reminderIndicator = document.createElement('span');
      reminderIndicator.classList.add('reminder-count');
      reminderIndicator.textContent = `(${dayReminders.length})`;
      dayCell.appendChild(reminderIndicator);
    }

    dayCell.addEventListener('click', () => {
      if (isPastDay) {
        AlertNotification(
          'Día no disponible',
          'No puedes crear recordatorios en días pasados',
          null,
          { showCancelButton: false }
        );
        return;
      }

      onDayClick(day, dayReminders);
    });

    container.appendChild(dayCell);
  }
};







