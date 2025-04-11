import { Calendar } from '../../components/Calendar/calendar';
import('./calendar.css');

export const calendarPage = (node) => {
  node.innerHTML = "";

  const calendarContainer = document.createElement('div');
  calendarContainer.classList.add('calendar-container');

  const header = document.createElement('h2');
  header.textContent = "Calendario";

  const content = document.createElement('div');
  Calendar(content);

  calendarContainer.appendChild(header);
  calendarContainer.appendChild(content);

  node.appendChild(calendarContainer);
};
