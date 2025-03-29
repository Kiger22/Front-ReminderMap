import { renderTodayNotifications } from '../../functions/renderTodayNotifications';
import('./today.css');

export const todayPage = async (node) => {
  node.innerHTML = "";

  const todayContainer = document.createElement('div');
  todayContainer.classList.add('today-container');

  const header = document.createElement('h2');
  header.textContent = "Recordatorios de Hoy";
  todayContainer.appendChild(header);

  // Creamos el contenedor para la lista de recordatorios
  const remindersList = document.createElement('div');
  remindersList.classList.add('reminders-list');
  todayContainer.appendChild(remindersList);

  node.appendChild(todayContainer);

  // Renderizamos los recordatorios y notificaciones del día
  await renderTodayNotifications(todayContainer);
};

