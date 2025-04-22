import('./calendarHeader.scss');

export const CalendarHeader = (currentMonth, currentYear, onChangeMonth) => {
  const header = document.createElement('div');
  header.classList.add('calendar-header');

  const monthYearDisplay = document.createElement('h3');
  monthYearDisplay.classList.add('month-year');

  const prevMonthBtn = document.createElement('button');
  prevMonthBtn.classList.add('month-nav', 'prev-month');
  prevMonthBtn.innerHTML = '&lt;';
  prevMonthBtn.addEventListener('click', () => onChangeMonth(-1));

  const nextMonthBtn = document.createElement('button');
  nextMonthBtn.classList.add('month-nav', 'next-month');
  nextMonthBtn.innerHTML = '&gt;';
  nextMonthBtn.addEventListener('click', () => onChangeMonth(1));

  header.appendChild(prevMonthBtn);
  header.appendChild(monthYearDisplay);
  header.appendChild(nextMonthBtn);

  return { header, monthYearDisplay };
};