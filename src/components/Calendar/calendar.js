import { AlertNotification } from '../AlertNotification/notification';

import('./calendar.scss');

export const Calendar = (node) => {
  node.innerHTML = '';

  let currentDate = new Date();
  let currentMonth = currentDate.getMonth();
  let currentYear = currentDate.getFullYear();

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

    for (let i = 0; i < firstDay; i++) {
      const emptyCell = document.createElement('div');
      emptyCell.classList.add('day', 'empty');
      daysContainer.appendChild(emptyCell);
    }

    for (let day = 1; day <= daysInMonth; day++) {
      const dayCell = document.createElement('div');
      dayCell.classList.add('day');
      dayCell.textContent = day;

      if (currentYear === new Date().getFullYear() &&
        currentMonth === new Date().getMonth() &&
        day === new Date().getDate()) {
        dayCell.classList.add('today');
      }

      dayCell.addEventListener('click', () => {
        AlertNotification(`Seleccionaste el día ${day} de ${monthNames[currentMonth]} ${currentYear}`, 'Este evento esta en construcción');
      });

      daysContainer.appendChild(dayCell);
    }
  };

  const changeMonth = (direction) => {
    currentMonth += direction;
    if (currentMonth < 0) {
      currentMonth = 11;
      currentYear--;
    } else if (currentMonth > 11) {
      currentMonth = 0;
      currentYear++;
    }
    renderCalendar();
  };

  calendarContainer.appendChild(header);
  calendarContainer.appendChild(daysContainer);
  node.appendChild(calendarContainer);

  renderCalendar();
};
